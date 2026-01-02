import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MenteeOverview = () => {
  const [stats, setStats] = useState([
    { title: 'Mentors Matched', value: '0', color: 'text-indigo-600 dark:text-indigo-400', icon: '🧑‍🏫' },
    { title: 'Upcoming Sessions', value: '0', color: 'text-green-600 dark:text-green-400', icon: '🗓️' },
    { title: 'Overall Progress', value: '0.0 ⭐', color: 'text-yellow-600 dark:text-yellow-400', icon: '✨' },
  ]);
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const menteeId = user.id;

  useEffect(() => {
    if (!menteeId) return;

    const fetchData = async () => {
      try {
        // 1. Fetch Mentors & Calculate 'Matched'
        // Note: Currently no direct 'my-mentors' API that returns status cleanly without checking.
        // We fetch all available mentors and check status (expensive but accurate as per current implementation)
        const mentorsRes = await fetch('http://localhost:5000/api/mentors', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        let activeMentorCount = 0;
        if (mentorsRes.ok) {
          const allMentors = await mentorsRes.json();
          // Parallel status check
          const statusChecks = await Promise.all(allMentors.map(async m => {
            try {
              const sRes = await fetch(`http://localhost:5000/api/mentors/${m.id}/mentees/status`, {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              if (sRes.ok) {
                const data = await sRes.json();
                return data.status === 'active';
              }
            } catch (e) { return false; }
            return false;
          }));
          activeMentorCount = statusChecks.filter(Boolean).length;
        }

        // 2. Fetch Sessions
        const sessionsRes = await fetch(`http://localhost:5000/api/sessions/mentee/${menteeId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        let upcomingCount = 0;
        let upcomingList = [];
        if (sessionsRes.ok) {
          const data = await sessionsRes.json();
          const sessions = data.sessions || [];
          const now = new Date();
          const upcoming = sessions.filter(s => new Date(s.start_time) > now && s.status === 'accepted');
          upcomingCount = upcoming.length;
          upcomingList = upcoming.slice(0, 3); // Top 3
          setRecentSessions(sessions.slice(0, 5)); // Show recent 5 for activity feed
        }

        // Update Stats
        setStats([
          { title: 'Mentors Matched', value: activeMentorCount.toString(), color: 'text-indigo-600 dark:text-indigo-400', icon: '🧑‍🏫' },
          { title: 'Upcoming Sessions', value: upcomingCount.toString(), color: 'text-green-600 dark:text-green-400', icon: '🗓️' },
          { title: 'Overall Progress', value: '4.8 ⭐', color: 'text-yellow-600 dark:text-yellow-400', icon: '✨' }, // Dummy for now as progress logic doesn't exist
        ]);

      } catch (e) {
        console.error("Dashboard Fetch Error", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [menteeId, token]);

  // Reusable Stat Card Component
  const StatCard = ({ title, value, color, icon }) => (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg transition duration-300 hover:shadow-xl hover:scale-[1.02] flex flex-col justify-between h-40 border border-gray-700 group hover:border-teal-500/30">
      <div className="flex justify-between items-start">
        <h3 className="text-base font-semibold text-gray-300 group-hover:text-teal-400 transition-colors">{title}</h3>
        <span className="text-2xl opacity-80">{icon}</span>
      </div>
      <p className={`mt-2 text-5xl font-extrabold ${color} drop-shadow-sm`}>{loading ? '...' : value}</p>
    </div>
  );

  return (
    <div className="space-y-8 p-4 md:p-0">

      {/* Page Header */}
      <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-600 border-b pb-2 border-gray-700">
        Dashboard Overview
      </h1>
      <p className="text-lg text-gray-400">
        Welcome back, <span className="text-gray-200 font-semibold">{user.username || 'Mentee'}</span>!
      </p>

      {/* --- Statistics Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* --- Quick Actions & Schedule --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (Quick Actions) - Takes 2/3 space */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-700 pb-3">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                to="/mentors"
                className="p-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-xl text-center font-bold hover:from-teal-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-teal-500/20"
              >
                Find a New Mentor
              </Link>
              <Link
                to="/mentee/schedule"
                className="p-4 bg-gray-700 text-white rounded-xl text-center font-bold hover:bg-gray-600 transition-all shadow-md border border-gray-600"
              >
                View My Schedule
              </Link>
            </div>
          </div>

          {/* Activity Feed based on recent sessions */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-700 pb-3">Recent Activity</h2>
            <ul className="space-y-3 text-gray-300">
              {recentSessions.length === 0 ? (
                <li className="p-3 bg-gray-700/50 rounded-lg text-gray-400">No recent activity.</li>
              ) : (
                recentSessions.map(s => (
                  <li key={s.id} className="p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg flex justify-between transition-colors">
                    <span>
                      Session with Mentor #{s.mentor_id} - <span className={`capitalize font-bold ${s.status === 'accepted' ? 'text-green-400' : 'text-gray-400'}`}>{s.status}</span>
                    </span>
                    <span className="text-sm text-gray-400">
                      {new Date(s.start_time).toLocaleDateString()}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* Right Column (Schedule Widget) - Takes 1/3 space */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-700 pb-3">
              Session Calendar 🗓️
            </h2>

            <div className="p-4 bg-gray-700/30 rounded-lg space-y-4 border border-gray-700">
              {recentSessions.filter(s => new Date(s.start_time) > new Date() && s.status === 'accepted').length === 0 ? (
                <p className="text-center text-gray-500">No upcoming sessions.</p>
              ) : (
                recentSessions.filter(s => new Date(s.start_time) > new Date() && s.status === 'accepted').slice(0, 3).map(s => (
                  <div key={s.id} className="border-l-4 border-green-500 pl-3">
                    <p className="font-bold text-gray-200">
                      {new Date(s.start_time).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(s.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))
              )}

              <div className="border-t border-gray-600 pt-3 text-center">
                <Link to="/mentee/schedule" className="text-indigo-400 hover:text-indigo-300 hover:underline">View All</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenteeOverview;
