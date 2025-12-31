import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [mentees, setMentees] = useState([]); // Active mentees only
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    menteeId: '',
    date: '',
    startTime: '',
    endTime: '',
    notes: ''
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const mentorId = user.id;

  // Fetch Data
  // Fetch Data Wrapper
  const fetchData = async () => {
    try {
      // 1. Fetch Active Mentees
      const mRes = await fetch(`http://localhost:5000/api/mentors/${mentorId}/mentees`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (mRes.ok) {
        const mData = await mRes.json();
        const active = (mData.mentees || []).filter(m => m.status === 'active');
        setMentees(active);
      }

      // 2. Fetch Sessions
      const sRes = await fetch(`http://localhost:5000/api/sessions/mentor/${mentorId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (sRes.ok) {
        const sData = await sRes.json();
        const sorted = (sData.sessions || []).sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
        setSessions(sorted);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mentorId) fetchData();
  }, [mentorId, token]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    const { menteeId, date, startTime, endTime, notes } = formData;

    if (!menteeId || !date || !startTime || !endTime) {
      toast.error("Please fill all required fields");
      return;
    }

    // Construct Date objects
    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);

    if (startDateTime >= endDateTime) {
      toast.error("End time must be after start time");
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/sessions/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          menteeId,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          notes
        })
      }); // Note: POST /schedule logic added to Controller

      const data = await res.json();
      if (res.ok) {
        toast.success("Session Scheduled Successfully!");
        setShowModal(false);
        setFormData({ menteeId: '', date: '', startTime: '', endTime: '', notes: '' });
        fetchData(); // Reload from server
      } else {
        toast.error(data.message || "Scheduling failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  const upcomingParams = sessions.filter(s => new Date(s.start_time) > new Date() && s.status !== 'cancelled');

  return (
    <div className="space-y-8 p-4 sm:p-0">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center">
        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">
          🗓️ Mentorship Schedule
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 md:mt-0 py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg flex items-center gap-2"
        >
          <span>+</span> Schedule New Session
        </button>
      </div>

      {/* --- Main Content Layout --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (Sessions List) - Takes 2/3 space */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 border-b pb-3 border-gray-200 dark:border-gray-700">
              Upcoming Sessions
            </h2>

            {loading ? <p>Loading...</p> : upcomingParams.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No upcoming sessions scheduled.
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingParams.map(session => {
                  // Find mentee name (optimization: store name in session or map from mentees list)
                  // If mentee list is loaded, find it. If user not in list (e.g. inactive now), show ID.
                  const menteeName = mentees.find(m => m.mentee_id === session.mentee_id)?.name || mentees.find(m => m.mentee_id === session.mentee_id)?.username || `Mentee #${session.mentee_id}`;

                  return (
                    <div key={session.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between border-l-4 border-indigo-500">
                      <div>
                        <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{menteeName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(session.start_time).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-300">
                          {new Date(session.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(session.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${session.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          session.status === 'requested' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100'
                          }`}>
                          {session.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Past/Stats or Simple Calendar View) */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 border-b pb-3 border-gray-200 dark:border-gray-700">
              Stats
            </h2>
            <div className="space-y-4">
              <div className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                <p className="text-gray-500 dark:text-gray-300 text-sm">Total Sessions</p>
                <p className="text-3xl font-bold text-indigo-600">{sessions.length}</p>
              </div>
              {/* Can add more stats here */}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Schedule Session</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">&times;</button>
            </div>
            <form onSubmit={handleSchedule} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Mentee</label>
                <select
                  name="menteeId"
                  value={formData.menteeId}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">-- Select Mentee --</option>
                  {mentees.map(m => (
                    <option key={m.mentee_id} value={m.mentee_id}>
                      {m.name || m.username || `Mentee #${m.mentee_id}`}
                    </option>
                  ))}
                </select>
                {mentees.length === 0 && <p className="text-xs text-red-500 mt-1">No active mentees found.</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  rows="3"
                ></textarea>
              </div>

              <div className="flex justify-end pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="mr-3 px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold shadow-md">
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Sessions;