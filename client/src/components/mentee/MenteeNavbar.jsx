import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config/api";
import { IoNotificationsOutline } from "react-icons/io5";
import { io } from "socket.io-client";

const MenteeNavbar = ({ toggleSidebar }) => {
  const [username, setUsername] = useState('Mentee');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let socket;
    const userStr = localStorage.getItem('user');
    let userId = null;

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUsername(user.username || 'Mentee');
        userId = user.id;
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }

    // Fetch profile and notifications
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
        if (!token) return;

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // Fetch Profile
        const profileRes = await fetch(`${API_URL}/api/profile/me`, { headers });
        if (profileRes.ok) {
          const data = await profileRes.json();
          if (data.username) setUsername(data.username);
          if (data.profile && data.profile.avatar_url) {
            const url = data.profile.avatar_url;
            setAvatarUrl((url.startsWith('data:') || url.startsWith('http')) ? url : `${API_URL}${url}`);
          }
        }

        // Fetch Notifications
        const notifRes = await fetch(`${API_URL}/api/notifications`, { headers });
        if (notifRes.ok) {
          const notifications = await notifRes.json();
          if (Array.isArray(notifications)) {
            const count = notifications.filter(n => !n.is_read && !n.read).length;
            setUnreadCount(count);
          } else {
            setUnreadCount(0);
          }
        }

      } catch (err) {
        console.error('Error fetching navbar data:', err);
      }
    };

    fetchData();

    // Socket.io for real-time notifications
    if (userId) {
      socket = io(API_URL);
      socket.emit('join:user', { userId });

      socket.on('notification:new', (data) => {
        console.log('New notification received:', data);
        setUnreadCount(prev => prev + 1);
      });
    }

    return () => {
      if (socket) socket.disconnect();
    };

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
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 text-white">

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

        {/* Spacer to push right section to end */}
        <div className="flex-grow"></div>

        {/* Right Section: Profile & Logout */}
        <div className="flex items-center space-x-3 sm:space-x-4">

          {/* Back to Home */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-400 hover:text-white transition-colors focus:outline-none"
            aria-label="Back to Home"
          >
            <span className="mr-1">←</span> <span className="hidden sm:inline text-sm">Home</span>
          </button>

          {/* Notification Icon */}
          <button
            onClick={() => navigate('/mentee/notifications')}
            className="relative p-2 text-gray-400 hover:text-white transition-colors focus:outline-none"
            aria-label="Notifications"
          >
            <IoNotificationsOutline className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-gray-800">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Welcome Message */}
          <span className="text-gray-200 font-medium hidden sm:inline text-sm">
            Hello, <strong>{username}</strong>
          </span>

          {/* Profile Picture */}
          <button className="focus:outline-none">
            <img
              src={avatarUrl || `https://ui-avatars.com/api/?name=${username}&background=random`}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500"
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