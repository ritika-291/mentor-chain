import db from '../config/db.js';

const Session = {
    async createSession({ mentorId, menteeId, startTime, endTime, price = null, notes = null }) {
        const [result] = await db.execute(
            'INSERT INTO sessions (mentor_id, mentee_id, start_time, end_time, price, notes) VALUES (?, ?, ?, ?, ?, ?)',
            [mentorId, menteeId, startTime, endTime, price, notes]
        );
        return result;
    },

    async findOverlappingSessions(mentorId, startTime, endTime) {
        const [rows] = await db.execute(
            `SELECT * FROM sessions WHERE mentor_id = ? AND status IN ('requested','accepted') AND NOT (end_time <= ? OR start_time >= ?)`,
            [mentorId, startTime, endTime]
        );
        return rows;
    },

    async getById(sessionId) {
        const [rows] = await db.execute('SELECT * FROM sessions WHERE id = ?', [sessionId]);
        return rows[0];
    },

    async updateStatus(sessionId, status) {
        const [result] = await db.execute('UPDATE sessions SET status = ? WHERE id = ?', [status, sessionId]);
        return result;
    },

    async listForMentor(mentorId, { limit = 50, offset = 0 } = {}) {
        const limitVal = parseInt(limit, 10);
        const offsetVal = parseInt(offset, 10);
        const [rows] = await db.execute(
            `SELECT * FROM sessions WHERE mentor_id = ? ORDER BY start_time DESC LIMIT ${limitVal} OFFSET ${offsetVal}`,
            [mentorId]
        );
        return rows;
    },

    async listForMentee(menteeId, { limit = 50, offset = 0 } = {}) {
        const limitVal = parseInt(limit, 10);
        const offsetVal = parseInt(offset, 10);
        const [rows] = await db.execute(
            `SELECT * FROM sessions WHERE mentee_id = ? ORDER BY start_time DESC LIMIT ${limitVal} OFFSET ${offsetVal}`,
            [menteeId]
        );
        return rows;
    }
};

export default Session;