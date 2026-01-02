
import express from 'express';
import { createPost, getPosts, likePost, commentOnPost, getPostComments } from '../controllers/communityController.js';
import { authenticate as protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createPost);
router.get('/', protect, getPosts);
router.put('/:id/like', protect, likePost); // PUT is often used for idempotent updates like likes, or POST
router.post('/:id/comment', protect, commentOnPost);
router.get('/:id/comments', protect, getPostComments);

export default router;
