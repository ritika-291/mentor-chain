import CalendarIntegration from '../models/calendarIntegrationModel.js';
import User from '../models/userModel.js';

const calendarController = {
    // Simple endpoint to accept provider tokens for now (POST body should include provider and tokens)
    async connect(req, res) {
        try {
            const mentorId = parseInt(req.params.mentorId, 10);
            if (isNaN(mentorId)) return res.status(400).json({ message: 'Invalid mentor id' });

            if (!req.user || req.user.id !== mentorId) return res.status(403).json({ message: 'Forbidden' });

            const { provider, provider_user_id, access_token, refresh_token, scope, token_expires } = req.body;
            if (!provider || !access_token) return res.status(400).json({ message: 'provider and access_token required' });

            const result = await CalendarIntegration.upsert(mentorId, { provider, provider_user_id, access_token, refresh_token, scope, token_expires });
            res.json({ message: 'Calendar connected', result });
        } catch (err) {
            console.error('Error connecting calendar:', err);
            res.status(500).json({ message: 'Server error' });
        }
    }
};

export default calendarController;