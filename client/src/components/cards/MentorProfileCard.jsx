import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MentorProfileCard = ({ mentor }) => {
    const { id, name, title, expertise, rating, mentee_count, availability_status } = mentor;

    const getAvailabilityClasses = (status) => {
        switch (status) {
            case 'High':
                return 'bg-green-900/40 text-green-300 border-green-800';
            case 'Medium':
                return 'bg-yellow-900/40 text-yellow-300 border-yellow-800';
            case 'Low':
                return 'bg-red-900/40 text-red-300 border-red-800';
            default:
                return 'bg-gray-700 text-gray-300 border-gray-600';

        }
    };
    return (
        <motion.div
            className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 h-full flex flex-col justify-between transform transition-all hover:bg-gray-750"
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 truncate pr-2">{name}</h3>
                    {/* Placeholder Avatar if needed, or keeping it clean */}
                </div>
                <p className="text-md text-gray-300 line-clamp-2 min-h-[3rem] font-medium">{title}</p>

                <div className="flex items-center justify-between mt-4 text-sm">
                    <span className="text-yellow-500 font-bold flex items-center space-x-1 bg-yellow-900/20 px-2 py-1 rounded-md border border-yellow-500/10">
                        <span className="text-lg">⭐</span> <span>{rating} ({mentee_count})</span>
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getAvailabilityClasses(availability_status)}`}>
                        {availability_status}
                    </span>
                </div>

                <div className="mt-5">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Top Skills</p>
                    <div className="flex flex-wrap gap-2">
                        {/* Show up to 3 expertise tags */}
                        {expertise.slice(0, 3).map((skill, i) => (
                            <span key={`${skill}-${i}`} className="text-xs bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full border border-gray-600 hover:border-teal-500/50 transition-colors">
                                {skill}
                            </span>
                        ))}
                        {expertise.length > 3 && (
                            <span className="text-xs text-gray-500 px-2 py-1">
                                +{expertise.length - 3} more
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <Link
                to={`/mentors/${id}`}
                className="mt-6 block text-center py-3 px-4 bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 text-white rounded-xl transition-all duration-300 font-bold shadow-lg hover:shadow-teal-500/30"
            >
                View Profile & Book Session
            </Link>
        </motion.div>
    );
}
export default MentorProfileCard;