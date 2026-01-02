import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import image from "../../assets/images/image.png"
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/mentors?q=${encodeURIComponent(searchQuery)}`);
  };
  return (
    <section className="bg-gray-900 text-white min-h-screen flex items-center p-4 md:p-8">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">

        {/* Left Side: Text and Search Bar */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left mb-12 md:mb-0 px-4 md:px-0">
          <h1 className="text-4xl md:text-4xl lg:text-6xl font-extrabold leading-tight tracking-wide">
            Find Your Perfect Mentor for <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Research Success</span>.
          </h1>
          <p className="mt-4 md:mt-6 text-lg md:text-xl text-gray-300 max-w-xl">
            Partner with experienced mentors who guide you every step of the way. Discover the right expert to bring your academic research to life—effortlessly and effectively.
          </p>

          {/* Search Bar and Button */}
          <div className="mt-8 flex flex-col sm:flex-row items-center w-full max-w-lg space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for a mentor by name "
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-800 text-gray-300 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors duration-300"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <button
              onClick={handleSearch}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-teal-400 to-blue-500 text-white font-bold rounded-full shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105"
            >
              Find My Mentor
            </button>

          </div>
        </div>

        {/* Right Side: Image */}
        <div className="w-full md:w-1/2 flex justify-center p-4">
          <img
            src={image}
            alt="Three people collaborating on a laptop, representing a mentoring session"
            className="w-80 h-80 md:h-120 lg:w-120 lg:h-120 rounded-full shadow-2xl object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;