import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GiHamburgerMenu } from "react-icons/gi";

const NavbarDashboard = ({ toggleSidebar }) => {
  const [username, setUsername] = useState('Mentor');
  const [avatarUrl, setAvatarUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get username from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUsername(user.username || 'Mentor');
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }

    // Fetch profile to get avatar
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
        if (!token) return;

        const response = await fetch('http://localhost:5000/api/profile/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.username) {
            setUsername(data.username);
          }
          if (data.profile && data.profile.avatar_url) {
            setAvatarUrl(`http://localhost:5000${data.profile.avatar_url}`);
          }
        }
      } catch (err) {
        console.error('Error fetching profile for navbar:', err);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    // Redirect to home page
    navigate('/');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-20 transition-colors duration-200">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Hamburger/Bar Icon (Visible on small screens, hidden on md and up) */}
        <button
          className="md:hidden p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <GiHamburgerMenu />
        </button>

        {/* Search Bar */}
        <div className="relative flex-grow mx-4 max-w-md hidden md:block">
          <input
            type="text"
            placeholder="Search dashboard or mentees..."
            className="w-full p-2 pl-10 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 transition-all duration-200"
          />
          {/* Search Icon */}
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>

        {/* User Info and Profile */}
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 dark:text-gray-300 font-medium hidden sm:inline">
            Hello, <strong>{username}</strong>
          </span>
          <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            {/* Bell Icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
          </button>
          <button className="focus:outline-none">
            <img
              src={avatarUrl || 'https://via.placeholder.com/40'}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500 dark:ring-indigo-400"
            />
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white text-sm font-semibold px-3 py-2 rounded-lg shadow-md hover:bg-red-600 transition-colors duration-150 whitespace-nowrap"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default NavbarDashboard;