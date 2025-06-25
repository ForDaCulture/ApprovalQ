import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, onSnapshot, query, where, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';

// --- Icon Components (Heroicons & Custom) ---
const ChevronDownIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
const BellIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const HomeIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const DocumentTextIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const CogIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const ChartBarIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const CheckCircleIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const SparklesIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L11 15l-4 6h6l1.293-1.293a1 1 0 011.414 0L19 19m-7-3l4-4m0 0l4 4m-4-4v12" /></svg>;
const UploadIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const PaperAirplaneIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>;
const GlobeIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h8a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.704 4.343a9.003 9.003 0 0110.592 0m-10.592 0a9.003 9.003 0 00-1.263 5.06M18.296 4.343a9.003 9.003 0 011.263 5.06M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const LightBulbIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;

// --- MOCK PROFILES (for login simulation) ---
const initialUsers = {
    "user_creator": { name: "Alex Chen", email: "alex.c@innovateinc.com", role: "Content Creator", org: "Innovate Inc.", avatarInitial: "A", plan: "Team Plan" },
    "user_marketer": { name: "Brenda Starr", email: "brenda.s@innovateinc.com", role: "Junior Marketer", org: "Innovate Inc.", avatarInitial: "B", plan: "Team Plan" },
    "user_editor": { name: "Charles Kane", email: "charles.k@innovateinc.com", role: "Senior Editor", org: "Innovate Inc.", avatarInitial: "C", plan: "Team Plan" },
};

const initialContent = [
    { id: 1, title: "Q3 Product Launch Blog Post", createdBy: "Alex Chen", status: "Needs Factual Review", createdAt: "2025-06-18", prompt: "Write a blog post about our new Q3 product, 'SynthWave', targeting enterprise customers.", content: "SynthWave is the future of enterprise AI...", comments: [] },
    { id: 2, title: "New Homepage Headline Copy", createdBy: "Alex Chen", status: "Needs Brand Review", createdAt: "2025-06-17", prompt: "Generate 5 new headlines for our homepage.", content: "1. Innovate Faster. 2. Your Partner in AI. ...", comments: [] },
    { id: 3, title: "Social Media Campaign - July", createdBy: "Alex Chen", status: "Changes Requested (Factual)", createdAt: "2025-06-15", prompt: "Create a series of tweets for our July social media campaign.", content: "Tweet 1: ... Tweet 2: ...", comments: [] },
    { id: 4, title: "Investor Update - Q2", createdBy: "Alex Chen", status: "Approved", createdAt: "2025-06-12", prompt: "Draft the Q2 investor update email.", content: "Dear Investors, Q2 has been a period of significant growth...", comments: [{text: "Looks good!", author: "Charles Kane", role: "Senior Editor"}]}
];

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
    const [view, setView] = useState('login');
    const [appView, setAppView] = useState('dashboard');
    const [user, setUser] = useState(null);
    const [contentItems, setContentItems] = useState(initialContent);
    const [activeContentId, setActiveContentId] = useState(null);

    const handleLogin = (userId) => {
        setUser(initialUsers[userId]);
        setView('app');
    };
    
    const handleLogout = () => { setUser(null); setView('login'); };

    const navigate = (newView, contentId = null) => {
        setAppView(newView);
        setActiveContentId(contentId);
    }
    
    const updateContentStatus = (contentId, newStatus) => {
        setContentItems(prev => prev.map(item => item.id === contentId ? { ...item, status: newStatus } : item));
    }
    
    const addContent = (newItem) => {
        const newContent = {
            id: contentItems.length + 1,
            ...newItem,
            createdAt: new Date().toISOString().split('T')[0],
            comments: []
        };
        setContentItems(prev => [newContent, ...prev]);
    }

    return (
        <AppContext.Provider value={{
            view, setView, appView, setAppView, user, setUser, handleLogin, handleLogout,
            contentItems, setContentItems, activeContentId, setActiveContentId, navigate, updateContentStatus, addContent
        }}>
            {children}
        </AppContext.Provider>
    );
};

// --- Main Application Component ---
const App = () => {
    return (
        <AppProvider>
            <Main />
        </AppProvider>
    );
};

