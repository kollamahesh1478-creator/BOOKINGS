import mongoose from 'mongoose';
import User from './User.js';

const doctorSchema = new mongoose.Schema({
    licenseNumber: {
        type: String,
        required: [true, 'License number is required'],
        unique: true
    },
    specialization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Specialty',
        required: [true, 'Specialization is required']
    },
    subSpecializations: [String],
    qualifications: [{
        degree: String,
        institute: String,
        year: Number,
        certificateUrl: String
    }],
    experience: {
        type: Number,
        required: [true, 'Years of experience is required'],
        min: 0
    },
    consultationFee: {
        type: Number,
        required: [true, 'Consultation fee is required'],
        min: 0
    },
    availableSlots: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        startTime: String,
        endTime: String,
        slotDuration: {
            type: Number,
            default: 30 // in minutes
        }
    }],
    hospitalAffiliations: [String],
    bio: String,
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    isAvailable: {
        type: Boolean,
        default: true
    },
    bankDetails: {
        accountNumber: String,
        ifscCode: String,
        bankName: String,
        accountHolderName: String
    }
}, { timestamps: true });

export default User.discriminator('doctor', doctorSchema);
