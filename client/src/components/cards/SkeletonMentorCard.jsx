
import React from 'react';

const SkeletonMentorCard = () => {
    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 animate-pulse">
            <div>
                {/* Title skeleton */}
                <div className="h-6 bg-gray-700 rounded w-1/2 mb-2"></div>
                {/* Subtitle skeleton */}
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            </div>

            <div className="flex items-center justify-between mt-3">
                {/* Rating skeleton */}
                <div className="h-4 bg-gray-700 rounded w-16"></div>
                {/* Badge skeleton */}
                <div className="h-6 bg-gray-700 rounded-full w-24"></div>
            </div>

            <div className="mt-4">
                <div className="h-3 bg-gray-700 rounded w-20 mb-2"></div>
                <div className="flex flex-wrap gap-1">
                    <div className="h-6 bg-gray-700 rounded w-16"></div>
                    <div className="h-6 bg-gray-700 rounded w-20"></div>
                    <div className="h-6 bg-gray-700 rounded w-12"></div>
                </div>
            </div>

            <div className="mt-5 h-10 bg-gray-700 rounded-lg w-full"></div>
        </div>
    );
};

export default SkeletonMentorCard;
