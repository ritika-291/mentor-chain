import express from 'express';
import ConversationController from '../controllers/conversationController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, ConversationController.createConversation);
router.get('/', authenticate, ConversationController.listForUser);
router.get('/:conversationId/messages', authenticate, ConversationController.listMessages);
router.post('/:conversationId/messages', authenticate, ConversationController.sendMessage);
router.post('/:conversationId/read', authenticate, ConversationController.markRead);
router.get('/unread/counts', authenticate, ConversationController.unreadCounts);

export default router;