const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

admin.initializeApp();
const db = admin.firestore();

/**
 * Creates a new piece of content using a prompt.
 */
exports.generateContent = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called by an authenticated user.",
    );
  }

  const {prompt, title} = data;
  const uid = context.auth.uid;

  if (!prompt || !title) {
    throw new functions.https.HttpsError(
        "invalid-argument",
        "Request must include a 'prompt' and 'title'.",
    );
  }

  try {
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) {
      throw new functions.https.HttpsError("not-found", "User not found in database.");
    }
    const {orgId, name} = userDoc.data();

    const apiKey = functions.config().apikeys.gemini;
    const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;

    const payload = {contents: [{role: "user", parts: [{text: prompt}]}]};

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Gemini API Error:", errorBody);
      throw new functions.https.HttpsError("internal", "The AI model failed to generate a response.");
    }

    const result = await response.json();
    const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text ||
      "AI response could not be generated.";

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

    return {
      contentId: contentRef.id,
      message: "Content generated successfully!",
    };
  } catch (error) {
    console.error("Error in generateContent:", error);
    throw new functions.https.HttpsError("internal", "An unexpected error occurred while generating content.");
  }
});

/**
 * Generates strategic advice using a prompt.
 */
exports.generateStrategy = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "This function must be called by an authenticated user.",
        );
    }

    const {prompt} = data;

    if (!prompt) {
        throw new functions.https.HttpsError(
            "invalid-argument",
            "Request must include a 'prompt'.",
        );
    }

    try {
        const apiKey = functions.config().apikeys.gemini;
        const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;

        const strategicPrompt = `As an expert marketing and business strategist, provide a detailed, actionable response for the following request. Structure the response clearly with headings and bullet points where appropriate:\n\nREQUEST: "${prompt}"`;
        const payload = {contents: [{role: "user", parts: [{text: strategicPrompt}]}]};

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error("Gemini API Error:", errorBody);
            throw new functions.https.HttpsError("internal", "The AI model failed to generate a strategy.");
        }

        const result = await response.json();
        const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text ||
            "AI strategy could not be generated.";

        return {response: generatedText};
    } catch (error) {
        console.error("Error in generateStrategy:", error);
        throw new functions.https.HttpsError("internal", "An unexpected error occurred while generating the strategy.");
    }
});
