
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config/api';

const RoadmapsPage = () => { // Generic listing for Mentors (Manage) and Mentees (Explore/My)
    const [roadmaps, setRoadmaps] = useState([]);
    const [allRoadmaps, setAllRoadmaps] = useState([]); // For Explore tab
    const [view, setView] = useState('my'); // 'my' or 'explore'
    const [role, setRole] = useState('mentee');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setRole(user.role || 'mentee');
        fetchRoadmaps(user.role);
    }, []);

    const fetchRoadmaps = async (userRole) => {
        const token = localStorage.getItem('token');
        try {
            if (userRole === 'mentee') {
                // Fetch My Enrolled
                const resMy = await fetch(`${API_URL}/api/roadmaps/my/enrolled`, { headers: { Authorization: `Bearer ${token}` } });
                if (resMy.ok) setRoadmaps(await resMy.json());

                // Fetch All (Explore)
                const resAll = await fetch(`${API_URL}/api/roadmaps`, { headers: { Authorization: `Bearer ${token}` } });
                if (resAll.ok) setAllRoadmaps(await resAll.json());
            } else {
                // Mentor: Fetch their own? Or All?
                // Currently fetching All for simple display -> ideally fetch created by them
                const res = await fetch(`${API_URL}/api/roadmaps?mentorId=${JSON.parse(localStorage.getItem('user')).id}`, { headers: { Authorization: `Bearer ${token}` } });
                if (res.ok) setRoadmaps(await res.json());
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
                <div>
                    <h1 className="text-3xl font-bold mb-2">Roadmaps 🗺️</h1>
                    {role === 'mentee' && (
                        <div className="flex space-x-4 text-sm font-medium">
                            <button
                                onClick={() => setView('my')}
                                className={`px-3 py-1 rounded-full ${view === 'my' ? 'bg-teal-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                            >
                                My Learning
                            </button>
                            <button
                                onClick={() => setView('explore')}
                                className={`px-3 py-1 rounded-full ${view === 'explore' ? 'bg-teal-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                            >
                                Explore All
                            </button>
                        </div>
                    )}
                </div>

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
            ) : (view === 'my' && role === 'mentee' ? roadmaps : (role === 'mentee' ? allRoadmaps : roadmaps)).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(view === 'my' && role === 'mentee' ? roadmaps : (role === 'mentee' ? allRoadmaps : roadmaps)).map(roadmap => (
                        <div key={roadmap.id} className="block relative">
                            {role === 'mentor' && (
                                <button
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        if (!confirm('Delete this roadmap?')) return;
                                        const token = localStorage.getItem('token');
                                        await fetch(`${API_URL}/api/roadmaps/${roadmap.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
                                        fetchRoadmaps(role);
                                    }}
                                    className="absolute top-2 right-2 z-10 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            )}
                            <Link to={`/${role}/roadmaps/${roadmap.id}`}>
                                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-teal-500 transition-colors h-full flex flex-col">
                                    <h3 className="text-xl font-bold text-teal-400 mb-2">{roadmap.title}</h3>
                                    <p className="text-gray-400 text-sm mb-4 flex-1">{roadmap.description}</p>
                                    <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-700 pt-4">
                                        <span>{roadmap.total_steps || 0} Steps</span>
                                        {(role === 'mentee' && view === 'my') && (
                                            <span className="text-green-400">{(roadmap.completed_steps / roadmap.total_steps * 100).toFixed(0)}% Complete</span>
                                        )}
                                        {(role === 'mentee' && view === 'explore') && (
                                            <span className="text-blue-400">View Details</span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
                    <p className="text-gray-400 mb-4">{view === 'my' ? "You haven't enrolled in any roadmaps yet." : "No roadmaps found to explore."}</p>
                    {role === 'mentee' && view === 'my' && (
                        <button onClick={() => setView('explore')} className="text-teal-400 hover:underline">Find roadmaps to start learning!</button>
                    )}
                </div>
            )}
        </div>
    );
};

export default RoadmapsPage;
