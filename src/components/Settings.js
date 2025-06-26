// --- File: src/components/Settings.js ---

import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

// Re-defining these here to keep the component self-contained for clarity
const PlusIcon = () => <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const CheckCircleIcon = ({ className }) => <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;


const ProfileSettings = ({ user }) => (
    <div className="max-w-xl"><h3 className="text-xl font-bold text-white mb-4">Your Profile</h3><form className="space-y-6"><div><label className="text-sm font-medium text-slate-300">Full Name</label><input type="text" defaultValue={user.name} className="mt-1 block w-full px-3 py-3 border border-slate-600 bg-slate-700 text-slate-200 rounded-md focus:outline-none focus:ring-violet-500 focus:border-violet-500" /></div><div><label className="text-sm font-medium text-slate-300">Email Address</label><input type="email" defaultValue={user.email} className="mt-1 block w-full px-3 py-3 border border-slate-600 bg-slate-700 text-slate-200 rounded-md disabled:opacity-50" disabled /></div><button type="button" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition">Save Changes</button></form></div>
);

const TeamManagement = () => {
    // In a real app, this would fetch from a 'users' collection where orgId matches
    const MOCK_TEAM = [
        { id: '1', name: 'Alex Chen', email: 'alex.c@innovateinc.com', role: 'Content Creator', status: 'Active' },
        { id: '2', name: 'Brenda Starr', email: 'brenda.s@innovateinc.com', role: 'Junior Marketer', status: 'Active' },
    ];
    return (
    <div>
        <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold text-white">Team Members</h3><button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition flex items-center"><PlusIcon /> <span className="ml-2">Invite Member</span></button></div>
        <div className="bg-slate-800 rounded-lg border border-slate-700"><table className="w-full text-sm text-left text-slate-300"><thead className="text-xs text-slate-400 uppercase bg-slate-700/50"><tr><th scope="col" className="px-6 py-3">Name</th><th scope="col" className="px-6 py-3">Role</th><th scope="col" className="px-6 py-3">Status</th><th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th></tr></thead><tbody>{MOCK_TEAM.map(member => (<tr key={member.id} className="border-b border-slate-700"><td className="px-6 py-4 font-semibold text-white">{member.name}</td><td className="px-6 py-4">{member.role}</td><td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${member.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{member.status}</span></td><td className="px-6 py-4 text-right"><button className="font-medium text-violet-400 hover:underline">Edit</button></td></tr>))}</tbody></table></div>
    </div>
)};

const Billing = () => (
     <div><h3 className="text-xl font-bold text-white mb-6">Plans & Billing</h3><div className="grid grid-cols-1 md:grid-cols-3 gap-8"><div className="bg-slate-800 p-6 rounded-lg border-2 border-violet-500 shadow-2xl shadow-violet-500/10"><h4 className="font-bold text-violet-400">Team Plan (Current)</h4><p className="text-4xl font-extrabold text-white mt-4">$79<span className="text-lg font-medium text-slate-400">/mo</span></p><ul className="text-slate-300 space-y-2 text-sm mt-6"><li className="flex items-center gap-2"><CheckCircleIcon className="h-5 w-5 text-violet-400"/> Up to 10 users</li><li className="flex items-center gap-2"><CheckCircleIcon className="h-5 w-5 text-violet-400"/> Unlimited Content</li><li className="flex items-center gap-2"><CheckCircleIcon className="h-5 w-5 text-violet-400"/> Advanced Analytics</li></ul><button disabled className="w-full mt-8 bg-slate-700 text-slate-400 font-bold py-2 rounded-lg cursor-not-allowed">Your Current Plan</button></div><div className="bg-slate-800 p-6 rounded-lg border border-slate-700"><h4 className="font-bold text-white">Pro Plan</h4><p className="text-4xl font-extrabold text-white mt-4">$149<span className="text-lg font-medium text-slate-400">/mo</span></p><ul className="text-slate-300 space-y-2 text-sm mt-6"><li className="flex items-center gap-2"><CheckCircleIcon className="h-5 w-5 text-violet-400"/> Unlimited users</li><li className="flex items-center gap-2"><CheckCircleIcon className="h-5 w-5 text-violet-400"/> Slack & Asana Integrations</li><li className="flex items-center gap-2"><CheckCircleIcon className="h-5 w-5 text-violet-400"/> API Access</li></ul><button className="w-full mt-8 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-lg transition">Upgrade to Pro</button></div></div></div>
);


export const Settings = () => {
    const { user } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState('profile');
    const tabs = ['profile', 'team', 'billing', 'integrations'];
    return(
        <div>
            <h2 className="text-3xl font-bold text-white mb-2">Settings</h2><p className="text-slate-400 mb-8">Manage your profile, team, and billing information.</p>
            <div className="flex border-b border-slate-700">{tabs.map(tab => (<button key={tab} onClick={() => setActiveTab(tab)} className={`capitalize px-4 py-3 font-semibold text-sm transition ${activeTab === tab ? 'text-violet-400 border-b-2 border-violet-400' : 'text-slate-400 hover:text-white'}`}>{tab}</button>))}</div>
            <div className="pt-8">
                {activeTab === 'profile' && <ProfileSettings user={user} />}
                {activeTab === 'team' && <TeamManagement />}
                {activeTab === 'billing' && <Billing />}
                {activeTab === 'integrations' && <p>Integrations coming soon.</p>}
            </div>
        </div>
    );
};