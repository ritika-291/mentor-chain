
import express from 'express';
import {
    createRoadmap, getAllRoadmaps, getMyRoadmaps,
    getRoadmapDetails, enrollRoadmap, updateProgress,
    deleteRoadmap, updateRoadmap
} from '../controllers/roadmapController.js';
import { authenticate as protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public / General
router.get('/', getAllRoadmaps); // List all available roadmaps
router.get('/:id', protect, getRoadmapDetails); // Get one details (needs auth for progress status, strictly speaking maybe optional but simpler with)

// Mentor
router.post('/', protect, createRoadmap); // Create new
router.delete('/:id', protect, deleteRoadmap); // Delete
router.put('/:id', protect, updateRoadmap); // Update title/desc

// Mentee
router.get('/my/enrolled', protect, getMyRoadmaps); // Get enrolled roadmaps
router.post('/:id/enroll', protect, enrollRoadmap); // Enroll in a roadmap
router.put('/:id/steps/:stepId', protect, updateProgress); // Check/Uncheck step

export default router;
