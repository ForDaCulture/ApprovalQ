import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { collection, query, onSnapshot } from 'firebase/firestore';

export const AllContent = () => {
    const { navigate, db } = useContext(AppContext);
    const [contentItems, setContentItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db) return;
        const q = query(collection(db, "content")); // In a real app, you'd filter by orgId
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setContentItems(items);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [db]);

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
    
    if (loading) return <div className="text-white">Loading all content...</div>;

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
                            <td className="px-6 py-4">{content.createdBy?.name || 'Unknown'}</td>
                            <td className="px-6 py-4">{content.createdAt?.toDate().toLocaleDateString() || 'N/A'}</td>
                            <td className="px-6 py-4"><span className={statusInfo.style}><span className="h-2 w-2 rounded-full bg-current"></span>{statusInfo.text}</span></td>
                        </tr>
                    )})}
                </tbody>
             </table>
        </div>
    );
}