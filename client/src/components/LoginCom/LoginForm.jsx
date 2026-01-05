import React, { useState } from 'react';
import InputField from './InputField';
import Password from './Password';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../../config/api';

const LoginForm = ({ role }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // important to receive httpOnly refresh cookie
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
        // Store token and user data
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        if (role === "Mentor") {
          navigate('/mentor');
        } else {
          navigate('/mentee');
        }
      } else {
        console.error('Login failed:', data.message || 'Something went wrong');
        alert(data.message || 'Login failed!'); // Show an alert for feedback
      }
    } catch (error) {
      console.error('Network or parsing error during login:', error);
      alert('Server connection error or response parsing issue. Please check console for details.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InputField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Password value={password} onChange={setPassword} />
      <button
        type="submit"
        className="w-full py-3 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold shadow-lg transform transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400"
      >
        Login
      </button>
      <p className="text-center text-gray-400 text-sm">
        Don't have an account?
        <Link to="/signup" className="ml-1 font-medium text-teal-400 hover:underline">
          Sign up
        </Link>

      </p>
    </form>
  );
};

export default LoginForm;