import express from 'express';
import {
    createAppointment,
    getAppointments,
    getAppointmentDetails,
    updateAppointment,
    cancelAppointment,
    rateAppointment
} from '../controllers/appointmentController.js';
import { authMiddleware, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, authorize('patient'), createAppointment);
router.get('/', authMiddleware, getAppointments);
router.get('/:id', authMiddleware, getAppointmentDetails);
router.put('/:id', authMiddleware, authorize('patient'), updateAppointment);
router.delete('/:id', authMiddleware, authorize('patient'), cancelAppointment);
router.post('/:id/rate', authMiddleware, authorize('patient'), rateAppointment);

export default router;
