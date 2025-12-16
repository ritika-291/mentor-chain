import React, { useState } from 'react';
import InputField from './InputField';
import Password from './Password';
import { Link, useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("logging in as: ", email, password);
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InputField label="Email" type="email" value={email} onChange={setEmail} />
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