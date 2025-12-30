import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Role from '../components/LoginCom/Role';
import LoginForm from '../components/LoginCom/LoginForm';

const Login = () => {
  const [role, setRole] = useState("Mentee");

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
              Welcome Back
            </h1>
            <p className="text-gray-400 text-sm">
              Enter your credentials to access <span className="text-teal-400 font-medium">MentorChain</span>
            </p>
          </div>

          {/* Role Selection Container */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">I am a:</span>
            </div>
            <Role selectedRole={role} setSelectedRole={setRole} />
          </div>

          {/* Form Section */}
          <div className="w-full">
            <LoginForm role={role} />
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-500">
              <Link to="/forgot-password" className="text-teal-400 hover:text-teal-300 transition-colors">
                Forgot Password?
              </Link>
            </p>
            <p className="text-sm text-gray-500">
              New to the platform?{' '}
              <Link to="/signup" className="text-teal-400 hover:text-teal-300 transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;