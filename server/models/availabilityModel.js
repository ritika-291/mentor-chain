import db from '../config/db.js';

const Availability = {
    async listForMentor(mentorId) {
        const [rows] = await db.execute(
            'SELECT * FROM availability WHERE mentor_id = ? ORDER BY created_at DESC',
            [mentorId]
        );
        return rows;
    },

    async replaceSlots(mentorId, slots = []) {
        // Simple replace strategy: delete existing slots for mentor and insert provided slots
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();
            await conn.execute('DELETE FROM availability WHERE mentor_id = ?', [mentorId]);

            for (const slot of slots) {
                const { recurring = 'none', day_of_week = null, start_time, end_time, start_date = null, end_date = null, timezone = 'UTC' } = slot;
                await conn.execute(
                    'INSERT INTO availability (mentor_id, recurring, day_of_week, start_time, end_time, start_date, end_date, timezone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [mentorId, recurring, day_of_week, start_time, end_time, start_date, end_date, timezone]
                );
            }

            await conn.commit();
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
        return this.listForMentor(mentorId);
    },

    async addSlot(mentorId, slot) {
        const { recurring = 'none', day_of_week = null, start_time, end_time, start_date = null, end_date = null, timezone = 'UTC' } = slot;
        const [result] = await db.execute(
            'INSERT INTO availability (mentor_id, recurring, day_of_week, start_time, end_time, start_date, end_date, timezone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [mentorId, recurring, day_of_week, start_time, end_time, start_date, end_date, timezone]
        );
        return result;
    },

    async removeSlot(slotId) {
        const [result] = await db.execute('DELETE FROM availability WHERE id = ?', [slotId]);
        return result;
    }
};

export default Availability;
