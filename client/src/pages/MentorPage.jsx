import React, { useState, useMemo, useEffect } from 'react';
import MentorProfileCard from '../components/cards/MentorProfileCard';
import SkeletonMentorCard from '../components/cards/SkeletonMentorCard';
import mentorDetailsData from '../data/MentorDetailsData';
import { useSearchParams } from 'react-router-dom';

const MentorsPage = () => {
    // --- State for Search and Filtering ---
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const [selectedExpertise, setSelectedExpertise] = useState('All');
    const [sortBy, setSortBy] = useState('rating');
    const [realMentors, setRealMentors] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch real mentors from API
    useEffect(() => {
        const fetchMentors = async () => {
            setLoading(true);
            try {
                // Fetch all public mentors from backend (search query can be handled here or locally, currently fetching all)
                // For better efficiency, you can pass ?q=searchTerm to the API if you want backend-only search
                // But since we are MERGING with dummy data, let's fetch 'all' (or top 20) and then filter locally 
                // to respect the mixed data requirement.
                const res = await fetch('http://localhost:5000/api/mentors');
                if (res.ok) {
                    const data = await res.json();
                    // Transform API data to match Card component props structure if needed
                    const transformed = data.map(m => ({
                        id: `real-${m.id}`,
                        name: m.username, // mapping username to name
                        title: m.bio ? m.bio.substring(0, 30) + '...' : 'Mentor', // Placeholder title
                        company: "MentorChain",
                        rating: Number(m.average_rating) || 0,
                        reviews: m.reviews_count || 0,
                        expertise: typeof m.expertise === 'string' ? JSON.parse(m.expertise) : (m.expertise || []),
                        availability_status: "High", // Default or map if available
                        image: m.avatar_url || "https://randomuser.me/api/portraits/men/1.jpg" // Placeholder if null
                    }));
                    setRealMentors(transformed);
                }
            } catch (err) {
                console.error("Failed to fetch mentors", err);
            } finally {
                // Simulate a slight delay to show off the skeleton if fetch is too fast (optional, good for UX demo)
                setTimeout(() => setLoading(false), 800);
            }
        };
        fetchMentors();
    }, []);

    // Sync URL search param to state if it changes
    useEffect(() => {
        const q = searchParams.get('q');
        if (q !== null) {
            setSearchTerm(q);
        }
    }, [searchParams]);

    // Combine Data
    const allMentors = useMemo(() => {
        return [...realMentors, ...mentorDetailsData];
    }, [realMentors]);

    // Extract all unique expertise domains for the filter dropdown
    const allExpertise = useMemo(() => {
        const skills = allMentors.flatMap(m => m.expertise || []);
        return ['All', ...new Set(skills)];
    }, [allMentors]);

    // Filtered and Sorted Mentors Logic
    const filteredAndSortedMentors = useMemo(() => {
        let filtered = allMentors;

        // 1. Filter by Expertise
        if (selectedExpertise !== 'All') {
            filtered = filtered.filter(mentor => (mentor.expertise || []).includes(selectedExpertise));
        }

        // 2. Filter by Search Term (Name, Title, or Expertise)
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(mentor =>
                (mentor.name || '').toLowerCase().includes(lowerSearch) ||
                (mentor.title || '').toLowerCase().includes(lowerSearch) ||
                (mentor.expertise || []).some(skill => skill.toLowerCase().includes(lowerSearch))
            );
        }

        // 3. Sort
        if (sortBy === 'rating') {
            filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (sortBy === 'availability') {
            const order = { High: 3, Medium: 2, Low: 1 };
            // Handle cases where availability might be missing or different case
            const getOrder = (status) => order[status] || 0;
            filtered.sort((a, b) => getOrder(b.availability_status) - getOrder(a.availability_status));
        }

        return filtered;
    }, [searchTerm, selectedExpertise, sortBy, allMentors]);


    return (
        <div className="space-y-8 p-4 md:p-8 min-h-screen bg-gray-900 text-white transition-colors duration-500">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-600 drop-shadow-sm">
                Find Your Mentor 🔍
            </h1>

            {/* --- Search and Filter Bar --- */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 space-y-4">

                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Search by name, title, or skill..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-4 border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent bg-gray-700/50 text-white placeholder-gray-400 transition-all shadow-sm"
                />

                {/* Filters and Sort */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <select
                        value={selectedExpertise}
                        onChange={(e) => setSelectedExpertise(e.target.value)}
                        className="flex-1 p-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent bg-gray-700/50 text-white transition-all shadow-sm"
                    >
                        {allExpertise.map(skill => (
                            <option key={skill} value={skill}>{skill === 'All' ? 'All Expertise' : skill}</option>
                        ))}
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="flex-1 p-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent bg-gray-700/50 text-white transition-all shadow-sm"
                    >
                        <option value="rating">Sort by Rating (High to Low)</option>
                        <option value="availability">Sort by Availability</option>
                    </select>
                </div>
                <p className="text-sm font-medium text-gray-400 pl-1">
                    Showing <span className="text-teal-400 font-bold">{loading ? '...' : filteredAndSortedMentors.length}</span> mentors matching your criteria.
                </p>
            </div>

            {/* --- Mentors List --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    // Show 6 skeleton cards while loading
                    Array.from({ length: 6 }).map((_, index) => (
                        <SkeletonMentorCard key={index} />
                    ))
                ) : (
                    filteredAndSortedMentors.length > 0 ? (
                        filteredAndSortedMentors.map((mentor) => (
                            <MentorProfileCard
                                key={mentor.id}
                                mentor={mentor}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10 text-gray-500 dark:text-gray-400">
                            No mentors found matching your search.
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default MentorsPage;