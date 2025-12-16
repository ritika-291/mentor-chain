import React from 'react';

const Role = ({selectedRole,setSelectedRole}) => {


  return (
    <div className="flex justify-center space-x-4">
      <button
        onClick={() => setSelectedRole('Mentor')}
        className={`flex-1 py-3 px-6 rounded-full font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 ${
          selectedRole === 'Mentor' ? 'bg-teal-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        Mentor
      </button>
      <button
        onClick={() => setSelectedRole('Mentee')}
        className={`flex-1 py-3 px-6 rounded-full font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 ${
          selectedRole === 'Mentee' ? 'bg-teal-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        Mentee
      </button>
    </div>
  );
};

export default Role;