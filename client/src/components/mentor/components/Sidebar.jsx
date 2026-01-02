import React from 'react'
import { NavLink } from 'react-router-dom';
import { GiHamburgerMenu } from "react-icons/gi"; // Import the icon

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {

  const navItems = [
    { to: ".", label: "Overview" }, // "." refers to the index route of the parent (/mentor)
    { to: "sessions", label: "Sessions" },
    { to: "request", label: "Request" },
    { to: "messages", label: "Messages" },
    { to: "profile", label: "Profile" },
    { to: "settings", label: "Settings" },
    { to: "roadmaps", label: "Roadmaps" },
    { to: "/community", label: "Community" },
  ];


  return (
    <aside className={`bg-gray-800 text-white w-64 min-h-screen p-4 fixed top-0 left-0 transition-all duration-300 z-[100] md:translate-x-0 
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}> {/* Sidebar always open on md and up, slides on small screens */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-3xl font-bold">MentorChain</div>
        <button onClick={toggleSidebar} className="text-white text-2xl focus:outline-none md:hidden"> {/* Hide on md and up */}
          <GiHamburgerMenu />
        </button>
      </div>
      <nav>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "."} // Ensure 'Overview' is only active when exactly matching
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 
              ${isActive ? 'bg-blue-600 text-white font-semibold' : ''}`
            }>
            {item.label}
          </NavLink>
        ))}

      </nav>
    </aside>
  )
}

export default Sidebar