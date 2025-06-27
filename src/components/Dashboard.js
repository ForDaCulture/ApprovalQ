import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import DraftGenerator from './components/AILab/DraftGenerator';
import Summarizer from './components/AILab/Summarizer';
import AITool from './components/AILab/AITool';

const Dashboard = ({ user, isGuest }) => {
  const displayName = isGuest ? 'Guest' : user?.displayName || 'User';
  const [contentCount, setContentCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  // Fetch stats from Firestore
  useEffect(() => {
    const fetchStats = async () => {
      const contentSnapshot = await getDocs(collection(db, 'content'));
      const pendingSnapshot = await getDocs(collection(db, 'content'), where('status', '==', 'pending'));
      setContentCount(contentSnapshot.size);
      setPendingCount(pendingSnapshot.size);
    };
    fetchStats();
  }, []);

  // Animation variants
  const widgetVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6 md:p-10">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
          Welcome back, {displayName}.
        </h1>
        {isGuest && (
          <p className="text-gray-300 mt-2 text-sm md:text-base">
            You are currently in read-only mode.{' '}
            <Link to="/signup" className="text-indigo-400 hover:underline">
              Sign up to unlock full access.
            </Link>
          </p>
        )}
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          variants={widgetVariants}
          initial="hidden"
          animate="visible"
          className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:shadow-xl transition-shadow duration-300"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recent Activity
          </h2>
          <p className="text-gray-300 text-sm">The activity feed showing recent comments and status changes will appear here.</p>
          <Link to="/activity" className="mt-4 inline-block text-indigo-400 hover:text-indigo-300 text-sm font-medium">
            View all activity →
          </Link>
        </motion.div>
        
        <motion.div
          variants={widgetVariants}
          initial="hidden"
          animate="visible"
          className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:shadow-xl transition-shadow duration-300"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Actions
          </h2>
          <ul className="space-y-3">
            <li>
              <Link to="/all-content" className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
                View all content
              </Link>
            </li>
            <li>
              <Link to="/generate-content" className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Generate new content
              </Link>
            </li>
          </ul>
        </motion.div>

        <motion.div
          variants={widgetVariants}
          initial="hidden"
          animate="visible"
          className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:shadow-xl transition-shadow duration-300"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 012-2h2a2 2 0 012 2v12a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Stats Overview
          </h2>
          <div className="space-y-3">
            <p className="text-gray-300 text-sm">
              Total Content: <span className="font-bold text-white">{contentCount}</span>
            </p>
            <p className="text-gray-300 text-sm">
              Pending Approvals: <span className="font-bold text-white">{pendingCount}</span>
            </p>
            <p className="text-gray-300 text-sm">
              Active Campaigns: <span className="font-bold text-white">3</span>
            </p>
          </div>
        </motion.div>

        {/* AI Lab Section */}
        <motion.div
          variants={widgetVariants}
          initial="hidden"
          animate="visible"
          className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:shadow-xl transition-shadow duration-300 col-span-1 md:col-span-2 lg:col-span-3"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <svg className="w-7 h-7 mr-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            AI Lab
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DraftGenerator userRole={user?.role} />
            <Summarizer />
            <AITool toolName="Content Analyzer" description="Analyze content for tone and readability" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;