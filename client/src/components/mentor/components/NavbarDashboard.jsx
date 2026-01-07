import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GiHamburgerMenu } from "react-icons/gi";
import { API_URL } from '../../../config/api';

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

        const response = await fetch(`${API_URL}/api/profile/me`, {
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
            const url = data.profile.avatar_url;
            setAvatarUrl((url.startsWith('data:') || url.startsWith('http')) ? url : `${API_URL}${url}`);
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
    <header className="bg-gray-800 shadow-md sticky top-0 z-20 border-b border-gray-700 transition-colors duration-200">
      <div className="flex items-center justify-between h-16 px-6 text-white">
        {/* Hamburger/Bar Icon (Visible on small screens, hidden on md and up) */}
        <button
          className="md:hidden p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <GiHamburgerMenu />
        </button>

        {/* Spacer to push right section to end */}
        <div className="flex-grow"></div>

        {/* User Info and Profile */}
        <div className="flex items-center space-x-4">
          {/* Back to Home */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-400 hover:text-white transition-colors focus:outline-none"
            aria-label="Back to Home"
          >
            <span className="mr-1">←</span> <span className="hidden sm:inline text-sm">Home</span>
          </button>

          <span className="text-gray-200 font-medium hidden sm:inline">
            Hello, <strong>{username}</strong>
          </span>
          <button className="p-2 rounded-full text-gray-400 hover:bg-gray-700 transition-colors">
            {/* Bell Icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
          </button>
          <button className="focus:outline-none">
            <img
              src={avatarUrl || `https://ui-avatars.com/api/?name=${username}&background=random`}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500"
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