
import React, { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';
import { API_URL } from '../config/api';

const RoadmapDetail = () => {
    const { id } = useParams();
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState('mentee');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUserRole(user.role || 'mentee');
        fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/roadmaps/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            setRoadmap(data);
        }
        setLoading(false);
    };

    const toggleStep = async (stepId, currentStatus) => {
        if (userRole !== 'mentee') return; // Mentors can't check off steps here (view only)

        // Optimistic UI
        setRoadmap(prev => ({
            ...prev,
            userProgress: {
                ...prev.userProgress,
                [stepId]: !currentStatus ? 1 : 0
            }
        }));

        const token = localStorage.getItem('token');

        await fetch(`${API_URL}/api/roadmaps/${id}/steps/${stepId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ completed: !currentStatus })
        });
    };

    const handleEnroll = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/api/roadmaps/${id}/enroll`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                alert('Enrolled! You can now track progress.');
                fetchDetails(); // Reload to update state
            }
        } catch (err) { console.error(err); }
    };

    if (loading) return <div className="p-8 text-white">Loading...</div>;
    if (!roadmap) return <div className="p-8 text-white">Roadmap not found.</div>;

    const completedCount = Object.values(roadmap.userProgress || {}).filter(c => c).length;
    const progress = Math.round((completedCount / roadmap.steps.length) * 100) || 0;

    return (
        <div className="bg-gray-900 min-h-screen text-white p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-teal-400 mb-2">{roadmap.title}</h1>
                    <p className="text-gray-400 text-lg mb-4">{roadmap.description}</p>
                    <div className="flex items-center space-x-4">
                        <span className="bg-gray-800 px-3 py-1 rounded text-sm border border-gray-700">
                            By {roadmap.mentor_name}
                        </span>
                        {/* Only show enroll if mentee and not started? Check progress existence implies enrollment usually */}
                    </div>
                </div>

                {/* Progress Bar */}
                {userRole === 'mentee' && (
                    <div className="bg-gray-800 rounded-full h-4 w-full mb-8 relative overflow-hidden border border-gray-700">
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-400 to-blue-500 transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}

                {/* Timeline / Steps */}
                <div className="space-y-6 relative border-l-2 border-gray-700 ml-4 pl-8 pb-4">
                    {roadmap.steps.map((step, index) => {
                        const isCompleted = roadmap.userProgress && roadmap.userProgress[step.id];
                        return (
                            <div key={step.id} className="relative">
                                {/* Dot on timeline */}
                                <div
                                    className={`absolute -left-[41px] top-1 w-6 h-6 rounded-full border-4 border-gray-900 ${isCompleted ? 'bg-teal-400' : 'bg-gray-700'}`}
                                />

                                <div className={`bg-gray-800 p-6 rounded-xl border transition-colors ${isCompleted ? 'border-teal-500/50' : 'border-gray-700'}`}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className={`text-xl font-bold mb-2 ${isCompleted ? 'text-teal-400 line-through' : 'text-white'}`}>
                                                {step.title}
                                            </h3>
                                            <p className="text-gray-400 mb-3">{step.description}</p>
                                            {step.resource_link && (
                                                <a href={step.resource_link} target="_blank" rel="noreferrer" className="text-blue-400 text-sm hover:underline">
                                                    View Resource ↗
                                                </a>
                                            )}
                                        </div>

                                        {userRole === 'mentee' && (
                                            <button
                                                onClick={() => toggleStep(step.id, isCompleted)}
                                                className={`w-8 h-8 rounded flex items-center justify-center border transition-all ${isCompleted ? 'bg-teal-500 border-teal-500 text-white' : 'border-gray-600 hover:border-teal-400'}`}
                                            >
                                                {isCompleted && '✓'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default RoadmapDetail;
