
import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { API_URL } from '../config/api';

const CommunityPage = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // State to track which post's comments are open
    const [activeCommentPostId, setActiveCommentPostId] = useState(null);
    const [comments, setComments] = useState({}); // Map postId -> array of comments
    const [newComment, setNewComment] = useState(''); // Current comment input

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));

        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const res = await fetch(`${API_URL}/api/community`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setPosts(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token || !newPost.trim()) return;

        try {
            const res = await fetch(`${API_URL}/api/community`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: newPost })
            });

            if (res.ok) {
                setNewPost('');
                fetchPosts(); // Reload posts
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleLike = async (postId) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Optimistic update
        setPosts(posts.map(p => {
            if (p.id === postId) {
                return {
                    ...p,
                    likes: p.is_liked ? p.likes - 1 : p.likes + 1,
                    is_liked: !p.is_liked ? 1 : 0 // Toggle 1/0
                };
            }
            return p;
        }));

        try {
            const res = await fetch(`${API_URL}/api/community/${postId}/like`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) {
                // Revert if error (could implement full revert logic here via reload)
                fetchPosts();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const toggleComments = async (postId) => {
        if (activeCommentPostId === postId) {
            setActiveCommentPostId(null);
            return;
        }
        setActiveCommentPostId(postId);
        // Fetch comments if not already loaded (optional validation, here simpler to fetch always or check length)
        fetchComments(postId);
    };

    const fetchComments = async (postId) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/api/community/${postId}/comments`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setComments(prev => ({ ...prev, [postId]: data }));
            }
        } catch (err) { console.error(err); }
    };

    const handleCommentSubmit = async (e, postId) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token || !newComment.trim()) return;

        try {
            const res = await fetch(`${API_URL}/api/community/${postId}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: newComment })
            });

            if (res.ok) {
                setNewComment('');
                fetchComments(postId); // Refresh comments
                // Also update comment count in posts list
                setPosts(posts.map(p => p.id === postId ? { ...p, comment_count: p.comment_count + 1 } : p));
            }
        } catch (err) { console.error(err); }
    };

    return (
        <div className="bg-gray-900 min-h-screen">
            <Navbar />

            <div className="container mx-auto px-4 py-24 max-w-4xl">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-white mb-4">Community Forum 💬</h1>
                    <p className="text-gray-400">Connect, share, and grow with fellow mentors and mentees.</p>
                </div>

                {/* Create Post Section */}
                {user ? (
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mb-8">
                        <form onSubmit={handlePostSubmit}>
                            <textarea
                                className="w-full bg-gray-900 text-white p-4 rounded-lg border border-gray-700 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none"
                                rows="3"
                                placeholder="What's on your mind? Ask a question or share a tip..."
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                            />
                            <div className="flex justify-end mt-3">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-gradient-to-r from-teal-400 to-blue-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                                >
                                    Post
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="bg-gray-800 p-6 rounded-xl text-center mb-8 border border-gray-700">
                        <p className="text-gray-300">You must be logged in to post.</p>
                    </div>
                )}

                {/* Feed Section */}
                <div className="space-y-6">
                    {loading ? (
                        <div className="text-center text-gray-500">Loading posts...</div>
                    ) : posts.length > 0 ? (
                        posts.map(post => (
                            <div key={post.id} className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700 hover:border-gray-600 transition-colors">
                                <div className="flex items-center space-x-3 mb-4">
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${post.username}&background=random`}
                                        alt={post.username}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div>
                                        <h3 className="text-white font-bold">{post.username}</h3>
                                        <span className="text-xs text-teal-400 uppercase tracking-wider border border-teal-400/30 px-2 py-0.5 rounded-full">{post.role}</span>
                                        <span className="text-gray-500 text-xs ml-2">{new Date(post.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                                <div className="mt-4 flex items-center space-x-6 text-gray-400 text-sm border-t border-gray-700 pt-4">
                                    <button
                                        onClick={() => handleLike(post.id)}
                                        className={`flex items-center space-x-1 transition-colors ${post.is_liked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
                                    >
                                        <span>{post.is_liked ? '❤️' : '🤍'}</span>
                                        <span>{post.likes} Likes</span>
                                    </button>
                                    <button
                                        onClick={() => toggleComments(post.id)}
                                        className="flex items-center space-x-1 hover:text-blue-400 transition-colors"
                                    >
                                        <span>💬</span>
                                        <span>{post.comment_count} Comments</span>
                                    </button>
                                </div>

                                {/* Comments Section */}
                                {activeCommentPostId === post.id && (
                                    <div className="mt-4 bg-gray-900/50 p-4 rounded-lg">
                                        <h4 className="text-gray-400 text-sm mb-3">Comments</h4>

                                        {/* Drop comments here */}
                                        <div className="space-y-3 mb-4 max-h-60 overflow-y-auto custom-scrollbar">
                                            {comments[post.id] && comments[post.id].length > 0 ? (
                                                comments[post.id].map(comment => (
                                                    <div key={comment.id} className="flex space-x-3">
                                                        <img
                                                            src={`https://ui-avatars.com/api/?name=${comment.username}&background=random`}
                                                            alt={comment.username}
                                                            className="w-6 h-6 rounded-full mt-1"
                                                        />
                                                        <div className="bg-gray-800 p-2 rounded-lg flex-1">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="text-xs font-bold text-gray-300">{comment.username}</span>
                                                                <span className="text-[10px] text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                                                            </div>
                                                            <p className="text-gray-300 text-sm">{comment.content}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-500 text-xs italic">No comments yet.</p>
                                            )}
                                        </div>

                                        {/* Add Comment Input */}
                                        <form onSubmit={(e) => handleCommentSubmit(e, post.id)} className="flex space-x-2">
                                            <input
                                                type="text"
                                                className="flex-1 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg border border-gray-700 focus:border-teal-500 outline-none"
                                                placeholder="Write a comment..."
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                            />
                                            <button type="submit" className="text-teal-400 hover:text-teal-300 font-semibold text-sm">Post</button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500 text-lg">No posts yet. Be the first to start the conversation! 🚀</p>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default CommunityPage;
