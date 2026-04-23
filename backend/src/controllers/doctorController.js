import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';

export const getDoctors = async (req, res) => {
    try {
        const { specialization, search, page = 1, limit = 10 } = req.query;

        let query = { isAvailable: true };

        if (specialization) {
            query.specialization = specialization;
        }

        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { bio: { $regex: search, $options: 'i' } }
            ];
        }

        const doctors = await Doctor.find(query)
            .populate('specialization', 'name')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ rating: -1 });

        const total = await Doctor.countDocuments(query);

        res.status(200).json({
            success: true,
            doctors,
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

export const getDoctorDetails = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id)
            .populate('specialization', 'name description')
            .populate('appointments');

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        // Get doctor's appointments count
        const appointments = await Appointment.countDocuments({
            doctor: req.params.id,
            status: 'completed'
        });

        res.status(200).json({
            success: true,
            doctor: {
                ...doctor.toObject(),
                totalAppointments: appointments
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getAvailableSlots = async (req, res) => {
    try {
        const { doctorId, date } = req.query;

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        const selectedDate = new Date(date);
        const dayName = selectedDate.toLocaleString('en-US', { weekday: 'long' });

        // Get available slots for the day
        const availableSlot = doctor.availableSlots.find(slot => slot.day === dayName);
        if (!availableSlot) {
            return res.status(200).json({
                success: true,
                slots: []
            });
        }

        // Get booked appointments for this day
        const bookedAppointments = await Appointment.find({
            doctor: doctorId,
            appointmentDate: {
                $gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
                $lt: new Date(selectedDate.setHours(23, 59, 59, 999))
            },
            status: { $ne: 'cancelled' }
        });

        // Generate time slots
        const slots = [];
        const [startHour, startMin] = availableSlot.startTime.split(':').map(Number);
        const [endHour, endMin] = availableSlot.endTime.split(':').map(Number);

        let currentTime = new Date(selectedDate);
        currentTime.setHours(startHour, startMin, 0, 0);

        const slotDuration = availableSlot.slotDuration || 30;

        while (currentTime.getHours() < endHour || (currentTime.getHours() === endHour && currentTime.getMinutes() < endMin)) {
            const slotStart = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
            const slotEnd = new Date(currentTime.getTime() + slotDuration * 60000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

            const isBooked = bookedAppointments.some(apt => apt.timeSlot.startTime === slotStart);

            if (!isBooked) {
                slots.push({ startTime: slotStart, endTime: slotEnd });
            }

            currentTime = new Date(currentTime.getTime() + slotDuration * 60000);
        }

        res.status(200).json({
            success: true,
            slots
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateDoctor = async (req, res) => {
    try {
        const { bio, availableSlots, consultationFee, qualifications } = req.body;

        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            { bio, availableSlots, consultationFee, qualifications, updatedAt: new Date() },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Doctor profile updated successfully',
            doctor
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
