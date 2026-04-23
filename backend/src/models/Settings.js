import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    hospitalName: {
        type: String,
        default: 'Hospital Name'
    },
    hospitalLogo: {
        type: String,
        default: '/logo.png' // URL or path to logo
    },
    hospitalAddress: {
        type: String,
        default: 'Hospital Address'
    },
    hospitalPhone: {
        type: String,
        default: '+1-234-567-8900'
    },
    hospitalEmail: {
        type: String,
        default: 'info@hospital.com'
    },
    slotDuration: {
        type: Number,
        default: 30 // minutes
    },
    workingHours: {
        start: {
            type: String,
            default: '09:00'
        },
        end: {
            type: String,
            default: '17:00'
        }
    },
    maxAppointmentsPerDay: {
        type: Number,
        default: 10
    },
    allowPatientMultipleAppointments: {
        type: Boolean,
        default: false // If false, patient can only book one per day
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);