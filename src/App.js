import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { OpenAI } from 'openai';
import { motion, AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';
import { AppContext } from './context/AppContext';
import AppLayout from './components/AppLayout';
import './index.css'; // Tailwind CSS import

// --- FIX 1: Lazy-loaded components ---
// Added imports for ProfileSettings, TeamManagement, and Billing to resolve 'not defined' errors.
const LandingPage = lazy(() => import('./components/LandingPage'));
const Onboarding = lazy(() => import('./components/Onboarding'));
const CreativeInsights = lazy(() => import('./components/CreativeInsights'));
const AllContent = lazy(() => import('./components/AllContent'));
const AILab = lazy(() => import('./components/AILab'));
const InviteUserForm = lazy(() => import('./components/InviteUserForm'));
const ProfileSettings = lazy(() => import('./components/ProfileSettings'));
const TeamManagement = lazy(() => import('./components/TeamManagement'));
const Billing = lazy(() => import('./components/Billing'));

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Note: For client-side use; consider server-side for production
});

// Error boundary fallback
const ErrorFallback = ({ error }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex justify-center items-center h-screen bg-gray-900 text-red-400 text-lg"
  >
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p>{error.message}</p>
    </div>
  </motion.div>
);

// --- FIX 2: App Content Component ---
// All state, hooks, and routing logic have been moved into this new component.
// This ensures that `useNavigate` is called within a component that is a child of `<Router>`, fixing a critical hook error.
function AppContent() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [orgId, setOrgId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser(currentUser);
            setRole(userData.role || 'user');
            setOrgId(userData.orgId || null);
          } else {
            // New user, not yet onboarded
            setUser(currentUser);
            setRole('user'); // Default role
            setOrgId(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
          setRole(null);
          setOrgId(null);
        }
      } else {
        setUser(null);
        setRole(null);
        setOrgId(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Memoize context value
  const contextValue = useMemo(
    () => ({ db, auth, openai, user, role, orgId, navigate }),
    [user, role, orgId, navigate]
  );

  // Protected route component
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (loading) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center h-screen bg-gray-900 text-white"
        >
          Loading...
        </motion.div>
      );
    }
    if (!user) return <Navigate to="/landing" replace />;
    if (!orgId && window.location.pathname !== '/onboarding') return <Navigate to="/onboarding" replace />;
    if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/dashboard" replace />;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gray-900 text-white font-sans">
        <AnimatePresence mode="wait">
          <Suspense
            fallback={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center items-center h-screen bg-gray-900 text-white"
              >
                Loading...
              </motion.div>
            }
          >
            <Routes>
              {/* --- FIX: Added root path redirect --- */}
              {/* This ensures visiting the base URL always shows the landing page first. */}
              <Route path="/" element={<Navigate to="/landing" replace />} />

              {/* Landing Page */}
              <Route
                path="/landing"
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <LandingPage />
                  </motion.div>
                }
              />
              {/* Onboarding */}
              <Route
                path="/onboarding"
                element={
                  user ? <Onboarding setOrgId={setOrgId} /> : <Navigate to="/landing" replace />
                }
              />
              {/* Main App with Layout */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Routes>
                        <Route path="/dashboard" element={<CreativeInsights />} />
                        <Route path="/all-content" element={<AllContent />} />
                        <Route path="/ai-lab" element={<AILab />} />
                        <Route path="/profile" element={<ProfileSettings />} />
                        <Route path="/settings" element={<ProfileSettings />} />
                        <Route
                          path="/team"
                          element={
                            <ProtectedRoute allowedRoles={['Admin']}>
                              <TeamManagement />
                            </ProtectedRoute>
                          }
                        />
                        <Route path="/billing" element={
                            <ProtectedRoute allowedRoles={['Admin']}>
                                <Billing />
                            </ProtectedRoute>
                        } />
                        <Route
                          path="/invite"
                          element={
                            <ProtectedRoute allowedRoles={['Admin']}>
                              <InviteUserForm />
                            </ProtectedRoute>
                          }
                        />
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                      </Routes>
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </div>
    </AppContext.Provider>
  );
}


// The main App component now wraps the app in the Router and ErrorBoundary.
function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
