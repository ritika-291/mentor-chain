import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    // 1. Not logged in
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 2. Role check (case-insensitive)
    if (allowedRoles) {
        const userRole = user.role.toLowerCase();
        const allowed = allowedRoles.map(r => r.toLowerCase());

        if (!allowed.includes(userRole)) {
            // Redirect to their own dashboard or home
            const redirectPath = userRole === 'mentor' ? '/mentor/overview' : '/mentee/overview';
            return <Navigate to={redirectPath} replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
