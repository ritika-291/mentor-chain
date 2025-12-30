import React, { useState } from 'react';
import Role from '../components/LoginCom/Role';
import SignupForm from '../components/Signup/SignupForm';
import { Link } from 'react-router-dom';

const SignUp = () => {
    const [role, setRole] = useState("Mentee");

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden px-4 selection:bg-teal-500/30">
            
            {/* Background Decorative Elements - Inverted for visual variety */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-700"></div>

            <div className="relative w-full max-w-[480px] bg-gray-900/40 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-[2rem] shadow-2xl">
                
                <div className="flex flex-col items-center space-y-8">
                    {/* Header Section */}
                    <div className="text-center space-y-3">
                        <h1 className="text-4xl font-bold tracking-tight text-white italic">
                            Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 non-italic">MentorChain</span>
                        </h1>
                        <p className="text-gray-400 text-sm max-w-[280px] mx-auto">
                            Start your journey by choosing your role and creating a profile.
                        </p>
                    </div>

                    {/* Role Selection Section */}
                    <div className="w-full space-y-3">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">
                            Identify as
                        </label>
                        <div className="bg-black/20 p-1.5 rounded-2xl border border-white/5">
                            <Role selectedRole={role} setSelectedRole={setRole} />
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="w-full">
                        <SignupForm role={role} />
                    </div>

                    {/* Footer Section */}
                    <div className="pt-4 border-t border-white/5 w-full text-center">
                        <p className="text-gray-400 text-sm">
                            Already have an account? 
                            <Link to="/login" className="ml-2 font-semibold text-teal-400 hover:text-teal-300 transition-all hover:brightness-110">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;