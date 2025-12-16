import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/mentor/components/Sidebar'
import NavbarDashboard from '../../components/mentor/components/NavbarDashboard'
import { Outlet } from 'react-router-dom'


const MentorLayout = () => {
  // Initially open on medium screens and up, closed on small screens
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
    <div className="flex min-h-screen">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 ${isSidebarOpen ? 'md:ml-64' : 'ml-0'} transition-all duration-300 flex flex-col`}> {/* Main content area as flex column */}
        <NavbarDashboard toggleSidebar={toggleSidebar} /> {/* Navbar needs toggle button */}
        <main className="p-4 flex-1 overflow-y-auto"> {/* Main content scrolls */}
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MentorLayout