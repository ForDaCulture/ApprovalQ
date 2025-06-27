// src/components/StatusBadge.js
import React from 'react';

const statusStyles = {
  'Factual Review': 'bg-orange-400/10 text-orange-400 ring-orange-400/20',
  'Brand Review': 'bg-yellow-400/10 text-yellow-500 ring-yellow-400/20',
  'Changes Requested': 'bg-blue-400/10 text-blue-400 ring-blue-400/30',
  'Approved': 'bg-green-500/10 text-green-400 ring-green-500/20',
  // Add other statuses as needed
};

const statusDotStyles = {
    'Factual Review': 'bg-orange-400',
    'Brand Review': 'bg-yellow-500',
    'Changes Requested': 'bg-blue-400',
    'Approved': 'bg-green-500',
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const StatusBadge = ({ status }) => {
  if (!status) return null;

  return (
    <div
      className={classNames(
        statusStyles[status] || 'bg-gray-400/10 text-gray-400 ring-gray-400/20',
        'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset'
      )}
    >
        <div className={classNames(
            statusDotStyles[status] || 'bg-gray-400',
            'h-1.5 w-1.5 rounded-full mr-1.5'
        )}></div>
      {status}
    </div>
  );
};

export default StatusBadge;