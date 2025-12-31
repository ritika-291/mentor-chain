import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import mentorDetailsData from '../data/MentorDetailsData';

const MentorProfileDetail = () => {
  const { mentorId } = useParams();

  const [mentor, setMentor] = useState(null);

  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('none'); // 'none', 'requested', 'active'
  const [connectLoading, setConnectLoading] = useState(false);

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
          console.log(`Fetching from API: http://localhost:5000/api/mentors/${realId}/profile`);
          const response = await fetch(`http://localhost:5000/api/mentors/${realId}/profile`);

          if (response.ok) {
            const data = await response.json();
            console.log("Fetched real mentor data:", data);

            // Handle potential missing profile object
            const profile = data.profile || {};
            const user = data.user || {};

            setMentor({
              id: mentorId,
              name: user.username || 'Unknown Mentor',
              title: profile.expertise && profile.expertise[0] ? `${profile.expertise[0]} Expert` : 'Mentor',
              expertise: profile.expertise || [],
              bio: profile.bio || "No bio available.",
              image: profile.avatar_url ? `http://localhost:5000${profile.avatar_url}` : 'https://via.placeholder.com/150',
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
          const res = await fetch(`http://localhost:5000/api/mentors/${realId}/mentees/status`, {
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
      const res = await fetch(`http://localhost:5000/api/mentors/${realId}/mentees`, {
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
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-white">{mentor.name}'s Profile</h1>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <div className="flex items-center mb-6">
          <img
            src={mentor.image}
            alt={mentor.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500 mr-6"
          />
          <div>
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">{mentor.name}</h2>
            <p className="text-indigo-600 dark:text-indigo-400 text-lg">{mentor.title}</p>
            <p className="text-gray-600 dark:text-gray-400">{mentor.expertise.join(', ')}</p>
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{mentor.bio}</p>

        {/* Example sections - you can expand these */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">Availability</h3>
            <p className="text-gray-700 dark:text-gray-300">{mentor.availability_status}</p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">Rating</h3>
            <p className="text-yellow-500 text-lg">{'⭐'.repeat(Math.round(mentor.rating))} {mentor.rating} ({mentor.reviews} reviews)</p>
          </div>
        </div>

        {/* Booking Section - Placeholder */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Book a Session</h3>
          <div className="flex gap-4">
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-indigo-700 transition duration-300">
              Schedule a Session with {mentor.name}
            </button>

            {/* Connect / Contact Button */}
            <div className="mt-8 flex justify-center">
              {connectionStatus === 'active' ? (
                <a
                  href={`mailto:${mentor.email}`}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105"
                >
                  Contact via Email ✉️
                </a>
              ) : connectionStatus === 'requested' ? (
                <button
                  disabled
                  className="bg-gray-400 text-white font-bold py-3 px-8 rounded-full shadow-lg cursor-not-allowed"
                >
                  Request Sent 🕒
                </button>
              ) : (
                <button
                  onClick={handleConnect}
                  disabled={connectLoading}
                  className={`${connectLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                    } text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105`}
                >
                  {connectLoading ? 'Sending...' : 'Connect with Mentor 🚀'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorProfileDetail;
