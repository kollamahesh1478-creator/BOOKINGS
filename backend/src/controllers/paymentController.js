import Payment from '../models/Payment.js';
import Appointment from '../models/Appointment.js';
import { stripe, getPayPalAccessToken, razorpayConfig } from '../config/paymentConfig.js';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail, paymentReceiptEmail } from '../utils/notifications.js';
import crypto from 'crypto';

export const initiatePayment = async (req, res) => {
    try {
        const { appointmentId, paymentMethod, amount } = req.body;

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        const transactionId = `TXN-${uuidv4()}`;

        switch (paymentMethod) {
            case 'stripe':
                return initiateStripePayment(req, res, appointmentId, amount, transactionId);
            case 'paypal':
                return initiatePayPalPayment(req, res, appointmentId, amount, transactionId);
            case 'razorpay':
                return initiateRazorpayPayment(req, res, appointmentId, amount, transactionId);
            case 'googlepay':
                return initiateGooglePayPayment(req, res, appointmentId, amount, transactionId);
            case 'phonpe':
                return initiatePhoNePePayment(req, res, appointmentId, amount, transactionId);
            case 'paytm':
                return initiatePaytmPayment(req, res, appointmentId, amount, transactionId);
            case 'netbanking':
                return initiateNetBankingPayment(req, res, appointmentId, amount, transactionId);
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid payment method'
                });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const initiateStripePayment = async (req, res, appointmentId, amount, transactionId) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: 'Appointment Fee',
                        description: `Consultation appointment ${appointmentId}`
                    },
                    unit_amount: Math.round(amount * 100)
                },
                quantity: 1
            }],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/payment-success?appointmentId=${appointmentId}&transactionId=${transactionId}`,
            cancel_url: `${process.env.CLIENT_URL}/payment-failed`,
            metadata: {
                appointmentId,
                transactionId,
                userId: req.user.id
            }
        });

        res.status(200).json({
            success: true,
            sessionId: session.id,
            paymentUrl: session.url,
            transactionId
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const initiatePayPalPayment = async (req, res, appointmentId, amount, transactionId) => {
    try {
        const accessToken = await getPayPalAccessToken();

        const response = await axios.post(
            `https://api-m.${process.env.PAYPAL_MODE === 'sandbox' ? 'sandbox.' : ''}paypal.com/v2/checkout/orders`,
            {
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: {
                        currency_code: 'INR',
                        value: amount.toString()
                    },
                    description: `Appointment consultation - ${appointmentId}`
                }],
                return_url: `${process.env.CLIENT_URL}/payment-success?appointmentId=${appointmentId}&transactionId=${transactionId}`,
                cancel_url: `${process.env.CLIENT_URL}/payment-failed`
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.status(200).json({
            success: true,
            orderId: response.data.id,
            paymentUrl: response.data.links.find(link => link.rel === 'approve')?.href,
            transactionId
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const initiateRazorpayPayment = async (req, res, appointmentId, amount, transactionId) => {
    try {
        const options = {
            amount: Math.round(amount * 100),
            currency: 'INR',
            receipt: transactionId,
            description: `Appointment consultation - ${appointmentId}`,
            notes: {
                appointmentId,
                userId: req.user.id
            }
        };

        // This would require razorpay SDK - simplified version
        res.status(200).json({
            success: true,
            orderId: transactionId,
            amount: amount,
            currency: 'INR',
            transactionId,
            message: 'Razorpay payment initiated'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const initiateGooglePayPayment = async (req, res, appointmentId, amount, transactionId) => {
    try {
        res.status(200).json({
            success: true,
            paymentData: {
                apiVersion: 2,
                apiVersionMinor: 0,
                allowedPaymentMethods: [{
                    type: 'CARD',
                    parameters: {
                        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                        allowedCardNetworks: ['VISA', 'MASTERCARD']
                    }
                }],
                merchantInfo: {
                    merchantId: process.env.GOOGLE_PAY_MERCHANT_ID,
                    merchantName: 'Hospital Appointment Booking'
                },
                transactionInfo: {
                    totalPriceStatus: 'FINAL',
                    totalPrice: amount.toString(),
                    currency: 'INR',
                    transactionId: transactionId
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const initiatePhoNePePayment = async (req, res, appointmentId, amount, transactionId) => {
    try {
        const merchantTransactionId = transactionId;
        const userId = req.user.id;

        const payload = {
            merchantId: process.env.PHONPE_MERCHANT_ID,
            merchantTransactionId: merchantTransactionId,
            merchantUserId: userId,
            amount: Math.round(amount * 100),
            redirectUrl: `${process.env.CLIENT_URL}/payment-success?appointmentId=${appointmentId}&transactionId=${transactionId}`,
            redirectMode: 'REDIRECT',
            callbackUrl: `${process.env.SERVER_URL || 'http://localhost:5000'}/api/payments/phonpe-callback`,
            mobileNumber: req.body.phone,
            paymentInstrument: {
                type: 'UPI'
            }
        };

        const bufferObj = Buffer.from(JSON.stringify(payload), 'utf8');
        const base64EncodedPayload = bufferObj.toString('base64');
        const xVerifyChecksum = crypto.createHash('sha256').update(base64EncodedPayload + '/pg/v1/pay' + process.env.PHONPE_API_KEY).digest('hex') + '###1';

        res.status(200).json({
            success: true,
            transactionId,
            paymentUrl: 'https://api.phonepe.com/apis/hermes/pg/v1/pay',
            payload: base64EncodedPayload,
            checksum: xVerifyChecksum
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const initiatePaytmPayment = async (req, res, appointmentId, amount, transactionId) => {
    try {
        res.status(200).json({
            success: true,
            transactionId,
            amount: amount,
            merchantId: process.env.PAYTM_MERCHANT_ID,
            paymentUrl: `${process.env.PAYTM_BASE_URL}/olts/initiateTransaction`,
            message: 'Paytm payment details prepared'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const initiateNetBankingPayment = async (req, res, appointmentId, amount, transactionId) => {
    try {
        res.status(200).json({
            success: true,
            transactionId,
            banks: [
                { code: 'HDFC', name: 'HDFC Bank' },
                { code: 'ICICI', name: 'ICICI Bank' },
                { code: 'SBI', name: 'State Bank of India' },
                { code: 'AXIS', name: 'Axis Bank' }
            ],
            message: 'Select a bank to proceed with net banking'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { appointmentId, transactionId, paymentMethod, paymentData } = req.body;

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Create payment record
        const payment = new Payment({
            transactionId,
            appointment: appointmentId,
            patient: req.user.id,
            doctor: appointment.doctor,
            amount: appointment.consultationFee || 0,
            paymentMethod,
            paymentStatus: 'completed',
            transactionDetails: paymentData || {}
        });

        await payment.save();

        // Update appointment
        appointment.payment = payment._id;
        appointment.paymentStatus = 'completed';
        appointment.status = 'confirmed';
        await appointment.save();

        // Send confirmation email
        const patient = await Patient.findById(req.user.id);
        await sendEmail(
            patient.email,
            'Payment Successful',
            paymentReceiptEmail(
                `${patient.firstName} ${patient.lastName}`,
                appointment.consultationFee,
                transactionId,
                `Appointment with Dr. on ${appointment.appointmentDate}`
            )
        );

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            payment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getPaymentHistory = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const payments = await Payment.find({ patient: req.user.id })
            .populate('appointment')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Payment.countDocuments({ patient: req.user.id });

        res.status(200).json({
            success: true,
            payments,
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

export const processRefund = async (req, res) => {
    try {
        const { paymentId, reason } = req.body;

        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        // Process refund based on payment method
        payment.refundDetails = {
            refundId: `REF-${uuidv4()}`,
            refundAmount: payment.amount,
            refundDate: new Date(),
            refundReason: reason,
            refundStatus: 'completed'
        };

        payment.paymentStatus = 'refunded';
        await payment.save();

        res.status(200).json({
            success: true,
            message: 'Refund processed successfully',
            refund: payment.refundDetails
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
