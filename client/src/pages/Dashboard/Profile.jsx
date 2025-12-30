import React, { useState, useEffect } from 'react';

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

        const response = await fetch('http://localhost:5000/api/profile/me', {
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
              ? `http://localhost:5000${data.profile.avatar_url}`
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

        const avatarResponse = await fetch('http://localhost:5000/api/profile/me/avatar', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (avatarResponse.ok) {
          const avatarData = await avatarResponse.json();
          setAvatarUrl(`http://localhost:5000${avatarData.avatar_url}`);
          setAvatarFile(null);
        } else {
          throw new Error('Failed to upload profile picture');
        }
      }

      // Update profile data
      const expertiseArray = expertise ? expertise.split(',').map(e => e.trim()).filter(e => e) : [];

      const response = await fetch('http://localhost:5000/api/profile/me', {
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

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      const token = getAuthToken();
      const response = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword: currentPassword,
          newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(data.message || 'Failed to change password');
      }
    } catch (err) {
      console.error('Error changing password:', err);
      setError('Failed to change password. Please try again.');
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
      <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">
        👤 Profile Settings
      </h1>

      {message && (
        <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">
          {message}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-6 border-b pb-3 border-gray-200 dark:border-gray-700">
          Personal Information
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Upload */}
          <div className="flex items-center space-x-6 pb-4 border-b border-gray-100 dark:border-gray-700">
            <img
              className="h-24 w-24 rounded-full object-cover ring-4 ring-indigo-300 dark:ring-indigo-600 shadow-lg"
              src={avatarUrl || 'https://via.placeholder.com/150'}
              alt="Current Profile"
            />
            <div>
              <label htmlFor="file-upload" className="cursor-pointer inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-150">
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
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, up to 5MB.
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={profile?.email || ''}
              readOnly
              className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-gray-100 dark:bg-gray-700 dark:text-white cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="expertise" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Expertise (comma-separated)
            </label>
            <input
              type="text"
              id="expertise"
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
              placeholder="e.g., Full-Stack Development, React, Node.js"
              className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
              className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bio / Introduction
            </label>
            <textarea
              id="bio"
              rows="4"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            ></textarea>
          </div>

          {/* Availability/Schedule Link */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Availability
            </label>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Manage and update your mentorship schedule and available hours.
            </p>
            <a href="/mentor/schedule" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 font-medium transition duration-150">
              Go to Schedule Management &rarr;
            </a>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 px-4 border border-transparent rounded-lg shadow-xl text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>

        {/* Section: Security and Password */}
        <div className="pt-8 mt-8 border-t border-gray-100 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-6 border-b pb-3 border-gray-200 dark:border-gray-700">
            Security
          </h3>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                id="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3 px-4 border border-transparent rounded-lg shadow-xl text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all duration-150"
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;