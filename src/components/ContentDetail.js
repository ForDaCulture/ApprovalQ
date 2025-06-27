// src/components/ContentDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';

const ContentDetail = ({ db, user, isGuest }) => {
  const { contentId } = useParams(); // Get the contentId from the URL
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    // You cannot view details in guest mode.
    if (isGuest) {
      setError("Please log in to view content details.");
      setLoading(false);
      return;
    }
    if (!user) {
        // This case handles if a user somehow gets here without being logged in.
        setLoading(false);
        return;
    }

    const docRef = doc(db, 'content', contentId);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Security check: ensure the logged-in user is the creator
        if (data.createdBy.userId === user.uid) {
            setContent({ id: docSnap.id, ...data });
        } else {
            setError("You do not have permission to view this content.");
        }
      } else {
        setError("This document does not exist.");
      }
      setLoading(false);
    }, (err) => {
      console.error("Error fetching document:", err);
      setError("Failed to load the document.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [contentId, db, user, isGuest]);

  if (loading) {
    return <div className="text-white text-center pt-32">Loading Content...</div>;
  }

  if (error) {
    return <div className="text-red-400 text-center pt-32">{error}</div>;
  }

  if (!content) {
    return <div className="text-white text-center pt-32">Content not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 text-white">
      <div className="mb-8">
        <RouterLink to="/dashboard" className="text-indigo-400 hover:text-indigo-300">&larr; Back to Dashboard</RouterLink>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content Pane */}
        <div className="md:col-span-2 bg-black/20 backdrop-blur-lg border border-white/10 p-8 rounded-xl">
            <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold">{content.title}</h1>
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/50">
                    {content.status}
                </span>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
                <h2 className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Original Prompt</h2>
                <p className="mt-2 text-gray-300 bg-gray-800/50 p-3 rounded-md font-mono text-sm">{content.prompt}</p>
            </div>
            <div className="mt-6">
                <h2 className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Generated Content</h2>
                <div className="mt-2 text-gray-200 leading-relaxed whitespace-pre-wrap">{content.generatedContent}</div>
            </div>
        </div>

        {/* Sidebar for Comments & Actions (Phase 2) */}
        <div className="md:col-span-1">
            <div className="bg-black/20 backdrop-blur-lg border border-white/10 p-6 rounded-xl">
                <h2 className="text-xl font-semibold">Activity & Comments</h2>
                <div className="mt-4 pt-4 border-t border-white/10 text-center text-gray-400">
                    <p>Commenting will be enabled in Phase 2.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDetail;