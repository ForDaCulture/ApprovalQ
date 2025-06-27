import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, onSnapshot, addDoc } from 'firebase/firestore';
import { OpenAI } from 'openai';
import { AppContext } from '../context/AppContext';
import { BeakerIcon, SparklesIcon } from '@heroicons/react/24/outline';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Note: For client-side use; consider server-side for production
});

export const AILab = () => {
  const { db, user, orgId, role } = useContext(AppContext);
  const [aiItems, setAiItems] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch AI Lab items from Firestore
  useEffect(() => {
    if (!db || !orgId) {
      setError('Database or organization ID not available');
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'aiLab'), where('orgId', '==', orgId));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAiItems(items);
        setLoading(false);
      },
      (err) => {
        console.error('Firestore error:', err);
        setError('Failed to load AI Lab data');
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [db, orgId]);

  // Handle AI prompt submission
  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || role !== 'creator') return;

    setAiLoading(true);
    try {
      const response = await openai.completions.create({
        model: 'text-davinci-003',
        prompt: `Generate a concise content draft or summary based on: ${prompt}`,
        max_tokens: 500,
        temperature: 0.7,
      });
      const generatedText = response.choices[0].text.trim();

      // Save to Firestore
      await addDoc(collection(db, 'aiLab'), {
        orgId,
        createdBy: { uid: user.uid, name: user.displayName || 'Unknown' },
        createdAt: new Date(),
        prompt,
        output: generatedText,
      });
      setPrompt('');
    } catch (err) {
      console.error('OpenAI error:', err);
      setError('Failed to generate AI content');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-full text-white text-lg"
      >
        Loading AI Lab...
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
      {/* AI Prompt Form */}
      {role === 'creator' && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-indigo-400" />
            Generate AI Content
          </h2>
          <form onSubmit={handleGenerate} className="flex flex-col gap-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt (e.g., 'Summarize a marketing campaign for social media')"
              className="w-full p-3 rounded-md bg-slate-900 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={4}
              disabled={aiLoading}
              aria-label="AI prompt input"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={aiLoading || !prompt.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center gap-2"
              aria-label="Generate AI content"
            >
              <BeakerIcon className="h-5 w-5" />
              {aiLoading ? 'Generating...' : 'Generate'}
            </motion.button>
          </form>
        </div>
      )}

      {/* AI Lab Table */}
      <table className="w-full text-sm text-left text-slate-300">
        <thead className="text-xs text-slate-400 uppercase bg-slate-700/50">
          <tr>
            <th scope="col" className="px-4 py-3 md:px-6">Prompt</th>
            <th scope="col" className="px-4 py-3 md:px-6">Created By</th>
            <th scope="col" className="px-4 py-3 md:px-6">Date</th>
            <th scope="col" className="px-4 py-3 md:px-6">Output Preview</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {aiItems.map((item) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="border-b border-slate-700 hover:bg-indigo-700/20 cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={() => console.log('View AI item:', item.id)} // Replace with navigate if needed
                onKeyDown={(e) => e.key === 'Enter' && console.log('View AI item:', item.id)}
                aria-label={`View AI item: ${item.prompt}`}
              >
                <td className="px-4 py-4 md:px-6 font-semibold text-white">
                  {item.prompt.slice(0, 50) + (item.prompt.length > 50 ? '...' : '')}
                </td>
                <td className="px-4 py-4 md:px-6">{item.createdBy?.name || 'Unknown'}</td>
                <td className="px-4 py-4 md:px-6">
                  {item.createdAt?.toDate().toLocaleDateString() || 'N/A'}
                </td>
                <td className="px-4 py-4 md:px-6">
                  {item.output.slice(0, 50) + (item.output.length > 50 ? '...' : '')}
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </motion.div>
  );
};