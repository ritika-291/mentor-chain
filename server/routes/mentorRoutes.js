import express from 'express';
import mentorController from '../controllers/mentorController.js';
import mentorMenteesController from '../controllers/mentorMenteesController.js';
import availabilityController from '../controllers/availabilityController.js';
import calendarController from '../controllers/calendarIntegrationController.js';
import reviewController from '../controllers/reviewController.js';
import analyticsController from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public: list mentors
router.get('/', mentorController.listPublic);

// Public: view mentor profile
router.get('/:mentorId/profile', mentorController.getProfile);

// Public: get mentor reviews
router.get('/:mentorId/reviews', reviewController.listReviewsByMentor);

// Mentor dashboard overview (protected, mentor or admin)
router.get('/:mentorId/overview', authenticate, requireRole('mentor'), analyticsController.overview);

// Protected: mentor updates their own profile
router.put('/:mentorId/profile', authenticate, requireRole('mentor'), mentorController.updateProfile);

// Mentees relationships
// Mentor views their mentees
router.get('/:mentorId/mentees', authenticate, requireRole('mentor'), mentorMenteesController.list);

// Mentee requests connection to mentor OR mentor adds mentee directly
router.post('/:mentorId/mentees', authenticate, mentorMenteesController.requestOrAdd);

// Mentee checks status with mentor
router.get('/:mentorId/mentees/status', authenticate, mentorMenteesController.checkStatus);

// Mentor accepts/rejects or updates status
router.patch('/:mentorId/mentees/:menteeId', authenticate, requireRole('mentor'), mentorMenteesController.updateStatus);

// Mentor removes a mentee
router.delete('/:mentorId/mentees/:menteeId', authenticate, requireRole('mentor'), mentorMenteesController.remove);

// Availability endpoints
// Public: get availability
router.get('/:mentorId/availability', availabilityController.getAvailability);
// Protected: mentor updates availability
router.put('/:mentorId/availability', authenticate, requireRole('mentor'), availabilityController.updateAvailability);

// Calendar integration (placeholder for token-only connect)
router.post('/:mentorId/calendar/connect', authenticate, requireRole('mentor'), calendarController.connect);

// Google OAuth helpers
router.get('/:mentorId/calendar/connect/url', authenticate, requireRole('mentor'), (req, res, next) => import('../controllers/calendarOAuthController.js').then(mod => mod.default.getAuthUrl(req, res, next)).catch(next));
// OAuth callback endpoint (public)
router.get('/calendar/oauth/callback', (req, res, next) => import('../controllers/calendarOAuthController.js').then(mod => mod.default.oauthCallback(req, res, next)).catch(next));

export default router;
