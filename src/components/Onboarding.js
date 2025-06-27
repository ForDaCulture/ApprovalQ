import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { doc, setDoc } from 'firebase/firestore'; // Import setDoc instead of updateDoc
import { UserPlusIcon, PencilSquareIcon, CheckBadgeIcon, ShieldCheckIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const Onboarding = ({ setOrgId: setAppOrgId }) => {
    const { db, user, navigate } = useContext(AppContext);
    const [step, setStep] = useState(1);
    const [organizationName, setOrganizationName] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const roles = [
        { name: 'Creator', description: 'Draft content and submit for review.', icon: <PencilSquareIcon className="h-8 w-8 text-indigo-400" /> },
        { name: 'Editor', description: 'Review and edit content submissions.', icon: <CheckBadgeIcon className="h-8 w-8 text-indigo-400" /> },
        { name: 'Approver', description: 'Give the final sign-off on content.', icon: <UserPlusIcon className="h-8 w-8 text-indigo-400" /> },
        { name: 'Admin', description: 'Manage the team, billing, and content.', icon: <ShieldCheckIcon className="h-8 w-8 text-indigo-400" /> },
    ];

    const handleNext = () => {
        if (organizationName.trim() === '') {
            setError('Please enter an organization name.');
            return;
        }
        setError('');
        setStep(2);
    };

    const handleFinishOnboarding = async () => {
        if (!selectedRole) {
            setError('Please select a role to continue.');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const orgId = organizationName.trim().toLowerCase().replace(/\s+/g, '-');
            const userRef = doc(db, 'users', user.uid);
            
            // --- FIX: Use setDoc with { merge: true } ---
            // This is more robust. It creates the document if it doesn't exist,
            // or merges the new data if it does, preventing race conditions.
            await setDoc(userRef, {
                orgId: orgId,
                role: selectedRole,
            }, { merge: true });

            setAppOrgId(orgId); // Update the orgId in the main App state
            navigate('/dashboard'); // Navigate to the main application
        } catch (err) {
            console.error("Error saving user data:", err);
            setError('Failed to save your information. Please try again.');
            setLoading(false);
        }
    };

    const stepVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4 font-sans">
            <div className="w-full max-w-xl">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-indigo-500"
                            initial={{ width: '0%' }}
                            animate={{ width: step === 1 ? '50%' : '100%' }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                        />
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            variants={stepVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.5 }}
                            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl"
                        >
                            <h1 className="text-4xl font-bold text-white mb-2">Welcome to ApprovalQ</h1>
                            <p className="text-slate-400 mb-8">Let's start by creating your organization.</p>
                            
                            <label htmlFor="organizationName" className="block text-sm font-medium text-slate-300 mb-2">
                                Organization Name
                            </label>
                            <input
                                type="text"
                                id="organizationName"
                                value={organizationName}
                                onChange={(e) => setOrganizationName(e.target.value)}
                                placeholder="e.g., Creative Dynamics Inc."
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                            />
                            
                            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                            
                            <button
                                onClick={handleNext}
                                className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg mt-8 transition-all duration-300 transform hover:scale-105"
                            >
                                Next <ArrowRightIcon className="h-5 w-5 ml-2" />
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            variants={stepVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.5 }}
                            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl"
                        >
                            <h2 className="text-3xl font-bold text-white mb-2">What's your role?</h2>
                            <p className="text-slate-400 mb-8">This will help tailor your experience inside ApprovalQ.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {roles.map((role) => (
                                    <button
                                        key={role.name}
                                        onClick={() => setSelectedRole(role.name)}
                                        className={`p-6 text-left border rounded-xl transition-all duration-300 ${
                                            selectedRole === role.name 
                                                ? 'bg-indigo-600 border-indigo-500 shadow-lg' 
                                                : 'bg-slate-800 border-slate-700 hover:border-slate-500 hover:bg-slate-700'
                                        }`}
                                    >
                                        <div className="flex items-center mb-2">
                                            {role.icon}
                                            <h3 className="text-xl font-bold text-white ml-3">{role.name}</h3>
                                        </div>
                                        <p className="text-slate-300">{role.description}</p>
                                    </button>
                                ))}
                            </div>

                            {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

                            <button
                                onClick={handleFinishOnboarding}
                                disabled={loading}
                                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg mt-8 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Finalizing...' : 'Finish Setup'}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Onboarding;
