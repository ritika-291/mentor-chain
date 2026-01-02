
import Community from '../models/communityModel.js';

export const createPost = async (req, res) => {
    try {
        const { content } = req.body;
        const userId = req.user.id; // From authMiddleware

        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        const postId = await Community.create(userId, content);
        res.status(201).json({ message: 'Post created', postId });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getPosts = async (req, res) => {
    try {
        const userId = req.user.id;
        const posts = await Community.getAll(userId);
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

import User from '../models/userModel.js';
import Notification from '../models/notificationModel.js';

export const likePost = async (req, res) => {
    try {
        const { id } = req.params; // Post ID
        const userId = req.user.id;
        const status = await Community.toggleLike(id, userId);

        // Notify if liked
        if (status === 'liked') {
            const ownerId = await Community.getOwner(id);
            if (ownerId && ownerId !== userId) {
                const liker = await User.findUserById(userId);
                const message = liker ? `${liker.username} liked your post` : 'Someone liked your post';
                await Notification.create(ownerId, 'like', message, id);
            }
        }

        res.json({ message: `Post ${status}`, status });
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const commentOnPost = async (req, res) => {
    try {
        const { id } = req.params; // Post ID
        const { content } = req.body;
        const userId = req.user.id;

        if (!content) return res.status(400).json({ message: 'Comment content required' });

        await Community.addComment(id, userId, content);

        // Notify
        const ownerId = await Community.getOwner(id);
        if (ownerId && ownerId !== userId) {
            const commenter = await User.findUserById(userId);
            const message = commenter ? `${commenter.username} commented on your post` : 'Someone commented on your post';
            await Notification.create(ownerId, 'comment', message, id);
        }

        res.json({ message: 'Comment added' });
    } catch (error) {
        console.error('Error commenting:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getPostComments = async (req, res) => {
    try {
        const { id } = req.params;
        const comments = await Community.getComments(id);
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
