import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa'; // Import right arrow icon

const MentorCard = ({ title, subtitle, image, link }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col items-center text-center ">
      {/* Image Section */}
      <div className="w-full h-75 md:h-56 lg:h-100 flex-shrink-0">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>

      {/* Text Content */}
      <div className="p-6 flex flex-col items-center">
        <h3 className="text-xl font-semibold text-white mb-2">
          {title}
        </h3>
        
        <Link
          to={link}
          className="inline-flex items-center font-medium text-teal-500 hover:text-teal-600 transition-colors duration-200"
        >
          {subtitle}
          <FaArrowRight className="ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default MentorCard;