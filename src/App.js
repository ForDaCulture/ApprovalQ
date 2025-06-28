import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { auth, db, openai } from './firebaseConfig';
import { AppContext } from './context/AppContext';
import AppLayout from './components/AppLayout';
import './index.css';
import { ErrorBoundary } from 'react-error-boundary';

const LandingPage = lazy(() => import('./components/LandingPage'));
const Onboarding = lazy(() => import('./components/Onboarding'));
const CreativeInsights = lazy(() => import('./components/CreativeInsights'));
const AllContent = lazy(() => import('./components/AllContent'));
const AILab = lazy(() => import('./components/AILab'));
const InviteUserForm = lazy(() => import('./components/InviteUserForm'));
const ProfileSettings = lazy(() => import('./components/ProfileSettings'));
const TeamManagement = lazy(() => import('./components/TeamManagement'));
const Billing = lazy(() => import('./components/Billing'));
const ContentDetailView = lazy(() => import('./components/ContentDetailView'));
const Notifications = lazy(() => import('./components/Notifications')); // Added Notifications

const ErrorFallback = ({ error }) => {
  const { theme } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex justify-center items-center h-screen text-red-400 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p>{error.message}</p>
      </div>
    </motion.div>
  );
};

const LoadingSpinner = () => {
  const { theme } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`flex flex-col justify-center items-center h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}
    >
      <svg className="animate-spin h-12 w-12 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="text-lg font-medium">Loading ApprovalQ...</p>
    </motion.div>
  );
};

function AppContent() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [orgId, setOrgId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser(currentUser);
          setRole(userData.role || null);
          setOrgId(userData.orgId || null);
        } else {
          setUser(currentUser);
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

  const contextValue = useMemo(
    () => ({ db, auth, openai, user, role, orgId, navigate }),
    [user, role, orgId, navigate]
  );

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!user) return <Navigate to="/landing" replace />;
    if (!orgId && window.location.pathname !== '/onboarding') return <Navigate to="/onboarding" replace />;
    if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/dashboard" replace />;
    return children;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <AppContext.Provider value={contextValue}>
      <AnimatePresence mode="wait">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Navigate to="/landing" replace />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/onboarding" element={user ? <Onboarding setOrgId={setOrgId} /> : <Navigate to="/landing" replace />} />
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
                      <Route path="/team" element={<ProtectedRoute allowedRoles={['Admin']}><TeamManagement /></ProtectedRoute>} />
                      <Route path="/billing" element={<ProtectedRoute allowedRoles={['Admin']}><Billing /></ProtectedRoute>} />
                      <Route path="/invite" element={<ProtectedRoute allowedRoles={['Admin']}><InviteUserForm /></ProtectedRoute>} />
                      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} /> {/* Added Notifications route */}
                      <Route path="/content/:contentId" element={<ContentDetailView />} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </AppContext.Provider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Router>
          <AppContent />
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;