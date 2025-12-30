import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MenteeNavbar = ({ toggleSidebar }) => {
  const [username, setUsername] = useState('Mentee');
  const [avatarUrl, setAvatarUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get username from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUsername(user.username || 'Mentee');
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

          {/* Welcome Message */}
          <span className="text-gray-700 dark:text-gray-300 font-medium hidden sm:inline text-sm">
            Hello, <strong>{username}</strong>
          </span>

          {/* Profile Picture */}
          <button className="focus:outline-none">
            <img
              src={avatarUrl || 'https://via.placeholder.com/40/6366f1/ffffff?text=M'}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500 dark:ring-indigo-400"
            />
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white text-sm font-semibold px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow-md hover:bg-red-600 transition-colors duration-150 whitespace-nowrap"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default MenteeNavbar;