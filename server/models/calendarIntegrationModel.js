import db from '../config/db.js';

const CalendarIntegration = {
    async getByUserId(userId) {
        const [rows] = await db.execute('SELECT * FROM calendar_integrations WHERE user_id = ?', [userId]);
        return rows[0];
    },

    async listAll() {
        const [rows] = await db.execute('SELECT * FROM calendar_integrations');
        return rows;
    },

    async upsert(userId, data) {
        const existing = await this.getByUserId(userId);
        if (existing) {
            const [result] = await db.execute(
                'UPDATE calendar_integrations SET provider = ?, provider_user_id = ?, access_token = ?, refresh_token = ?, scope = ?, token_expires = ? WHERE user_id = ?',
                [data.provider, data.provider_user_id, data.access_token, data.refresh_token, data.scope, data.token_expires, userId]
            );
            return result;
        } else {
            const [result] = await db.execute(
                'INSERT INTO calendar_integrations (user_id, provider, provider_user_id, access_token, refresh_token, scope, token_expires) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [userId, data.provider, data.provider_user_id, data.access_token, data.refresh_token, data.scope, data.token_expires]
            );
            return result;
        }
    }
};

export default CalendarIntegration;