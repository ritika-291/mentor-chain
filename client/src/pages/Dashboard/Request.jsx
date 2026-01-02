// Requests.jsx

import React, { useState, useEffect } from 'react';
// Assuming RequestCard is the name of your styled component
import RequestCard from '../../components/mentor/components/RequestCard';

const Requests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [pastRequests, setPastRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get current user (mentor) info
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const token = localStorage.getItem('token');
  const mentorId = user ? user.id : null;

  useEffect(() => {
    if (mentorId) {
      fetchRequests();
    }
  }, [mentorId]);

  const fetchRequests = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/mentors/${mentorId}/mentees`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        console.log('[DEBUG] Fetched requests data:', data);
        // data.mentees is the array
        const all = data.mentees || [];
        setPendingRequests(all.filter(r => r.status === 'requested'));
        setPastRequests(all.filter(r => r.status !== 'requested'));
      } else {
        console.error("Failed to fetch requests");
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

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
        // Refresh list
        fetchRequests();
        alert("Request accepted!");
      } else {
        alert("Failed to accept request.");
      }
    } catch (err) {
      console.error("Error accepting:", err);
    }
  };

  const handleReject = async (menteeId) => {
    if (!window.confirm("Are you sure you want to reject this request?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/mentors/${mentorId}/mentees/${menteeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'inactive' })
      });
      if (res.ok) {
        fetchRequests();
        alert("Request rejected/archived.");
      } else {
        alert("Failed to reject request.");
      }
    } catch (err) {
      console.error("Error rejecting:", err);
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-0">

      {/* Page Header */}
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-600 drop-shadow-sm">
        📧 Mentorship Requests
      </h1>

      {/* --- Pending Requests Section --- */}
      <h2 className="text-3xl font-bold text-teal-400 border-b pb-2 border-gray-700">
        Pending ( {pendingRequests.length} )
      </h2>

      {pendingRequests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pendingRequests.map(request => (
            <RequestCard
              key={request.mentee_id}
              request={request}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-gray-800 rounded-xl shadow-lg border border-gray-700">
          <p className="text-xl font-medium text-gray-300">
            🎉 Great job! You currently have no pending mentorship requests.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            New requests will appear here when mentees seek your expertise.
          </p>
        </div>
      )}

      {/* --- Past Requests/Archive (Optional) --- */}
      <div className="pt-6">
        <h2 className="text-2xl font-bold text-white border-b pb-2 border-gray-700">
          Archived/Past Requests
        </h2>
        <div className="mt-4 bg-gray-800 p-4 rounded-xl shadow-md border border-gray-700">
          <ul className="divide-y divide-gray-700">
            {pastRequests.map(item => (
              <li key={item.mentee_id} className="flex justify-between items-center py-3 text-gray-300 text-sm">
                <span>Request from <strong className="text-teal-400">{item.name || 'User'}</strong></span>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${item.status === 'active' ? 'bg-green-900/40 text-green-300' : 'bg-red-900/40 text-red-300'
                  }`}>
                  {item.status} ({new Date(item.created_at || Date.now()).toLocaleDateString()})
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Requests;