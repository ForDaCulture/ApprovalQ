
import React, { useState, useEffect, useRef } from 'react';

const BellIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const ChevronDownIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;

export const Header = ({ user, onLogout, view }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const viewTitles = { dashboard: 'Dashboard', insights: 'Creative Insights', 'all-content': 'All Content', content: 'Content Review', settings: 'Settings', create: 'New Content', sandbox: 'AI Strategy Lab' };

    useEffect(() => {
        const handleClickOutside = (event) => { if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false); };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const displayName = user ? user.name : 'User';
    const role = user ? user.role : 'Guest';
    const photoURL = user ? user.photoURL : '';
    const nameInitial = displayName ? displayName.charAt(0) : 'G';

    return (
        <header className="bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center flex-shrink-0">
            <h1 className="text-xl font-bold text-white capitalize">{viewTitles[view]}</h1>
            <div className="flex items-center space-x-6">
                <button className="text-gray-400 hover:text-white transition"><BellIcon className="h-6 w-6" /></button>
                <div className="relative" ref={menuRef}>
                    <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center space-x-2">
                        {photoURL ? 
                            <img className="h-9 w-9 rounded-full" src={photoURL} alt="User avatar" /> :
                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center font-bold text-white">{nameInitial}</div>
                        }
                        <div className="hidden md:block text-left"><p className="font-semibold text-sm text-gray-200">{displayName}</p><p className="text-xs text-gray-400">{role}</p></div>
                        <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {menuOpen && (<div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-700"><button className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700">Profile</button><button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700">Logout</button></div>)}
                </div>
            </div>
        </header>
    );
};