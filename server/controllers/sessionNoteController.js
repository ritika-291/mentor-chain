import SessionNote from '../models/sessionNoteModel.js';
import sessionModel from '../models/sessionModel.js';
import { uploadFile } from '../utils/storageUtils.js';

const SessionNoteController = {
    async submitNote(req, res) {
        try {
            const sessionId = parseInt(req.params.sessionId, 10);
            const userId = req.user.id; // must be mentor
            const session = await sessionModel.getById(sessionId);
            if (!session) return res.status(404).json({ message: 'Session not found' });
            if (session.mentor_id !== userId) return res.status(403).json({ message: 'Only the session mentor can add notes' });

            const content = req.body.content || null;
            const attachments = [];

            // Handle uploaded files (if any)
            if (req.files && req.files.length > 0) {
                for (const f of req.files) {
                    const result = await uploadFile({ localPath: f.path, filename: f.filename });
                    attachments.push({ originalName: f.originalname, filename: f.filename, size: f.size, url: result.url, provider: result.provider });
                }
            }

            const note = await SessionNote.createNote(sessionId, userId, content, attachments);
            return res.status(201).json(note);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to save note' });
        }
    },

    async listNotes(req, res) {
        try {
            const sessionId = parseInt(req.params.sessionId, 10);
            const userId = req.user.id;
            const session = await sessionModel.getById(sessionId);
            if (!session) return res.status(404).json({ message: 'Session not found' });
            // Only mentor can view notes (private notes for mentors)
            if (session.mentor_id !== userId) return res.status(403).json({ message: 'Not authorized to view notes' });

            const notes = await SessionNote.listBySession(sessionId);
            return res.json(notes);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to fetch notes' });
        }
    }
};

export default SessionNoteController;