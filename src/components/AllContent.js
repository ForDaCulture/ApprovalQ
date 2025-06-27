import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { AppContext } from '../context/AppContext';

export const AllContent = ({ orgId }) => {
  const { db } = useContext(AppContext);
  const navigate = useNavigate();
  const [contentItems, setContentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!db || !orgId) {
      setError('Database or organization ID not available');
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'content'), where('orgId', '==', orgId));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setContentItems(items);
        setLoading(false);
      },
      (err) => {
        console.error('Firestore error:', err);
        setError('Failed to load content');
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [db, orgId]);

  const getStatusInfo = (status) => {
    const base = 'px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-2';
    switch (status) {
      case 'Approved':
        return { text: 'Approved', style: `${base} bg-green-500/10 text-green-400 border border-green-500/30` };
      case 'Needs Brand Review':
        return { text: 'Brand Review', style: `${base} bg-yellow-500/10 text-yellow-400 border border-yellow-500/30` };
      case 'Needs Factual Review':
        return { text: 'Factual Review', style: `${base} bg-orange-500/10 text-orange-400 border border-orange-500/30` };
      case 'Changes Requested (Factual)':
      case 'Changes Requested (Brand)':
        return { text: 'Changes Requested', style: `${base} bg-sky-500/10 text-sky-400 border border-sky-500/30` };
      case 'Rejected':
        return { text: 'Rejected', style: `${base} bg-red-500/10 text-red-400 border border-red-500/30` };
      default:
        return { text: status || 'Unknown', style: `${base} bg-slate-500/10 text-slate-400 border border-slate-500/30` };
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-full text-white text-lg"
      >
        Loading content...
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
      <table className="w-full text-sm text-left text-slate-300">
        <thead className="text-xs text-slate-400 uppercase bg-slate-700/50">
          <tr>
            <th scope="col" className="px-4 py-3 md:px-6">Title</th>
            <th scope="col" className="px-4 py-3 md:px-6">Created By</th>
            <th scope="col" className="px-4 py-3 md:px-6">Date</th>
            <th scope="col" className="px-4 py-3 md:px-6">Status</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {contentItems.map((content) => {
              const statusInfo = getStatusInfo(content.status);
              return (
                <motion.tr
                  key={content.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="border-b border-slate-700 hover:bg-indigo-700/20 cursor-pointer"
                  onClick={() => navigate(`/content/${content.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/content/${content.id}`)}
                  aria-label={`View content: ${content.title}`}
                >
                  <td className="px-4 py-4 md:px-6 font-semibold text-white">{content.title}</td>
                  <td className="px-4 py-4 md:px-6">{content.createdBy?.name || 'Unknown'}</td>
                  <td className="px-4 py-4 md:px-6">
                    {content.createdAt?.toDate().toLocaleDateString() || 'N/A'}
                  </td>
                  <td className="px-4 py-4 md:px-6">
                    <span className={statusInfo.style}>
                      <span className="h-2 w-2 rounded-full bg-current"></span>
                      {statusInfo.text}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </tbody>
      </table>
    </motion.div>
  );
};