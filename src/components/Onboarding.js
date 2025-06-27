import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { doc, setDoc } from 'firebase/firestore';

const Onboarding = ({ setOrgId }) => {
  const { db, user, navigate } = useContext(AppContext);
  const [step, setStep] = useState(1);
  const [orgName, setOrgName] = useState('');
  const [role, setRole] = useState('creator');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const steps = [
    { id: 1, title: 'Create Your Organization' },
    { id: 2, title: 'Choose Your Role' },
  ];

  const handleNext = async () => {
    if (step === 1 && !orgName.trim()) {
      setError('Organization name is required');
      return;
    }
    if (step === steps.length) {
      setLoading(true);
      try {
        const orgId = `org_${Date.now()}`; // Simple unique ID; consider UUID in production
        await setDoc(doc(db, 'users', user.uid), {
          orgId,
          role,
          name: user.displayName || 'Anonymous User',
          email: user.email || '',
        });
        setOrgId(orgId);
        navigate('/dashboard');
      } catch (err) {
        console.error('Onboarding error:', err);
        setError('Failed to save onboarding data');
        setLoading(false);
      }
      return;
    }
    setError(null);
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    setError(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4"
    >
      <div className="max-w-md w-full bg-slate-800/70 p-6 rounded-lg border border-slate-700">
        <h2 className="text-2xl font-bold mb-4">Welcome to ApprovalQ</h2>
        <div className="flex justify-between mb-6">
          {steps.map((s) => (
            <div
              key={s.id}
              className={`flex-1 text-center ${step >= s.id ? 'text-indigo-400' : 'text-gray-400'}`}
            >
              {s.title}
            </div>
          ))}
        </div>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <label className="block text-sm font-medium mb-2">Organization Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full p-3 rounded-md bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Creative Agency"
                aria-label="Organization name"
              />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <label className="block text-sm font-medium mb-2">Your Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 rounded-md bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="User role"
              >
                <option value="creator">Creator</option>
                <option value="editor">Editor</option>
                <option value="approver">Approver</option>
                <option value="Admin">Admin</option>
              </select>
            </motion.div>
          )}
        </AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 mt-4"
          >
            {error}
          </motion.p>
        )}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Back"
            >
              Back
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label={step === steps.length ? 'Complete Onboarding' : 'Next'}
          >
            {loading ? 'Saving...' : step === steps.length ? 'Complete' : 'Next'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Onboarding;