// src/components/Dashboard.js
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext'; // We will create this context next

export const Dashboard = () => {
    const { contentItems, navigate, user } = useContext(AppContext);

    const myActionItems = contentItems.filter(item => {
        if (user.role === 'Junior Marketer' && item.status === 'Needs Factual Review') return true;
        if (user.role === 'Senior Editor' && item.status === 'Needs Brand Review') return true;
        if (user.role === 'Content Creator' && item.status.startsWith('Changes Requested')) return true;
        return false;
    });

    const getStatusInfo = (status) => {
        const base = "px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-2";
        switch (status) {
            case 'Approved': return { text: 'Approved', style: `bg-green-500/10 text-green-400 border border-green-500/30 ${base}` };
            case 'Needs Brand Review': return { text: 'Brand Review', style: `bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 ${base}` };
            case 'Needs Factual Review': return { text: 'Factual Review', style: `bg-orange-500/10 text-orange-400 border border-orange-500/30 ${base}` };
            case 'Changes Requested (Factual)': case 'Changes Requested (Brand)': return { text: 'Changes Requested', style: `bg-sky-500/10 text-sky-400 border border-sky-500/30 ${base}` };
            default: return { text: 'Unknown', style: `bg-slate-500/10 text-slate-400 border border-slate-500/30 ${base}` };
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
                            <div key={content.id} className="bg-slate-800/70 p-6 rounded-lg border border-slate-700 cursor-pointer hover:border-violet-500 hover:-translate-y-1 transition-all duration-300" onClick={() => navigate('content', content.id)}>
                                <h3 className="text-lg font-bold mb-2 text-white truncate">{content.title}</h3>
                                <p className="text-slate-400 mb-4 text-sm">By {content.createdBy}</p>
                                <div className="flex justify-between items-center">
                                    <span className={statusInfo.style}><span className="h-2 w-2 rounded-full bg-current"></span>{statusInfo.text}</span>
                                    <span className="text-xs text-slate-500">{content.createdAt}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center text-slate-500 mt-10 p-8 bg-slate-800/50 rounded-lg border border-dashed border-slate-700">
                    <h3 className="text-xl font-semibold text-white">All clear!</h3>
                    <p>You have no pending action items.</p>
                </div>
            )}
        </div>
    );
};