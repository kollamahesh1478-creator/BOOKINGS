import express from 'express';
import {
    getDashboardStats,
    manageUsers,
    toggleUserStatus,
    createDoctor,
    manageSpecialties,
    createSpecialty,
    updateSpecialty,
    getAppointmentReports,
    getPaymentReports,
    sendNotification
} from '../controllers/adminController.js';
import { authMiddleware, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Dashboard
router.get('/dashboard', authMiddleware, authorize('admin', 'superadmin'), getDashboardStats);

// User Management
router.get('/users', authMiddleware, authorize('admin', 'superadmin'), manageUsers);
router.post('/users/:userId/toggle-status', authMiddleware, authorize('admin', 'superadmin'), toggleUserStatus);

// Doctor Management
router.post('/doctors', authMiddleware, authorize('admin', 'superadmin'), createDoctor);

// Specialty Management
router.get('/specialties', authMiddleware, authorize('admin', 'superadmin'), manageSpecialties);
router.post('/specialties', authMiddleware, authorize('admin', 'superadmin'), createSpecialty);
router.put('/specialties/:id', authMiddleware, authorize('admin', 'superadmin'), updateSpecialty);

// Reports
router.get('/reports/appointments', authMiddleware, authorize('admin', 'superadmin'), getAppointmentReports);
router.get('/reports/payments', authMiddleware, authorize('admin', 'superadmin'), getPaymentReports);

// Notifications
router.post('/notifications', authMiddleware, authorize('admin', 'superadmin'), sendNotification);

export default router;
