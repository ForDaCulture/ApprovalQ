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

// Lazy-loaded components
const LandingPage = lazy(() => import('./components/LandingPage'));
const Onboarding = lazy(() => import('./components/Onboarding'));
const CreativeInsights = lazy(() => import('./components/CreativeInsights'));
const AllContent = lazy(() => import('./components/AllContent'));
const AILab = lazy(() => import('./components/AILab'));
const InviteUserForm = lazy(() => import('./components/InviteUserForm'));

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

function App() {
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
            setUser(currentUser);
            setRole('user');
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
    if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/dashboard" replace />;
    if (!orgId) return <Navigate to="/onboarding" replace />;
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
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AppContext.Provider value={contextValue}>
        <Router>
          <div className="min-h-screen bg-gray-900 text-white font-sans">
            <AnimatePresence>
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
                      <ProtectedRoute>
                        <Onboarding setOrgId={setOrgId} />
                      </ProtectedRoute>
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
          <Route path="/billing" element={<Billing />} />
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
        </Router>
      </AppContext.Provider>
    </ErrorBoundary>
  );
}

export default App;