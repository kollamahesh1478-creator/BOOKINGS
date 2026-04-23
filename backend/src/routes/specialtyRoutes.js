import express from 'express';

const router = express.Router();

// Get specialties
router.get('/', (req, res) => {
    res.json({ message: 'Get all specialties' });
});

// Get specialty by ID
router.get('/:id', (req, res) => {
    res.json({ message: 'Get specialty details' });
});

// Create specialty (admin only)
router.post('/', (req, res) => {
    res.json({ message: 'Create specialty' });
});

export default router;
