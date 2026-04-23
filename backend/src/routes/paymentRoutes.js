import express from 'express';
import {
    initiatePayment,
    verifyPayment,
    getPaymentHistory,
    processRefund
} from '../controllers/paymentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/initiate', authMiddleware, initiatePayment);
router.post('/verify', authMiddleware, verifyPayment);
router.get('/history', authMiddleware, getPaymentHistory);
router.post('/refund', authMiddleware, processRefund);

export default router;
