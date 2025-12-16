// MenteeNavbar.jsx

import React from "react";

// Note: toggleSidebar is passed from the parent layout component (MenteeDashboard)
const MenteeNavbar = ({ toggleSidebar }) => { 
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-20 transition-colors duration-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        
        {/* Left Section: Sidebar Toggle (Mobile) */}
        <div className="flex items-center space-x-3">
          <button
            className="md:hidden p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={toggleSidebar} 
            aria-label="Toggle Sidebar"
          >
            {/* Menu/Bars Icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          
          {/* Dashboard Title - Hidden on desktop to allow search bar space */}
          <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 md:hidden">
            Mentee
          </h2>
        </div>

        {/* Center Section: Search Bar (Hidden on very small screens) */}
        <div className="relative flex-grow mx-4 max-w-lg hidden sm:block">
          <input
            type="text"
            placeholder="Search mentors, sessions, or resources..."
            className="w-full p-2 pl-10 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 transition-all duration-200"
          />
          {/* Search Icon */}
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>

        {/* Right Section: Profile & Logout */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* Welcome Message (Example) */}
           <span className="text-gray-700 dark:text-gray-300 font-medium hidden sm:inline text-sm">
             Hello, **Mentee**
           </span>

          {/* Profile Picture */}
          <button className="focus:outline-none">
            <img
              src="https://via.placeholder.com/40/6366f1/ffffff?text=M"
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500 dark:ring-indigo-400"
            />
          </button>
          
          {/* Logout Button */}
          <button className="bg-red-500 text-white text-sm font-semibold px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow-md hover:bg-red-600 transition-colors duration-150 whitespace-nowrap">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default MenteeNavbar;