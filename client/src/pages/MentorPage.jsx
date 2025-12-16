// src/pages/Dashboard/Mentee/Mentors.jsx (Assuming this is your list file)

import React, { useState, useMemo } from 'react';
import MentorProfileCard from '../components/cards/MentorProfileCard';
import mentorDetailsData from '../data/MentorDetailsData';


const MentorsPage = () => {
    // --- State for Search and Filtering ---
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedExpertise, setSelectedExpertise] = useState('All');
    const [sortBy, setSortBy] = useState('rating');
    
    // Extract all unique expertise domains for the filter dropdown
    const allExpertise = useMemo(() => {
        const skills = mentorDetailsData.flatMap(m => m.expertise || []);
        return ['All', ...new Set(skills)];
    }, []);

    // Filtered and Sorted Mentors Logic (re-using the previous robust logic)
    const filteredAndSortedMentors = useMemo(() => {
        let filtered = mentorDetailsData;

        if (selectedExpertise !== 'All') {
            filtered = filtered.filter(mentor => (mentor.expertise || []).includes(selectedExpertise));
        }

        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(mentor => 
                (mentor.name || '').toLowerCase().includes(lowerSearch) ||
                (mentor.title || '').toLowerCase().includes(lowerSearch)
            );
        }

        if (sortBy === 'rating') {
            filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (sortBy === 'availability') {
            const order = { High: 3, Medium: 2, Low: 1 };
            filtered.sort((a, b) => order[b.availability_status] - order[a.availability_status]);
        }
        
        return filtered;
    }, [searchTerm, selectedExpertise, sortBy]);


    return (
        <div className="space-y-8 p-4 md:p-0">
            <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">
                Find Your Mentor 🔍
            </h1>
            
            {/* --- Search and Filter Bar (for context and functionality) --- */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 space-y-4">
                
                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Search by name, title, or skill..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />

                {/* Filters and Sort */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <select 
                        value={selectedExpertise}
                        onChange={(e) => setSelectedExpertise(e.target.value)}
                        className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    >
                        {allExpertise.map(skill => (
                            <option key={skill} value={skill}>{skill === 'All' ? 'All Expertise' : skill}</option>
                        ))}
                    </select>

                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="rating">Sort by Rating (High to Low)</option>
                        <option value="availability">Sort by Availability</option>
                    </select>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Showing **{filteredAndSortedMentors.length}** mentors matching your criteria.
                </p>
            </div>
            
            {/* --- Mentors List (Mapping the Card) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedMentors.map((mentor) => (
                    // 🔑 Key change: Pass the entire 'mentor' object as the prop
                    <MentorProfileCard 
                        key={mentor.id} 
                        mentor={mentor} // Pass the full object
                    />
                ))}
            </div>
        </div>
    );
};

export default MentorsPage;