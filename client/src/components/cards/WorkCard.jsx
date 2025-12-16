import React from 'react';
import { Link } from 'react-router-dom';

const WorkCard = ({ step, title, description, buttonText, image, link }) => {
  return (
    <div className="w-full max-w-sm bg-gray-800 rounded-xl shadow-xl p-8 transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl flex flex-col">

      {/* Main content area with image and text side-by-side on larger screens */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        
        {/* Left side: Image */}
        <div className="flex-shrink-0 w-32 h-32 sm:w-28 sm:h-28 flex items-center justify-center">
          <img src={image} alt={title} className="w-full h-full object-contain" />
        </div>

        {/* Right side: Text content */}
        <div className="flex-grow text-center sm:text-left">
          <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 mb-1">
            {step}.
          </div>
          <h3 className="text-xl font-bold mb-2">
            {title}
          </h3>
          <p className="text-gray-300 text-sm">
            {description}
          </p>
        </div>
      </div>
      
      {/* Full-width button at the bottom */}
      <div className="mt-auto">
        <Link to={link}>
        <button className="w-full bg-gradient-to-r from-teal-400 to-blue-500 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-transform duration-300 ease-in-out hover:scale-105">
          {buttonText}
        </button>
        </Link>
      </div>
    </div>
  );
};

export default WorkCard;