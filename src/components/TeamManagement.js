import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { UserGroupIcon } from '@heroicons/react/24/outline';

const TeamManagement = () => {
  const { db, orgId, navigate } = useContext(AppContext);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!db || !orgId) {
      setError('Database or organization ID not available');
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'users'), where('orgId', '==', orgId));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const members = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTeamMembers(members);
        setLoading(false);
      },
      (err) => {
        console.error('Firestore error:', err);
        setError('Failed to load team members');
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [db, orgId]);

  const handleRoleChange = async (userId, newRole) => {
    if (!db || !orgId) return;
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
    } catch (err) {
      console.error('Role update error:', err);
      setError('Failed to update role');
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-full text-white text-lg"
      >
        Loading team...
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-full text-red-400 text-lg"
      >
        {error}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-slate-800/70 p-6 rounded-lg border border-slate-700"
    >
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <UserGroupIcon className="h-5 w-5 text-indigo-400" />
        Team Management
      </h2>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/invite')}
        className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Invite new user"
      >
        Invite New User
      </motion.button>
      <table className="w-full text-sm text-left text-slate-300">
        <thead className="text-xs text-slate-400 uppercase bg-slate-700/50">
          <tr>
            <th scope="col" className="px-4 py-3 md:px-6">Name</th>
            <th scope="col" className="px-4 py-3 md:px-6">Email</th>
            <th scope="col" className="px-4 py-3 md:px-6">Role</th>
            <th scope="col" className="px-4 py-3 md:px-6">Actions</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {teamMembers.map((member) => (
              <motion.tr
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="border-b border-slate-700 hover:bg-indigo-700/20"
              >
                <td className="px-4 py-4 md:px-6 font-semibold text-white">{member.name}</td>
                <td className="px-4 py-4 md:px-6">{member.email}</td>
                <td className="px-4 py-4 md:px-6">
                  <select
                    value={member.role}
                    onChange={(e) => handleRoleChange(member.id, e.target.value)}
                    className="p-2 rounded-md bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label={`Change role for ${member.name}`}
                  >
                    <option value="creator">Creator</option>
                    <option value="editor">Editor</option>
                    <option value="approver">Approver</option>
                    <option value="Admin">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-4 md:px-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-indigo-400 hover:text-indigo-300"
                    aria-label={`View ${member.name}'s profile`}
                  >
                    View
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </motion.div>
  );
};

export default TeamManagement;