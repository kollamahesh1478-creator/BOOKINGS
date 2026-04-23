import express from 'express';
import { getDoctors, getDoctorDetails, getAvailableSlots, updateDoctor } from '../controllers/doctorController.js';
import { authMiddleware, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getDoctors);
router.get('/:id', getDoctorDetails);
router.get('/:doctorId/available-slots', getAvailableSlots);
router.put('/:id', authMiddleware, authorize('doctor'), updateDoctor);

export default router;
