import React, { useState, useEffect } from "react";
import MenteeNavbar from "../../components/mentee/MenteeNavbar";
import MenteeSidebar from "../../components/mentee/MenteeSidebar";
import { Outlet } from "react-router-dom";

const MenteeLayout = () => {
  // Initially open on medium screens and up, closed on small screens
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  // Function to toggle the sidebar (passed to the Navbar and Sidebar)
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Effect to handle sidebar visibility on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true); // Always open on md and up
      } else {
        setIsSidebarOpen(false); // Always close on small screens when resizing
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">

      {/* 1. Sidebar - Fixed and responsive using translation for mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-30 transition-transform duration-300 ease-in-out w-64 md:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* The MenteeSidebar component is placed here */}
        <MenteeSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      {/* 2. Main Content Wrapper */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out min-w-0 
        ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}`}
      >

        {/* Navbar - Pass the toggle function here */}
        <MenteeNavbar toggleSidebar={toggleSidebar} />

        {/* Main Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {/* Outlet renders the specific page (Overview, Sessions, etc.) */}
          <Outlet />
        </main>
      </div>

      {/* 3. Mobile Overlay - Closes sidebar on click */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-20 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default MenteeLayout;