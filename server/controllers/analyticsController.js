import Analytics from '../models/analyticsModel.js';

const AnalyticsController = {
    async overview(req, res) {
        try {
            const mentorId = parseInt(req.params.mentorId, 10);
            const user = req.user;

            // Ownership check: allow only the mentor themself or admin (if you have an admin role)
            if (!user || (user.role !== 'admin' && user.id !== mentorId)) {
                return res.status(403).json({ message: 'Not authorized to view this overview' });
            }

            const { startDate, endDate, status } = req.query;
            const opts = {};
            if (startDate) opts.startDate = startDate;
            if (endDate) opts.endDate = endDate;
            if (status) opts.status = status;

            const data = await Analytics.overview(mentorId, opts);
            return res.json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to compute overview' });
        }
    }
};

export default AnalyticsController;