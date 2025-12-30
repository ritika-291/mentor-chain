import React from 'react';
import mentorData from '../../data/MentorData';
import MentorCard from '../cards/MentorCard';

const Features = () => {
  return (
    <section id="features" className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 tracking-wide">
          Explore Our Mentors
        </h2>
        {/* Corrected Grid Class */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 max-w-6xl mx-auto">
          {mentorData.map((item, index) => (
            <MentorCard key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;