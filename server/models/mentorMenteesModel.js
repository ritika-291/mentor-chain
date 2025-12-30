import db from '../config/db.js';

const MentorMentees = {
    async listMentees(mentorId, { limit = 50, offset = 0 } = {}) {
        const [rows] = await db.execute(
            `SELECT mm.mentor_id, mm.mentee_id, mm.status, mm.started_at, u.username, u.email, u.created_at AS mentee_created_at
            FROM mentor_mentees mm
            JOIN users u ON u.id = mm.mentee_id
            WHERE mm.mentor_id = ?
            ORDER BY mm.created_at DESC
            LIMIT ? OFFSET ?`,
            [mentorId, parseInt(limit, 10), parseInt(offset, 10)]
        );
        return rows;
    },

    async getRelationship(mentorId, menteeId) {
        const [rows] = await db.execute(
            'SELECT * FROM mentor_mentees WHERE mentor_id = ? AND mentee_id = ?',
            [mentorId, menteeId]
        );
        return rows[0];
    },

    async createRelationship(mentorId, menteeId, status = 'requested') {
        const [result] = await db.execute(
            'INSERT INTO mentor_mentees (mentor_id, mentee_id, status, started_at) VALUES (?, ?, ?, ?)',
            [mentorId, menteeId, status, status === 'active' ? new Date() : null]
        );
        return result;
    },

    async updateStatus(mentorId, menteeId, status) {
        const [result] = await db.execute(
            'UPDATE mentor_mentees SET status = ?, started_at = CASE WHEN ? = ' +
            "'active'" + ' THEN ? ELSE started_at END WHERE mentor_id = ? AND mentee_id = ?',
            [status, status, status === 'active' ? new Date() : null, mentorId, menteeId]
        );
        return result;
    },

    async removeRelationship(mentorId, menteeId) {
        const [result] = await db.execute(
            'DELETE FROM mentor_mentees WHERE mentor_id = ? AND mentee_id = ?',
            [mentorId, menteeId]
        );
        return result;
    }
};

export default MentorMentees;
