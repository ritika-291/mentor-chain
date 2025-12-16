// CalendarWidget.jsx

import React from 'react';
// NOTE: You would typically import the Calendar component from a library here, e.g.:
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css'; 

export default function Calendar() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition duration-300">
      
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
        Schedule & Calendar 🗓️
      </h2>
      
      {/* Calendar Area/Placeholder */}
      <div className="w-full">
        {/* If using a library like react-calendar, you would render it here.
          The surrounding div helps control its width and style.
          
          Example: <Calendar className="w-full border-none shadow-none dark:bg-gray-700" />
        */}
        <div className="p-8 bg-indigo-50 dark:bg-gray-700 border-2 border-dashed border-indigo-300 dark:border-indigo-600 rounded-lg text-center">
          <p className="text-lg font-medium text-indigo-700 dark:text-indigo-400">
            [Interactive Calendar Widget Placeholder]
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Booked sessions, availability, and upcoming events displayed here.
          </p>
        </div>
      </div>

      {/* Quick Action */}
      <div className="mt-4 text-center">
        <button className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-150 shadow-md">
          + Add New Session
        </button>
      </div>
    </div>
  );
}