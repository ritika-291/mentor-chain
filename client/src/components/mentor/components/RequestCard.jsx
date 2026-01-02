// RequestCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';

export default function RequestCard({ request, onAccept, onReject }) {
  // Use passed request prop or fallback (though fallback shouldn't be needed with real data)
  const { mentee_id, name, expertise, bio, created_at, status, username, email } = request || {};

  // Format date if needed
  const dateStr = created_at ? new Date(created_at).toLocaleDateString() : 'Unknown date';

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg transition duration-300 hover:shadow-teal-500/10 border border-gray-700">

      {/* Header and Title */}
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center justify-between">
        Mentorship Request 📧
        <span className="text-sm font-normal text-gray-400">{dateStr}</span>
      </h2>

      {/* Request Details */}
      <div className="p-4 bg-gray-700 rounded-lg space-y-3">

        <p className="text-xl font-semibold text-teal-400">
          {name || username || 'Unknown User'}
        </p>

        <p className="text-sm text-gray-300">
          Status: <span className="font-medium text-white capitalize">{status}</span>
        </p>

        <p className="text-sm text-gray-300">
          Email: <a href={`mailto:${email}`} className="text-teal-400 hover:underline">{email}</a>
        </p>

        {/* Expertise/Bio - assuming these fields exist on the user or passed separately */}
        {/* Since the API listMentees only returns basic info, we might not have bio/expertise here unless we join more tables or fetch it.
            For now, we'll display what we have. */}

        <div className="text-base text-gray-200 border-t border-gray-600 pt-3">
          <Link to={`/mentee/${mentee_id}`} className="text-teal-400 hover:text-teal-300 font-medium">
            View Profile &rarr;
          </Link>
        </div>
      </div>

      {/* Action Buttons */}
      {status === 'requested' && (
        <div className="flex space-x-4 mt-6">
          <button
            onClick={() => onAccept(mentee_id)}
            className="flex-1 py-3 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-150 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800">
            Accept
          </button>
          <button
            onClick={() => onReject(mentee_id)}
            className="flex-1 py-3 px-4 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-150 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800">
            Reject
          </button>
        </div>
      )}
    </div>
  );
}