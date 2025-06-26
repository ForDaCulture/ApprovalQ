// src/components/Sidebar.js
import React from 'react';

// --- Icon Components ---
const HomeIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const DocumentTextIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const CogIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const ChartBarIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;

export const Sidebar = ({ currentView, setView }) => {
    const navItems = [ 
        { id: 'dashboard', label: 'Dashboard', icon: HomeIcon }, 
        { id: 'content', label: 'All Content', icon: DocumentTextIcon },
        { id: 'insights', label: 'Insights Engine', icon: ChartBarIcon }, 
        { id: 'settings', label: 'Settings', icon: CogIcon } 
    ];
    return (
        <aside className="w-64 bg-gray-900 border-r border-gray-800 flex-shrink-0 flex flex-col">
            <div className="h-[73px] flex items-center justify-center border-b border-gray-800 flex-shrink-0"><h1 className="text-2xl font-black bg-gradient-to-r from-violet-500 to-indigo-500 text-transparent bg-clip-text">ApprovalQ</h1></div>
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map(item => (<button key={item.id} onClick={() => setView(item.id)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold text-sm transition ${currentView === item.id ? 'bg-violet-500/10 text-violet-400' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}><item.icon className="h-6 w-6" /><span>{item.label}</span></button>))}
            </nav>
            <div className="p-4 border-t border-gray-800 flex-shrink-0"><button onClick={() => setView('create')} className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg transition shadow-lg shadow-indigo-600/20"><PlusIcon /><span>New Content</span></button></div>
        </aside>
    );
};