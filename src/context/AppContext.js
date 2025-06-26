import React, { createContext, useState, useEffect, useContext } from 'react';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, signInAnonymously } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';

export const AppContext = createContext(null);

export const AppProvider = ({ children, auth, db }) => {
    const [user, setUser] = useState(null); // This holds our custom user profile
    const [isLoading, setIsLoading] = useState(true);
    const [appView, setAppView] = useState('dashboard');
    const [activeContentId, setActiveContentId] = useState(null);

    // This effect listens for Firebase authentication changes
    useEffect(() => {
        if (!auth || !db) return;

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // If a user is logged in, fetch their custom profile from Firestore
                const userDocRef = doc(db, "users", firebaseUser.uid);
                const unsubProfile = onSnapshot(userDocRef, (doc) => {
                    if (doc.exists()) {
                        setUser({ uid: firebaseUser.uid, photoURL: firebaseUser.photoURL, ...doc.data() });
                    } else if (firebaseUser.isAnonymous) {
                         setUser({ uid: firebaseUser.uid, name: "Guest User", role: "Guest" });
                    }
                    setIsLoading(false);
                });
                return () => unsubProfile();
            } else {
                // No user is signed in
                setUser(null);
                setIsLoading(false);
            }
        });
        return () => unsubscribe();
    }, [auth, db]);

    // --- Authentication Handlers ---
    const handleGoogleLogin = async () => {
        if (!auth) return;
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const firebaseUser = result.user;
            const userDocRef = doc(db, "users", firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                await setDoc(userDocRef, {
                    name: firebaseUser.displayName,
                    email: firebaseUser.email,
                    role: 'Content Creator',
                    org: `${firebaseUser.displayName}'s Workspace`,
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
            await signInAnonymously(auth);
        } catch (error) {
            console.error("Anonymous login error:", error);
        }
    };

    const handleLogout = () => {
        if (auth) signOut(auth);
    };
    
    // --- Navigation ---
    const navigate = (view, id = null) => {
        setAppView(view);
        setActiveContentId(id);
    };

    const value = {
        user,
        isLoading,
        handleGoogleLogin,
        handleAnonymousLogin,
        handleLogout,
        db,
        auth,
        appView,
        activeContentId,
        navigate,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}