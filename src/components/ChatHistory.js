import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig'; // Assuming firebaseConfig.js exports initialized db
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

const ChatHistory = ({ userId }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, 'chatHistory'),
      where('userId', '==', userId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    }, (error) => {
      console.error('Error fetching chat history:', error);
    });

    return () => unsubscribe();
  }, [userId]);

  return (
    <div className="p-4 bg-gray-800 text-white rounded">
      <h3 className="text-lg font-bold">Chat History</h3>
      {messages.length === 0 ? (
        <p>No chat history available.</p>
      ) : (
        <ul>
          {messages.map((msg) => (
            <li key={msg.id} className="py-2">
              <span className="text-gray-400">
                {new Date(msg.timestamp?.toDate()).toLocaleString()}:
              </span>{' '}
              {msg.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatHistory;