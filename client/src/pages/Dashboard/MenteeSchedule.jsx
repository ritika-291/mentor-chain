import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const MenteeSchedule = () => {
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mentorsMap, setMentorsMap] = useState({});

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const menteeId = user.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Mentors for Name Mapping
        const mRes = await fetch('http://localhost:5000/api/mentors', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const nameMap = {};
        if (mRes.ok) {
          const allMentors = await mRes.json();
          allMentors.forEach(m => {
            // Map user_id to name (or id if user_id not explicit, but usually id in api list is profile id which maps to user_id)
            // Let's assume m.id is the User ID for simplicity as per previous logic
            nameMap[m.id] = m.name || m.username || `Mentor #${m.id}`;
          });
          setMentorsMap(nameMap);
        }

        // 2. Fetch Sessions
        const sRes = await fetch(`http://localhost:5000/api/sessions/mentee/${menteeId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (sRes.ok) {
          const data = await sRes.json();
          const sessions = data.sessions || [];

          const now = new Date();
          const upcoming = [];
          const past = [];

          sessions.forEach(session => {
            const start = new Date(session.start_time);
            const sessionData = {
              id: session.id,
              mentorId: session.mentor_id,
              date: start.toLocaleDateString(),
              time: start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              topic: session.notes || 'Mentorship Session', // Using notes as topic/title
              status: session.status,
              rawDate: start
            };

            if (start > now && session.status !== 'cancelled') {
              upcoming.push(sessionData);
            } else if (session.status === 'completed' || start <= now) {
              past.push(sessionData); // Include cancelled? Maybe separate or strictly past/completed.
            }
          });

          setUpcomingSessions(upcoming.sort((a, b) => a.rawDate - b.rawDate));
          setPastSessions(past.sort((a, b) => b.rawDate - a.rawDate)); // Descending for past
        }
      } catch (e) {
        console.error(e);
        toast.error("Failed to load schedule");
      } finally {
        setLoading(false);
      }
    };

    if (menteeId) fetchData();
  }, [menteeId, token]);

  // Reusable Session Card Component
  const SessionCard = ({ session, type }) => (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-full border-l-4 border-indigo-500">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white truncate pr-2">{session.topic}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${session.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
            {session.status}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-1"><span className="font-medium">Mentor:</span> {mentorsMap[session.mentorId] || `Mentor #${session.mentorId}`}</p>
        <p className="text-gray-600 dark:text-gray-400"><span className="font-medium">Date:</span> {session.date} at {session.time}</p>
      </div>
      <div className="mt-4 flex justify-end">
        {type === 'upcoming' && (
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-150 text-sm">
            Join Meeting
          </button>
        )}
        {type === 'past' && (
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors duration-150 text-sm">
            Feedback
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 p-4 md:p-0">

      {/* Page Header */}
      <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-4">
        🗓️ My Sessions
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Manage your upcoming and past mentoring sessions.
      </p>

      {/* --- Upcoming Sessions Section --- */}
      <section className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-6 border-b pb-3 border-gray-200 dark:border-gray-700">
          Upcoming Sessions
        </h2>
        {loading ? <p>Loading...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map(session => (
                <SessionCard key={session.id} session={session} type="upcoming" />
              ))
            ) : (
              <p className="text-gray-700 dark:text-gray-300 col-span-full text-center py-4">No upcoming sessions. Wait for your mentor to schedule one!</p>
            )}
          </div>
        )}
      </section>

      {/* --- Past Sessions Section --- */}
      <section className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-6 border-b pb-3 border-gray-200 dark:border-gray-700">
          Past Sessions
        </h2>
        {loading ? <p>Loading...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastSessions.length > 0 ? (
              pastSessions.map(session => (
                <SessionCard key={session.id} session={session} type="past" />
              ))
            ) : (
              <p className="text-gray-700 dark:text-gray-300 col-span-full text-center py-4">No past sessions to display.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default MenteeSchedule;