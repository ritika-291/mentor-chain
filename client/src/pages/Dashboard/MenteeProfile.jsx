import React, { useState, useEffect } from 'react';

const MenteeProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Form state
  const [username, setUsername] = useState('');
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Available learning goal options
  const learningGoalOptions = [
    'Web Development',
    'Frontend Development',
    'Backend Development',
    'Full-Stack Development',
    'Software Development Engineer (SDE)',
    'Data Analyst',
    'Data Scientist',
    'Business Management',
    'Project Management',
    'Product Management',
    'UI/UX Design',
    'Mobile Development',
    'DevOps',
    'Cloud Computing',
    'Cybersecurity',
    'Machine Learning',
    'Artificial Intelligence',
    'Digital Marketing',
    'Content Writing',
    'Graphic Design',
    'Database Administration',
    'System Administration'
  ];

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
          console.log('Profile data received:', data); // Debug log
          setProfile(data);
          setUsername(data.username || '');

          // Initialize avatar URL if stored
          if (data.profile && data.profile.avatar_url) {
            setAvatarUrl(`http://localhost:5000${data.profile.avatar_url}`);
          }

          // Initialize selected goals if stored in backend
          if (data.profile && data.profile.goals) {
            // Handle both array and string (in case it's stored as JSON string)
            const goalsArray = Array.isArray(data.profile.goals)
              ? data.profile.goals
              : (typeof data.profile.goals === 'string' ? JSON.parse(data.profile.goals) : []);
            console.log('Loaded goals from backend:', goalsArray); // Debug log
            setSelectedGoals(goalsArray);
          } else {
            console.log('No goals found in profile data'); // Debug log
            setSelectedGoals([]);
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

  // Toggle learning goal selection
  const toggleGoal = (goal) => {
    setSelectedGoals(prev => {
      if (prev.includes(goal)) {
        return prev.filter(g => g !== goal);
      } else {
        return [...prev, goal];
      }
    });
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
          const newAvatarUrl = `http://localhost:5000${avatarData.avatar_url}`;
          setAvatarUrl(newAvatarUrl);
          setAvatarFile(null);
          // Store avatar URL in profile state for navbar access
          setProfile(prev => ({
            ...prev,
            profile: {
              ...prev?.profile,
              avatar_url: avatarData.avatar_url
            }
          }));
        } else {
          throw new Error('Failed to upload profile picture');
        }
      }

      // Update profile data
      const response = await fetch('http://localhost:5000/api/profile/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          goals: selectedGoals // Send goals array to backend
        })
      });

      if (response.ok) {
        setMessage('Profile updated successfully!');
        // Update profile state with new goals
        setProfile(prev => ({
          ...prev,
          profile: {
            ...prev?.profile,
            goals: selectedGoals
          }
        }));
        setTimeout(() => {
          setMessage('');
          // Refresh to show updated data
          window.location.reload();
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
      <div className="space-y-8 p-4 md:p-0">
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-0">
      <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">
        👤 My Profile
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
          {/* Profile Picture Upload - Before Full Name */}
          <div className="flex items-center space-x-6 pb-4 border-b border-gray-100 dark:border-gray-700">
            <div className="relative">
              <img
                className="h-24 w-24 rounded-full object-cover ring-4 ring-indigo-300 dark:ring-indigo-600 shadow-lg"
                src={avatarUrl || 'https://via.placeholder.com/150/6366f1/ffffff?text=M'}
                alt="Current Profile"
              />
              <label
                htmlFor="profile-picture-upload"
                className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors shadow-lg"
                title="Change Profile Picture"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </label>
              <input
                id="profile-picture-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Profile Picture</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, up to 5MB. Click the icon to change.
              </p>
            </div>
          </div>

          {/* Form Fields: Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>

          {/* Section: Learning Goals with Tags/Chips */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
              Learning Goals
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Select your areas of interest and learning goals (click to add/remove)
            </p>

            {/* Selected Goals Display */}
            {selectedGoals.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selected Goals:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedGoals.map((goal) => (
                    <span
                      key={goal}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                    >
                      {goal}
                      <button
                        type="button"
                        onClick={() => toggleGoal(goal)}
                        className="ml-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Available Goals Options */}
            <div className="flex flex-wrap gap-2">
              {learningGoalOptions.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => toggleGoal(goal)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedGoals.includes(goal)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button for Profile */}
          <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
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

export default MenteeProfile;