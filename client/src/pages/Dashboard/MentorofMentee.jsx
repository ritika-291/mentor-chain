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
        const fetchMentorsAndStatus = async () => {
            try {
                // 1. Fetch Mentors
                const response = await fetch('http://localhost:5000/api/mentors');
                if (response.ok) {
                    const realMentors = await response.json();

                    // 2. Fetch Status for each mentor (if logged in as mentee)
                    const userStr = localStorage.getItem('user');
                    const user = userStr ? JSON.parse(userStr) : null;
                    const token = localStorage.getItem('token');

                    const mentorsWithStatus = await Promise.all(realMentors.map(async (m) => {
                        let status = 'none';
                        if (user && user.role === 'mentee' && token) {
                            try {
                                const statusRes = await fetch(`http://localhost:5000/api/mentors/${m.id}/mentees/status`, {
                                    headers: { 'Authorization': `Bearer ${token}` }
                                });
                                if (statusRes.ok) {
                                    const statusData = await statusRes.json();
                                    status = statusData.status;
                                }
                            } catch (ignore) { }
                        }

                        return {
                            id: `real-${m.id}`,
                            realId: m.id, // Store raw ID for logic
                            name: m.username,
                            title: m.expertise && m.expertise[0] ? `${m.expertise[0]} Expert` : 'Mentor',
                            expertise: m.expertise || [],
                            rating: m.rating || 5.0,
                            availability_status: m.availability_status === 'available' ? 'High' : (m.availability_status === 'busy' ? 'Low' : 'Medium'),
                            mentee_count: 0,
                            avatar_url: m.avatar_url,
                            connection_status: status // 'none', 'requested', 'active'
                        };
                    }));

                    // distinct by ID or just append? User said "along all the dummy data"
                    // We will append real mentors to the top or mix them in.
                    setAllMentors([...mentorsWithStatus, ...mentorDetailsData]);
                }
            } catch (error) {
                console.error('Failed to fetch real mentors:', error);
            }
        };
        fetchMentorsAndStatus();
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
                    Showing {filteredAndSortedMentors.length} mentors matching your criteria.
                </p>
            </div>

            {/* Mentors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedMentors.map(mentor => (
                    <div key={mentor.id} className="relative">
                        <MentorProfileCard mentor={mentor} />
                        {mentor.connection_status && mentor.connection_status !== 'none' && (
                            <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold text-white ${mentor.connection_status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                                }`}>
                                {mentor.connection_status === 'active' ? 'Connected' : 'Requested'}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Mentors;