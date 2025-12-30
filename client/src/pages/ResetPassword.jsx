import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Password from '../components/LoginCom/Password';

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Password has been reset successfully.');
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.message || 'Invalid or expired reset token. Please request a new one.');
      }
    } catch (error) {
      console.error('Error during password reset:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] selection:bg-teal-500/30">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      <div className="relative w-full max-w-md px-6 py-12 bg-gray-900/50 border border-gray-800 backdrop-blur-xl rounded-3xl shadow-2xl">
        <div className="flex flex-col items-center space-y-8">
          
          {/* Header Section */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Reset Password
            </h1>
            <p className="text-gray-400 text-sm">
              Enter your new password below.
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div>
              <Password 
                value={password} 
                onChange={setPassword}
                label="New Password"
              />
            </div>

            <div>
              <Password 
                value={confirmPassword} 
                onChange={setConfirmPassword}
                label="Confirm New Password"
              />
            </div>

            {message && (
              <div className="p-4 bg-teal-500/20 border border-teal-500/50 rounded-lg text-teal-400 text-sm">
                {message}
                <p className="mt-2 text-xs">Redirecting to login page...</p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold shadow-lg transform transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          {/* Footer Section */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              <Link to="/login" className="font-medium text-teal-400 hover:text-teal-300 transition-colors">
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
