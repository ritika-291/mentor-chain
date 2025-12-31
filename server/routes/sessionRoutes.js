import express from 'express';
import sessionController from '../controllers/sessionController.js';
import reviewController from '../controllers/reviewController.js';
import sessionNoteController from '../controllers/sessionNoteController.js';
import upload from '../middleware/uploadMiddleware.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Mentee requests a session
router.post('/', authenticate, requireRole('mentee'), sessionController.requestSession);

// Mentor schedules a session
router.post('/schedule', authenticate, requireRole('mentor'), sessionController.scheduleSession);

// Mentor: list their sessions
router.get('/mentor/:mentorId', authenticate, requireRole('mentor'), sessionController.listForMentor);

// Mentee: list their sessions
router.get('/mentee/:menteeId', authenticate, requireRole('mentee'), sessionController.listForMentee);

// Update session status (mentor only)
router.patch('/:sessionId/status', authenticate, requireRole('mentor'), sessionController.updateStatus);

// Mentee submits a review for a completed session
router.post('/:sessionId/review', authenticate, requireRole('mentee'), reviewController.submitReview);

// Session notes (private to mentors)
// Mentor posts note with optional attachments (multipart/form-data)
router.post('/:sessionId/notes', authenticate, requireRole('mentor'), upload.array('attachments', 5), sessionNoteController.submitNote);
// Mentor lists notes for a session
router.get('/:sessionId/notes', authenticate, requireRole('mentor'), sessionNoteController.listNotes);

export default router;