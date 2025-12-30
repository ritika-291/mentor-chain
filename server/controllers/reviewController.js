import Review from '../models/reviewModel.js';
import db from '../config/db.js';
import sessionModel from '../models/sessionModel.js';
import Notification from '../models/notificationModel.js';

const ReviewController = {
    async submitReview(req, res) {
        try {
            const sessionId = parseInt(req.params.sessionId, 10);
            const userId = req.user.id; // mentee
            const { rating, comment } = req.body;

            if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
                return res.status(400).json({ message: 'rating must be an integer between 1 and 5' });
            }

            // Validate session
            const session = await sessionModel.getById(sessionId);
            if (!session) return res.status(404).json({ message: 'Session not found' });
            if (session.status !== 'completed') return res.status(400).json({ message: 'Session must be completed to submit a review' });
            if (session.mentee_id !== userId) return res.status(403).json({ message: 'Only the session mentee can submit a review for this session' });

            const existing = await Review.getBySession(sessionId);
            if (existing) return res.status(400).json({ message: 'Review already submitted for this session' });

            const review = await Review.createReview(sessionId, session.mentor_id, userId, rating, comment || null);

            // Recompute average and count
            const stats = await Review.statsForMentor(session.mentor_id);
            const avg = stats.avgRating ? Number(Number(stats.avgRating).toFixed(2)) : 0;
            const count = stats.count || 0;

            // Update mentor_profiles cached values
            await db.execute('UPDATE mentor_profiles SET average_rating = ?, reviews_count = ? WHERE user_id = ?', [avg, count, session.mentor_id]);

            // Create notification for mentor
            try {
                await Notification.create(session.mentor_id, 'review', { sessionId, reviewId: review.id, rating });
            } catch (err) {
                console.warn('Failed to create notification for review:', err.message);
            }

            return res.status(201).json(review);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to submit review' });
        }
    },

    async listReviewsByMentor(req, res) {
        try {
            const mentorId = parseInt(req.params.mentorId, 10);
            const limit = Math.min(100, parseInt(req.query.limit || '50', 10));
            const offset = parseInt(req.query.offset || '0', 10);

            const rows = await Review.listByMentor(mentorId, limit, offset);
            return res.json(rows);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to fetch reviews' });
        }
    }
};

export default ReviewController;