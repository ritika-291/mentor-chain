import db from '../config/db.js';

const Message = {
    async createMessage(conversationId, senderId, content) {
        const [res] = await db.execute(
            'INSERT INTO messages (conversation_id, sender_id, text) VALUES (?, ?, ?)',
            [conversationId, senderId, content]
        );
        const insertId = res.insertId;
        const [rows] = await db.execute('SELECT id, conversation_id, sender_id, text as content, created_at FROM messages WHERE id = ?', [insertId]);
        return rows[0];
    },

    async listMessages(conversationId, limit = 50, beforeId = null) {
        let query = 'SELECT id, conversation_id, sender_id, text as content, created_at FROM messages WHERE conversation_id = ?';
        const params = [conversationId];

        if (beforeId) {
            query += ' AND id < ?';
            params.push(beforeId);
        }

        // Fix for "Incorrect arguments to mysqld_stmt_execute" with LIMIT
        const limitInt = parseInt(limit, 10) || 50;
        query += ` ORDER BY id DESC LIMIT ${limitInt}`;

        const [rows] = await db.execute(query, params);
        return rows.reverse(); // return in chronological order
    },

    async markRead(conversationId, userId) {
        // For now, track per-user read position in conversation_participants table
        const [res] = await db.execute('UPDATE conversation_participants SET last_read_message_id = (SELECT id FROM messages WHERE conversation_id = ? ORDER BY id DESC LIMIT 1) WHERE conversation_id = ? AND user_id = ?', [conversationId, conversationId, userId]);
        return res.affectedRows > 0;
    },

    async unreadCountForUser(userId) {
        const [rows] = await db.execute(
            `SELECT c.id as conversation_id, (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id AND m.id > IFNULL(cp.last_read_message_id,0) AND m.sender_id != ?) as unread_count
            FROM conversation_participants cp
            JOIN conversations c ON cp.conversation_id = c.id
            WHERE cp.user_id = ?`,
            [userId, userId]
        );
        return rows;
    }
};

export default Message;