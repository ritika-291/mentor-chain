// MenteeSettings.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const MenteeSettings = () => {
  // Dummy state for settings toggles
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sessionReminders, setSessionReminders] = useState(true);
  const [mentorUpdates, setMentorUpdates] = useState(true);

  // Password Change State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/auth/change-password', {
        oldPassword,
        newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-0">

      {/* Page Header */}
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-600 drop-shadow-sm">
        ⚙️ Settings
      </h1>

      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 space-y-8">

        {/* --- 1. Notifications Settings --- */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4 border-b pb-3 border-gray-700">
            Notification Preferences
          </h2>

          {/* Session Reminders */}
          <div className="flex justify-between items-center py-4 border-b border-gray-700">
            <div>
              <p className="text-lg font-medium text-white">Session Reminders</p>
              <p className="text-sm text-gray-400">Get an alert 30 minutes before your scheduled sessions.</p>
            </div>
            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={sessionReminders}
                onChange={() => setSessionReminders(!sessionReminders)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-teal-600"></div>
            </label>
          </div>

          {/* Mentor Updates */}
          <div className="flex justify-between items-center py-4">
            <div>
              <p className="text-lg font-medium text-white">Mentor Availability Updates</p>
              <p className="text-sm text-gray-400">Notify me when my preferred mentor updates their open slots.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={mentorUpdates}
                onChange={() => setMentorUpdates(!mentorUpdates)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-teal-600"></div>
            </label>
          </div>
        </section>

        {/* --- 2. Appearance & General --- */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4 border-b pb-3 border-gray-700">
            Appearance & General
          </h2>

          {/* Dark Mode Toggle */}
          <div className="flex justify-between items-center py-4 border-b border-gray-700">
            <div>
              <p className="text-lg font-medium text-white">Dark Mode</p>
              <p className="text-sm text-gray-400">Switch the dashboard theme to dark colors.</p>
            </div>
            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={() => setIsDarkMode(!isDarkMode)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-teal-600"></div>
            </label>
          </div>

          {/* Default Timezone Setting (Placeholder) */}
          <div className="py-4">
            <label htmlFor="timezone" className="block text-lg font-medium text-white mb-1">
              Time Zone
            </label>
            <select
              id="timezone"
              defaultValue="UTC-5"
              className="mt-1 block w-full md:w-1/2 p-3 border border-gray-600 rounded-xl shadow-sm focus:ring-teal-500 focus:border-teal-500 bg-gray-700 text-white"
            >
              <option value="UTC-5">(UTC-05:00) Eastern Time (US & Canada)</option>
              <option value="IST">(UTC+05:30) India Standard Time</option>
              <option value="UTC-8">(UTC-08:00) Pacific Time (US & Canada)</option>
            </select>
            <p className="mt-1 text-xs text-gray-400">All session times will be displayed in this zone.</p>
          </div>
        </section>

        {/* --- 3. Password Check --- */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4 border-b pb-3 border-gray-700">
            Security
          </h2>
          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div>
              <label className="block text-gray-300 mb-1" htmlFor="oldPass">Current Password</label>
              <input
                id="oldPass"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full p-2 border rounded-xl bg-gray-700 border-gray-600 text-white focus:ring-teal-500 focus:border-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1" htmlFor="newPass">New Password</label>
              <input
                id="newPass"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border rounded-xl bg-gray-700 border-gray-600 text-white focus:ring-teal-500 focus:border-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1" htmlFor="confirmPass">Confirm New Password</label>
              <input
                id="confirmPass"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border rounded-xl bg-gray-700 border-gray-600 text-white focus:ring-teal-500 focus:border-teal-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 disabled:bg-gray-800 transition-colors"
            >
              {loading ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </section>

        {/* --- 4. Save Button --- */}
        <div className="pt-6 border-t border-gray-700">
          <button
            type="submit"
            className="py-3 px-6 border border-transparent rounded-xl shadow-xl text-lg font-bold text-white bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-150"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenteeSettings;
