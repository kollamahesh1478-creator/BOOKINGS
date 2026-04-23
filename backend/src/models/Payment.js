import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        unique: true,
        required: true
    },
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
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
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: 0
    },
    currency: {
        type: String,
        default: 'INR'
    },
    paymentMethod: {
        type: String,
        enum: [
            'stripe',
            'paypal',
            'razorpay',
            'googlepay',
            'phonpe',
            'paytm',
            'netbanking',
            'wallet',
            'cash'
        ],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded', 'partially_refunded'],
        default: 'pending'
    },
    transactionDetails: {
        gatewayTransactionId: String,
        authorizationCode: String,
        cardLast4: String,
        cardBrand: String,
        bankName: String,
        upiId: String
    },
    refundDetails: {
        refundId: String,
        refundAmount: Number,
        refundDate: Date,
        refundReason: String,
        refundStatus: {
            type: String,
            enum: ['pending', 'completed', 'failed']
        }
    },
    failureReason: String,
    notes: String,
    ipAddress: String,
    userAgent: String,
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
paymentSchema.index({ appointment: 1 });
paymentSchema.index({ patient: 1 });
paymentSchema.index({ paymentStatus: 1 });
paymentSchema.index({ createdAt: -1 });

export default mongoose.model('Payment', paymentSchema);
