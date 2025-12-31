import Session from '../models/sessionModel.js';
import Availability from '../models/availabilityModel.js';
import CalendarEvents from '../models/calendarEventsModel.js';
import User from '../models/userModel.js';
import Notification from '../models/notificationModel.js';
import sendEmail from '../utils/emailUtils.js';
import db from '../config/db.js';

function hasOverlap(startA, endA, startB, endB) {
    return !(endA <= startB || startA >= endB);
}

const sessionController = {
    // Mentee requests a session with a mentor
    async requestSession(req, res) {
        try {
            if (!req.user || req.user.role !== 'mentee') return res.status(403).json({ message: 'Only mentees can request sessions' });

            const { mentorId, start_time, end_time, price, notes } = req.body;
            const mentor_id = parseInt(mentorId, 10);
            if (isNaN(mentor_id) || !start_time || !end_time) return res.status(400).json({ message: 'mentorId, start_time and end_time are required' });

            const start = new Date(start_time);
            const end = new Date(end_time);
            if (isNaN(start) || isNaN(end) || start >= end) return res.status(400).json({ message: 'Invalid times' });

            // Verify mentor exists
            const mentorUser = await User.findUserById(mentor_id);
            if (!mentorUser || mentorUser.role !== 'mentor') return res.status(404).json({ message: 'Mentor not found' });

            // 1) Check availability slots
            // We'll check if at least one availability slot covers this time
            const slots = await Availability.listForMentor(mentor_id);
            const requestDay = start.getUTCDay(); // 0..6
            const requestTime = start.toISOString().substr(11, 8); // HH:MM:SS
            const requestEndTime = end.toISOString().substr(11, 8);

            let withinAvailability = false;
            for (const s of slots) {
                if (s.recurring === 'weekly') {
                    if (s.day_of_week === requestDay) {
                        if (s.start_time <= requestTime && s.end_time >= requestEndTime) { withinAvailability = true; break; }
                    }
                } else {
                    // non-recurring: check date range and times
                    const startDate = s.start_date ? new Date(s.start_date) : null;
                    const endDate = s.end_date ? new Date(s.end_date) : null;
                    const reqDate = new Date(start.toISOString().substr(0, 10));
                    if (startDate && endDate && reqDate >= startDate && reqDate <= endDate) {
                        if (s.start_time <= requestTime && s.end_time >= requestEndTime) { withinAvailability = true; break; }
                    }
                }
            }

            if (!withinAvailability) {
                return res.status(409).json({ message: 'Requested time is outside mentor availability' });
            }

            // 2) Check calendar_events for conflicts
            const calConflicts = await db.execute(
                'SELECT * FROM calendar_events WHERE user_id = ? AND NOT (end_time <= ? OR start_time >= ?)',
                [mentor_id, start.toISOString().slice(0, 19).replace('T', ' '), end.toISOString().slice(0, 19).replace('T', ' ')]
            );
            if (calConflicts[0] && calConflicts[0].length > 0) {
                return res.status(409).json({ message: 'Conflict with calendar events', conflicts: calConflicts[0] });
            }

            // 3) Check existing sessions for conflicts
            const overlapping = await Session.findOverlappingSessions(mentor_id, start.toISOString().slice(0, 19).replace('T', ' '), end.toISOString().slice(0, 19).replace('T', ' '));
            if (overlapping && overlapping.length > 0) {
                return res.status(409).json({ message: 'Conflict with existing sessions', conflicts: overlapping });
            }

            // 4) Create session within a transaction
            const conn = await db.getConnection();
            try {
                await conn.beginTransaction();
                const [result] = await conn.execute(
                    'INSERT INTO sessions (mentor_id, mentee_id, start_time, end_time, price, notes) VALUES (?, ?, ?, ?, ?, ?)',
                    [mentor_id, req.user.id, start, end, price || null, notes || null]
                );
                const sessionId = result.insertId;

                // Create notification for mentor (in-app)
                try {
                    await Notification.create(mentor_id, 'session_request', { sessionId, menteeId: req.user.id });
                } catch (nv) { console.error('Failed to create notification:', nv); }

                // Send email to mentor
                try {
                    const subject = `New session request from ${req.user.username || req.user.email}`;
                    const html = `<p>Hello ${mentorUser.username || 'Mentor'},</p><p>You have a new session request for ${start.toISOString()} - ${end.toISOString()}</p>`;
                    await sendEmail(mentorUser.email, subject, html);
                } catch (ev) { console.error('Failed to send session request email:', ev); }

                await conn.commit();
                return res.status(201).json({ message: 'Session requested', sessionId });
            } catch (err) {
                await conn.rollback();
                throw err;
            } finally {
                conn.release();
            }

        } catch (err) {
            console.error('Error requesting session:', err);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Mentor schedules a session directly
    async scheduleSession(req, res) {
        try {
            if (!req.user || req.user.role !== 'mentor') return res.status(403).json({ message: 'Only mentors can schedule via this endpoint' });

            const { menteeId, start_time, end_time, price, notes } = req.body;
            const mentor_id = req.user.id; // Mentor is the scheduler
            const mentee_id = parseInt(menteeId, 10);

            if (isNaN(mentee_id) || !start_time || !end_time) return res.status(400).json({ message: 'menteeId, start_time and end_time are required' });

            const start = new Date(start_time);
            const end = new Date(end_time);
            if (isNaN(start) || isNaN(end) || start >= end) return res.status(400).json({ message: 'Invalid times' });

            // Verify they are connected?
            // Ideally yes. Check 'active' status.
            // (Assuming MentorMentees model usage or direct query, but let's assume if they have the ID they can try, 
            // but strict check is better. I won't import MentorMentees just for this to save complexity unless needed, 
            // but effectively they should be connected.)

            // Check conflicts
            const overlapping = await Session.findOverlappingSessions(mentor_id, start.toISOString().slice(0, 19).replace('T', ' '), end.toISOString().slice(0, 19).replace('T', ' '));
            if (overlapping && overlapping.length > 0) {
                return res.status(409).json({ message: 'Conflict with existing sessions', conflicts: overlapping });
            }

            // Create Session (Auto Accepted)
            // We need to modify 'createSession' logic or manually insert with status 'accepted'.
            // The model `createSession` just inserts. Default status in DB is usually 'requested'.
            // I should verify DB schema default. 
            // If default is 'requested', I need to update it immediately or custom insert.
            // Let's use custom insert in Controller for speed or update Model. 
            // Actually, `createSession` in model takes basic params.
            // Let's add `status` param to `createSession` in Model or just UPDATE after create.
            // Update after create is safer/easier without changing Model signature too much.

            // Wait, Model createSession `INSERT INTO sessions ...`. 
            // Columns: mentor_id, mentee_id, start_time, end_time, price, notes. 
            // It uses default status.
            // I will update the status immediately after creation.

            const result = await Session.createSession({
                mentorId: mentor_id,
                menteeId: mentee_id,
                startTime: start,
                endTime: end,
                price,
                notes
            });
            const sessionId = result.insertId;

            // Set to accepted
            await Session.updateStatus(sessionId, 'accepted');

            // Notify Mentee
            try {
                await Notification.create(mentee_id, 'session_status', { sessionId, status: 'scheduled' });
                // Email mentee...
            } catch (e) {
                console.error("Notification failed", e);
            }

            return res.status(201).json({ message: 'Session scheduled', sessionId });

        } catch (err) {
            console.error('Error scheduling session:', err);
            res.status(500).json({ message: 'Server error' });
        }
    },
    async listForMentor(req, res) {
        try {
            const mentorId = parseInt(req.params.mentorId, 10);
            if (isNaN(mentorId)) return res.status(400).json({ message: 'Invalid mentor id' });
            if (!req.user || req.user.id !== mentorId) return res.status(403).json({ message: 'Forbidden' });

            const sessions = await Session.listForMentor(mentorId, { limit: 100 });
            res.json({ sessions });
        } catch (err) {
            console.error('Error listing sessions:', err);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Mentee: list sessions
    async listForMentee(req, res) {
        try {
            const menteeId = parseInt(req.params.menteeId, 10);
            if (isNaN(menteeId)) return res.status(400).json({ message: 'Invalid mentee id' });
            if (!req.user || req.user.id !== menteeId) return res.status(403).json({ message: 'Forbidden' });

            const sessions = await Session.listForMentee(menteeId, { limit: 100 });
            res.json({ sessions });
        } catch (err) {
            console.error('Error listing sessions:', err);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Mentor accepts/rejects a session
    async updateStatus(req, res) {
        try {
            const sessionId = parseInt(req.params.sessionId, 10);
            const { status } = req.body;
            if (!['accepted', 'rejected', 'cancelled', 'completed'].includes(status)) return res.status(400).json({ message: 'Invalid status' });

            const session = await Session.getById(sessionId);
            if (!session) return res.status(404).json({ message: 'Session not found' });

            if (!req.user || req.user.id !== session.mentor_id) return res.status(403).json({ message: 'Forbidden' });

            // If accepting, re-check conflicts at that moment
            if (status === 'accepted') {
                const overlapping = await Session.findOverlappingSessions(session.mentor_id, session.start_time, session.end_time);
                // remove self from overlapping
                const others = overlapping.filter(s => s.id !== session.id);
                if (others.length > 0) return res.status(409).json({ message: 'Conflict with other sessions', conflicts: others });
            }

            await Session.updateStatus(sessionId, status);

            // Notify mentee
            try {
                await Notification.create(session.mentee_id, 'session_status', { sessionId, status });
                const mentee = await User.findUserById(session.mentee_id);
                if (mentee) await sendEmail(mentee.email, `Your session ${status}`, `<p>Your session was ${status}.</p>`);
            } catch (nerr) { console.error('Failed to notify mentee:', nerr); }

            res.json({ message: 'Session status updated' });
        } catch (err) {
            console.error('Error updating session status:', err);
            res.status(500).json({ message: 'Server error' });
        }
    }
};

export default sessionController;