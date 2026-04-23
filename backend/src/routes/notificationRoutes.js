import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get notifications
router.get('/', authMiddleware, (req, res) => {
    res.json({ message: 'Get notifications' });
});

// Mark notification as read
router.put('/:id/read', authMiddleware, (req, res) => {
    res.json({ message: 'Mark notification as read' });
});

// Delete notification
router.delete('/:id', authMiddleware, (req, res) => {
    res.json({ message: 'Delete notification' });
});

export default router;
