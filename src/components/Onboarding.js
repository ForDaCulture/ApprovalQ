// src/components/Onboarding.js
import React, { useContext } from 'react';
import { AppStateContext } from '../context/AppStateContext';

const Onboarding = () => {
  const { user, navigate } = useContext(AppStateContext);
  const [step, setStep] = React.useState(1);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-2xl p-8 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700">
        {step === 1 && (
          <div>
            <h2 className="text-3xl font-bold text-white text-center">Welcome to ApprovalQ, {user?.name.split(' ')[0]}!</h2>
            <p className="text-slate-400 text-center mt-2 mb-8">Let's set up your workspace.</p>
            <div className="space-y-4">
              <label className="text-sm font-medium text-slate-300">Organization Name</label>
              <input type="text" defaultValue={user?.org} className="mt-1 block w-full px-3 py-3 border border-slate-600 bg-slate-700 text-slate-200 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
            </div>
            <button onClick={() => setStep(2)} className="mt-8 w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-lg transition">Next: Invite Your Team</button>
          </div>
        )}
        {step === 2 && (
          <div>
            <h2 className="text-3xl font-bold text-white text-center">Build your creative team</h2>
            <p className="text-slate-400 text-center mt-2 mb-8">Invite the key members of your workflow.</p>
            <div className="space-y-4">
              {/* InviteUserForm placeholder */}
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => navigate('app')} className="w-1/2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-3 rounded-lg transition">Skip for now</button>
              <button onClick={() => navigate('app')} className="w-1/2 bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-lg transition">Finish Setup</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;