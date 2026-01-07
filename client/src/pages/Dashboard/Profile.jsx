import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config/api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Form state
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [expertise, setExpertise] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token') || localStorage.getItem('accessToken');
  };

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          setError('Please login to view your profile');
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/api/profile/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          setUsername(data.username || '');

          if (data.profile) {
            setBio(data.profile.bio || '');
            setExpertise(Array.isArray(data.profile.expertise)
              ? data.profile.expertise.join(', ')
              : (data.profile.expertise || ''));
            setHourlyRate(data.profile.hourly_rate || '');
            setAvatarUrl(data.profile.avatar_url
              ? (data.profile.avatar_url.startsWith('data:') || data.profile.avatar_url.startsWith('http')
                ? data.profile.avatar_url
                : `${API_URL}${data.profile.avatar_url}`)
              : '');
          }
        } else {
          setError('Failed to load profile');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle profile picture selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const token = getAuthToken();

      // Upload avatar first if a new file was selected
      if (avatarFile) {
        const formData = new FormData();
        formData.append('profilePicture', avatarFile);

        const avatarResponse = await fetch(`${API_URL}/api/profile/me/avatar`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (avatarResponse.ok) {
          const avatarData = await avatarResponse.json();
          const avUrl = avatarData.avatar_url;
          setAvatarUrl((avUrl.startsWith('data:') || avUrl.startsWith('http')) ? avUrl : `${API_URL}${avUrl}`);
          setAvatarFile(null);
        } else {
          throw new Error('Failed to upload profile picture');
        }
      }

      // Update profile data
      const expertiseArray = expertise ? expertise.split(',').map(e => e.trim()).filter(e => e) : [];

      const response = await fetch(`${API_URL}/api/profile/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          bio,
          expertise: expertiseArray,
          hourly_rate: hourlyRate ? parseFloat(hourlyRate) : null
        })
      });

      if (response.ok) {
        setMessage('Profile updated successfully!');
        setTimeout(() => {
          setMessage('');
          // Refresh profile data
          window.location.reload(); // Simple refresh, can be optimized
        }, 1500);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };



  if (loading) {
    return (
      <div className="space-y-8 p-4 sm:p-0">
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 sm:p-0">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-600 drop-shadow-sm">
        👤 Profile Settings
      </h1>

      {message && (
        <div className="p-4 bg-green-900/40 border border-green-800 rounded-lg text-green-300 shadow-md">
          {message}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-900/40 border border-red-800 rounded-lg text-red-300 shadow-md">
          {error}
        </div>
      )}

      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6 border-b pb-3 border-gray-700">
          Personal Information
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Upload */}
          <div className="flex items-center space-x-6 pb-4 border-b border-gray-700">
            <img
              className="h-24 w-24 rounded-full object-cover ring-4 ring-teal-600 shadow-lg"
              src={avatarUrl || `https://ui-avatars.com/api/?name=${username}&background=random&size=150`}
              alt="Current Profile"
            />
            <div>
              <label htmlFor="file-upload" className="cursor-pointer inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-teal-600 hover:bg-teal-700 transition-colors duration-150">
                Change Picture
              </label>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
              />
              <p className="mt-1 text-xs text-gray-400">
                PNG, JPG, up to 5MB.
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-600 rounded-xl shadow-sm focus:ring-teal-500 focus:border-teal-500 bg-gray-700 text-white placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={profile?.email || ''}
              readOnly
              className="mt-1 block w-full p-3 border border-gray-600 rounded-xl shadow-sm bg-gray-600 text-gray-300 cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="expertise" className="block text-sm font-medium text-gray-300 mb-1">
              Expertise (comma-separated)
            </label>
            <input
              type="text"
              id="expertise"
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
              placeholder="e.g., Full-Stack Development, React, Node.js"
              className="mt-1 block w-full p-3 border border-gray-600 rounded-xl shadow-sm focus:ring-teal-500 focus:border-teal-500 bg-gray-700 text-white placeholder-gray-400"
            />
          </div>

          <div>
            <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-300 mb-1">
              Hourly Rate ($)
            </label>
            <input
              type="number"
              id="hourlyRate"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              step="0.01"
              min="0"
              placeholder="e.g., 50.00"
              className="mt-1 block w-full p-3 border border-gray-600 rounded-xl shadow-sm focus:ring-teal-500 focus:border-teal-500 bg-gray-700 text-white placeholder-gray-400"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">
              Bio / Introduction
            </label>
            <textarea
              id="bio"
              rows="4"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-600 rounded-xl shadow-sm focus:ring-teal-500 focus:border-teal-500 bg-gray-700 text-white placeholder-gray-400"
            ></textarea>
          </div>

          {/* Availability/Schedule Link */}
          <div className="pt-4 border-t border-gray-700">
            <label className="block text-lg font-medium text-white mb-2">
              Availability
            </label>
            <p className="text-sm text-gray-400 mb-3">
              Manage and update your mentorship schedule and available hours.
            </p>
            <a href="/mentor/schedule" className="inline-flex items-center text-teal-400 hover:text-teal-300 font-medium transition duration-150">
              Go to Schedule Management &rarr;
            </a>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 px-4 border border-transparent rounded-xl shadow-xl text-lg font-bold text-white bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>


      </div>
    </div>
  );
};

export default Profile;