const Main = () => {
    const { view } = React.useContext(AppContext);

    const renderContent = () => {
        switch (view) {
            case 'login': return <Login />;
            case 'onboarding': return <Onboarding />;
            case 'app': return <AppLayout />;
            default: return <Login />;
        }
    };
    return (
        <>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`}</style>
            <div className="bg-slate-900 text-slate-100 min-h-screen font-sans antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
                {renderContent()}
            </div>
        </>
    );
};

// --- App Layout & Core Views ---
const AppLayout = () => {
    const { user, handleLogout, appView, navigate, activeContentId } = React.useContext(AppContext);
    return (
        <div className="flex h-screen bg-slate-800">
            <Sidebar currentView={appView} setView={navigate} user={user} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header user={user} onLogout={handleLogout} view={appView} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-900 p-8">
                    {appView === 'dashboard' && <Dashboard />}
                    {appView === 'all-content' && <AllContentView />}
                    {appView === 'insights' && <CreativeInsights />}
                    {appView === 'sandbox' && <AISandbox />}
                    {appView === 'content' && <ContentView contentId={activeContentId} />}
                    {appView === 'create' && <ContentCreator />}
                    {appView === 'settings' && <Settings user={user} />}
                </main>
            </div>
        </div>
    );
};

const Header = ({ user, onLogout, view }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const viewTitles = { dashboard: 'Dashboard', insights: 'Creative Insights', 'all-content': 'All Content', content: 'Content Review', settings: 'Settings', create: 'New Content', sandbox: 'AI Strategy Lab' };

    useEffect(() => {
        const handleClickOutside = (event) => { if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false); };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center flex-shrink-0">
            <h1 className="text-xl font-bold text-white capitalize">{viewTitles[view]}</h1>
            <div className="flex items-center space-x-6">
                <button className="text-slate-400 hover:text-white transition"><BellIcon className="h-6 w-6" /></button>
                <div className="relative" ref={menuRef}>
                    <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center space-x-2">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-teal-500 to-sky-600 flex items-center justify-center font-bold text-white">{user.name.charAt(0)}</div>
                        <div className="hidden md:block text-left"><p className="font-semibold text-sm text-slate-200">{user.name}</p><p className="text-xs text-slate-400">{user.role}</p></div>
                        <ChevronDownIcon className={`h-5 w-5 text-slate-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {menuOpen && (<div className="absolute right-0 mt-2 w-48 bg-slate-700 rounded-md shadow-lg py-1 z-50 border border-slate-600"><a href="#" className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-600">Profile</a><button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-600">Logout</button></div>)}
                </div>
            </div>
        </header>
    );
};

const Sidebar = ({ currentView, setView, user }) => {
    const navItems = [ 
        { id: 'dashboard', label: 'Dashboard', icon: HomeIcon }, 
        { id: 'all-content', label: 'All Content', icon: DocumentTextIcon },
        { id: 'insights', label: 'Insights Engine', icon: ChartBarIcon }, 
        { id: 'sandbox', label: 'AI Strategy Lab', icon: LightBulbIcon },
        { id: 'settings', label: 'Settings', icon: CogIcon } 
    ];
    return (
        <aside className="w-64 bg-slate-800 border-r border-slate-700 flex-shrink-0 flex flex-col">
            <div className="h-[73px] flex items-center justify-center border-b border-slate-700 flex-shrink-0"><h1 className="text-2xl font-black bg-gradient-to-r from-teal-400 to-sky-500 text-transparent bg-clip-text">ApprovalQ</h1></div>
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map(item => (<button key={item.id} onClick={() => setView(item.id)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold text-sm transition ${currentView === item.id ? 'bg-teal-500/10 text-teal-400' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}><item.icon className="h-6 w-6" /><span>{item.label}</span></button>))}
            </nav>
            <div className="p-4 border-t border-slate-700 flex-shrink-0"><button onClick={() => setView('create')} className="w-full flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 px-4 rounded-lg transition shadow-lg shadow-teal-600/20"><PlusIcon /><span>New Content</span></button></div>
        </aside>
    );
};

