// src/components/InviteUserForm.js
import React from 'react';
import { motion } from 'framer-motion';

const InviteUserForm = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-slate-800/70 p-6 rounded-lg border border-slate-700 text-white"
  >
    <h2 className="text-lg font-semibold">Invite User</h2>
    <p>Placeholder for user invitation form.</p>
  </motion.div>
);
export default InviteUserForm;