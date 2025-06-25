const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

/**
 * Securely calls the Gemini API to generate content.
 */
exports.generateContent = functions.https.onCall(async (data, context) => {
    // 1. Verify the user is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "The function must be called while authenticated.",
        );
    }

    const {prompt, title} = data;
    const uid = context.auth.uid;

    if (!prompt || !title) {
        throw new functions.https.HttpsError(
            "invalid-argument",
            "The function must be called with a 'prompt' and 'title'.",
        );
    }

    try {
        // 2. Get user's organization to associate with the content
        const userDoc = await db.collection("users").doc(uid).get();
        if (!userDoc.exists) {
            throw new functions.https.HttpsError("not-found", "User not found.");
        }
        const {orgId, name} = userDoc.data();

        // 3. Call the Gemini API
        const apiKey = functions.config().apikeys.gemini;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const payload = {contents: [{role: "user", parts: [{text: prompt}]}]};

        const fetch = (await import("node-fetch")).default;
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new functions.https.HttpsError("internal",
                `API Error: ${errorBody.error.message}`);
        }

        const result = await response.json();
        const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text ||
            "AI response could not be generated.";

        // 4. Save the new content to Firestore
        const contentData = {
            orgId,
            title,
            prompt,
            generatedContent: generatedText,
            editedContent: generatedText,
            status: "Needs Factual Review",
            createdBy: {userId: uid, name: name},
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            comments: [],
        };

        const contentRef = await db.collection("content").add(contentData);

        // 5. Return the ID of the new document
        return {
            contentId: contentRef.id,
            message: "Content generated successfully!",
        };
    } catch (error) {
        console.error("Error in generateContent:", error);
        throw new functions.https.HttpsError("internal",
            "An unexpected error occurred.", error.message);
    }
});

/**
 * NOTE: Other functions like generateVisual and inviteUser would follow
 * the same pattern. This example focuses on the core 'generateContent'
 * function to keep it clear.
 */
