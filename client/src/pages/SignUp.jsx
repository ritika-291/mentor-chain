import React, { useState } from 'react';
import Role from '../components/LoginCom/Role';
import SignupForm from '../components/Signup/SignupForm';
import { Link } from 'react-router-dom';

const SignUp = () => {
    const [role, setRole] = useState("Mentee");
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
            <div className="w-full max-w-md p-6 space-y-6 bg-gray-800 rounded-2xl shadow-2xl">
                <div className="flex flex-col items-center">
                    <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 mb-6">
                        Create an Account
                    </h1>
                    <Role selectedRole={role} setSelectedRole={setRole} />
                </div>
                <SignupForm role={role} />
                <p className="text-center text-gray-400 text-sm">
                    Already have an account? 
                    <Link to="/login" className="ml-1 font-medium text-teal-400 hover:underline">
                        Log in
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default SignUp;