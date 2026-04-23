import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    appointmentId: {
        type: String,
        unique: true,
        required: true
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    specialty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Specialty',
        required: true
    },
    appointmentDate: {
        type: Date,
        required: true
    },
    timeSlot: {
        startTime: String,
        endTime: String
    },
    status: {
        type: String,
        enum: ['scheduled', 'confirmed', 'cancelled', 'completed', 'noshow', 'rescheduled'],
        default: 'scheduled'
    },
    appointmentType: {
        type: String,
        enum: ['consultation', 'followup', 'procedure'],
        default: 'consultation'
    },
    symptoms: String,
    notes: String,
    consultationMode: {
        type: String,
        enum: ['online', 'inperson'],
        default: 'inperson'
    },
    meetingLink: String,
    location: String,
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    remindersSent: {
        email: {
            type: Boolean,
            default: false
        },
        sms: {
            type: Boolean,
            default: false
        }
    },
    cancellationReason: String,
    cancellationDate: Date,
    prescription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prescription'
    },
    medicalRecord: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MedicalRecord'
    },
    rating: Number,
    review: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Index for faster queries
appointmentSchema.index({ patient: 1, appointmentDate: -1 });
appointmentSchema.index({ doctor: 1, appointmentDate: -1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ appointmentDate: 1 });

export default mongoose.model('Appointment', appointmentSchema);
