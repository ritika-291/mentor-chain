// Requests.jsx

import React from 'react';
// Assuming RequestCard is the name of your styled component
import RequestCard from '../../components/mentor/components/RequestCard';

const Requests = () => {
  // Dummy data for pending requests
  const pendingRequests = [
    { id: 1, name: 'Alice Johnson', expertise: 'Web Development (React)', bio: 'Seeking guidance on complex state management patterns and best practices for large projects.' },
    { id: 2, name: 'Bob Williams', expertise: 'Data Science (Python)', bio: 'Need help structuring my machine learning portfolio and transitioning to a full-time role.' },
    { id: 3, name: 'Charlie Davis', expertise: 'DevOps & Cloud', bio: 'Looking for advice on containerization with Docker and deployment strategies using AWS.' },
  ];
  
  // Dummy data for accepted/archived requests (optional section)
  const pastRequests = [
    { id: 4, name: 'Eve Martinez', status: 'Accepted', date: '3 months ago' },
  ];

  return (
    <div className="space-y-8 p-4 sm:p-0">
      
      {/* Page Header */}
      <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">
        📧 Mentorship Requests
      </h1>

      {/* --- Pending Requests Section --- */}
      <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 border-b pb-2 border-gray-200 dark:border-gray-700">
        Pending ( {pendingRequests.length} )
      </h2>
      
      {pendingRequests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pendingRequests.map(request => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          <p className="text-xl font-medium text-gray-600 dark:text-gray-300">
            🎉 Great job! You currently have no pending mentorship requests.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            New requests will appear here when mentees seek your expertise.
          </p>
        </div>
      )}

      {/* --- Past Requests/Archive (Optional) --- */}
      <div className="pt-6">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 border-b pb-2 border-gray-200 dark:border-gray-700">
          Archived/Past Requests
        </h2>
        <div className="mt-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {pastRequests.map(item => (
              <li key={item.id} className="flex justify-between items-center py-3 text-gray-700 dark:text-gray-300 text-sm">
                <span>Request from **{item.name}**</span>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  item.status === 'Accepted' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                }`}>
                  {item.status} ({item.date})
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Requests;