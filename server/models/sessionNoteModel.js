import db from '../config/db.js';

const SessionNote = {
    async createNote(sessionId, mentorId, content, attachments = []) {
        const [res] = await db.execute(
            'INSERT INTO session_notes (session_id, mentor_id, content, attachments) VALUES (?, ?, ?, ?)',
            [sessionId, mentorId, content, JSON.stringify(attachments || [])]
        );
        const insertId = res.insertId;
        const [rows] = await db.execute('SELECT id, session_id, mentor_id, content, attachments, created_at FROM session_notes WHERE id = ?', [insertId]);
        if (rows.length) {
            rows[0].attachments = JSON.parse(rows[0].attachments || '[]');
            return rows[0];
        }
        return null;
    },

    async listBySession(sessionId) {
        const [rows] = await db.execute('SELECT id, session_id, mentor_id, content, attachments, created_at FROM session_notes WHERE session_id = ? ORDER BY created_at DESC', [sessionId]);
        return rows.map(r => ({ ...r, attachments: JSON.parse(r.attachments || '[]') }));
    }
};

export default SessionNote;