// --- Page Components ---
const Dashboard = () => {
    const { contentItems, navigate, user } = React.useContext(AppContext);
    
    const myActionItems = contentItems.filter(item => {
        if(user.role === 'Junior Marketer' && item.status === 'Needs Factual Review') return true;
        if(user.role === 'Senior Editor' && item.status === 'Needs Brand Review') return true;
        if(user.role === 'Content Creator' && item.status.startsWith('Changes Requested')) return true;
        return false;
    });

    const getStatusInfo = (status) => {
        const base = "px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-2";
        switch (status) {
            case 'Approved': return { text: 'Approved', style: `bg-green-500/10 text-green-400 border border-green-500/30 ${base}` };
            case 'Needs Brand Review': return { text: 'Brand Review', style: `bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 ${base}` };
            case 'Needs Factual Review': return { text: 'Factual Review', style: `bg-orange-500/10 text-orange-400 border border-orange-500/30 ${base}` };
            case 'Changes Requested (Factual)': case 'Changes Requested (Brand)': return { text: 'Changes Requested', style: `bg-sky-500/10 text-sky-400 border border-sky-500/30 ${base}` };
            case 'Rejected': return { text: 'Rejected', style: `bg-red-500/10 text-red-400 border border-red-500/30 ${base}` };
            default: return { text: status, style: `bg-slate-500/10 text-slate-400 border border-slate-500/30 ${base}` };
        }
    };
    return (
        <div>
            <h2 className="text-3xl font-bold text-white mb-6">Your Action Items</h2>
            {myActionItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myActionItems.map(content => {
                         const statusInfo = getStatusInfo(content.status);
                         return (
                            <div key={content.id} className="bg-slate-800/70 p-6 rounded-lg border border-slate-700 cursor-pointer hover:border-teal-500 hover:-translate-y-1 transition-all duration-300 shadow-lg" onClick={() => navigate('content', content.id)}>
                                <h3 className="text-lg font-bold mb-2 text-white truncate">{content.title}</h3><p className="text-slate-400 mb-4 text-sm">By {content.createdBy}</p>
                                <div className="flex justify-between items-center"><span className={statusInfo.style}><span className="h-2 w-2 rounded-full bg-current"></span>{statusInfo.text}</span><span className="text-xs text-slate-500">{content.createdAt}</span></div>
                            </div>
                         );
                    })}
                </div>
            ) : (
             <div className="text-center text-slate-500 mt-10 p-8 bg-slate-800/50 rounded-lg border border-dashed border-slate-700"><h3 className="text-xl font-semibold text-white">All clear!</h3><p>You have no pending action items.</p></div>
            )}
        </div>
    );
};

const AllContentView = () => {
    const { contentItems, navigate } = React.useContext(AppContext);

    const getStatusInfo = (status) => {
        const base = "px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-2";
        switch (status) {
            case 'Approved': return { text: 'Approved', style: `bg-green-500/10 text-green-400 border border-green-500/30 ${base}` };
            case 'Needs Brand Review': return { text: 'Brand Review', style: `bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 ${base}` };
            case 'Needs Factual Review': return { text: 'Factual Review', style: `bg-orange-500/10 text-orange-400 border border-orange-500/30 ${base}` };
            case 'Changes Requested (Factual)': case 'Changes Requested (Brand)': return { text: 'Changes Requested', style: `bg-sky-500/10 text-sky-400 border border-sky-500/30 ${base}` };
            case 'Rejected': return { text: 'Rejected', style: `bg-red-500/10 text-red-400 border border-red-500/30 ${base}` };
            default: return { text: status, style: `bg-slate-500/10 text-slate-400 border border-slate-500/30 ${base}` };
        }
    };
    
    return (
        <div className="bg-slate-800/70 p-6 rounded-lg border border-slate-700">
             <table className="w-full text-sm text-left text-slate-300">
                <thead className="text-xs text-slate-400 uppercase bg-slate-700/50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Title</th>
                        <th scope="col" className="px-6 py-3">Created By</th>
                        <th scope="col" className="px-6 py-3">Date</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {contentItems.map(content => {
                        const statusInfo = getStatusInfo(content.status);
                        return (
                        <tr key={content.id} className="border-b border-slate-700 hover:bg-slate-800 cursor-pointer" onClick={() => navigate('content', content.id)}>
                            <td className="px-6 py-4 font-semibold text-white">{content.title}</td>
                            <td className="px-6 py-4">{content.createdBy}</td>
                            <td className="px-6 py-4">{content.createdAt}</td>
                            <td className="px-6 py-4"><span className={statusInfo.style}><span className="h-2 w-2 rounded-full bg-current"></span>{statusInfo.text}</span></td>
                        </tr>
                    )})}
                </tbody>
             </table>
        </div>
    );
}

