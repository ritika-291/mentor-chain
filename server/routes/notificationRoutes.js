import express from 'express';
import notificationController from '../controllers/notificationController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// List notifications for the authenticated user
router.get('/', authenticate, notificationController.list);

// Mark a notification as read
router.patch('/:id/read', authenticate, notificationController.markRead);

export default router;
