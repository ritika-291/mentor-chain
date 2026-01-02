
import React from "react";
import { NavLink } from "react-router-dom";

const MenteeSidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const navItems = [
    { to: ".", label: "Overview" },
    { to: "mentors", label: "Find Mentors" },
    { to: "schedule", label: "My Sessions" },
    { to: "messages", label: "Messages" },
    { to: "profile", label: "Profile" },
    { to: "settings", label: "Settings" },
    { to: "roadmaps", label: "Roadmaps" },
    { to: "/community", label: "Community" },
  ];

  return (
    <aside className={`w-64 flex flex-col bg-gray-800 text-white h-full shadow-2xl transition-colors duration-200 md:translate-x-0
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>


      <div className="p-5 border-b border-gray-700 flex justify-between items-center">
        <div className="text-2xl font-extrabold text-white">
          Mentor<span className="text-indigo-400">Chain</span>
        </div>
        <button onClick={toggleSidebar} className="text-white text-2xl focus:outline-none md:hidden">
          {/* Simple Hamburger Icon */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "."}
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg font-medium text-base transition-all duration-200 
               ${isActive
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50' // Blue active state
                : 'text-gray-300 hover:bg-gray-700 hover:text-white' // Dark hover state
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>


    </aside>
  );
};

export default MenteeSidebar;