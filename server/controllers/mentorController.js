import Mentor from '../models/mentorModel.js';
import User from '../models/userModel.js';

const mentorController = {
    async getProfile(req, res) {
        try {
            const mentorId = parseInt(req.params.mentorId, 10);
            if (isNaN(mentorId)) return res.status(400).json({ message: 'Invalid mentor id' });

            const user = await User.findUserById(mentorId);
            if (!user || user.role.toLowerCase() !== 'mentor') return res.status(404).json({ message: 'Mentor not found. Role mismatch.' });

            const profile = await Mentor.getByUserId(mentorId);
            res.json({ user: { id: user.id, username: user.username, email: user.email }, profile });
        } catch (err) {
            console.error('Error in getProfile:', err);
            res.status(500).json({ message: 'Server error' });
        }
    },

    async updateProfile(req, res) {
        try {
            const mentorId = parseInt(req.params.mentorId, 10);
            if (isNaN(mentorId)) return res.status(400).json({ message: 'Invalid mentor id' });

            // Only allow owner to update
            if (!req.user || req.user.id !== mentorId) return res.status(403).json({ message: 'Forbidden' });

            const allowed = ['bio', 'expertise', 'avatar_url', 'hourly_rate', 'availability_status'];
            const payload = {};
            for (const key of allowed) {
                if (req.body[key] !== undefined) payload[key] = req.body[key];
            }

            if (payload.availability_status && !['available', 'busy'].includes(payload.availability_status)) {
                return res.status(400).json({ message: 'Invalid availability_status' });
            }

            if (payload.expertise && !Array.isArray(payload.expertise)) {
                return res.status(400).json({ message: 'expertise must be an array' });
            }

            await Mentor.upsertProfile(mentorId, payload);
            const profile = await Mentor.getByUserId(mentorId);
            res.json({ message: 'Profile updated', profile });
        } catch (err) {
            console.error('Error in updateProfile:', err);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Public mentor listing with optional search and pagination
    async listPublic(req, res) {
        try {
            const limit = Math.min(100, parseInt(req.query.limit || '20', 10));
            const offset = parseInt(req.query.offset || '0', 10);
            const q = req.query.q || null;
            const rows = await Mentor.listPublic({ limit, offset, q });
            return res.json(rows);
        } catch (err) {
            console.error('Error in listPublic:', err);
            return res.status(500).json({ message: 'Server error' });
        }
    }
};

export default mentorController;
