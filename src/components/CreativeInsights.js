import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { ChartBarIcon, ClockIcon, DocumentTextIcon, SparklesIcon } from '@heroicons/react/24/outline';

// This is the component for your main dashboard, as routed in App.js
const CreativeInsights = () => {
    // Use context to get user, orgId, and db instance. This is more robust than props.
    const { user, orgId, db } = useContext(AppContext);

    const [contentCount, setContentCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const displayName = user?.displayName || 'User';

    // Fetch stats from Firestore, properly filtered by the user's organization
    useEffect(() => {
        // Do not fetch if orgId is not yet available
        if (!orgId || !db) return;

        const fetchStats = async () => {
            setLoading(true);
            try {
                // Create a base query filtered by the user's organization ID for security and correctness
                const baseContentQuery = query(collection(db, 'content'), where('orgId', '==', orgId));
                
                // Query for all content within the organization
                const allContentSnapshot = await getDocs(baseContentQuery);
                setContentCount(allContentSnapshot.size);

                // Query specifically for content with 'pending' status within the organization
                const pendingContentQuery = query(baseContentQuery, where('status', '==', 'pending'));
                const pendingSnapshot = await getDocs(pendingContentQuery);
                setPendingCount(pendingSnapshot.size);

            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            }
            setLoading(false);
        };

        fetchStats();
    }, [orgId, db]); // Rerun effect if orgId or db instance changes

    // Animation variants for widgets
    const widgetVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
                ease: "easeOut"
            }
        }),
    };
    
    // Placeholder for a loading state
    if (loading) {
        return <div className="text-center p-10">Loading dashboard...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 p-6 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                    Welcome back, {displayName}.
                </h1>
                <p className="text-slate-400 mt-1">Here's what's happening in your organization today.</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Stats Overview Widget */}
                <motion.div
                    custom={1}
                    variants={widgetVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700"
                >
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <ChartBarIcon className="w-6 h-6 mr-2 text-indigo-400" />
                        Stats Overview
                    </h2>
                    <div className="space-y-4">
                        <p className="text-slate-300">
                            Total Content: <span className="font-bold text-2xl text-white ml-2">{contentCount}</span>
                        </p>
                        <p className="text-slate-300">
                            Pending Approvals: <span className="font-bold text-2xl text-white ml-2">{pendingCount}</span>
                        </p>
                    </div>
                </motion.div>

                {/* Quick Actions Widget */}
                <motion.div
                    custom={2}
                    variants={widgetVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700"
                >
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <SparklesIcon className="w-6 h-6 mr-2 text-indigo-400" />
                        Quick Actions
                    </h2>
                    <ul className="space-y-3">
                        <li>
                            <Link to="/all-content" className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors duration-200 font-medium">
                                <DocumentTextIcon className="w-5 h-5 mr-3" />
                                View All Content
                            </Link>
                        </li>
                        <li>
                            <Link to="/ai-lab" className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors duration-200 font-medium">
                                <SparklesIcon className="w-5 h-5 mr-3" />
                                Go to AI Lab
                            </Link>
                        </li>
                    </ul>
                </motion.div>

                {/* Recent Activity Widget */}
                <motion.div
                    custom={3}
                    variants={widgetVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700"
                >
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <ClockIcon className="w-6 h-6 mr-2 text-indigo-400" />
                        Recent Activity
                    </h2>
                    <p className="text-slate-400 text-sm">Your team's latest updates will appear here.</p>
                </motion.div>
            </div>
        </div>
    );
};

export default CreativeInsights;

