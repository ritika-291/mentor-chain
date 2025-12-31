// Overview.jsx

import React, { useState, useEffect } from 'react';
// Renaming imports to match the styled components we created earlier
import MenteesCard from '../../components/mentor/components/MenteesCard'; // Your original component name
import Calendar from '../../components/mentor/components/Calendar'; // Your original component name
import RequestCard from '../../components/mentor/components/RequestCard';
import toast from 'react-hot-toast';

const Overview = () => {
  const [activeMentees, setActiveMentees] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);

  // Stats State
  const [stats, setStats] = useState([
    { title: 'Active Mentees', value: '0', color: 'text-indigo-600 dark:text-indigo-400', icon: '🧑‍💻' },
    { title: 'Pending Requests', value: '0', color: 'text-yellow-600 dark:text-yellow-400', icon: '⏳' },
    { title: 'Average Rating', value: '4.8 ⭐', color: 'text-green-600 dark:text-green-400', icon: '✨' },
  ]);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : {};
  const mentorId = user.id;
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    if (!mentorId) return;
    try {
      // 1. Fetch Mentees
      const res = await fetch(`http://localhost:5000/api/mentors/${mentorId}/mentees`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const all = data.mentees || [];

        const active = all.filter(r => r.status === 'active');
        const pending = all.filter(r => r.status === 'requested');

        setActiveMentees(active);
        setPendingRequests(pending);

        // Update stats
        setStats(prev => [
          { ...prev[0], value: active.length.toString() },
          { ...prev[1], value: pending.length.toString(), title: "Pending Requests", icon: '⏳' },
          prev[2]
        ]);
      }

      // 2. Fetch Sessions
      const sRes = await fetch(`http://localhost:5000/api/sessions/mentor/${mentorId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (sRes.ok) {
        const sData = await sRes.json();
        setSessions(sData.sessions || []);
      }

    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [mentorId]); // eslint-disable-line react-hooks/exhaustive-deps


  const handleAccept = async (menteeId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/mentors/${mentorId}/mentees/${menteeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'active' })
      });
      if (res.ok) {
        toast.success("Request accepted!");
        fetchData(); // Refresh data
      } else {
        toast.error("Failed to accept request");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error accepting request");
    }
  };

  const handleReject = async (menteeId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/mentors/${mentorId}/mentees/${menteeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'rejected' })
      });
      if (res.ok) {
        toast.success("Request rejected");
        fetchData();
      } else {
        toast.error("Failed to reject");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-0">

      {/* Page Title */}
      <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">
        Dashboard Overview
      </h1>

      {/* --- Statistics Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl transition duration-300 hover:shadow-2xl border border-gray-100 dark:border-gray-700"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{stat.title}</h3>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className={`mt-2 text-5xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* --- Main Content Layout --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (Mentees + Requests) - Takes 2/3 space */}
        <div className="lg:col-span-2 space-y-6">
          <MenteesCard mentees={activeMentees} />

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Recent Requests</h2>
            {pendingRequests.length === 0 ? (
              <p className="text-gray-500 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">No pending requests.</p>
            ) : (
              pendingRequests.map(req => (
                <RequestCard
                  key={req.mentee_id}
                  request={req}
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              ))
            )}
          </div>
        </div>

        {/* Right Column (Calendar) - Takes 1/3 space */}
        <div className="lg:col-span-1">
          <Calendar sessions={sessions} />
        </div>
      </div>
    </div>
  )
}

export default Overview;