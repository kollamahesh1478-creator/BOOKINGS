import mongoose from 'mongoose';
import User from './User.js';

const patientSchema = new mongoose.Schema({
    dateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required']
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        default: null
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    emergencyContact: {
        name: String,
        relationship: String,
        phone: String
    },
    medicalHistory: [{
        condition: String,
        diagnosis: Date,
        description: String
    }],
    allergies: [String],
    currentMedications: [String],
    insuranceDetails: {
        provider: String,
        policyNumber: String,
        expiryDate: Date
    },
    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    }],
    prescriptions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prescription'
    }],
    medicalRecords: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MedicalRecord'
    }]
}, { timestamps: true });

export default User.discriminator('patient', patientSchema);
