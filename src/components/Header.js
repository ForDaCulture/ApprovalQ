// src/components/Header.js
import React, { useState } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';

const Header = ({ user, isGuest, handleLogout }) => {
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);

  // This header is only shown when authenticated, so we can assume user or isGuest is true.
  const displayName = isGuest ? 'Guest' : user?.displayName || 'User';
  const role = isGuest ? 'Read-Only' : 'Content Creator'; // We can make this dynamic later

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-800 bg-gray-950 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* This button is for mobile sidebar, we'll wire it up later */}
      <button type="button" className="-m-2.5 p-2.5 text-gray-400 lg:hidden">
        <span className="sr-only">Open sidebar</span>
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-800 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end">
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-300">
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          
          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-800" aria-hidden="true" />

          {/* Profile dropdown */}
          <div className="relative">
            <button onClick={() => setUserMenuOpen(!isUserMenuOpen)} className="-m-1.5 flex items-center p-1.5">
              <span className="sr-only">Open user menu</span>
              <div className="h-8 w-8 rounded-full bg-indigo-700 flex items-center justify-center text-sm font-semibold">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-4 text-sm font-semibold leading-6 text-white" aria-hidden="true">
                  {displayName}
                </span>
                <svg className="ml-2 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
              </span>
            </button>
            {isUserMenuOpen && (
                 <div className="absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded-md bg-gray-900 py-2 shadow-lg ring-1 ring-white/10 focus:outline-none">
                    <div className="px-4 py-2 border-b border-white/10">
                        <p className="text-sm font-semibold text-white">{displayName}</p>
                        <p className="text-xs text-gray-400">{role}</p>
                    </div>
                    <a href="/settings" className="block px-4 py-2 text-sm leading-5 text-gray-300 hover:bg-gray-800">Settings</a>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm leading-5 text-gray-300 hover:bg-gray-800">
                        {isGuest ? 'Exit Guest Mode' : 'Log out'}
                    </button>
                 </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;