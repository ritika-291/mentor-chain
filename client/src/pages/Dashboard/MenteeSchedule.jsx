import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { API_URL } from '../../config/api';

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
        const mRes = await fetch(`${API_URL}/api/mentors`, {
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
        const sRes = await fetch(`${API_URL}/api/sessions/mentee/${menteeId}`, {
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
    <div className="bg-gray-800 p-5 rounded-lg shadow-md border border-gray-700 flex flex-col justify-between h-full border-l-4 border-teal-500 hover:shadow-xl transition-shadow">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-white truncate pr-2">{session.topic}</h3>
          <span className={`text-xs px-2 py-1 rounded-full font-bold ${session.status === 'accepted' ? 'bg-green-900/40 text-green-300 border border-green-800' : 'bg-gray-700 text-gray-300'
            }`}>
            {session.status.toUpperCase()}
          </span>
        </div>
        <p className="text-gray-400 mb-1"><span className="font-medium text-gray-300">Mentor:</span> {mentorsMap[session.mentorId] || `Mentor #${session.mentorId}`}</p>
        <p className="text-gray-400"><span className="font-medium text-gray-300">Date:</span> {session.date} at {session.time}</p>
      </div>
      <div className="mt-4 flex justify-end">
        {type === 'upcoming' && (
          <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-150 text-sm font-bold shadow-md">
            Join Meeting
          </button>
        )}
        {type === 'past' && (
          <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors duration-150 text-sm font-medium">
            Feedback
          </button>
        )}
      </div>
    </div>
  );

  // Calendar Logic
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const today = new Date();

    const days = [];
    // Empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-4 border border-gray-700 bg-gray-800/50"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = new Date(year, month, day).toLocaleDateString();
      // Check for sessions on this day
      const sessionsOnDay = upcomingSessions.filter(s => s.date === dateStr);
      const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

      days.push(
        <div key={day} className={`p-4 border border-gray-700 min-h-[100px] relative transition-colors hover:bg-gray-700/50 ${isToday ? 'bg-gray-700/80 ring-1 ring-teal-500' : 'bg-gray-800'}`}>
          <span className={`text-sm font-bold ${isToday ? 'text-teal-400' : 'text-gray-400'}`}>{day}</span>
          {sessionsOnDay.map((session, idx) => (
            <div key={idx} className="mt-2 p-1 bg-teal-900/50 border border-teal-700/50 rounded text-xs text-teal-200 truncate" title={`${session.time} - ${session.topic}`}>
              {session.time}
            </div>
          ))}
        </div>
      );
    }
    return days;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="space-y-8 p-4 md:p-0">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-600 mb-2 drop-shadow-sm">
            🗓️ My Schedule
          </h1>
          <p className="text-lg text-gray-400">
            Manage your sessions with your mentors.
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-lg flex items-center justify-between min-w-[300px]">
          <button onClick={handlePrevMonth} className="text-gray-400 hover:text-white p-2 text-xl">‹</button>
          <span className="text-xl font-bold text-white">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
          <button onClick={handleNextMonth} className="text-gray-400 hover:text-white p-2 text-xl">›</button>
        </div>
      </div>

      {/* --- Calendar Grid View --- */}
      <section className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
        <div className="grid grid-cols-7 bg-gray-800 border-b border-gray-700">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="p-4 text-center font-bold text-gray-400 uppercase text-xs tracking-wider">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {renderCalendar()}
        </div>
      </section>

      {/* --- Upcoming Sessions Section --- */}
      <section className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6 border-b pb-3 border-gray-700 flex items-center">
          <span className="mr-2">🚀</span> Upcoming Sessions
        </h2>
        {loading ? <p className="text-gray-400">Loading...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map(session => (
                <SessionCard key={session.id} session={session} type="upcoming" />
              ))
            ) : (
              <p className="text-gray-400 col-span-full text-center py-4 bg-gray-700/30 rounded-lg">No upcoming sessions. Schedule one with a mentor!</p>
            )}
          </div>
        )}
      </section>

      {/* --- Past Sessions Section --- */}
      <section className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6 border-b pb-3 border-gray-700 flex items-center">
          <span className="mr-2">📜</span> Past Sessions
        </h2>
        {loading ? <p className="text-gray-400">Loading...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastSessions.length > 0 ? (
              pastSessions.map(session => (
                <SessionCard key={session.id} session={session} type="past" />
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center py-4">No past sessions to display.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default MenteeSchedule;