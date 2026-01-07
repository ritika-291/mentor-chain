
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { API_URL } from '../config/api';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    // Determine current user role context from URL
    const isMentee = location.pathname.startsWith('/mentee');
    const isMentor = location.pathname.startsWith('/mentor');

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/api/notifications`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const markRead = async (id, relatedId, isRead) => {
        if (!isRead) {
            // Optimistic update
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));

            const token = localStorage.getItem('token');
            try {
                await fetch(`${API_URL}/api/notifications/${id}/read`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } catch (err) { console.error(err); }
        }
    };

    const getLink = (n) => {
        if (n.type === 'message') {
            return isMentee ? '/mentee/messages' : isMentor ? '/mentor/messages' : '/community';
        }
        if (n.type === 'roadmap') {
            // Assuming roadmap URLs follow this pattern
            return isMentee ? `/mentee/roadmaps/${n.related_id}` : `/mentor/roadmaps/${n.related_id}`;
        }
        // Fallback for like/comment/etc
        return '/community';
    };

    return (
        <div className="bg-gray-900 min-h-screen text-white p-8">
            <h1 className="text-3xl font-bold mb-8">Notifications 🔔</h1>

            {loading ? (
                <p>Loading...</p>
            ) : notifications.length > 0 ? (
                <div className="max-w-3xl mx-auto space-y-4">
                    {notifications.map(n => (
                        <Link
                            key={n.id}
                            to={getLink(n)}
                            onClick={() => markRead(n.id, n.related_id, n.is_read)}
                            className={`block p-4 rounded-xl border transition-colors flex items-center justify-between
                                ${n.is_read ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-gray-800 border-teal-500/50 text-white shadow-lg shadow-teal-500/10'}`}
                        >
                            <div className="flex items-center space-x-4">
                                <div className={`w-2 h-2 rounded-full ${n.is_read ? 'bg-transparent' : 'bg-teal-500'}`} />
                                <div>
                                    <p className="font-medium">{n.message}</p>
                                    <span className="text-xs text-gray-500">{new Date(n.created_at).toLocaleString()}</span>
                                </div>
                            </div>
                            <span className="text-xl">
                                {n.type === 'like' ? '❤️' : n.type === 'comment' ? '💬' : n.type === 'message' ? '📩' : '📢'}
                            </span>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
                    <p className="text-gray-400">No notifications yet.</p>
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;
