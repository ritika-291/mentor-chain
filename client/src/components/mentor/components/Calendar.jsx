// CalendarWidget.jsx

import React from 'react';
// NOTE: You would typically import the Calendar component from a library here, e.g.:
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css'; 

export default function Calendar({ sessions = [] }) {
  // Filter upcoming
  const upcoming = sessions.filter(s => new Date(s.start_time) > new Date() && s.status === 'accepted').slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition duration-300">

      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
        Schedule & Calendar 🗓️
      </h2>

      {/* Sessions List */}
      <div className="w-full space-y-3">
        {upcoming.length > 0 ? (
          upcoming.map(s => (
            <div key={s.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-indigo-500">
              <p className="font-bold text-gray-800 dark:text-gray-200">
                {new Date(s.start_time).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(s.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-xs text-gray-500 mt-1 truncate">
                {s.notes || 'No topic'}
              </p>
            </div>
          ))
        ) : (
          <div className="p-6 bg-indigo-50 dark:bg-gray-700 border-2 border-dashed border-indigo-300 dark:border-indigo-600 rounded-lg text-center">
            <p className="text-sm font-medium text-indigo-700 dark:text-indigo-400">
              No upcoming sessions.
            </p>
          </div>
        )}
      </div>

      {/* Quick Action */}
      <div className="mt-4 text-center">
        <a href="/mentor/sessions" className="py-2 px-4 inline-block bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-150 shadow-md text-sm">
          Manage Sessions
        </a>
      </div>
    </div>
  );
}