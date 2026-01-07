
import express from 'express';
import {
    createRoadmap, getAllRoadmaps, getMyRoadmaps,
    getRoadmapDetails, enrollRoadmap, unenrollRoadmap, updateProgress,
    deleteRoadmap, updateRoadmap
} from '../controllers/roadmapController.js';
import { authenticate as protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public / General
// Mentee routes (Specific paths first)
router.get('/my/enrolled', protect, getMyRoadmaps); // Get enrolled roadmaps

// Public / General
router.get('/', getAllRoadmaps); // List all available roadmaps
router.get('/:id', protect, getRoadmapDetails); // Get one details

// Mentor
router.post('/', protect, createRoadmap); // Create new
router.delete('/:id', protect, deleteRoadmap); // Delete
router.put('/:id', protect, updateRoadmap); // Update title/desc

// Mentee

router.post('/:id/enroll', protect, enrollRoadmap); // Enroll in a roadmap
router.post('/:id/unenroll', protect, unenrollRoadmap); // Unenroll
router.put('/:id/steps/:stepId', protect, updateProgress); // Check/Uncheck step

export default router;
