// src/components/Notification.js
import React, { useEffect } from 'react';

const Notification = ({ notification, onClear }) => {
  const { message, type } = notification;

  useEffect(() => {
    // If there's a message, set a timer to clear it after 5 seconds
    if (message) {
      const timer = setTimeout(() => {
        onClear();
      }, 5000);
      
      // Cleanup the timer if the component unmounts or notification changes
      return () => clearTimeout(timer);
    }
  }, [message, onClear]);

  if (!message) {
    return null;
  }

  // Determine styles based on notification type
  const baseClasses = "fixed top-5 right-5 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden z-50";
  const typeClasses = {
    success: 'border-l-4 border-green-500',
    error: 'border-l-4 border-red-500',
  };
  const iconClasses = {
      success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', // Check circle
      error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' // X circle
  }
  const iconColor = type === 'success' ? 'text-green-500' : 'text-red-500';

  return (
    <div className={`${baseClasses} ${typeClasses[type] || ''}`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
             <svg className={`h-6 w-6 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconClasses[type]} />
            </svg>
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900">{type === 'success' ? 'Success!' : 'Error'}</p>
            <p className="mt-1 text-sm text-gray-500">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button onClick={onClear} className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;