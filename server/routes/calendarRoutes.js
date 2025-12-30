import express from 'express';
import CalendarIntegration from '../models/calendarIntegrationModel.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import db from '../config/db.js';

const router = express.Router();

// Admin: list all integrations
router.get('/', authenticate, requireRole('admin'), async (req, res) => {
    try {
        const rows = await CalendarIntegration.listAll();
        return res.json(rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to list calendar integrations' });
    }
});

// Get integration for a user (mentor or admin)
router.get('/:userId', authenticate, async (req, res) => {
    try {
        const userId = parseInt(req.params.userId, 10);
        if (!req.user || (req.user.id !== userId && req.user.role !== 'admin')) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const row = await CalendarIntegration.getByUserId(userId);
        return res.json(row || null);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to get calendar integration' });
    }
});

// Upsert integration for a user (mentor must own the account)
router.post('/:userId', authenticate, requireRole('mentor'), async (req, res) => {
    try {
        const userId = parseInt(req.params.userId, 10);
        if (req.user.id !== userId) return res.status(403).json({ message: 'Forbidden' });
        const { provider, provider_user_id, access_token, refresh_token, scope, token_expires } = req.body;
        if (!provider || !access_token) return res.status(400).json({ message: 'provider and access_token required' });
        const result = await CalendarIntegration.upsert(userId, { provider, provider_user_id, access_token, refresh_token, scope, token_expires });
        return res.json({ message: 'Integration saved', result });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to save integration' });
    }
});

// Delete integration (mentor or admin)
router.delete('/:userId', authenticate, async (req, res) => {
    try {
        const userId = parseInt(req.params.userId, 10);
        if (!req.user || (req.user.id !== userId && req.user.role !== 'admin')) return res.status(403).json({ message: 'Forbidden' });
        const [result] = await db.execute('DELETE FROM calendar_integrations WHERE user_id = ?', [userId]);
        return res.json({ message: 'Deleted', affectedRows: result.affectedRows });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to delete integration' });
    }
});

export default router;