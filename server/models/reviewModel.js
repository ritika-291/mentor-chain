import db from '../config/db.js';

const Review = {
    async createReview(sessionId, mentorId, menteeId, rating, comment) {
        const [res] = await db.execute(
            'INSERT INTO reviews (session_id, mentor_id, mentee_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
            [sessionId, mentorId, menteeId, rating, comment]
        );
        const insertId = res.insertId;
        const [rows] = await db.execute('SELECT id, session_id, mentor_id, mentee_id, rating, comment, created_at FROM reviews WHERE id = ?', [insertId]);
        return rows[0];
    },

    async getBySession(sessionId) {
        const [rows] = await db.execute('SELECT * FROM reviews WHERE session_id = ? LIMIT 1', [sessionId]);
        return rows[0];
    },

    async listByMentor(mentorId, limit = 50, offset = 0) {
        const [rows] = await db.execute(
            `SELECT r.id, r.session_id, r.rating, r.comment, r.created_at, u.id as mentee_id, u.username as mentee_username, u.email as mentee_email
            FROM reviews r
            LEFT JOIN users u ON u.id = r.mentee_id
            WHERE r.mentor_id = ?
            ORDER BY r.created_at DESC
            LIMIT ? OFFSET ?`,
            [mentorId, limit, offset]
        );
        return rows;
    },

    async statsForMentor(mentorId) {
        const [rows] = await db.execute('SELECT AVG(rating) as avgRating, COUNT(*) as count FROM reviews WHERE mentor_id = ?', [mentorId]);
        return rows[0] || { avgRating: null, count: 0 };
    }
};

export default Review;