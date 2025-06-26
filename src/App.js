// --- File: src/App.js ---
// This file is now the master controller that initializes services and renders the correct view.

import React, { useContext, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { AppProvider, AppContext } from './context/AppContext';

// Import your page components
import { LandingPage } from './components/LandingPage';
import { AppLayout } from './components/AppLayout';

// IMPORTANT: Paste your Firebase config object here
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const AppCore = () => {
    const { user, isLoading } = useContext(AppContext);

    if (isLoading) {
        return <div className="bg-slate-900 h-screen w-screen flex items-center justify-center text-white">Initializing ApprovalQ...</div>;
    }
    
    return user ? <AppLayout /> : <LandingPage />;
};


export default function App() {
    const [firebaseServices, setFirebaseServices] = useState(null);

    useEffect(() => {
        try {
            const app = initializeApp(firebaseConfig);
            setFirebaseServices({
                auth: getAuth(app),
                db: getFirestore(app),
            });
        } catch(e) {
            console.error("Firebase initialization failed:", e);
        }
    }, []);

    if (!firebaseServices) {
        return <div className="bg-slate-900 h-screen w-screen flex items-center justify-center text-white">Configuring Environment...</div>;
    }

    return (
        <AppProvider auth={firebaseServices.auth} db={firebaseServices.db}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`}</style>
            <div className="font-sans antialiased">
                <AppCore />
            </div>
        </AppProvider>
    );
}
