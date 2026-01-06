import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import mentorDetailsData from '../data/MentorDetailsData';
import { API_URL } from '../config/api';

const MentorProfileDetail = () => {
  const { mentorId } = useParams();

  const [mentor, setMentor] = useState(null);

  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('none'); // 'none', 'requested', 'active'
  const [connectLoading, setConnectLoading] = useState(false);

  // Scheduling State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [scheduleLoading, setScheduleLoading] = useState(false);

  const handleScheduleClick = () => {
    if (connectionStatus !== 'active') {
      alert("You must be connected with this mentor to schedule a session.");
      return;
    }
    setShowScheduleModal(true);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    setScheduleLoading(true);

    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const user = JSON.parse(userStr || '{}');

    if (!user.id || !token) {
      alert("Please login to schedule.");
      setScheduleLoading(false);
      return;
    }

    // Combine date and time
    const startDateTime = new Date(`${sessionDate}T${sessionTime}`);
    // Check valid date
    if (isNaN(startDateTime.getTime())) {
      alert("Invalid date or time.");
      setScheduleLoading(false);
      return;
    }

    const payload = {
      mentor_id: mentor.id.replace('real-', ''), // Ensure we use the raw ID
      mentee_id: user.id,
      start_time: startDateTime.toISOString(),
      duration: 60, // Default 1 hour
      notes: sessionNotes
    };

    try {
      const res = await fetch(`${API_URL}/api/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        alert("Session scheduled successfully!");
        setShowScheduleModal(false);
        setSessionDate('');
        setSessionTime('');
        setSessionNotes('');
      } else {
        alert(data.message || "Failed to schedule session.");
      }
    } catch (err) {
      console.error("Scheduling error:", err);
      alert("Error scheduling session.");
    } finally {
      setScheduleLoading(false);
    }
  };

  useEffect(() => {
    const fetchMentor = async () => {
      setLoading(true);

      // Determine user role and ID
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const isMentee = user && user.role === 'mentee';
      const token = localStorage.getItem('token');

      // Check if it's a real mentor (based on ID prefix)
      if (typeof mentorId === 'string' && mentorId.startsWith('real-')) {
        const realId = mentorId.replace('real-', '');
        try {
          console.log(`Fetching from API: ${API_URL}/api/mentors/${realId}/profile`);
          const response = await fetch(`${API_URL}/api/mentors/${realId}/profile`);

          if (response.ok) {
            const data = await response.json();
            console.log("Fetched real mentor data:", data);

            // Handle potential missing profile object
            const profile = data.profile || {};
            const userData = data.user || {};

            // Safely parse expertise
            let safeExpertise = [];
            if (Array.isArray(profile.expertise)) {
              safeExpertise = profile.expertise;
            } else if (typeof profile.expertise === 'string') {
              try {
                // Try parsing as JSON first (e.g. "[\"React\",\"Node\"]")
                const parsed = JSON.parse(profile.expertise);
                if (Array.isArray(parsed)) safeExpertise = parsed;
                else safeExpertise = profile.expertise.split(',').map(s => s.trim());
              } catch (e) {
                // Fallback to comma separation
                safeExpertise = profile.expertise.split(',').map(s => s.trim());
              }
            }

            setMentor({
              id: mentorId,
              name: userData.username || 'Unknown Mentor',
              title: safeExpertise[0] ? `${safeExpertise[0]} Expert` : 'Mentor',
              expertise: safeExpertise,
              bio: profile.bio || "No bio available.",
              image: profile.avatar_url ? `${API_URL}${profile.avatar_url}` : 'https://via.placeholder.com/150',
              rating: profile.rating || 5.0,
              availability_status: profile.availability_status === 'available' ? 'High' : (profile.availability_status === 'busy' ? 'Low' : 'Medium'),
              reviews: profile.reviews_count || 0
            });
          } else {
            console.error("Failed to fetch real mentor profile. Status:", response.status);
            setMentor(null);
          }
        } catch (error) {
          console.error("Error fetching real mentor:", error);
          setMentor(null);
        }
      } else {
        // Fallback to dummy data
        const foundMentor = mentorDetailsData.find(m => m.id === parseInt(mentorId));
        setMentor(foundMentor);
      }
      setLoading(false);

      // Fetch connection status if mentee
      if (isMentee && mentorId.startsWith('real-')) {
        const realId = mentorId.replace('real-', '');
        try {
          const res = await fetch(`${API_URL}/api/mentors/${realId}/mentees/status`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setConnectionStatus(data.status || 'none');
          }
        } catch (err) {
          console.error("Error fetching connection status:", err);
        }
      }
    };

    fetchMentor();
  }, [mentorId]);

  const handleConnect = async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      alert("Please login to connect.");
      return;
    }
    const token = localStorage.getItem('token');
    if (!mentorId.startsWith('real-')) {
      alert("Cannot connect to demo mentors. Please choose a real mentor.");
      return;
    }

    const realId = mentorId.replace('real-', '');
    setConnectLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/mentors/${realId}/mentees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (res.ok) {
        setConnectionStatus('requested');
        // toast.success("Request sent!"); // Access toaster if available
        alert("Connection request sent successfully!");
      } else {
        alert(data.message || "Failed to send request.");
      }
    } catch (err) {
      console.error("Connection error:", err);
      alert("Error sending request.");
    } finally {
      setConnectLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!mentor) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-700 dark:text-gray-300">
        Mentor not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto p-4 max-w-5xl">
          <h1 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-600 drop-shadow-sm">
            {mentor.name}'s Profile
          </h1>

          <div className="bg-gray-800 shadow-2xl rounded-xl p-8 border border-gray-700">
            <div className="flex flex-col md:flex-row items-center md:items-start mb-8 border-b border-gray-700 pb-8">
              <img
                src={mentor.image}
                alt={mentor.name}
                className="w-40 h-40 rounded-full object-cover ring-4 ring-teal-600 shadow-xl mb-6 md:mb-0 md:mr-10"
              />
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-white mb-2">{mentor.name}</h2>
                <p className="text-xl font-medium text-teal-400 mb-2">{mentor.title}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                  {mentor.expertise.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm font-medium border border-gray-600">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="prose prose-invert max-w-none mb-10">
              <h3 className="text-2xl font-bold text-white mb-4">About</h3>
              <p className="text-gray-300 text-lg leading-relaxed">{mentor.bio}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                  <span className="mr-2">📅</span> Availability
                </h3>
                <p className={`text-lg font-semibold ${mentor.availability_status === 'High' ? 'text-green-400' :
                  mentor.availability_status === 'Low' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                  {mentor.availability_status}
                </p>
              </div>
              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                  <span className="mr-2">⭐</span> Rating
                </h3>
                <div className="flex items-center text-yellow-400 text-xl font-bold">
                  {mentor.rating} <span className="text-gray-400 text-base font-normal ml-2">({mentor.reviews} reviews)</span>
                </div>
              </div>
            </div>

            {/* Booking Section */}
            <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col items-center justify-center text-center">
              <h3 className="text-3xl font-bold text-white mb-6">Ready to start?</h3>
              <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
                <button
                  onClick={handleScheduleClick}
                  className={`flex-1 px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white rounded-xl text-lg font-bold shadow-lg transition-all transform hover:-translate-y-1 ${connectionStatus !== 'active' ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}>
                  Schedule a Session
                </button>

                {/* Connect / Contact Button */}
                <div className="flex-1">
                  {connectionStatus === 'active' ? (
                    <a
                      href={`mailto:${mentor.email}`}
                      className="block w-full px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl text-lg font-bold shadow-lg transition-all transform hover:-translate-y-1"
                    >
                      Contact via Email ✉️
                    </a>
                  ) : connectionStatus === 'requested' ? (
                    <button
                      disabled
                      className="block w-full px-8 py-4 bg-gray-600 text-gray-300 rounded-xl text-lg font-bold cursor-not-allowed border border-gray-500"
                    >
                      Request Sent 🕒
                    </button>
                  ) : (
                    <button
                      onClick={handleConnect}
                      disabled={connectLoading}
                      className={`block w-full px-8 py-4 ${connectLoading ? 'bg-indigo-500' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-xl text-lg font-bold shadow-lg transition-all transform hover:-translate-y-1`}
                    >
                      {connectLoading ? 'Sending...' : 'Connect with Mentor 🚀'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Session Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
            <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-md p-6 transform transition-all duration-300 scale-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Schedule Session</h2>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleScheduleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Time</label>
                  <input
                    type="time"
                    required
                    value={sessionTime}
                    onChange={(e) => setSessionTime(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Topic / Notes</label>
                  <textarea
                    placeholder="What do you want to discuss?"
                    required
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all h-24 resize-none"
                  ></textarea>
                </div>

                {/* Status Message used for feedback inside modal if needed, or rely on alerts */}

                <button
                  type="submit"
                  disabled={scheduleLoading}
                  className={`w-full py-3 rounded-xl font-bold text-lg shadow-lg transform hover:-translate-y-1 transition-all ${scheduleLoading
                    ? 'bg-gray-600 cursor-not-allowed text-gray-300'
                    : 'bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white'
                    }`}
                >
                  {scheduleLoading ? 'Scheduling...' : 'Confirm Session'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MentorProfileDetail;
