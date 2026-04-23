import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import Admin from '../models/Admin.js';
import Appointment from '../models/Appointment.js';
import Payment from '../models/Payment.js';
import Specialty from '../models/Specialty.js';
import Notification from '../models/Notification.js';

export const getDashboardStats = async (req, res) => {
    try {
        const totalPatients = await Patient.countDocuments();
        const totalDoctors = await Doctor.countDocuments();
        const totalAppointments = await Appointment.countDocuments();
        const totalRevenue = await Payment.aggregate([
            { $match: { paymentStatus: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const appointmentsByStatus = await Appointment.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const recentAppointments = await Appointment.find()
            .populate('patient', 'firstName lastName email')
            .populate('doctor', 'firstName lastName')
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).json({
            success: true,
            stats: {
                totalPatients,
                totalDoctors,
                totalAppointments,
                totalRevenue: totalRevenue[0]?.total || 0,
                appointmentsByStatus,
                recentAppointments
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const manageUsers = async (req, res) => {
    try {
        const { role, page = 1, limit = 10, search } = req.query;

        let query = {};
        if (role) query.role = role;
        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            users,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const toggleUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByIdAndUpdate(
            userId,
            { isActive: !user.isActive },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'User status updated',
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const createDoctor = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password, licenseNumber, specialization, experience, consultationFee } = req.body;

        // Create user
        const user = new Doctor({
            firstName,
            lastName,
            email,
            phone,
            password,
            role: 'doctor',
            licenseNumber,
            specialization,
            experience,
            consultationFee
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: 'Doctor created successfully',
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const manageSpecialties = async (req, res) => {
    try {
        const specialties = await Specialty.find();

        res.status(200).json({
            success: true,
            specialties
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const createSpecialty = async (req, res) => {
    try {
        const { name, description, icon } = req.body;

        const specialty = new Specialty({
            name,
            description,
            icon
        });

        await specialty.save();

        res.status(201).json({
            success: true,
            message: 'Specialty created successfully',
            specialty
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateSpecialty = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, icon, isActive } = req.body;

        const specialty = await Specialty.findByIdAndUpdate(
            id,
            { name, description, icon, isActive },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Specialty updated successfully',
            specialty
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getAppointmentReports = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        let query = {};
        if (startDate && endDate) {
            query.appointmentDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const appointments = await Appointment.find(query)
            .populate('doctor', 'firstName lastName')
            .populate('specialty', 'name')
            .sort({ appointmentDate: -1 });

        const stats = {
            total: appointments.length,
            byStatus: {},
            bySpecialty: {},
            byDoctor: {}
        };

        appointments.forEach(apt => {
            // Count by status
            stats.byStatus[apt.status] = (stats.byStatus[apt.status] || 0) + 1;

            // Count by specialty
            const specialtyName = apt.specialty?.name || 'Unknown';
            stats.bySpecialty[specialtyName] = (stats.bySpecialty[specialtyName] || 0) + 1;

            // Count by doctor
            const doctorName = `${apt.doctor?.firstName} ${apt.doctor?.lastName}`;
            stats.byDoctor[doctorName] = (stats.byDoctor[doctorName] || 0) + 1;
        });

        res.status(200).json({
            success: true,
            appointments,
            stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getPaymentReports = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        let query = {};
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const payments = await Payment.find(query)
            .populate('patient', 'firstName lastName email')
            .sort({ createdAt: -1 });

        const stats = {
            total: payments.length,
            totalRevenue: payments.reduce((sum, p) => sum + (p.paymentStatus === 'completed' ? p.amount : 0), 0),
            byPaymentMethod: {},
            byStatus: {}
        };

        payments.forEach(payment => {
            stats.byPaymentMethod[payment.paymentMethod] = (stats.byPaymentMethod[payment.paymentMethod] || 0) + 1;
            stats.byStatus[payment.paymentStatus] = (stats.byStatus[payment.paymentStatus] || 0) + 1;
        });

        res.status(200).json({
            success: true,
            payments,
            stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const sendNotification = async (req, res) => {
    try {
        const { userId, type, title, message } = req.body;

        const notification = new Notification({
            recipient: userId,
            type,
            title,
            message
        });

        await notification.save();

        res.status(201).json({
            success: true,
            message: 'Notification sent successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
