import React, { useState, useContext, useNavigate } from 'react'; // Added useNavigate
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { SparklesIcon, PaperAirplaneIcon, LockClosedIcon } from '@heroicons/react/24/solid';

const AILab = () => {
  const { db, openai, user, orgId, role, navigate } = useContext(AppContext); // Added navigate to context destructuring
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canGenerate = role === 'Admin' || role === 'Creator';

  const handleGenerateContent = async (e) => {
    e.preventDefault();
    if (!canGenerate) {
      setError('You do not have permission to generate content.');
      return;
    }
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate content.');
      return;
    }
    if (!openai) {
      setError('OpenAI service is not available. Please check your API key.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that writes concise and professional blog posts.' },
          { role: 'user', content: `Write a blog post about: ${prompt}` }
        ],
      });

      const generatedContent = completion.choices[0]?.message?.content;
      if (!generatedContent) {
        throw new Error('AI failed to generate content.');
      }

      const contentCollection = collection(db, 'content');
      await addDoc(contentCollection, {
        title: prompt.substring(0, 60),
        content: generatedContent,
        orgId: orgId,
        createdBy: {
          userId: user.uid,
          name: user.displayName || 'Unknown User',
        },
        createdAt: serverTimestamp(),
        status: 'Pending',
      });

      navigate('/all-content'); // Using navigate from useNavigate
    } catch (err) {
      console.error('AI Lab Error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-4 md:p-6"
    >
      <div className="flex flex-col items-center text-center mb-8">
        <SparklesIcon className="h-16 w-16 text-indigo-400 mb-4" />
        <h1 className="text-4xl font-bold text-white">AI Content Lab</h1>
        <p className="text-slate-400 mt-2 max-w-2xl">
          Describe the content you want to create. Our AI will generate a draft, which you can then review and edit.
        </p>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 shadow-2xl">
        <form onSubmit={handleGenerateContent}>
          <label htmlFor="ai-prompt" className="block text-sm font-medium text-slate-300 mb-2">
            Your Prompt
          </label>
          <textarea
            id="ai-prompt"
            rows="6"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'A blog post about the top 5 benefits of remote work for small businesses'"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            disabled={loading || !canGenerate}
          />
          
          {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}

          <div className="mt-6 flex justify-center">
            <motion.button
              type="submit"
              disabled={loading || !canGenerate}
              whileHover={{ scale: (loading || !canGenerate) ? 1 : 1.05 }}
              whileTap={{ scale: (loading || !canGenerate) ? 1 : 0.95 }}
              className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              {!canGenerate ? (
                <>
                  <LockClosedIcon className="h-5 w-5" />
                  Permission Denied
                </>
              ) : loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="h-5 w-5" />
                  Generate Content
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AILab;