import Notification from '../models/notificationModel.js';

const notificationController = {
    async list(req, res) {
        try {
            const userId = req.user.id;
            const { limit = 50, offset = 0 } = req.query;
            const notifications = await Notification.listForUser(userId, { limit, offset });
            res.json({ notifications });
        } catch (err) {
            console.error('Error fetching notifications:', err);
            res.status(500).json({ message: 'Server error' });
        }
    },

    async markRead(req, res) {
        try {
            const userId = req.user.id;
            const notificationId = parseInt(req.params.id, 10);
            if (isNaN(notificationId)) return res.status(400).json({ message: 'Invalid id' });

            // Optionally: verify ownership by querying notification (simple approach assumes notification exists and belongs to user)
            await Notification.markRead(notificationId);
            res.json({ message: 'Notification marked as read' });
        } catch (err) {
            console.error('Error marking notification read:', err);
            res.status(500).json({ message: 'Server error' });
        }
    }
};

export default notificationController;