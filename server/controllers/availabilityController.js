import Availability from '../models/availabilityModel.js';
import User from '../models/userModel.js';

const availabilityController = {
    async getAvailability(req, res) {
        try {
            const mentorId = parseInt(req.params.mentorId, 10);
            if (isNaN(mentorId)) return res.status(400).json({ message: 'Invalid mentor id' });

            // Public access - anyone can view availability
            const slots = await Availability.listForMentor(mentorId);
            res.json({ availability: slots });
        } catch (err) {
            console.error('Error fetching availability:', err);
            res.status(500).json({ message: 'Server error' });
        }
    },

    async updateAvailability(req, res) {
        try {
            const mentorId = parseInt(req.params.mentorId, 10);
            if (isNaN(mentorId)) return res.status(400).json({ message: 'Invalid mentor id' });

            // Only mentor owner can update
            if (!req.user || req.user.id !== mentorId) return res.status(403).json({ message: 'Forbidden' });

            const slots = req.body.slots;
            if (!Array.isArray(slots)) return res.status(400).json({ message: 'slots must be an array' });

            // Basic validation of each slot
            for (const s of slots) {
                if (!s.start_time || !s.end_time) return res.status(400).json({ message: 'Each slot requires start_time and end_time' });
                if (s.recurring && !['none','weekly'].includes(s.recurring)) return res.status(400).json({ message: 'Invalid recurring value' });
                if (s.recurring === 'weekly' && (s.day_of_week === undefined || s.day_of_week === null)) return res.status(400).json({ message: 'day_of_week required for weekly recurring' });
            }

            const result = await Availability.replaceSlots(mentorId, slots);
            res.json({ message: 'Availability updated', availability: result });
        } catch (err) {
            console.error('Error updating availability:', err);
            res.status(500).json({ message: 'Server error' });
        }
    }
};

export default availabilityController;