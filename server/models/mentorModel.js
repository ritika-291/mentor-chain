import db from '../config/db.js';

const Mentor = {
    async getByUserId(userId) {
        const [rows] = await db.execute(
            'SELECT * FROM mentor_profiles WHERE user_id = ?',
            [userId]
        );
        return rows[0];
    },

    async createProfile(userId, { bio, expertise, avatar_url, hourly_rate, availability_status }) {
        const [result] = await db.execute(
            'INSERT INTO mentor_profiles (user_id, bio, expertise, avatar_url, hourly_rate, availability_status) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, bio || null, JSON.stringify(expertise || []), avatar_url || null, hourly_rate || null, availability_status || 'available']
        );
        return result;
    },

    async updateProfile(userId, fields) {
        const updates = [];
        const values = [];

        if (fields.bio !== undefined) { updates.push('bio = ?'); values.push(fields.bio); }
        if (fields.expertise !== undefined) { updates.push('expertise = ?'); values.push(JSON.stringify(fields.expertise)); }
        if (fields.avatar_url !== undefined) { updates.push('avatar_url = ?'); values.push(fields.avatar_url); }
        if (fields.hourly_rate !== undefined) { updates.push('hourly_rate = ?'); values.push(fields.hourly_rate); }
        if (fields.availability_status !== undefined) { updates.push('availability_status = ?'); values.push(fields.availability_status); }

        if (updates.length === 0) return null;

        values.push(userId);
        const [result] = await db.execute(
            `UPDATE mentor_profiles SET ${updates.join(', ')} WHERE user_id = ?`,
            values
        );
        return result;
    },

    async upsertProfile(userId, data) {
        const existing = await this.getByUserId(userId);
        if (existing) {
            return this.updateProfile(userId, data);
        } else {
            return this.createProfile(userId, data);
        }
    },

    async listPublic({ limit = 20, offset = 0, q = null } = {}) {
        // Normalize and validate inputs to avoid prepared-statement argument errors
        const params = [];
        let where = "WHERE u.role = 'mentor'";

        // Normalize q if it's an array (e.g., repeated query params)
        if (Array.isArray(q)) q = q.join(' ');
        if (q) {
            const like = `%${String(q)}%`;
            where += ' AND (u.username LIKE ? OR mp.bio LIKE ?)';
            params.push(like, like);
        }

        // Ensure numeric limit/offset (not added to params to avoid prepared-statement issues)
        const limitNum = Math.max(1, Math.min(100, Number.isFinite(Number(limit)) ? Number(limit) : 20));
        const offsetNum = Math.max(0, Number.isFinite(Number(offset)) ? Number(offset) : 0);

        const sql = `SELECT u.id, u.username, mp.bio, mp.expertise, mp.avatar_url, mp.average_rating, mp.reviews_count
             FROM users u
             JOIN mentor_profiles mp ON mp.user_id = u.id
             ${where}
             ORDER BY (mp.average_rating IS NULL) ASC, mp.average_rating DESC, u.username ASC
             LIMIT ${limitNum} OFFSET ${offsetNum}`;

        // Debugging: log the final SQL and params when in development
        if (process.env.NODE_ENV !== 'production') {
            console.debug('mentorModel.listPublic SQL:', sql);
            console.debug('mentorModel.listPublic params:', params);
        }

        const [rows] = await db.execute(sql, params);
        return rows;
    }
};

export default Mentor;
