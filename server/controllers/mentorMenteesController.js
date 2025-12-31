import MentorMentees from '../models/mentorMenteesModel.js';
import User from '../models/userModel.js';
import sendEmail from '../utils/emailUtils.js';
import Notification from '../models/notificationModel.js';
import Conversation from '../models/conversationModel.js';

const mentorMenteesController = {
    // Mentor views list of their mentees
    async list(req, res) {
        try {
            const mentorId = parseInt(req.params.mentorId, 10);
            if (isNaN(mentorId)) return res.status(400).json({ message: 'Invalid mentor id' });

            // Only the mentor himself can view their mentees
            if (!req.user || req.user.id !== mentorId) return res.status(403).json({ message: 'Forbidden' });

            const { limit = 50, offset = 0 } = req.query;
            console.log(`[DEBUG] Listing mentees for mentorId: ${mentorId}, Limit: ${limit}, Offset: ${offset}`);
            const mentees = await MentorMentees.listMentees(mentorId, { limit, offset });
            console.log(`[DEBUG] Found ${mentees.length} mentees`);
            res.json({ mentees });
        } catch (err) {
            console.error('Error listing mentees:', err);
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    },

    // Mentee requests connection to mentor (mentee role) or mentor can add a mentee directly
    async requestOrAdd(req, res) {
        try {
            const mentorId = parseInt(req.params.mentorId, 10);
            if (isNaN(mentorId)) return res.status(400).json({ message: 'Invalid mentor id' });

            // If requester is mentee, create a request for themselves
            if (req.user.role.toLowerCase() === 'mentee') {
                const menteeId = req.user.id;
                const existing = await MentorMentees.getRelationship(mentorId, menteeId);

                if (existing) {
                    if (existing.status === 'active') {
                        return res.status(400).json({ message: 'You are already connected with this mentor.', status: existing.status });
                    } else if (existing.status === 'requested') {
                        return res.status(400).json({ message: 'Request already pending.', status: existing.status });
                    } else {
                        // Status is 'rejected' or 'inactive', allow re-request
                        await MentorMentees.reRequestRelationship(mentorId, menteeId);
                    }
                } else {
                    await MentorMentees.createRelationship(mentorId, menteeId, 'requested');
                }

                // Fetch mentor and mentee info to notify
                const mentorUser = await User.findUserById(mentorId);
                const menteeUser = await User.findUserById(menteeId);
                const menteeName = (menteeUser && (menteeUser.username || menteeUser.email)) || 'A mentee';

                if (mentorUser) {
                    // Create in-app notification
                    try {
                        await Notification.create(mentorId, 'mentee_request', { menteeId, menteeName });
                    } catch (notifErr) {
                        console.error('Failed to create DB notification:', notifErr);
                    }

                    // Send email notification (best-effort)
                    try {
                        const subject = `New mentorship request from ${menteeName}`;
                        const html = `<p>Hello ${mentorUser.username || 'Mentor'},</p>
                            <p>You have a new mentorship request from ${menteeName}.</p>
                            <p><a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/mentor/${mentorId}/mentees">View requests</a></p>`;
                        await sendEmail(mentorUser.email, subject, html);
                    } catch (emailErr) {
                        console.error('Failed to send mentee request email:', emailErr);
                    }
                }

                return res.status(201).json({ message: 'Request created', status: 'requested' });
            }

            // If requester is mentor, they can add a mentee directly by passing menteeId in body
            if (req.user.role === 'mentor' && req.user.id === mentorId) {
                const { menteeId } = req.body;
                if (!menteeId) return res.status(400).json({ message: 'menteeId required' });
                const user = await User.findUserById(menteeId);
                if (!user || user.role.toLowerCase() !== 'mentee') return res.status(400).json({ message: 'Invalid mentee id' });
                const existing = await MentorMentees.getRelationship(mentorId, menteeId);
                if (existing) return res.status(400).json({ message: 'Relationship already exists' });
                await MentorMentees.createRelationship(mentorId, menteeId, 'active');
                return res.status(201).json({ message: 'Mentee added' });
            }

            return res.status(403).json({ message: 'Forbidden' });
        } catch (err) {
            console.error('Error requesting/adding mentee:', err);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Check relationship status (for mentee to see if they requested/connected)
    async checkStatus(req, res) {
        try {
            const mentorId = parseInt(req.params.mentorId, 10);
            if (isNaN(mentorId)) return res.status(400).json({ message: 'Invalid mentor id' });

            if (!req.user || req.user.role.toLowerCase() !== 'mentee') {
                return res.status(403).json({ message: 'Forbidden: Only mentees can check status' });
            }

            const menteeId = req.user.id;
            const relationship = await MentorMentees.getRelationship(mentorId, menteeId);

            if (relationship) {
                return res.json({ status: relationship.status });
            } else {
                return res.json({ status: 'none' });
            }
        } catch (err) {
            console.error('Error checking status:', err);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Mentor updates status of a relationship (accept request / deactivate)
    async updateStatus(req, res) {
        try {
            const mentorId = parseInt(req.params.mentorId, 10);
            const menteeId = parseInt(req.params.menteeId, 10);
            if (isNaN(mentorId) || isNaN(menteeId)) return res.status(400).json({ message: 'Invalid ids' });

            if (!req.user || req.user.id !== mentorId) return res.status(403).json({ message: 'Forbidden' });

            const { status } = req.body;
            if (!['requested', 'active', 'inactive'].includes(status)) return res.status(400).json({ message: 'Invalid status' });

            const existing = await MentorMentees.getRelationship(mentorId, menteeId);
            if (!existing) return res.status(404).json({ message: 'Relationship not found' });

            await MentorMentees.updateStatus(mentorId, menteeId, status);

            // If status is 'active', ensure a conversation exists
            if (status === 'active') {
                const existingConv = await Conversation.findConversationBetween(mentorId, menteeId);
                if (!existingConv) {
                    await Conversation.createConversation([mentorId, menteeId]);
                    console.log(`[Message] Conversation created for mentor ${mentorId} and mentee ${menteeId}`);
                }
            }

            res.json({ message: 'Status updated' });
        } catch (err) {
            console.error('Error updating mentee status:', err);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Mentor removes a relationship
    async remove(req, res) {
        try {
            const mentorId = parseInt(req.params.mentorId, 10);
            const menteeId = parseInt(req.params.menteeId, 10);
            if (isNaN(mentorId) || isNaN(menteeId)) return res.status(400).json({ message: 'Invalid ids' });

            if (!req.user || req.user.id !== mentorId) return res.status(403).json({ message: 'Forbidden' });

            const existing = await MentorMentees.getRelationship(mentorId, menteeId);
            if (!existing) return res.status(404).json({ message: 'Relationship not found' });

            await MentorMentees.removeRelationship(mentorId, menteeId);
            res.json({ message: 'Relationship removed' });
        } catch (err) {
            console.error('Error removing mentee relationship:', err);
            res.status(500).json({ message: 'Server error' });
        }
    }
};

export default mentorMenteesController;
