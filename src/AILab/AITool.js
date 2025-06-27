// src/components/AILab/AITool.js
import React from 'react';
import { motion } from 'framer-motion';

const AITool = ({ toolName, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-700 p-4 rounded-lg"
    >
      <h3 className="text-lg font-semibold text-white mb-2">{toolName}</h3>
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      <button className="btn-secondary w-full" disabled>
        Coming Soon
      </button>
    </motion.div>
  );
};

export default AITool;