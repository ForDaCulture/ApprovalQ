// src/components/AILab/Summarizer.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Summarizer = () => {
  const [input, setInput] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!input) return;
    setLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          prompt: `Summarize this content in 2-3 sentences: ${input}`,
          max_tokens: 100,
        }),
      });
      const data = await response.json();
      setSummary(data.choices[0].text.trim());
    } catch (error) {
      setSummary('Error summarizing content. Please try again.');
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-700 p-4 rounded-lg"
    >
      <h3 className="text-lg font-semibold text-white mb-2">Summarizer</h3>
      <textarea
        className="w-full p-2 mb-2 bg-gray-600 text-white rounded"
        placeholder="Paste content to summarize..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        className="btn-primary w-full"
        onClick={handleSummarize}
        disabled={loading}
      >
        {loading ? 'Summarizing...' : 'Generate Summary'}
      </button>
      {summary && <p className="mt-2 text-gray-300">{summary}</p>}
    </motion.div>
  );
};

export default Summarizer;