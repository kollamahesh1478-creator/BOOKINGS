import express from 'express';
import { authMiddleware, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Patient routes
router.get('/profile', authMiddleware, authorize('patient'), (req, res) => {
    // Get patient profile
    res.json({ message: 'Get patient profile' });
});

router.put('/profile', authMiddleware, authorize('patient'), (req, res) => {
    // Update patient profile
    res.json({ message: 'Update patient profile' });
});

router.get('/medical-history', authMiddleware, authorize('patient'), (req, res) => {
    // Get medical history
    res.json({ message: 'Get medical history' });
});

router.get('/prescriptions', authMiddleware, authorize('patient'), (req, res) => {
    // Get prescriptions
    res.json({ message: 'Get prescriptions' });
});

router.get('/appointments', authMiddleware, authorize('patient'), (req, res) => {
    // Get appointments
    res.json({ message: 'Get appointments' });
});

export default router;
