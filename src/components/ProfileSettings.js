import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { doc, updateDoc } from 'firebase/firestore';
import { UserIcon } from '@heroicons/react/24/outline';

const ProfileSettings = () => {
  const { db, user, orgId, role } = useContext(AppContext);
  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!db || !user) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        name: name.trim(),
        email: email.trim(),
      });
      setSuccess('Profile updated successfully');
      setError(null);
    } catch (err) {
      console.error('Profile update error:', err);
      setError('Failed to update profile');
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-slate-800/70 p-6 rounded-lg border border-slate-700 max-w-md mx-auto"
    >
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <UserIcon className="h-5 w-5 text-indigo-400" />
        Profile Settings
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-md bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Your name"
            aria-label="Name"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-md bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Your email"
            aria-label="Email"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Organization ID</label>
          <input
            type="text"
            value={orgId || 'Not set'}
            disabled
            className="w-full p-3 rounded-md bg-slate-900 border border-slate-700 text-gray-400"
            aria-label="Organization ID (read-only)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Role</label>
          <input
            type="text"
            value={role || 'Not set'}
            disabled
            className="w-full p-3 rounded-md bg-slate-900 border border-slate-700 text-gray-400"
            aria-label="Role (read-only)"
          />
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400"
          >
            {error}
          </motion.p>
        )}
        {success && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-400"
          >
            {success}
          </motion.p>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading || !name.trim() || !email.trim()}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Save profile"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ProfileSettings;