import express from 'express';
import profileController from '../controllers/profileController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { uploadProfilePicture } from '../middleware/uploadMiddleware.js';

const router = express.Router();


// All profile routes require authentication
router.use(authenticate);

// Get user profile
router.get('/me', profileController.getProfile);

// Update user profile
router.put('/me', profileController.updateProfile);

// Upload profile picture
router.post('/me/avatar', uploadProfilePicture, profileController.uploadProfilePicture);

export default router;
