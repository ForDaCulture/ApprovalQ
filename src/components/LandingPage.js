
// --- File: src/components/LandingPage.js ---
// Corrected to use the AppContext and its provided functions.

import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const CheckCircleIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;

export const LandingPage = () => {
    const { handleGoogleLogin, handleAnonymousLogin } = useContext(AppContext);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    const features = [
        { name: 'AI-Powered Drafts', description: 'Generate high-quality first drafts for any content type, from blog posts to ad copy, in seconds.' },
        { name: 'Structured Workflows', description: 'Guide your content through a clear, role-based approval process, from factual review to final sign-off.' },
        { name: 'Centralized Feedback', description: 'Eliminate chaotic email threads with a single source of truth for all comments, edits, and approvals.' },
        { name: 'Data-Driven Insights', description: 'Connect your marketing data to generate visual concepts and strategic ideas, bridging the gap between analytics and creativity.' },
    ];

    return (
        <div className="bg-white">
            <header className="absolute inset-x-0 top-0 z-50">
                <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                    <div className="flex lg:flex-1"><a href="#" className="-m-1.5 p-1.5"><span className="text-2xl font-black bg-gradient-to-r from-violet-600 to-indigo-600 text-transparent bg-clip-text">ApprovalQ</span></a></div>
                    <div className="flex lg:hidden"><button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700" onClick={() => setMobileMenuOpen(true)}><MenuIcon /></button></div>
                    <div className="hidden lg:flex lg:gap-x-12"><a href="#" className="text-sm font-semibold leading-6 text-gray-900">Features</a><a href="#" className="text-sm font-semibold leading-6 text-gray-900">Pricing</a></div>
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end"><button onClick={handleGoogleLogin} className="text-sm font-semibold leading-6 text-gray-900">Log in with Google <span aria-hidden="true">&rarr;</span></button></div>
                </nav>
                {mobileMenuOpen && (
                    <div className="lg:hidden">
                        <div className="fixed inset-0 z-50" />
                        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                            <div className="flex items-center justify-between"><a href="#" className="-m-1.5 p-1.5"><span className="text-2xl font-black bg-gradient-to-r from-violet-600 to-indigo-600 text-transparent bg-clip-text">ApprovalQ</span></a><button type="button" className="-m-2.5 rounded-md p-2.5 text-gray-700" onClick={() => setMobileMenuOpen(false)}><XIcon /></button></div>
                            <div className="mt-6 flow-root"><div className="-my-6 divide-y divide-gray-500/10"><div className="space-y-2 py-6"><a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Features</a><a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Pricing</a></div><div className="py-6"><button onClick={handleGoogleLogin} className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Log in with Google</button><button onClick={handleAnonymousLogin} className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Try as Guest</button></div></div></div>
                        </div>
                    </div>
                )}
            </header>

            <main>
                <div className="relative isolate pt-14">
                    <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true"><div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#8080ff] to-[#9a70ff] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div></div>
                    <div className="py-24 sm:py-32 lg:pb-40">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="mx-auto max-w-2xl text-center">
                                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">The Operating System for Creative Teams</h1>
                                <p className="mt-6 text-lg leading-8 text-gray-600">Stop the chaos. Ship better work, faster. ApprovalQ combines AI-powered creation with structured approval workflows to eliminate bottlenecks and unlock your team's true potential.</p>
                                <div className="mt-10 flex items-center justify-center gap-x-6">
                                    <button onClick={handleGoogleLogin} className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Get started with Google</button>
                                    <button onClick={handleAnonymousLogin} className="text-sm font-semibold leading-6 text-gray-900">Try as Guest <span aria-hidden="true">→</span></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};