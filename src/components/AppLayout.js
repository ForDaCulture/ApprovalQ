import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  DocumentTextIcon,
  ChartBarIcon,
  BeakerIcon,
  CogIcon,
  UserGroupIcon,
  UserPlusIcon,
  CreditCardIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const AppLayout = ({ user, role, orgId, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Navigation items, dynamically filtered by role
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'All Content', href: '/all-content', icon: DocumentTextIcon },
    { name: 'Insights Engine', href: '/insights', icon: ChartBarIcon },
    { name: 'AI Strategy Lab', href: '/ai-lab', icon: BeakerIcon },
    ...(role === 'Admin'
      ? [
          { name: 'Team', href: '/team', icon: UserGroupIcon },
          { name: 'Invite User', href: '/invite', icon: UserPlusIcon },
        ]
      : []),
  ];

  const secondaryNavigation = [
    { name: 'Billing', href: '/billing', icon: CreditCardIcon },
    { name: 'Settings', href: '/settings', icon: CogIcon },
  ];

  // Animation variants for sidebar
  const sidebarVariants = {
    open: { width: '256px', transition: { duration: 0.3, ease: 'easeInOut' } },
    closed: { width: '64px', transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <motion.aside
        initial="closed"
        animate={isSidebarOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        className="flex flex-col overflow-y-auto bg-gray-900 text-white px-4 py-6 md:px-6"
      >
        {/* Header with Logo and Toggle */}
        <div className="flex h-16 items-center justify-between">
          {isSidebarOpen && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold text-white"
            >
              ApprovalQ {orgId && `| ${orgId}`}
            </motion.h1>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {isSidebarOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Primary Navigation */}
        <nav className="flex flex-1 flex-col mt-4">
          <ul className="flex flex-col gap-y-7">
            <li>
              <ul className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        classNames(
                          isActive
                            ? 'bg-indigo-700 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-indigo-600',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors'
                        )
                      }
                      aria-label={item.name}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-x-3"
                      >
                        <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                        {isSidebarOpen && <span>{item.name}</span>}
                      </motion.div>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
            {/* Secondary Navigation */}
            <li className="mt-auto">
              <ul className="-mx-2 space-y-1">
                {secondaryNavigation.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        classNames(
                          isActive
                            ? 'bg-indigo-700 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-indigo-600',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors'
                        )
                      }
                      aria-label={item.name}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-x-3"
                      >
                        <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                        {isSidebarOpen && <span>{item.name}</span>}
                      </motion.div>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-white">
            {navigation.find((item) => item.href === window.location.pathname)?.name || 'ApprovalQ'}
          </h1>
          <p className="text-gray-400">Welcome, {user?.displayName || 'User'}</p>
        </motion.header>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 rounded-lg p-6"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AppLayout;