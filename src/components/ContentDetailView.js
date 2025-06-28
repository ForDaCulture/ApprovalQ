import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeftIcon, PencilIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const ContentDetailView = () => {
  const { contentId } = useParams();
  const { db, user, addComment, navigate } = useContext(AppContext);
  const { theme } = useTheme();
  const [content, setContent] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [status, setStatus] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !contentId) {
      setLoading(false);
      return;
    }
    const fetchContent = async () => {
      try {
        const contentRef = doc(db, 'content', contentId);
        const contentSnap = await getDoc(contentRef);
        if (contentSnap.exists()) {
          const data = contentSnap.data();
          setContent(data);
          setStatus(data.status || 'Draft');
          setEditedContent(data.body || '');
        } else {
          setContent(null);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [db, contentId]);

  useEffect(() => {
    if (!db || !contentId) return;
    const commentsRef = collection(db, `content/${contentId}/comments`);
    const unsubscribe = onSnapshot(commentsRef, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComments(commentsData.sort((a, b) => a.createdAt?.toDate() - b.createdAt?.toDate()));
    }, (error) => console.error('Error fetching comments:', error));
    return () => unsubscribe();
  }, [db, contentId]);

  const canEdit = user?.role === 'Editor' || user?.role === 'Content Creator';
  const canReview = user?.role === 'Reviewer' && status === 'Under Review';
  const canApprove = user?.role === 'Approver' && status === 'Under Review';

  const handleStatusChange = async (newStatus) => {
    if (!db || !contentId) return;
    try {
      const contentRef = doc(db, 'content', contentId);
      await updateDoc(contentRef, { status: newStatus, updatedAt: serverTimestamp() });
      setStatus(newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleSaveEdit = async () => {
    if (!db || !contentId) return;
    try {
      const contentRef = doc(db, 'content', contentId);
      await updateDoc(contentRef, { body: editedContent, updatedAt: serverTimestamp() });
      setContent(prev => ({ ...prev, body: editedContent }));
      setEditMode(false);
    } catch (error) {
      console.error('Error saving edit:', error);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(newComment);
      setNewComment('');
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`p-6 text-center ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} min-h-screen`}
      >
        <p>Loading content...</p>
      </motion.div>
    );
  }

  if (!content) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`p-6 text-center ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} min-h-screen`}
      >
        <p>Content not found.</p>
        <Link to="/all-content" className={`text-${theme === 'dark' ? 'indigo-400' : 'indigo-600'} hover:underline mt-4 inline-block`}>
          <ArrowLeftIcon className="h-5 w-5 inline mr-1" /> Back to All Content
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex flex-col p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} min-h-screen`}
    >
      <div className="mb-6">
        <Link to="/all-content" className={`text-${theme === 'dark' ? 'indigo-400' : 'indigo-600'} hover:underline mb-4 inline-block transition-colors`}>
          <ArrowLeftIcon className="h-5 w-5 inline mr-1" /> Back to All Content
        </Link>
        <h1 className="text-2xl font-bold mb-2">{content.title}</h1>
        <p className={`text-${theme === 'dark' ? 'gray-400' : 'gray-600'} mb-4`}>Created by: {content.createdBy?.name || 'Unknown'}</p>
        {editMode ? (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className={`w-full p-2 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            rows="6"
          />
        ) : (
          <div className="prose max-w-none">
            <p>{content.body}</p>
          </div>
        )}
        <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Status: <span className="text-indigo-400">{status}</span></p>
        {canEdit && (
          <button
            onClick={() => setEditMode(!editMode)}
            className={`mt-2 ${editMode ? 'bg-green-600 hover:bg-green-500' : 'bg-blue-600 hover:bg-blue-500'} text-white py-1 px-3 rounded transition-transform hover:scale-105`}
          >
            {editMode ? <><CheckCircleIcon className="h-4 w-4 inline mr-1" /> Save</> : <><PencilIcon className="h-4 w-4 inline mr-1" /> Edit</>}
          </button>
        )}
        {editMode && (
          <button
            onClick={() => setEditMode(false)}
            className="ml-2 bg-red-600 hover:bg-red-500 text-white py-1 px-3 rounded transition-transform hover:scale-105"
          >
            <XCircleIcon className="h-4 w-4 inline mr-1" /> Cancel
          </button>
        )}
        {editMode && <button onClick={handleSaveEdit} className="ml-2 bg-green-600 hover:bg-green-500 text-white py-1 px-3 rounded transition-transform hover:scale-105">Save Changes</button>}
      </div>

      <div className="flex space-x-4 mb-6">
        {canEdit && status === 'Draft' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded transition-colors"
            onClick={() => handleStatusChange('Under Review')}
          >
            Send for Review
          </motion.button>
        )}
        {canReview && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-yellow-600 hover:bg-yellow-500 text-white py-2 px-4 rounded transition-colors"
            onClick={() => handleStatusChange('Changes Requested')}
          >
            Request Changes
          </motion.button>
        )}
        {canApprove && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded transition-colors"
            onClick={() => handleStatusChange('Approved')}
          >
            Approve
          </motion.button>
        )}
      </div>

      <div className={`bg-${theme === 'dark' ? 'gray-800' : 'gray-200'} p-4 rounded-lg mb-6`}>
        <h3 className="text-lg font-semibold mb-4">Comments</h3>
        <form onSubmit={handleAddComment} className="mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className={`w-full p-2 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} rounded mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            rows="3"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded transition-colors"
          >
            Post Comment
          </motion.button>
        </form>
        <div className="space-y-4 max-h-60 overflow-y-auto">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} rounded-lg`}
              >
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {comment.createdBy.name} ({comment.createdBy.role}) -{' '}
                  {comment.createdAt?.toDate().toLocaleString()}
                </p>
                <p className={`mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{comment.text}</p>
              </motion.div>
            ))
          ) : (
            <p className={`text-${theme === 'dark' ? 'gray-400' : 'gray-500'}`}>No comments yet.</p>
          )}
        </div>
      </div>

      {status === 'Approved' && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Publish</h3>
          <div className="flex items-center space-x-4">
            <select
              className={`bg-${theme === 'dark' ? 'gray-700' : 'white'} p-2 rounded text-${theme === 'dark' ? 'white' : 'gray-900'}`}
            >
              <option value="blog">Blog</option>
              <option value="twitter">Twitter</option>
              <option value="linkedin">LinkedIn</option>
            </select>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-purple-600 hover:bg-purple-500 text-white py-2 px-4 rounded transition-colors"
            >
              Publish Now
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ContentDetailView;