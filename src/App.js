// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AllContent from './pages/AllContent';
import { Settings } from './components/Settings';
import Notification from './components/Notification';
import ContentDetail from './components/ContentDetail';
import { app } from './firebaseConfig';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { getFunctions } from 'firebase/functions';

const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

function App() {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true); // Corrected syntax: removed extra '='
  const [notification, setNotification] = useState({ message: '', type: '' });

  const showNotification = (message, type = 'error') => { setNotification({ message, type }); };
  const clearNotification = () => { setNotification({ message: '', type: '' }); };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if(currentUser) { setIsGuest(false); }
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (providerName) => {
    let provider;
    if (providerName === 'google') { provider = new GoogleAuthProvider(); }
    else if (providerName === 'github') { provider = new GithubAuthProvider(); }
    else { return; }
    try {
      const result = await signInWithPopup(auth, provider);
      const loggedInUser = result.user;
      const userRef = doc(db, "users", loggedInUser.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          displayName: loggedInUser.displayName, email: loggedInUser.email, photoURL: loggedInUser.photoURL,
          createdAt: serverTimestamp(), orgId: null, role: "creator",
        });
      }
    } catch (error) { showNotification(error.message, 'error'); }
  };
  
  const handleTryAsGuest = () => { setIsGuest(true); };

  const handleLogout = async () => {
    if(isGuest) { setIsGuest(false); } 
    else { try { await signOut(auth); } catch (error) { showNotification(error.message, 'error'); } }
  };

  if (loading) { return <div className="text-white flex items-center justify-center h-screen">Initializing ApprovalQ...</div>; }
  
  const isAuthenticated = user || isGuest;
  
  // A simple placeholder for pages that are not yet built
  const PlaceholderPage = ({ title }) => (
    <div>
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <p className="text-gray-400 mt-4">This page is under construction and will be built in a future phase.</p>
    </div>
  );

  return (
    <Router>
      <Notification notification={notification} onClear={clearNotification} />
      <AppLayout user={user} isGuest={isGuest} handleLogin={handleLogin} handleLogout={handleLogout}>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Dashboard user={user} isGuest={isGuest} /> : <LandingPage handleLogin={handleLogin} handleTryAsGuest={handleTryAsGuest} />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard user={user} isGuest={isGuest} /> : <LandingPage handleLogin={handleLogin} handleTryAsGuest={handleTryAsGuest} />} />
          <Route path="/all-content" element={isAuthenticated ? <AllContent db={db} user={user} showNotification={showNotification} /> : <LandingPage handleLogin={handleLogin} handleTryAsGuest={handleTryAsGuest} />} />
          <Route path="/content/:contentId" element={isAuthenticated ? <ContentDetail db={db} user={user} isGuest={isGuest} /> : <LandingPage handleLogin={handleLogin} handleTryAsGuest={handleTryAsGuest} />} />
          <Route path="/insights" element={isAuthenticated ? <PlaceholderPage title="Insights Engine" /> : <LandingPage handleLogin={handleLogin} handleTryAsGuest={handleTryAsGuest} />} />
          <Route path="/ai-lab" element={isAuthenticated ? <PlaceholderPage title="AI Strategy Lab" /> : <LandingPage handleLogin={handleLogin} handleTryAsGuest={handleTryAsGuest} />} />
          <Route path="/settings" element={isAuthenticated ? <Settings /> : <LandingPage handleLogin={handleLogin} handleTryAsGuest={handleTryAsGuest} />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;