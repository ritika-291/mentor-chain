// MenteeSchedule.jsx

import React from 'react';

const MenteeSchedule = () => {
  // Dummy data for upcoming sessions
  const upcomingSessions = [
    { id: 1, mentor: 'Jane Mentor', date: '2025-11-10', time: '10:00 AM', topic: 'React State Management' },
    { id: 2, mentor: 'Mark Wilson', date: '2025-11-12', time: '02:00 PM', topic: 'Node.js API Development' },
    { id: 3, mentor: 'Alice Johnson', date: '2025-11-15', time: '11:00 AM', topic: 'Database Design Basics' },
  ];

  // Dummy data for past sessions
  const pastSessions = [
    { id: 4, mentor: 'Jane Mentor', date: '2025-10-28', time: '03:00 PM', topic: 'Introduction to JavaScript' },
    { id: 5, mentor: 'Mark Wilson', date: '2025-10-25', time: '09:00 AM', topic: 'Setting Up Your Dev Environment' },
  ];

  // Reusable Session Card Component
  const SessionCard = ({ session, type }) => (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-full">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{session.topic}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-1"><span className="font-medium">Mentor:</span> {session.mentor}</p>
        <p className="text-gray-600 dark:text-gray-400"><span className="font-medium">Date:</span> {session.date} at {session.time}</p>
      </div>
      <div className="mt-4 flex justify-end">
        {type === 'upcoming' && (
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-150">
            View Details
          </button>
        )}
        {type === 'past' && (
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors duration-150">
            Feedback
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 p-4 md:p-0">
      
      {/* Page Header */}
      <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-4">
        🗓️ My Sessions
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Manage your upcoming and past mentoring sessions.
      </p>

      {/* --- Upcoming Sessions Section --- */}
      <section className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-6 border-b pb-3 border-gray-200 dark:border-gray-700">
          Upcoming Sessions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingSessions.length > 0 ? (
            upcomingSessions.map(session => (
              <SessionCard key={session.id} session={session} type="upcoming" />
            ))
          ) : (
            <p className="text-gray-700 dark:text-gray-300">No upcoming sessions found. Book one now!</p>
          )}
        </div>
      </section>

      {/* --- Past Sessions Section --- */}
      <section className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-6 border-b pb-3 border-gray-200 dark:border-gray-700">
          Past Sessions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastSessions.length > 0 ? (
            pastSessions.map(session => (
              <SessionCard key={session.id} session={session} type="past" />
            ))
          ) : (
            <p className="text-gray-700 dark:text-gray-300">No past sessions to display.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default MenteeSchedule;