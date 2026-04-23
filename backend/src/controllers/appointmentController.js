import Appointment from '../models/Appointment.js';
import Payment from '../models/Payment.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail, appointmentConfirmationEmail, appointmentReminderEmail } from '../utils/notifications.js';
import { sendSMS } from '../utils/notifications.js';

export const createAppointment = async (req, res) => {
    try {
        const { doctorId, appointmentDate, timeSlot, symptoms, appointmentType = 'consultation', consultationMode = 'inperson' } = req.body;

        // Validate doctor exists
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        // Check if slot is available
        const existingAppointment = await Appointment.findOne({
            doctor: doctorId,
            appointmentDate: new Date(appointmentDate),
            'timeSlot.startTime': timeSlot.startTime,
            status: { $ne: 'cancelled' }
        });

        if (existingAppointment) {
            return res.status(400).json({
                success: false,
                message: 'This time slot is already booked'
            });
        }

        // Create appointment
        const appointment = new Appointment({
            appointmentId: `APT-${uuidv4()}`,
            patient: req.user.id,
            doctor: doctorId,
            specialty: doctor.specialization,
            appointmentDate: new Date(appointmentDate),
            timeSlot,
            symptoms,
            appointmentType,
            consultationMode,
            status: 'scheduled',
            paymentStatus: 'pending'
        });

        await appointment.save();

        // Add appointment to patient's records
        await Patient.findByIdAndUpdate(
            req.user.id,
            { $push: { appointments: appointment._id } }
        );

        // Add appointment to doctor's records
        await Doctor.findByIdAndUpdate(
            doctorId,
            { $push: { appointments: appointment._id } }
        );

        res.status(201).json({
            success: true,
            message: 'Appointment created successfully',
            appointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getAppointments = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        let query = { patient: req.user.id };
        if (status) query.status = status;

        const appointments = await Appointment.find(query)
            .populate('doctor', 'firstName lastName specialization consultationFee')
            .populate('specialty', 'name')
            .sort({ appointmentDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Appointment.countDocuments(query);

        res.status(200).json({
            success: true,
            appointments,
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

export const getAppointmentDetails = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('doctor')
            .populate('specialty')
            .populate('payment');

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        res.status(200).json({
            success: true,
            appointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateAppointment = async (req, res) => {
    try {
        const { symptoms, notes } = req.body;

        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { symptoms, notes, updatedAt: new Date() },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Appointment updated successfully',
            appointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const cancelAppointment = async (req, res) => {
    try {
        const { cancellationReason } = req.body;

        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        if (appointment.status === 'completed' || appointment.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel this appointment'
            });
        }

        // Check if cancellation is within allowed time
        const appointmentTime = new Date(appointment.appointmentDate);
        const now = new Date();
        const hoursDifference = (appointmentTime - now) / (1000 * 60 * 60);

        if (hoursDifference < 2) {
            return res.status(400).json({
                success: false,
                message: 'Appointment can only be cancelled at least 2 hours before'
            });
        }

        appointment.status = 'cancelled';
        appointment.cancellationReason = cancellationReason;
        appointment.cancellationDate = new Date();
        await appointment.save();

        // Process refund if payment was made
        if (appointment.paymentStatus === 'completed') {
            const payment = await Payment.findById(appointment.payment);
            if (payment) {
                payment.paymentStatus = 'refunded';
                await payment.save();
            }
        }

        res.status(200).json({
            success: true,
            message: 'Appointment cancelled successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const rateAppointment = async (req, res) => {
    try {
        const { rating, review } = req.body;

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { rating, review, updatedAt: new Date() },
            { new: true }
        );

        // Update doctor rating
        const appointments = await Appointment.find({ doctor: appointment.doctor, rating: { $exists: true } });
        const avgRating = appointments.reduce((sum, apt) => sum + apt.rating, 0) / appointments.length;

        await Doctor.findByIdAndUpdate(
            appointment.doctor,
            { rating: avgRating, totalReviews: appointments.length }
        );

        res.status(200).json({
            success: true,
            message: 'Review submitted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
