// Corrected to properly use the 'navigate' function from context

import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
import { AllContent } from './AllContent';
import { CreativeInsights } from './CreativeInsights';
import { Settings } from './Settings';

const ContentCreator = () => <div>Create Content Form</div>;

export const AppLayout = () => {
    const { user, handleLogout, appView, navigate } = useContext(AppContext);
    
    if (!user) {
        return <div className="bg-slate-900 h-screen w-screen flex items-center justify-center text-white">Authenticating...</div>;
    }

    const renderView = () => {
        switch(appView) {
            case 'dashboard': return <Dashboard />;
            case 'all-content': return <AllContent />;
            case 'insights': return <CreativeInsights />;
            case 'settings': return <Settings />;
            case 'create': return <ContentCreator />;
            default: return <Dashboard />;
        }
    }
    
    return (
        <div className="flex h-screen bg-gray-900 text-white">
            <Sidebar currentView={appView} setView={navigate} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header user={user} onLogout={handleLogout} view={appView} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-800 p-8">
                    {renderView()}
                </main>
            </div>
        </div>
    );
};