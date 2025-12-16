// MenteeProfile.jsx

import React from 'react';

const MenteeProfile = () => {
  return (
    <div className="space-y-8 p-4 md:p-0">
      
      {/* Page Header */}
      <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">
        👤 My Profile
      </h1>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700">
        
        {/* --- Section 1: Personal Information --- */}
        <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-6 border-b pb-3 border-gray-200 dark:border-gray-700">
          Personal Information
        </h2>

        <form className="space-y-6">
          
          {/* Profile Picture Upload */}
          <div className="flex items-center space-x-6 pb-4 border-b border-gray-100 dark:border-gray-700">
            <img
              className="h-24 w-24 rounded-full object-cover ring-4 ring-indigo-300 dark:ring-indigo-600 shadow-lg"
              src="https://via.placeholder.com/150/6366f1/ffffff?text=M"
              alt="Current Profile"
            />
            <div>
              <label htmlFor="file-upload" className="cursor-pointer inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-150">
                Change Picture
              </label>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                PNG or JPG, maximum 5MB.
              </p>
            </div>
          </div>
          
          {/* Form Fields: Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                defaultValue="Alex Mentee"
                className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                defaultValue="alex@example.com"
                readOnly 
                className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-gray-100 dark:bg-gray-700 dark:text-white cursor-not-allowed"
              />
            </div>
          </div>
          
          {/* Section: Learning Goals */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                Learning Goals
            </h3>
            
            <div>
              <label htmlFor="goals" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                My Primary Area of Focus
              </label>
              <textarea
                id="goals"
                rows="3"
                defaultValue="I am focusing on building my first full-stack application using React and Node.js. My goal is to become proficient in database design."
                className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              ></textarea>
            </div>
          </div>
          
          {/* --- Section 2: Security and Password --- */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-6 border-b pb-3 border-gray-200 dark:border-gray-700">
                Security
            </h3>
            
            <div className="space-y-4">
                <div>
                    <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Current Password
                    </label>
                    <input
                        type="password"
                        id="current-password"
                        placeholder="Enter current password"
                        className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="new-password"
                            placeholder="Enter new password"
                            className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            id="confirm-password"
                            placeholder="Confirm new password"
                            className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                </div>
            </div>
          </div>

          {/* Submit Button (Applies to all changes) */}
          <div className="pt-6">
            <button
              type="submit"
              className="w-full py-3 px-4 border border-transparent rounded-lg shadow-xl text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all duration-150"
            >
              Save All Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenteeProfile;
