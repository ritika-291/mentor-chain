
import Roadmap from '../models/roadmapModel.js';

// Mentor: Create a new roadmap
export const createRoadmap = async (req, res) => {
    try {
        const { title, description, steps } = req.body; // steps is array of {title, description, resourceLink}
        const mentorId = req.user.id;

        if (!title || !steps || !Array.isArray(steps)) {
            return res.status(400).json({ message: 'Title and steps are required' });
        }

        const roadmapId = await Roadmap.create(mentorId, title, description);

        // Add steps
        for (let i = 0; i < steps.length; i++) {
            const s = steps[i];
            await Roadmap.addStep(roadmapId, s.title, s.description, i + 1, s.resourceLink);
        }

        res.status(201).json({ message: 'Roadmap created', roadmapId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Public/All: Get all roadmaps
export const getAllRoadmaps = async (req, res) => {
    try {
        const roadmaps = await Roadmap.getAllRoadmaps();
        res.json(roadmaps);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Mentee: Get My Roadmaps
export const getMyRoadmaps = async (req, res) => {
    try {
        const userId = req.user.id;
        const roadmaps = await Roadmap.getUserRoadmaps(userId);
        res.json(roadmaps);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Single: Get Details (with progress if logged in)
export const getRoadmapDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user ? req.user.id : null;
        const roadmap = await Roadmap.getRoadmapDetails(id, userId);

        if (!roadmap) return res.status(404).json({ message: 'Roadmap not found' });

        res.json(roadmap);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Mentee: Enroll/Assign
export const enrollRoadmap = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        await Roadmap.assignToUser(userId, id);
        res.json({ message: 'Enrolled successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Mentee: Toggle Step
export const updateProgress = async (req, res) => {
    try {
        const { id, stepId } = req.params; // Roadmap ID, Step ID
        const { completed } = req.body; // true/false
        const userId = req.user.id;

        await Roadmap.updateStepProgress(userId, id, stepId, completed);
        res.json({ message: 'Progress updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
