
import React, { useState } from 'react';
import Navbar from '../layout/Navbar';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config/api';

const RoadmapBuilder = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [steps, setSteps] = useState([{ title: '', description: '', resourceLink: '' }]);
    const [loading, setLoading] = useState(false);

    const handleStepChange = (index, field, value) => {
        const newSteps = [...steps];
        newSteps[index][field] = value;
        setSteps(newSteps);
    };

    const addStep = () => {
        setSteps([...steps, { title: '', description: '', resourceLink: '' }]);
    };

    const removeStep = (index) => {
        if (steps.length === 1) return;
        const newSteps = steps.filter((_, i) => i !== index);
        setSteps(newSteps);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`${API_URL}/api/roadmaps`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, description, steps })
            });

            if (res.ok) {
                navigate('/mentor/roadmaps'); // Redirect to listing
            } else {
                const data = await res.json();
                alert('Failed to create roadmap: ' + (data.message || 'Unknown Error'));
            }
        } catch (err) {
            console.error(err);
            alert('Server error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-900 min-h-screen text-white p-8">
            <h1 className="text-3xl font-bold mb-8">Create New Roadmap 🗺️</h1>

            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
                {/* Roadmap Details */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h2 className="text-xl font-semibold mb-4 text-teal-400">Roadmap Overview</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Title</label>
                            <input
                                type="text"
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:border-teal-500 outline-none"
                                placeholder="e.g. Frontend Mastery Path"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Description</label>
                            <textarea
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:border-teal-500 outline-none"
                                rows="3"
                                placeholder="What will mentees learn?"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Steps */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-teal-400">Roadmap Steps</h2>
                    </div>

                    {steps.map((step, index) => (
                        <div key={index} className="bg-gray-800 p-6 rounded-xl border border-gray-700 relative">
                            <div className="absolute top-4 right-4">
                                <button
                                    type="button"
                                    onClick={() => removeStep(index)}
                                    className="text-red-400 hover:text-red-300 text-sm"
                                    disabled={steps.length === 1}
                                >
                                    Remove
                                </button>
                            </div>
                            <h3 className="text-lg font-medium mb-3">Step {index + 1}</h3>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3"
                                    placeholder="Step Title (e.g. Learn HTML Basics)"
                                    value={step.title}
                                    onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                                    required
                                />
                                <textarea
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3"
                                    rows="2"
                                    placeholder="Step Description..."
                                    value={step.description}
                                    onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3"
                                    placeholder="Resource Link (Optional)"
                                    value={step.resourceLink}
                                    onChange={(e) => handleStepChange(index, 'resourceLink', e.target.value)}
                                />
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addStep}
                        className="w-full py-3 bg-gray-800 border-2 border-dashed border-gray-700 text-gray-400 rounded-xl hover:border-teal-500 hover:text-teal-500 transition-colors"
                    >
                        + Add Step
                    </button>
                </div>

                <div className="flex justify-end pt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-gradient-to-r from-teal-400 to-blue-500 text-white font-bold rounded-lg hover:opacity-90 disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Create Roadmap'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RoadmapBuilder;
