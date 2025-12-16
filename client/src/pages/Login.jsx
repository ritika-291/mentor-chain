import React, { useState } from 'react';
import Role from '../components/LoginCom/Role';
import LoginForm from '../components/LoginCom/LoginForm';

const Login = () => {
  const [role, setRole] = useState("Mentee");
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-sm p-6 space-y-6 bg-gray-800 rounded-2xl shadow-2xl">
        <div className="flex flex-col items-center">
          <div className="w-full text-center py-4 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl mb-6">
            <h2 className="text-3xl font-extrabold text-white">Login to MentorChain</h2>
          </div>
          <Role selectedRole={role} setSelectedRole={setRole} />
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;