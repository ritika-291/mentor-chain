import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MentorFields from '../Role/mentor/MentorField';
import MenteeFields from '../Role/mentee/MenteeField';
import Password from '../LoginCom/Password';
import InputField from '../LoginCom/InputField';
import { API_URL } from '../../config/api';

const SignupForm = ({ role }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        fullName: "",
        expertise: "",
        experience: "",
        portfolio: "",
        bio: "",
        currentRole: "",
        interest: "",
        goals: ""
    });
    const navigate = useNavigate();

    const handleChange = (eOrValue) => {
        // Handle both event objects (from InputField) and direct values (from Password component)
        if (eOrValue && eOrValue.target) {
            setFormData({ ...formData, [eOrValue.target.name]: eOrValue.target.value });
        } else {
            // For Password component which might still return just value, or if we want to support it
            // But Password component usually doesn't have a name prop in this repo's pattern?
            // Let's check Password component. It usually takes onChange={setPassword}.
            // We'll update Password usage to be specific.
        }
    };

    // Specific handlers for Email/Password if they need to stay simple or adapter
    const handleEmailChange = (e) => setFormData({ ...formData, email: e.target.value });
    const handlePasswordChange = (val) => setFormData({ ...formData, password: val });


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const bodyData = {
                email: formData.email,
                password: formData.password,
                role: role,
                username: formData.fullName || formData.email, // Use Full Name as username
                // Mentor specific
                bio: formData.bio,
                expertise: formData.expertise,
                // Mentee specific
                goals: formData.goals ? formData.goals.split(',').map(g => g.trim()) : []
            };


            console.log('Raw response from backend:', response); // Log the raw response

            const data = await response.json();
            console.log('Parsed data from backend:', data); // Log the parsed data

            if (response.ok) {
                console.log('Signup successful:', data);
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
                console.error('Signup failed:', data.message || 'Something went wrong');
                alert(data.message || 'Signup failed!');
            }
        } catch (error) {
            console.error('Network or parsing error during signup:', error); // More specific error message
            alert('Server connection error or response parsing issue. Please check console for details.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleEmailChange}
            />
            <Password
                value={formData.password}
                onChange={handlePasswordChange}
            />
            {role === "Mentor" ? (
                <MentorFields formData={formData} handleChange={handleChange} />
            ) : (
                <MenteeFields formData={formData} handleChange={handleChange} />
            )}
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