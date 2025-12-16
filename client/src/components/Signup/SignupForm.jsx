import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MentorFields from '../Role/mentor/MentorField';
import MenteeFields from '../Role/mentee/MenteeField';
import Password from '../LoginCom/Password';
import InputField from '../LoginCom/InputField';

const SignupForm = ({ role }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log("Signing up as:", role, { email, password });
        // Conditional redirection based on role
        if (role === "Mentor") {
            navigate('/mentor');
        } else {
            navigate('/mentee');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <InputField label="Email" type="email" value={email} onChange={setEmail} />
            <Password value={password} onChange={setPassword} />
            {role === "Mentor" ? <MentorFields /> : <MenteeFields />}
            <button
                type="submit"
                className="w-full py-3 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold shadow-lg transform transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400"
            >
                Sign Up as {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
        </form>
    );
}

export default SignupForm;