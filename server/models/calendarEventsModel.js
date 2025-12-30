import db from '../config/db.js';

const CalendarEvents = {
    async upsertEvent(userId, provider, providerEventId, startTime, endTime, rawEvent) {
        const [existing] = await db.execute(
            'SELECT id FROM calendar_events WHERE user_id = ? AND provider = ? AND provider_event_id = ? LIMIT 1',
            [userId, provider, providerEventId]
        );
        if (existing.length > 0) {
            const id = existing[0].id;
            const [result] = await db.execute(
                'UPDATE calendar_events SET start_time = ?, end_time = ?, raw_event = ? WHERE id = ?',
                [startTime, endTime, JSON.stringify(rawEvent), id]
            );
            return result;
        } else {
            const [result] = await db.execute(
                'INSERT INTO calendar_events (user_id, provider_event_id, provider, start_time, end_time, raw_event) VALUES (?, ?, ?, ?, ?, ?)',
                [userId, providerEventId, provider, startTime, endTime, JSON.stringify(rawEvent)]
            );
            return result;
        }
    }
};

export default CalendarEvents;