// ProfileSettings.jsx
import React from 'react';

const Profile = () => {
  return (
    <div className="space-y-8 p-4 sm:p-0">
      
      {/* Page Header */}
      <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">
        👤 Profile Settings
      </h1>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-6 border-b pb-3 border-gray-200 dark:border-gray-700">
          Personal Information
        </h2>

        <form className="space-y-6">
          
          {/* Profile Picture Upload */}
          <div className="flex items-center space-x-6 pb-4 border-b border-gray-100 dark:border-gray-700">
            <img
              className="h-24 w-24 rounded-full object-cover ring-4 ring-indigo-300 dark:ring-indigo-600 shadow-lg"
              src="https://via.placeholder.com/150"
              alt="Current Profile"
            />
            <div>
              <label htmlFor="file-upload" className="cursor-pointer inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-150">
                Change Picture
              </label>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, up to 5MB.
              </p>
            </div>
          </div>
          
          {/* Form Fields */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              defaultValue="Jane Mentor"
              className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="expertise" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Expertise
            </label>
            <input
              type="text"
              id="expertise"
              defaultValue="Full-Stack Development, React"
              className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bio / Introduction
            </label>
            <textarea
              id="bio"
              rows="4"
              defaultValue="Experienced full-stack developer with a passion for mentoring and helping others achieve their career goals in tech."
              className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            ></textarea>
          </div>
          
          {/* Availability/Schedule Link */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Availability
            </label>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Manage and update your mentorship schedule and available hours.
            </p>
            <a href="/dashboard/mentor/schedule" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 font-medium transition duration-150">
                Go to Schedule Management &rarr;
            </a>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              className="w-full py-3 px-4 border border-transparent rounded-lg shadow-xl text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all duration-150"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;