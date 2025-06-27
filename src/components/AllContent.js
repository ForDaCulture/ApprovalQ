import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { AppContext } from '../context/AppContext';
import { PlusIcon, DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';

// FIX: Renamed component to start with an uppercase letter as per React standards.
const AllContent = () => {
    // FIX: Get db and orgId from AppContext for consistency and robustness, not from props.
    const { db, orgId } = useContext(AppContext);
    const navigate = useNavigate();
    const [contentItems, setContentItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Don't run the query if the necessary context values aren't available yet.
        if (!db || !orgId) {
            setLoading(false); // Stop loading if we can't fetch data
            return;
        }

        const q = query(collection(db, 'content'), where('orgId', '==', orgId));
        
        // onSnapshot provides real-time updates from Firestore.
        const unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
                const items = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setContentItems(items);
                setLoading(false);
            },
            (err) => {
                console.error('Firestore error:', err);
                setError('Failed to load content. Please try refreshing the page.');
                setLoading(false);
            }
        );

        // This cleanup function detaches the listener when the component unmounts, preventing memory leaks.
        return () => unsubscribe();
    }, [db, orgId]);

    const getStatusInfo = (status) => {
        const base = 'px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-2 w-fit';
        switch (status) {
            case 'Approved':
                return { text: 'Approved', style: `${base} bg-green-500/10 text-green-400 border border-green-500/30` };
            case 'Pending':
                 return { text: 'Pending', style: `${base} bg-yellow-500/10 text-yellow-400 border border-yellow-500/30` };
            case 'Changes Requested':
                return { text: 'Changes Requested', style: `${base} bg-sky-500/10 text-sky-400 border border-sky-500/30` };
            case 'Rejected':
                return { text: 'Rejected', style: `${base} bg-red-500/10 text-red-400 border border-red-500/30` };
            default:
                return { text: status || 'Unknown', style: `${base} bg-slate-500/10 text-slate-400 border border-slate-500/30` };
        }
    };

    if (loading) {
        return <div className="text-center p-10 text-slate-400">Loading content...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-400">{error}</div>;
    }

    // UI/UX ENHANCEMENT: Graceful "empty state" for new users.
    if (contentItems.length === 0) {
        return (
            <div className="text-center p-10 flex flex-col items-center">
                 <DocumentMagnifyingGlassIcon className="h-16 w-16 text-slate-600 mb-4" />
                 <h2 className="text-2xl font-bold text-white mb-2">No content yet</h2>
                 <p className="text-slate-400 mb-6 max-w-sm">It looks like your organization hasn't created any content. Get started by generating your first piece in the AI Lab.</p>
                 <Link to="/ai-lab">
                    <motion.button 
                         whileHover={{ scale: 1.05 }}
                         whileTap={{ scale: 0.95 }}
                         className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                     >
                        <PlusIcon className="h-5 w-5" />
                        Create First Content
                    </motion.button>
                 </Link>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-4 md:p-6"
        >
            {/* UI ENHANCEMENT: Added a clear header and action button */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white">All Content</h1>
                    <p className="text-slate-400 mt-1">View and manage all content for your organization.</p>
                </div>
                <Link to="/ai-lab">
                     <motion.button 
                         whileHover={{ scale: 1.05 }}
                         whileTap={{ scale: 0.95 }}
                         className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                     >
                        <PlusIcon className="h-5 w-5" />
                        Create New Content
                    </motion.button>
                </Link>
            </div>
            
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left text-slate-300">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-900/80">
                        <tr>
                            <th scope="col" className="px-6 py-3">Title</th>
                            <th scope="col" className="px-6 py-3 hidden md:table-cell">Created By</th>
                            <th scope="col" className="px-6 py-3 hidden lg:table-cell">Date</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {contentItems.map((content) => {
                                const statusInfo = getStatusInfo(content.status);
                                return (
                                    <motion.tr
                                        key={content.id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="border-b border-slate-700 hover:bg-slate-700/50 cursor-pointer"
                                        onClick={() => navigate(`/content/${content.id}`)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => e.key === 'Enter' && navigate(`/content/${content.id}`)}
                                        aria-label={`View content: ${content.title}`}
                                    >
                                        <td className="px-6 py-4 font-semibold text-white">{content.title}</td>
                                        <td className="px-6 py-4 hidden md:table-cell">{content.createdBy?.name || 'Unknown'}</td>
                                        <td className="px-6 py-4 hidden lg:table-cell">
                                            {content.createdAt?.toDate().toLocaleDateString() || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
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
            </div>
        </motion.div>
    );
};

// FIX: Added the required default export for lazy loading to work.
export default AllContent;
