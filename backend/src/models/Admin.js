import mongoose from 'mongoose';
import User from './User.js';

const adminSchema = new mongoose.Schema({
    adminType: {
        type: String,
        enum: ['superadmin', 'hospitaladmin', 'departmentadmin'],
        default: 'hospitaladmin'
    },
    permissions: [{
        type: String,
        enum: [
            'manage_users',
            'manage_doctors',
            'manage_patients',
            'manage_appointments',
            'manage_payments',
            'view_reports',
            'manage_hospital',
            'manage_specialties',
            'manage_settings'
        ]
    }],
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Specialty'
    },
    assignedHospital: String,
    activityLog: [{
        action: String,
        details: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

export default User.discriminator('admin', adminSchema);
