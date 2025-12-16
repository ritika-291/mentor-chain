// RequestCard.jsx

import React from 'react';

// NOTE: In a real application, this component would accept a 'request' prop,
// like: export default function RequestCard({ request })
export default function RequestCard() {
  const request = {
    name: 'Mark Wilson',
    expertise: 'Data Science (Python)',
    bio: 'Looking for a mentor to guide my final year machine learning project focusing on NLP.',
    date: '2 hours ago'
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition duration-300 hover:shadow-indigo-500/30 border border-gray-100 dark:border-gray-700">
      
      {/* Header and Title */}
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center justify-between">
        Pending Mentorship Request 📧
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{request.date}</span>
      </h2>
      
      {/* Request Details */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3">
        
        <p className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
          {request.name}
        </p>
        
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Expertise needed: <span className="font-medium text-gray-800 dark:text-white">{request.expertise}</span>
        </p>
        
        <p className="text-base text-gray-700 dark:text-gray-200 border-t border-gray-200 dark:border-gray-600 pt-3">
          Bio Summary: {request.bio}*
        </p>
      </div>
      
      {/* Action Buttons */}
      <div className="flex space-x-4 mt-6">
        <button className="flex-1 py-3 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-150 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
          Accept
        </button>
        <button className="flex-1 py-3 px-4 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-150 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
          Reject
        </button>
      </div>
    </div>
  );
}