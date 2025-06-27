import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { CreditCardIcon } from '@heroicons/react/24/outline';

const Billing = () => {
  const { db, orgId, user } = useContext(AppContext);
  const [plan, setPlan] = useState('Free');
  const [billingHistory, setBillingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const plans = [
    { name: 'Free', price: 0, features: ['Basic AI tools', 'Up to 5 users', 'Standard support'] },
    { name: 'Pro', price: 29, features: ['Advanced AI tools', 'Up to 20 users', 'Priority support'] },
    { name: 'Enterprise', price: 99, features: ['Full AI suite', 'Unlimited users', 'Dedicated support'] },
  ];

  useEffect(() => {
    if (!db || !orgId) {
      setError('Database or organization ID not available');
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'billing'), where('orgId', '==', orgId));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const history = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setBillingHistory(history);
        const orgDoc = querySnapshot.docs.find((doc) => doc.data().type === 'plan');
        setPlan(orgDoc?.data().plan || 'Free');
        setLoading(false);
      },
      (err) => {
        console.error('Firestore error:', err);
        setError('Failed to load billing data');
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [db, orgId]);

  const handlePlanChange = async (newPlan) => {
    if (!db || !orgId || !user) return;
    setLoading(true);
    try {
      // Mock Stripe integration; replace with actual Stripe API in production
      await updateDoc(doc(db, 'billing', `plan_${orgId}`), {
        orgId,
        type: 'plan',
        plan: newPlan,
        updatedAt: new Date(),
        updatedBy: { uid: user.uid, name: user.displayName || 'Unknown' },
      });
      setPlan(newPlan);
    } catch (err) {
      console.error('Plan change error:', err);
      setError('Failed to update plan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-full text-white text-lg"
      >
        Loading billing...
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-full text-red-400 text-lg"
      >
        {error}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-slate-800/70 p-6 rounded-lg border border-slate-700"
    >
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <CreditCardIcon className="h-5 w-5 text-indigo-400" />
        Billing & Subscription
      </h2>
      {/* Plan Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {plans.map((p) => (
          <motion.div
            key={p.name}
            whileHover={{ scale: 1.05 }}
            className={`p-4 rounded-lg border ${plan === p.name ? 'border-indigo-500 bg-indigo-700/20' : 'border-slate-700'} text-white`}
          >
            <h3 className="text-lg font-bold">{p.name}</h3>
            <p className="text-2xl font-semibold">${p.price}/mo</p>
            <ul className="mt-2 text-gray-400">
              {p.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-400"></span>
                  {feature}
                </li>
              ))}
            </ul>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePlanChange(p.name)}
              disabled={plan === p.name || loading}
              className={`mt-4 w-full px-4 py-2 rounded-md text-white ${plan === p.name ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} disabled:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              aria-label={`Select ${p.name} plan`}
            >
              {plan === p.name ? 'Current Plan' : 'Select Plan'}
            </motion.button>
          </motion.div>
        ))}
      </div>
      {/* Billing History */}
      <h3 className="text-md font-semibold text-white mb-4">Billing History</h3>
      <table className="w-full text-sm text-left text-slate-300">
        <thead className="text-xs text-slate-400 uppercase bg-slate-700/50">
          <tr>
            <th scope="col" className="px-4 py-3 md:px-6">Date</th>
            <th scope="col" className="px-4 py-3 md:px-6">Amount</th>
            <th scope="col" className="px-4 py-3 md:px-6">Description</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {billingHistory.map((item) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="border-b border-slate-700"
              >
                <td className="px-4 py-4 md:px-6">
                  {item.updatedAt?.toDate().toLocaleDateString() || 'N/A'}
                </td>
                <td className="px-4 py-4 md:px-6">${item.amount || 0}</td>
                <td className="px-4 py-4 md:px-6">{item.description || 'Plan update'}</td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </motion.div>
  );
};

export default Billing;