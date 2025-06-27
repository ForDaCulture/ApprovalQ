// src/components/AppLayout.js
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const AppLayout = ({ children, user, isGuest, handleLogout }) => {
  const isAuthenticated = user || isGuest;

  // If not authenticated, we only render the children (e.g., the full-page LandingPage)
  if (!isAuthenticated) {
    return <main>{children}</main>;
  }

  // If authenticated, we render the full SaaS application shell
  return (
    <div className="min-h-screen w-full bg-gray-950 text-white font-sans">
      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <Sidebar />
      </div>

      {/* Main content area, correctly positioned to the right of the sidebar */}
      <div className="lg:pl-72">
        {/* The header is now the top bar of the main content area */}
        <Header user={user} isGuest={isGuest} handleLogout={handleLogout} />
        
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;