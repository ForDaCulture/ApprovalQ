import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import DOMPurify from 'dompurify'; // Changed from { sanitize } to default import
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const InviteUserForm = () => {
  const { db, user, orgId } = useContext(AppContext); // Removed unused navigate
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Content Creator');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const roles = ['Content Creator', 'Editor', 'Reviewer', 'Approver', 'Admin'];

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const sanitizedEmail = DOMPurify.sanitize(email.trim()); // Use DOMPurify.sanitize
    if (!validateEmail(sanitizedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!orgId) {
      setError('Organization not set. Please complete onboarding.');
      return;
    }

    setLoading(true);
    try {
      const inviteRef = doc(db, 'invites', sanitizedEmail);
      await setDoc(inviteRef, {
        email: sanitizedEmail,
        orgId,
        invitedBy: user.uid,
        role,
        timestamp: serverTimestamp(),
        status: 'pending',
      }, { merge: true });

      setSuccess(`Invitation sent to ${sanitizedEmail}.`);
      setEmail('');
      setRole('Content Creator');
    } catch (err) {
      console.error('Invite error:', err);
      setError('Failed to send invitation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-slate-800/70 p-6 rounded-lg border border-slate-700 text-white"
    >
      <h2 className="text-lg font-semibold mb-4">Invite User</h2>
      <form onSubmit={handleInvite} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            disabled={loading}
            aria-label="Invitee email address"
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-slate-300">
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            disabled={loading}
            aria-label="Invitee role"
          >
            {roles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-green-400 text-sm flex items-center"><CheckCircleIcon className="h-5 w-5 mr-2" />{success}</p>}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.05 }}
          whileTap={{ scale: loading ? 1 : 0.95 }}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send Invitation'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default InviteUserForm;