// src/components/LandingPage.js
import React from 'react';
import { motion } from 'framer-motion';

const LandingPage = ({ handleLogin, handleTryAsGuest }) => {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white relative overflow-hidden pt-24">
      {/* Aurora Background */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/50 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-600/50 rounded-full filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Title */}
          <motion.div
            className="md:col-span-3 p-8 rounded-2xl bg-black/20 backdrop-blur-lg border border-white/10 flex flex-col justify-center"
            variants={itemVariants}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              The Operating System <br />
              <span className="bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text">
                for Creative Teams
              </span>
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl">
              Stop the chaos. Ship better work, faster. ApprovalQ combines AI-powered creation with structured approval workflows to eliminate bottlenecks.
            </p>
          </motion.div>
          
          {/* CTA Box */}
          <motion.div
            className="md:col-span-1 p-8 rounded-2xl bg-black/20 backdrop-blur-lg border border-white/10 flex flex-col justify-center items-center space-y-4"
            variants={itemVariants}
          >
            <button
              onClick={() => handleLogin('google')}
              className="w-full text-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Get started with Google
            </button>
            <button
              onClick={handleTryAsGuest}
              className="w-full text-center px-6 py-3 border border-white/20 text-base font-medium rounded-md text-white bg-white/10 hover:bg-white/20 transition-colors"
            >
              Try as Guest
            </button>
          </motion.div>

          {/* Feature Box 1 */}
          <motion.div
            className="md:col-span-2 p-8 rounded-2xl bg-black/20 backdrop-blur-lg border border-white/10"
            variants={itemVariants}
          >
            <h3 className="text-xl font-bold">AI-Powered Creation</h3>
            <p className="mt-2 text-gray-400">
              Generate first drafts of blog posts, ad copy, and scripts in seconds. Break through creative blocks and focus on refining, not just writing.
            </p>
          </motion.div>

          {/* Feature Box 2 */}
          <motion.div
            className="md:col-span-2 p-8 rounded-2xl bg-black/20 backdrop-blur-lg border border-white/10"
            variants={itemVariants}
          >
            <h3 className="text-xl font-bold">Structured Approval</h3>
            <p className="mt-2 text-gray-400">
              Create custom, multi-step approval flows. Ensure every piece of content is reviewed by the right people, in the right order. No more email chaos.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;