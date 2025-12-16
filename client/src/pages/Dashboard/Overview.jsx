// Overview.jsx

import React from 'react';
// Renaming imports to match the styled components we created earlier
import MenteesCard from '../../components/mentor/components/MenteesCard'; // Your original component name
import Calendar from '../../components/mentor/components/Calendar'; // Your original component name
import RequestCard from '../../components/mentor/components/RequestCard';

const Overview = () => {
  // Array for reusable statistics cards
  const stats = [
    { title: 'Active Mentees', value: '5', color: 'text-indigo-600 dark:text-indigo-400', icon: '🧑‍💻' },
    { title: 'Upcoming Sessions', value: '3', color: 'text-green-600 dark:text-green-400', icon: '🗓️' },
    { title: 'Average Rating', value: '4.8 ⭐', color: 'text-yellow-600 dark:text-yellow-400', icon: '✨' },
  ];

  return (
    <div className="space-y-8 p-4 sm:p-0">
      
      {/* Page Title */}
      <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">
        Dashboard Overview
      </h1>

      {/* --- Statistics Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div 
            key={stat.title}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl transition duration-300 hover:shadow-2xl border border-gray-100 dark:border-gray-700"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{stat.title}</h3>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className={`mt-2 text-5xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* --- Main Content Layout --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Mentees + Requests) - Takes 2/3 space */}
        <div className="lg:col-span-2 space-y-6">
          <MenteesCard/>
          <RequestCard/>
        </div>
    
        {/* Right Column (Calendar) - Takes 1/3 space */}
        <div className="lg:col-span-1">
          <Calendar/>
        </div>
      </div>
    </div>
  )
}

export default Overview;