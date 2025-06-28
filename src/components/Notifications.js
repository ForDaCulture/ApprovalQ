import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig'; // Adjusted path
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const Notifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, 'notifications'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedNotifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(fetchedNotifications);
    });

    return () => unsubscribe();
  }, [userId]);

  return (
    <div className="p-4 bg-gray-800 text-white rounded">
      <h3 className="text-lg font-bold">Notifications</h3>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul>
          {notifications.map((notif) => (
            <li key={notif.id} className="py-2">
              {notif.message} -{' '}
              <span className="text-gray-400">
                {new Date(notif.timestamp?.toDate()).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;