const ContentCreator = () => {
    const { addContent, navigate, user } = React.useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef(null);

    const handleGenerate = () => {
        setIsLoading(true);
        const title = formRef.current.title.value;
        const prompt = formRef.current.prompt.value;
        
        const newItem = { title, prompt, content: `This is an AI-generated draft for "${title}" based on the prompt: "${prompt}". It requires review.`, status: 'Needs Factual Review', createdBy: user.name };
        setTimeout(() => { addContent(newItem); setIsLoading(false); navigate('dashboard'); }, 1500);
    };
    
    return (
        <div className="max-w-3xl mx-auto">
            <form ref={formRef} onSubmit={(e) => e.preventDefault()} className="bg-slate-800/70 p-8 rounded-lg border border-slate-700 shadow-2xl space-y-6">
                <div><label htmlFor="title" className="block mb-2 text-sm font-medium text-slate-300">Content Title</label><input type="text" id="title" name="title" className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 block w-full p-3" placeholder="e.g., 'Q4 Social Media Campaign Kickoff'" required /></div>
                <div><label htmlFor="prompt" className="block mb-2 text-sm font-medium text-slate-300">AI Prompt</label><textarea id="prompt" name="prompt" rows="8" className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 block w-full p-3" placeholder="Be specific! Include key topics, target audience, desired tone, and any keywords to get the best results." required ></textarea></div>
                <button type="button" onClick={handleGenerate} disabled={isLoading} className="w-full text-white bg-teal-600 hover:bg-teal-500 disabled:bg-slate-600 disabled:shadow-none focus:ring-4 focus:outline-none focus:ring-teal-500/50 font-bold rounded-lg text-md px-5 py-3 text-center transition-all duration-300 shadow-lg shadow-teal-600/30 flex items-center justify-center">
                    {isLoading ? (<><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Generating...</>) : "Generate & Start Workflow"}
                </button>
            </form>
        </div>
    );
};

const ContentView = ({ contentId }) => {
    const { user, contentItems, updateContentStatus, navigate } = React.useContext(AppContext);
    const content = contentItems.find(item => item.id === contentId);

    if (!content) return <p>Content not found.</p>;
    const canEdit = (user.role === 'Content Creator' && content.status.startsWith('Changes Requested')) || (user.role === 'Junior Marketer' && content.status === 'Needs Factual Review') || (user.role === 'Senior Editor' && content.status === 'Needs Brand Review');
    const handleUpdate = (newStatus) => { updateContentStatus(contentId, newStatus); navigate('dashboard'); }

    return (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-slate-800/70 p-8 rounded-lg border border-slate-700 shadow-2xl">
                <h1 className="text-4xl font-extrabold mb-2 text-white">{content.title}</h1>
                <p className="text-sm text-slate-400 mb-8">Created by {content.createdBy} on {content.createdAt}</p>
                <div className="mb-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700"><h3 className="text-sm font-semibold mb-2 text-slate-300">Original AI Prompt</h3><p className="text-sm text-slate-400 italic">{content.prompt}</p></div>
                <div className="mb-6"><h3 className="text-lg font-semibold mb-2 text-slate-200">Content</h3><textarea defaultValue={content.content} readOnly={!canEdit} rows="22" className={`w-full bg-slate-700 border ${!canEdit ? 'border-slate-700' : 'border-slate-600 focus:ring-2 focus:ring-teal-500 focus:border-teal-500'} text-white p-4 rounded-lg transition-all`}></textarea></div>
            </div>
            <div className="space-y-6">
                 <ActionPanel user={user} content={content} onUpdate={handleUpdate} />
                 <CommentsPanel comments={content.comments || []} canComment={canEdit} />
                 {content.status === "Approved" && <PublishPanel />}
            </div>
        </div>
    );
};

