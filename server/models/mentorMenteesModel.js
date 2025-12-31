import db from '../config/db.js';

const MentorMentees = {
    async listMentees(mentorId, { limit = 50, offset = 0 } = {}) {
        const limitInt = parseInt(limit, 10);
        const offsetInt = parseInt(offset, 10);

        const [rows] = await db.execute(
            `SELECT mm.mentor_id, mm.mentee_id, mm.status, mm.created_at, u.username, u.email
            FROM mentor_mentees mm
            JOIN users u ON u.id = mm.mentee_id
            WHERE mm.mentor_id = ?
            ORDER BY mm.created_at DESC
            LIMIT ${limitInt} OFFSET ${offsetInt}`,
            [mentorId]
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
            'INSERT INTO mentor_mentees (mentor_id, mentee_id, status) VALUES (?, ?, ?)',
            [mentorId, menteeId, status]
        );
        return result;
    },

    async updateStatus(mentorId, menteeId, status) {
        const [result] = await db.execute(
            'UPDATE mentor_mentees SET status = ? WHERE mentor_id = ? AND mentee_id = ?',
            [status, mentorId, menteeId]
        );
        return result;
    },

    async reRequestRelationship(mentorId, menteeId) {
        const [result] = await db.execute(
            'UPDATE mentor_mentees SET status = ?, created_at = NOW() WHERE mentor_id = ? AND mentee_id = ?',
            ['requested', mentorId, menteeId]
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
