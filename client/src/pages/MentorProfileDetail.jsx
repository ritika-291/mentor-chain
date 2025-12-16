import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import mentorDetailsData from '../data/MentorDetailsData'; 

const MentorProfileDetail = () => {
  const { mentorId } = useParams(); 

  const [mentor, setMentor] = useState(null);

  useEffect(() => {
    // Find the mentor in your data based on mentorId
    const foundMentor = mentorDetailsData.find(m => m.id === parseInt(mentorId));
    setMentor(foundMentor);
  }, [mentorId]);

  if (!mentor) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-700 dark:text-gray-300">
        Mentor not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-white">{mentor.name}'s Profile</h1>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <div className="flex items-center mb-6">
          <img
            src={mentor.image}
            alt={mentor.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500 mr-6"
          />
          <div>
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">{mentor.name}</h2>
            <p className="text-indigo-600 dark:text-indigo-400 text-lg">{mentor.title}</p>
            <p className="text-gray-600 dark:text-gray-400">{mentor.expertise.join(', ')}</p>
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{mentor.bio}</p>

        {/* Example sections - you can expand these */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">Availability</h3>
            <p className="text-gray-700 dark:text-gray-300">{mentor.availability_status}</p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">Rating</h3>
            <p className="text-yellow-500 text-lg">{'⭐'.repeat(Math.round(mentor.rating))} {mentor.rating} ({mentor.reviews} reviews)</p>
          </div>
        </div>

        {/* Booking Section - Placeholder */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Book a Session</h3>
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-indigo-700 transition duration-300">
            Schedule a Session with {mentor.name}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorProfileDetail;