// --- ContentView Sub-Components ---
const ActionPanel = ({ user, content, onUpdate }) => {
    return (
         <div className="bg-slate-800/70 p-6 rounded-lg border border-slate-700 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-white">Actions</h3>
            {user.role === 'Content Creator' && content.status.startsWith('Changes Requested') && ( <button onClick={() => onUpdate('Needs Factual Review')} className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-4 rounded-lg transition shadow-lg shadow-sky-600/20">Resubmit for Review</button> )}
            {user.role === 'Junior Marketer' && content.status === 'Needs Factual Review' && (<div className="space-y-3"><button onClick={() => onUpdate('Needs Brand Review')} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition shadow-lg shadow-green-600/20 flex items-center justify-center"><CheckCircleIcon className="h-5 w-5 mr-2" /> Approve & Send</button><button onClick={() => onUpdate('Changes Requested (Factual)')} className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-4 rounded-lg transition shadow-lg shadow-sky-600/20">Request Changes</button></div>)}
            {user.role === 'Senior Editor' && content.status === 'Needs Brand Review' && (<div className="space-y-3"><button onClick={() => onUpdate('Approved')} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition shadow-lg shadow-green-600/20 flex items-center justify-center"><CheckCircleIcon className="h-5 w-5 mr-2" /> Final Approve</button><button onClick={() => onUpdate('Changes Requested (Brand)')} className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-4 rounded-lg transition shadow-lg shadow-sky-600/20">Request Changes</button><button onClick={() => onUpdate('Rejected')} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-lg transition shadow-lg shadow-red-600/20">Reject Content</button></div>)}
             { !( (user.role === 'Content Creator' && content.status.startsWith('Changes Requested')) || (user.role === 'Junior Marketer' && content.status === 'Needs Factual Review') || (user.role === 'Senior Editor' && content.status === 'Needs Brand Review') ) && <p className="text-sm text-slate-500 text-center py-4">No actions required.</p> }
        </div>
    );
};

const CommentsPanel = ({ comments, canComment }) => (
    <div className="bg-slate-800/70 p-6 rounded-lg border border-slate-700 shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-white">Discussion</h3>
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2 mb-4">
            {comments.length > 0 ? [...comments].reverse().map((c, index) => (<div key={index} className="bg-slate-700/50 p-3 rounded-lg"><p className="text-sm text-slate-100">{c.text}</p><p className="text-xs text-teal-400 mt-2 font-semibold text-right">- {c.author} ({c.role})</p></div>)) : <p className="text-sm text-slate-500 text-center py-4">No comments yet.</p>}
        </div>
        {canComment && (<div className="mt-6 border-t border-slate-700 pt-4"><textarea rows="3" className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 mb-2" placeholder="Add a comment or required changes..."></textarea><button className="w-full bg-slate-600 hover:bg-slate-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition flex items-center justify-center"><PaperAirplaneIcon className="h-5 w-5 mr-2 transform -rotate-45" /> Post Comment</button></div>)}
    </div>
);

const PublishPanel = () => {
    const [platforms, setPlatforms] = useState({ blog: true, twitter: false, linkedin: true });
    const togglePlatform = (p) => setPlatforms(prev => ({...prev, [p]: !prev[p]}));
    return (
        <div className="bg-slate-800/70 p-6 rounded-lg border border-slate-700 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-white">Publish</h3>
            <div className="space-y-3">
                <PlatformToggle label="Blog (Wordpress)" active={platforms.blog} onToggle={() => togglePlatform('blog')} />
                <PlatformToggle label="Twitter / X" active={platforms.twitter} onToggle={() => togglePlatform('twitter')} />
                <PlatformToggle label="LinkedIn" active={platforms.linkedin} onToggle={() => togglePlatform('linkedin')} />
            </div>
            <button className="w-full mt-6 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition shadow-lg shadow-green-600/20 flex items-center justify-center"><GlobeIcon className="h-5 w-5 mr-2" /> Publish Now</button>
        </div>
    );
};

const PlatformToggle = ({ label, active, onToggle }) => (
    <button onClick={onToggle} className={`w-full p-3 rounded-md text-left flex justify-between items-center transition ${active ? 'bg-teal-500/20' : 'bg-slate-700 hover:bg-slate-600'}`}>
        <span className={`font-semibold ${active ? 'text-teal-300': 'text-slate-200'}`}>{label}</span>
        <div className={`w-11 h-6 rounded-full flex items-center p-1 transition ${active ? 'bg-teal-500' : 'bg-slate-600'}`}><div className={`w-4 h-4 bg-white rounded-full transform transition-transform ${active ? 'translate-x-5' : 'translate-x-0'}`}></div></div>
    </button>
);

// --- Insights & Other Components ---
const CreativeInsights = () => {
    const [file, setFile] = useState(null);
    const [fileContent, setFileContent] = useState('');
    const [insights, setInsights] = useState([]);
    const [visuals, setVisuals] = useState({});
    const [error, setError] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isGenerating, setIsGenerating] = useState({});

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onload = (e) => setFileContent(e.target.result);
            reader.readAsText(selectedFile);
            setInsights([]); setVisuals({}); setError('');
        }
    };

    const handleAnalyze = async () => {
        if (!fileContent) { setError('Please upload a file first.'); return; }
        setIsAnalyzing(true); setError(''); setInsights([]);
        try {
            const prompt = `Analyze the following marketing data and extract the top 3-5 actionable insights for a creative team. For each insight, provide a 'title' and a 'description' that can be used to generate a visual ad concept.\n\nDATA:\n---\n${fileContent}`;
            let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
            const payload = { contents: chatHistory, generationConfig: { responseMimeType: "application/json", responseSchema: { type: "OBJECT", properties: { "insights": { "type": "ARRAY", "items": { "type": "OBJECT", "properties": { "title": { "type": "STRING" }, "description": { "type": "STRING" } }, "required": ["title", "description"] } } } } } };
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            const result = await response.json();
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                const parsedResult = JSON.parse(result.candidates[0].content.parts[0].text);
                setInsights(parsedResult.insights || []);
            } else { throw new Error("Could not extract insights from the data."); }
        } catch (err) { setError(err.message); console.error(err); } finally { setIsAnalyzing(false); }
    };
    
    const handleGenerateVisual = async (insight, index) => {
        setIsGenerating(prev => ({ ...prev, [index]: true }));
        try {
            const prompt = `Create a visually compelling, photorealistic ad concept for social media based on this insight: "${insight.title}: ${insight.description}". Focus on a clean, modern aesthetic.`;
            const payload = { instances: [{ prompt }], parameters: { "sampleCount": 1 } };
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error(`Image Generation Error: ${response.status}`);
            const result = await response.json();
            if (result.predictions?.[0]?.bytesBase64Encoded) {
                const imageUrl = `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
                setVisuals(prev => ({...prev, [index]: imageUrl}));
            } else { throw new Error("Could not generate visual."); }
        } catch (err) { console.error(err); setVisuals(prev => ({...prev, [index]: `https://placehold.co/1024x1024/ef4444/ffffff?text=Error`}));
        } finally { setIsGenerating(prev => ({ ...prev, [index]: false })); }
    };

    return (
        <div>
            <div className="bg-slate-800/70 p-6 rounded-lg border border-slate-700 mb-8">
                <h3 className="text-xl font-bold text-white">Upload Your Data</h3><p className="text-slate-400 mt-1 mb-4 text-sm">Upload a text file (.txt, .csv) containing marketing reports, survey results, or customer feedback to generate creative insights.</p>
                <div className="flex items-center gap-4">
                    <label htmlFor="file-upload" className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-2 px-4 rounded-lg transition inline-flex items-center gap-2"><UploadIcon className="h-5 w-5" />{file ? 'Change File' : 'Select File'}</label>
                    <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".txt,.csv" />
                    {file && <span className="text-slate-300">{file.name}</span>}
                    <button onClick={handleAnalyze} disabled={!file || isAnalyzing} className="ml-auto bg-teal-600 hover:bg-teal-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition flex items-center gap-2">{isAnalyzing ? 'Analyzing...' : 'Analyze Data'}</button>
                </div>
            </div>
            {isAnalyzing && <p className="text-center text-lg">AI is analyzing your data... this may take a moment.</p>}
            {error && <p className="text-center text-red-400">{error}</p>}
            {insights.length > 0 && (
                <div className="space-y-8">
                    {insights.map((insight, index) => (
                        <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                            <div>
                                <h4 className="text-lg font-bold text-teal-400">{insight.title}</h4><p className="text-slate-300 mt-2">{insight.description}</p>
                                <button onClick={() => handleGenerateVisual(insight, index)} disabled={isGenerating[index]} className="mt-4 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition inline-flex items-center gap-2"><SparklesIcon className="h-5 w-5" />{isGenerating[index] ? 'Generating...' : 'Generate Visual Concept'}</button>
                            </div>
                            <div className="w-full aspect-square bg-slate-700 rounded-lg flex items-center justify-center">
                                {isGenerating[index] && ( <svg className="animate-spin h-8 w-8 text-sky-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> )}
                                {visuals[index] && <img src={visuals[index]} alt={insight.title} className="w-full h-full object-cover rounded-lg" />}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const AISandbox = () => {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsLoading(true);
        setError('');
        setResponse('');
        try {
            const fullPrompt = `As a marketing strategy expert, provide a detailed response for the following request: "${prompt}"`;
            const payload = { contents: [{ role: "user", parts: [{ text: fullPrompt }] }] };
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            const apiResponse = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!apiResponse.ok) throw new Error(`API Error: ${apiResponse.status}`);
            const result = await apiResponse.json();
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                setResponse(result.candidates[0].content.parts[0].text);
            } else { throw new Error("Could not generate a response."); }
        } catch(err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-4">AI Strategy Lab</h3>
            <div className="bg-slate-800/70 p-6 rounded-lg border border-slate-700 space-y-4">
                <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows="4" className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 block w-full p-3" placeholder="e.g., 'Generate 5 different SEO strategies for a new coffee brand...'"></textarea>
                <button onClick={handleGenerate} disabled={isLoading} className="w-full text-white bg-sky-600 hover:bg-sky-500 disabled:bg-slate-600 disabled:shadow-none focus:ring-4 focus:outline-none focus:ring-sky-500/50 font-bold rounded-lg text-md px-5 py-3 text-center transition-all duration-300 shadow-lg shadow-sky-600/30 flex items-center justify-center">
                    {isLoading ? 'Generating...' : 'Generate Strategy'}
                </button>
            </div>
            {isLoading && <p className="text-center mt-4">Generating response...</p>}
            {error && <p className="text-red-400 mt-4">{error}</p>}
            {response && <div className="mt-8 bg-slate-800/50 p-6 rounded-lg border border-slate-700 prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: response.replace(/\n/g, '<br />') }}></div>}
        </div>
    );
};

const Login = () => { const { handleLogin } = useContext(AppContext); const [userId, setUserId] = useState("user_creator"); return ( <div className="flex items-center justify-center min-h-screen"> <div className="w-full max-w-md p-8 space-y-8 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700"> <div className="text-center"><h1 className="text-4xl font-black bg-gradient-to-r from-teal-400 to-sky-500 text-transparent bg-clip-text">ApprovalQ</h1><p className="mt-2 text-slate-400">Log in to your workspace</p></div> <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}> <div className="rounded-md shadow-sm"> <label htmlFor="user-select" className="block mb-2 text-sm font-medium text-slate-400">Login As (Prototype)</label> <select id="user-select" value={userId} onChange={(e) => setUserId(e.target.value)} className="appearance-none relative block w-full px-3 py-3 border border-slate-600 bg-slate-700 text-slate-200 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"> {Object.entries(initialUsers).map(([id, user]) => (<option key={id} value={id}>{user.name} ({user.role})</option>))} </select> </div> <button type="button" onClick={() => handleLogin(userId)} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-teal-600 hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-teal-500 transition">Sign in</button> </form> </div> </div> ); };
const Onboarding = () => { const { setView, user } = useContext(AppContext); const [step, setStep] = useState(1); return ( <div className="flex items-center justify-center min-h-screen"> <div className="w-full max-w-2xl p-8 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700"> {step === 1 && ( <div> <h2 className="text-3xl font-bold text-white text-center">Welcome to ApprovalQ, {user.name.split(' ')[0]}!</h2><p className="text-slate-400 text-center mt-2 mb-8">Let's set up your workspace.</p> <div className="space-y-4"><label className="text-sm font-medium text-slate-300">Organization Name</label><input type="text" defaultValue={user.org} className="mt-1 block w-full px-3 py-3 border border-slate-600 bg-slate-700 text-slate-200 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500" /></div> <button onClick={() => setStep(2)} className="mt-8 w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-lg transition">Next: Invite Your Team</button> </div> )} {step === 2 && ( <div> <h2 className="text-3xl font-bold text-white text-center">Build your creative team</h2><p className="text-slate-400 text-center mt-2 mb-8">Invite the key members of your workflow.</p> <div className="space-y-4"><InviteUserForm isInline={true} /><InviteUserForm isInline={true} /></div> <div className="flex gap-4 mt-8"><button onClick={() => setView('app')} className="w-1/2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-3 rounded-lg transition">Skip for now</button><button onClick={() => setView('app')} className="w-1/2 bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-lg transition">Finish Setup</button></div> </div> )} </div> </div> ); };
const Settings = ({ user }) => { const [activeTab, setActiveTab] = useState('profile'); const tabs = ['profile', 'team', 'billing', 'integrations']; return( <div> <h2 className="text-3xl font-bold text-white mb-2">Settings</h2><p className="text-slate-400 mb-8">Manage your profile, team, and billing information.</p> <div className="flex border-b border-slate-700">{tabs.map(tab => (<button key={tab} onClick={() => setActiveTab(tab)} className={`capitalize px-4 py-3 font-semibold text-sm transition ${activeTab === tab ? 'text-teal-400 border-b-2 border-teal-400' : 'text-slate-400 hover:text-white'}`}>{tab}</button>))}</div> <div className="pt-8"> {activeTab === 'profile' && <ProfileSettings user={user} />} {activeTab === 'team' && <TeamManagement />} {activeTab === 'billing' && <Billing />} {activeTab === 'integrations' && <p>Integrations coming soon.</p>} </div> </div> ); };
const ProfileSettings = ({ user }) => ( <div className="max-w-xl"><h3 className="text-xl font-bold text-white mb-4">Your Profile</h3><form className="space-y-6"><div><label className="text-sm font-medium text-slate-300">Full Name</label><input type="text" defaultValue={user.name} className="mt-1 block w-full px-3 py-3 border border-slate-600 bg-slate-700 text-slate-200 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500" /></div><div><label className="text-sm font-medium text-slate-300">Email Address</label><input type="email" defaultValue={user.email} className="mt-1 block w-full px-3 py-3 border border-slate-600 bg-slate-700 text-slate-200 rounded-md disabled:opacity-50" disabled /></div><button type="button" className="bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded-lg transition">Save Changes</button></form></div> );
const TeamManagement = () => ( <div> <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold text-white">Team Members</h3><button className="bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded-lg transition flex items-center"><PlusIcon /> <span className="ml-2">Invite Member</span></button></div> <div className="bg-slate-800 rounded-lg border border-slate-700"><table className="w-full text-sm text-left text-slate-300"><thead className="text-xs text-slate-400 uppercase bg-slate-700/50"><tr><th scope="col" className="px-6 py-3">Name</th><th scope="col" className="px-6 py-3">Role</th><th scope="col" className="px-6 py-3">Status</th><th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th></tr></thead><tbody>{initialUsers && Object.values(initialUsers).map(member => (<tr key={member.uid} className="border-b border-slate-700"><td className="px-6 py-4 font-semibold text-white">{member.name}</td><td className="px-6 py-4">{member.role}</td><td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-400`}>Active</span></td><td className="px-6 py-4 text-right"><a href="#" className="font-medium text-teal-500 hover:underline">Edit</a></td></tr>))}</tbody></table></div> </div> );
const InviteUserForm = ({ isInline = false }) => ( <div className={`flex gap-2 ${isInline ? '' : 'mt-4'}`}><input type="email" placeholder="new.teammate@example.com" className="flex-1 px-3 py-3 border border-slate-600 bg-slate-700 text-slate-200 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500" /><select className="px-3 py-3 border border-slate-600 bg-slate-700 text-slate-200 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"><option>Content Creator</option><option>Junior Marketer</option><option>Senior Editor</option></select>{isInline && <button className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition">Send Invite</button>}</div> );
const Billing = () => ( <div><h3 className="text-xl font-bold text-white mb-6">Plans & Billing</h3><div className="grid grid-cols-1 md:grid-cols-3 gap-8"><div className="bg-slate-800 p-6 rounded-lg border-2 border-teal-500 shadow-2xl shadow-teal-500/10"><h4 className="font-bold text-teal-400">Team Plan (Current)</h4><p className="text-4xl font-extrabold text-white mt-4">$79<span className="text-lg font-medium text-slate-400">/mo</span></p><ul className="text-slate-300 space-y-2 text-sm mt-6"><li className="flex items-center gap-2"><CheckCircleIcon className="h-5 w-5 text-teal-400"/> Up to 10 users</li><li className="flex items-center gap-2"><CheckCircleIcon className="h-5 w-5 text-teal-400"/> Unlimited Content</li><li className="flex items-center gap-2"><CheckCircleIcon className="h-5 w-5 text-teal-400"/> Advanced Analytics</li></ul><button disabled className="w-full mt-8 bg-slate-700 text-slate-400 font-bold py-2 rounded-lg cursor-not-allowed">Your Current Plan</button></div><div className="bg-slate-800 p-6 rounded-lg border border-slate-700"><h4 className="font-bold text-white">Pro Plan</h4><p className="text-4xl font-extrabold text-white mt-4">$149<span className="text-lg font-medium text-slate-400">/mo</span></p><ul className="text-slate-300 space-y-2 text-sm mt-6"><li className="flex items-center gap-2"><CheckCircleIcon className="h-5 w-5 text-teal-400"/> Unlimited users</li><li className="flex items-center gap-2"><CheckCircleIcon className="h-5 w-5 text-teal-400"/> Slack & Asana Integrations</li><li className="flex items-center gap-2"><CheckCircleIcon className="h-5 w-5 text-teal-400"/> API Access</li></ul><button className="w-full mt-8 bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 rounded-lg transition">Upgrade to Pro</button></div><div className="bg-slate-800 p-6 rounded-lg border border-slate-700"><h4 className="font-bold text-white">Enterprise</h4><p className="text-2xl font-extrabold text-white mt-4">Let's Talk</p><ul className="text-slate-300 space-y-2 text-sm mt-6"><li className="flex items-center gap-2"><CheckCircleIcon className="h-5 w-5 text-teal-400"/> Custom Integrations</li><li className="flex items-center gap-2"><CheckCircleIcon className="h-5 w-5 text-teal-400"/> Dedicated Support</li><li className="flex items-center gap-2"><CheckCircleIcon className="h-5 w-5 text-teal-400"/> SSO & Security Reviews</li></ul><button className="w-full mt-8 bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 rounded-lg transition">Contact Sales</button></div></div></div> );

export default App;
