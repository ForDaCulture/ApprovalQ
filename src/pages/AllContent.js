// src/pages/AllContent.js
import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';

const AllContent = ({ db, user, showNotification }) => {
  const [contentList, setContentList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    const contentRef = collection(db, 'content');
    const q = query(contentRef, where("createdBy.userId", "==", user.uid), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const contents = [];
      querySnapshot.forEach((doc) => { contents.push({ id: doc.id, ...doc.data() }); });
      setContentList(contents);
      setIsLoading(false);
    }, (err) => {
        showNotification("Could not load your content.", 'error');
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user, db, showNotification]);

  if (isLoading) {
    return <p className="text-gray-400">Loading content...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">All Content</h1>
      <div className="bg-gray-900 shadow sm:rounded-lg">
        <div className="min-w-full overflow-hidden overflow-x-auto align-middle">
          <table className="min-w-full divide-y divide-gray-800">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {contentList.map((content) => (
                <tr key={content.id} className="hover:bg-gray-800/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    <Link to={`/content/${content.id}`} className="hover:text-indigo-400">
                        {content.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{content.createdBy.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {content.createdAt ? new Date(content.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <StatusBadge status={content.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {contentList.length === 0 && <p className="text-center py-8 text-gray-500">No content found.</p>}
      </div>
    </div>
  );
};

export default AllContent;