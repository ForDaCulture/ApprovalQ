// src/components/InviteUserForm.js
import React from 'react';

export const InviteUserForm = ({ isInline = false }) => (
     <div className={`flex gap-2 ${isInline ? '' : 'mt-4'}`}>
        <input type="email" placeholder="new.teammate@example.com" className="flex-1 px-3 py-3 border border-gray-600 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        <select className="px-3 py-3 border border-gray-600 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            <option>Content Creator</option>
            <option>Junior Marketer</option>
            <option>Senior Editor</option>
        </select>
         {isInline && <button className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition">Send Invite</button>}
     </div>
);