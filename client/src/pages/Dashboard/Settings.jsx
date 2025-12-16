// Settings.jsx
import React, { useState } from 'react';

const Settings = () => {
  // Dummy state for settings toggles
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [sessionReminders, setSessionReminders] = useState(true);

  return (
    <div className="space-y-8 p-4 sm:p-0">
      
      {/* Page Header */}
      <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">
        ⚙️ Dashboard Settings
      </h1>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 space-y-8">
        
        {/* --- 1. General & Appearance Settings --- */}
        <section>
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 border-b pb-3 border-gray-200 dark:border-gray-700">
            Appearance & General
          </h2>

          {/* Dark Mode Toggle */}
          <div className="flex justify-between items-center py-4 border-b border-gray-100 dark:border-gray-700">
            <div>
              <p className="text-lg font-medium text-gray-800 dark:text-gray-100">Dark Mode</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Switch the dashboard theme to dark colors.</p>
            </div>
            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={isDarkMode} 
                onChange={() => setIsDarkMode(!isDarkMode)} 
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          
          {/* Default Timezone Setting (Placeholder) */}
          <div className="py-4 border-b border-gray-100 dark:border-gray-700">
            <label htmlFor="timezone" className="block text-lg font-medium text-gray-800 dark:text-gray-100 mb-1">
              Time Zone
            </label>
            <select
              id="timezone"
              defaultValue="UTC-5"
              className="mt-1 block w-full md:w-1/2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="UTC-5">(UTC-05:00) Eastern Time (US & Canada)</option>
              <option value="IST">(UTC+05:30) India Standard Time</option>
              <option value="UTC-8">(UTC-08:00) Pacific Time (US & Canada)</option>
            </select>
          </div>
        </section>

        {/* --- 2. Notification Settings --- */}
        <section>
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 border-b pb-3 border-gray-200 dark:border-gray-700">
            Notifications
          </h2>

          {/* Email Notifications */}
          <div className="flex justify-between items-center py-4 border-b border-gray-100 dark:border-gray-700">
            <div>
              <p className="text-lg font-medium text-gray-800 dark:text-gray-100">Email Updates</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receive an email when a new mentorship request is submitted.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={emailNotifications} 
                onChange={() => setEmailNotifications(!emailNotifications)} 
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Session Reminders */}
          <div className="flex justify-between items-center py-4">
            <div>
              <p className="text-lg font-medium text-gray-800 dark:text-gray-100">Session Reminders</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Get a reminder 15 minutes before any scheduled session.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={sessionReminders} 
                onChange={() => setSessionReminders(!sessionReminders)} 
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </section>

        {/* --- 3. Save Button --- */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            className="py-3 px-6 border border-transparent rounded-lg shadow-xl text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 transition-all duration-150"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;