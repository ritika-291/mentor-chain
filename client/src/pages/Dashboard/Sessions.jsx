// Schedule.jsx

import React from 'react';
// Assuming CalendarWidget is the name of your calendar component
import Calendar from '../../components/mentor/components/Calendar'; 

const Schedule = () => {
  // Dummy data for upcoming sessions list
  const upcomingSessions = [
    { id: 1, mentee: 'John Doe', time: 'Mon, Nov 4 - 10:00 AM', topic: 'React State Management' },
    { id: 2, mentee: 'Jane Smith', time: 'Wed, Nov 6 - 2:00 PM', topic: 'Node.js Backend Setup' },
    { id: 3, mentee: 'Peter Jones', time: 'Fri, Nov 8 - 11:30 AM', topic: 'Portfolio Review' },
  ];

  return (
    <div className="space-y-8 p-4 sm:p-0">
      
      {/* Page Header */}
      <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">
        🗓️ Mentorship Schedule
      </h1>

      {/* --- Main Content Layout --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Calendar Widget) - Takes 2/3 space */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 border-b pb-3 border-gray-200 dark:border-gray-700">
              Session Calendar
            </h2>
            {/* Calendar Widget Integration */}
            <Calendar /> 

            <div className="mt-6 text-center">
              <button className="py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-150 shadow-lg">
                + Set New Availability
              </button>
            </div>
          </div>
        </div>
        
        {/* Right Column (Upcoming Sessions List) - Takes 1/3 space */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 border-b pb-3 border-gray-200 dark:border-gray-700">
              Upcoming Sessions
            </h2>
            <ul className="space-y-4">
              {upcomingSessions.map(session => (
                <li 
                  key={session.id}
                  className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-indigo-500 dark:border-indigo-400 hover:shadow-md transition duration-150 cursor-pointer"
                >
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{session.time}</p>
                  <p className="text-base font-medium text-indigo-700 dark:text-indigo-300">
                    {session.mentee}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Topic: {session.topic}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-center">
              <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 font-medium">
                View Past Sessions &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;