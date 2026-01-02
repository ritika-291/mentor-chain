
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const RoadmapsPage = () => { // Generic listing for Mentors (Manage) and Mentees (Explore/My)
    const [roadmaps, setRoadmaps] = useState([]);
    const [role, setRole] = useState('mentee');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setRole(user.role || 'mentee');
        fetchRoadmaps(user.role);
    }, []);

    const fetchRoadmaps = async (userRole) => {
        const token = localStorage.getItem('token');
        let url = 'http://localhost:5000/api/roadmaps'; // Default Public

        if (userRole === 'mentor') {
            // Fetch MY created roadmaps (endpoint logic in controller uses mentorId if filtered, or we can reuse `getMyRoadmaps` but that was for enrollment. 
            // Actually, `getMyRoadmaps` was for enrolled ones. Mentor needs to see Created ones.
            // Let's assume GetAll returns everything for now or create a dedicated endpoint later. 
            // For now, let's just fetch all and filter client side or use a dedicated `created` endpoint. 
            // Simplification: Fetch All and show.
        }

        try {
            const res = await fetch(url + (userRole === 'mentee' ? '/my/enrolled' : ''), {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // If mentee and no enrolled roadmaps yet, maybe fetch all public to browse?

            if (res.ok) {
                const data = await res.json();
                setRoadmaps(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-900 min-h-screen text-white p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Roadmaps 🗺️</h1>
                {role === 'mentor' && (
                    <Link
                        to="/mentor/roadmaps/create"
                        className="px-6 py-2 bg-teal-500 hover:bg-teal-600 rounded-lg font-semibold transition-colors"
                    >
                        + Create New
                    </Link>
                )}
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : roadmaps.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roadmaps.map(roadmap => (
                        <Link key={roadmap.id} to={`/${role}/roadmaps/${roadmap.id}`} className="block">
                            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-teal-500 transition-colors h-full flex flex-col">
                                <h3 className="text-xl font-bold text-teal-400 mb-2">{roadmap.title}</h3>
                                <p className="text-gray-400 text-sm mb-4 flex-1">{roadmap.description}</p>
                                <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-700 pt-4">
                                    <span>{roadmap.total_steps || 0} Steps</span>
                                    {roadmap.completed_steps !== undefined && (
                                        <span className="text-green-400">{(roadmap.completed_steps / roadmap.total_steps * 100).toFixed(0)}% Complete</span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
                    <p className="text-gray-400 mb-4">No roadmaps found.</p>
                    {role === 'mentee' && (
                        <Link to="/community" className="text-teal-400 hover:underline">See what mentors are creating!</Link>
                    )}
                </div>
            )}
        </div>
    );
};

export default RoadmapsPage;
