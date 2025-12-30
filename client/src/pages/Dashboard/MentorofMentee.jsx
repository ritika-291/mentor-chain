// src/pages/Dashboard/Mentee/Mentors.jsx (Assuming this is your list file)

import React, { useState, useMemo } from 'react';
import MentorProfileCard from '../../components/cards/MentorProfileCard'; // Corrected path
import mentorDetailsData from '../../data/MentorDetailsData'; // Using the imported JSON data

const Mentors = () => {
    // --- State for Search and Filtering ---
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedExpertise, setSelectedExpertise] = useState('All');
    const [sortBy, setSortBy] = useState('rating');
    const [allMentors, setAllMentors] = useState(mentorDetailsData);

    // Fetch real mentors from API and merge with dummy data
    React.useEffect(() => {
        const fetchMentors = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/mentors');
                if (response.ok) {
                    const realMentors = await response.json();

                    // Transform real mentors to match the shape of dummy data
                    const formattedRealMentors = realMentors.map(m => ({
                        id: `real-${m.id}`, // Ensure unique ID
                        name: m.username,
                        title: m.expertise && m.expertise[0] ? `${m.expertise[0]} Expert` : 'Mentor', // Derive title if missing
                        expertise: m.expertise || [],
                        rating: m.rating || 5.0, // Default rating for new mentors
                        availability_status: m.availability_status === 'available' ? 'High' : (m.availability_status === 'busy' ? 'Low' : 'Medium'),
                        mentee_count: 0, // Default for now
                        avatar_url: m.avatar_url // Pass avatar_url if available
                    }));

                    // distinct by ID or just append? User said "along all the dummy data"
                    // We will append real mentors to the top or mix them in.
                    setAllMentors([...formattedRealMentors, ...mentorDetailsData]);
                }
            } catch (error) {
                console.error('Failed to fetch real mentors:', error);
            }
        };
        fetchMentors();
    }, []);

    // Extract all unique expertise domains for the filter dropdown
    const allExpertise = useMemo(() => {
        const skills = allMentors.flatMap(m => m.expertise || []);
        return ['All', ...new Set(skills)];
    }, [allMentors]);

    // Filtered and Sorted Mentors Logic (re-using the previous robust logic)
    const filteredAndSortedMentors = useMemo(() => {
        let filtered = allMentors;

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
    }, [searchTerm, selectedExpertise, sortBy, allMentors]);


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

export default Mentors;