// src/components/AILab/DraftGenerator.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const DraftGenerator = ({ userRole }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input || (userRole !== 'creator' && userRole !== 'editor')) return;
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
          prompt: `Generate a draft based on this idea: ${input}. Keep it concise, professional, and suitable for a blog post.`,
          max_tokens: 200,
        }),
      });
      const data = await response.json();
      setOutput(data.choices[0].text.trim());
    } catch (error) {
      setOutput('Error generating draft. Please try again.');
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-700 p-4 rounded-lg"
    >
      <h3 className="text-lg font-semibold text-white mb-2">Draft Generator</h3>
      <textarea
        className="w-full p-2 mb-2 bg-gray-600 text-white rounded"
        placeholder="Enter your content idea..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={userRole !== 'creator' && userRole !== 'editor'}
      />
      <button
        className="btn-primary w-full"
        onClick={handleGenerate}
        disabled={loading || (userRole !== 'creator' && userRole !== 'editor')}
      >
        {loading ? 'Generating...' : 'Generate Draft'}
      </button>
      {output && <p className="mt-2 text-gray-300">{output}</p>}
    </motion.div>
  );
};

export default DraftGenerator;