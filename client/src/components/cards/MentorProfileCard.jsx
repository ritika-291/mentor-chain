import React from 'react';
import { Link } from 'react-router-dom';

const MentorProfileCard = ({mentor}) => {
    const {id, name ,title,expertise, rating, mentee_count, availability_status}=mentor;

    const getAvailabilityClasses =(status)=>{
        switch (status){
            case 'High':
                return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300';
            case 'Medium':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300';
            case 'Low':
                return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';

        }
    };
    return(
        <div 
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 
                       transition duration-200 hover:shadow-xl hover:scale-[1.01]"
        >
        <div>
            <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{name}</h3>
            <p className="text-md text-gray-700 dark:text-gray-300">{title}</p>
        </div>
        <div className="flex items-center justify-between mt-3 text-sm">
                <span className="text-yellow-500 font-semibold flex items-center space-x-1">
                    <span className="text-lg">⭐</span> <span>{rating} ({mentee_count})</span>
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityClasses(availability_status)}`}>
                    {availability_status} Availability
                </span>
            </div>
            <div className="mt-4">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Top Skills:</p>
                <div className="flex flex-wrap gap-1">
                    {/* Show up to 3 expertise tags */}
                    {expertise.slice(0, 3).map(skill => (
                        <span key={skill} className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-2 py-1 rounded-full">
                            {skill}
                        </span>
                    ))}
                    {expertise.length > 3 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                            +{expertise.length - 3} more
                        </span>
                    )}
                </div>
            </div>
            <Link 
              to={`/mentors/${id}`} // Updated route
              className="mt-5 block text-center py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-md"
            >
              View Profile & Book Session
            </Link>
        </div>
    );
}
export default MentorProfileCard;