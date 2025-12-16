// MenteeOverview.jsx

import React from 'react';
// Assuming you will create Mentee-specific widgets later
// import MentorsCard from '../../components/MenteeMentorsCard'; 
// import MenteeCalendar from '../../components/MenteeCalendarWidget'; 

const MenteeOverview = () => {
  // Data styled exactly like the mentor overview cards in the image
  const stats = [
    { title: 'Mentors Matched', value: '2', color: 'text-indigo-600 dark:text-indigo-400', icon: '🧑‍🏫' },
    { title: 'Upcoming Sessions', value: '3', color: 'text-green-600 dark:text-green-400', icon: '🗓️' },
    { title: 'Overall Progress', value: '4.8 ⭐', color: 'text-yellow-600 dark:text-yellow-400', icon: '✨' },
  ];

  // Reusable Stat Card Component for clean code
  const StatCard = ({ title, value, color, icon }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition duration-300 hover:shadow-xl hover:scale-[1.02] flex flex-col justify-between h-40 border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-start">
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
            <span className="text-2xl">{icon}</span>
        </div>
        <p className={`mt-2 text-5xl font-extrabold ${color}`}>{value}</p>
    </div>
  );

  return (
    <div className="space-y-8 p-4 md:p-0">
      
      {/* Page Header */}
      <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
        Dashboard Overview
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Welcome! Here's your activity summary and quick links.
      </p>

      {/* --- Statistics Cards (Replicating the top row) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* --- Quick Actions & Schedule --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Quick Actions) - Takes 2/3 space */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 border-b pb-3">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a 
                        href="/dashboard/mentee/mentors" 
                        className="p-4 bg-indigo-600 text-white rounded-lg text-center font-semibold hover:bg-indigo-700 transition-colors shadow-md"
                    >
                        Find a New Mentor
                    </a>
                    <a 
                        href="/dashboard/mentee/schedule" 
                        className="p-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg text-center font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-md"
                    >
                        View My Schedule
                    </a>
                </div>
            </div>
            
            {/* Placeholder for Recent Mentors/Activity Feed */}
             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 border-b pb-3">Activity Feed</h2>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                    <li className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">You booked a session with **Jane Mentor** for Friday.</li>
                    <li className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">Your progress rating was updated.</li>
                </ul>
            </div>
        </div>
        
        {/* Right Column (Schedule Widget) - Takes 1/3 space */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 border-b pb-3">
              Session Calendar 🗓️
            </h2>
            
            {/* Calendar Placeholder replicating the dashed box in the image */}
            <div className="p-6 bg-indigo-50 dark:bg-gray-700 border-2 border-dashed border-indigo-300 dark:border-indigo-600 rounded-lg text-center">
              <p className="text-lg font-medium text-indigo-700 dark:text-indigo-400">
                [Interactive Calendar Widget Placeholder]
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                View your upcoming sessions here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenteeOverview;
