import Conversation from '../models/conversationModel.js';
import Message from '../models/messageModel.js';

const ConversationController = {
    async createConversation(req, res) {
        try {
            const { participantIds } = req.body; // array of user ids
            if (!Array.isArray(participantIds) || participantIds.length < 2) return res.status(400).json({ message: 'participantIds must be an array of at least 2 user ids' });

            // Check if conversation exists
            const existing = await Conversation.findConversationBetween(participantIds[0], participantIds[1]);
            if (existing) {
                return res.status(200).json(existing);
            }

            const convo = await Conversation.createConversation(participantIds);
            return res.status(201).json(convo);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to create conversation' });
        }
    },

    async listForUser(req, res) {
        try {
            const userId = req.user.id;
            const convos = await Conversation.listForUser(userId);
            return res.json(convos);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to list conversations' });
        }
    },

    async listMessages(req, res) {
        try {
            const userId = req.user.id;
            const convoId = parseInt(req.params.conversationId, 10);
            const beforeId = req.query.before ? parseInt(req.query.before, 10) : null;
            const limit = Math.min(100, parseInt(req.query.limit || '50', 10));

            const isPart = await Conversation.isParticipant(convoId, userId);
            if (!isPart) return res.status(403).json({ message: 'Not a participant' });

            const msgs = await Message.listMessages(convoId, limit, beforeId);
            return res.json(msgs);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to list messages' });
        }
    },

    async sendMessage(req, res) {
        try {
            const userId = req.user.id;
            const convoId = parseInt(req.params.conversationId, 10);
            const { content } = req.body;
            if (!content || content.trim().length === 0) return res.status(400).json({ message: 'Empty message' });

            const isPart = await Conversation.isParticipant(convoId, userId);
            if (!isPart) return res.status(403).json({ message: 'Not a participant' });

            const msg = await Message.createMessage(convoId, userId, content);

            // Emit socket event if server has access to io
            if (req.app && req.app.get('io')) {
                const io = req.app.get('io');
                io.to(`conversation_${convoId}`).emit('message:new', msg);
            }

            return res.status(201).json(msg);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to send message' });
        }
    },

    async markRead(req, res) {
        try {
            const userId = req.user.id;
            const convoId = parseInt(req.params.conversationId, 10);
            const ok = await Message.markRead(convoId, userId);
            return res.json({ ok });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to mark read' });
        }
    },

    async unreadCounts(req, res) {
        try {
            const userId = req.user.id;
            const counts = await Message.unreadCountForUser(userId);
            return res.json(counts);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to compute unread counts' });
        }
    }
};

export default ConversationController;