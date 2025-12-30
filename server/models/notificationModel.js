import db from '../config/db.js';

const Notification = {
    async create(userId, type, payload) {
        const [result] = await db.execute(
            'INSERT INTO notifications (user_id, type, payload) VALUES (?, ?, ?)',
            [userId, type, JSON.stringify(payload || {})]
        );
        return result;
    },

    async listForUser(userId, { limit = 50, offset = 0 } = {}) {
        const [rows] = await db.execute(
            'SELECT id, user_id, type, payload, is_read as read, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
            [userId, parseInt(limit, 10), parseInt(offset, 10)]
        );
        return rows;
    },

    async markRead(notificationId) {
        const [result] = await db.execute(
            'UPDATE notifications SET is_read = 1 WHERE id = ?',
            [notificationId]
        );
        return result;
    }
};

export default Notification;
