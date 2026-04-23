import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: [
            'appointment_confirmed',
            'appointment_reminder',
            'appointment_cancelled',
            'appointment_rescheduled',
            'payment_received',
            'payment_failed',
            'prescription_ready',
            'doctor_review',
            'message',
            'system_notification'
        ],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    relatedAppointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    },
    relatedPayment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: Date,
    channel: {
        type: String,
        enum: ['email', 'sms', 'inapp', 'push'],
        default: 'inapp'
    },
    deliveryStatus: {
        type: String,
        enum: ['pending', 'sent', 'failed', 'bounced'],
        default: 'pending'
    },
    deliveryAttempts: {
        type: Number,
        default: 0
    },
    lastAttemptAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000) // 30 days
    }
}, { timestamps: true });

// Index for faster queries
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Notification', notificationSchema);
