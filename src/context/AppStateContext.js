import React, { createContext, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, signInAnonymously, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

// Create the context
export const AppStateContext = createContext(null);

// This provider component will wrap your entire app
export const AppStateProvider = ({ children, auth, db }) => {
    const [view, setView] = useState('landing'); // landing, app, features, pricing, etc.
    const [appUser, setAppUser] = useState(null); // This will hold our custom user profile
    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        if (!auth) return;
        
        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
                // If a user is logged in, fetch their custom profile from Firestore
                const userDocRef = doc(db, "users", firebaseUser.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    setAppUser({ uid: firebaseUser.uid, ...userDoc.data() });
                } else {
                    // This case handles a user who logged in but doesn't have a profile yet
                    // which can happen during the first sign-up
                    setAppUser({ uid: firebaseUser.uid, name: firebaseUser.displayName, email: firebaseUser.email });
                }
                setView('app'); // User is logged in, show the main application
            } else {
                setAppUser(null);
                setView('landing'); // No user, show the landing page
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [auth, db]);

    const handleGoogleLogin = async () => {
        if (!auth) return;
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            // If it's a new user, create their profile in our 'users' collection
            if (!userDoc.exists()) {
                await setDoc(userDocRef, {
                    name: user.displayName,
                    email: user.email,
                    role: 'Content Creator', // Default role for new sign-ups
                    org: `${user.displayName}'s Workspace`, // Default organization
                    createdAt: serverTimestamp()
                });
            }
        } catch (error) {
            console.error("Google login error:", error);
        }
    };
    
    const handleAnonymousLogin = async () => {
        if (!auth) return;
        try {
            const result = await signInAnonymously(auth);
            const user = result.user;
            // For guests, we don't create a persistent profile, just use the temp auth state
            setAppUser({ uid: user.uid, name: "Guest User", role: "Guest" });
            setView('app');
        } catch (error) {
            console.error("Anonymous login error:", error);
        }
    };

    const handleLogout = () => {
        if (auth) {
            signOut(auth);
        }
    };
    
    // The navigate function now just changes the 'view' state
    const navigate = (newView) => {
        setView(newView);
    };

    // The value that will be available to all children components
    const value = {
        view,
        appUser,
        isLoading,
        handleGoogleLogin,
        handleAnonymousLogin,
        handleLogout,
        navigate,
    };

    return (
        <AppStateContext.Provider value={value}>
            {children}
        </AppStateContext.Provider>
    );
};
