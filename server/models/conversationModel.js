import db from '../config/db.js';

const Conversation = {
    async createConversation(participantIds = []) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();
            const [res] = await conn.execute('INSERT INTO conversations () VALUES ()');
            const conversationId = res.insertId;
            for (const userId of participantIds) {
                await conn.execute('INSERT INTO conversation_participants (conversation_id, user_id) VALUES (?, ?)', [conversationId, userId]);
            }
            await conn.commit();
            return { id: conversationId };
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    },

    async addParticipant(conversationId, userId) {
        const [res] = await db.execute('INSERT IGNORE INTO conversation_participants (conversation_id, user_id) VALUES (?, ?)', [conversationId, userId]);
        return res;
    },

    async listForUser(userId) {
        const [rows] = await db.execute(
            `SELECT c.id as conversation_id, c.created_at FROM conversations c
            JOIN conversation_participants cp ON cp.conversation_id = c.id
            WHERE cp.user_id = ?
            ORDER BY c.created_at DESC`,
            [userId]
        );
        return rows;
    },

    async isParticipant(conversationId, userId) {
        const [rows] = await db.execute('SELECT * FROM conversation_participants WHERE conversation_id = ? AND user_id = ? LIMIT 1', [conversationId, userId]);
        return rows.length > 0;
    }
};

export default Conversation;