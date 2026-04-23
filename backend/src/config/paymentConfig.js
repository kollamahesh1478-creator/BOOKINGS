import Stripe from 'stripe';
import axios from 'axios';

// Stripe Configuration
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// PayPal Configuration
export const paypalConfig = {
    mode: process.env.PAYPAL_MODE || 'sandbox',
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_CLIENT_SECRET
};

// Razorpay Configuration
export const razorpayConfig = {
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
};

// Google Pay Configuration
export const googlePayConfig = {
    merchantId: process.env.GOOGLE_PAY_MERCHANT_ID,
    environment: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'TEST'
};

// PhonePe Configuration
export const phonePeConfig = {
    merchantId: process.env.PHONPE_MERCHANT_ID,
    apiKey: process.env.PHONPE_API_KEY,
    baseUrl: 'https://api.phonepe.com/apis/hermes'
};

// Paytm Configuration
export const paytmConfig = {
    merchantId: process.env.PAYTM_MERCHANT_ID,
    merchantKey: process.env.PAYTM_MERCHANT_KEY,
    websiteName: 'WEBSTAGING',
    baseUrl: 'https://securegw-stage.paytm.in'
};

// Get PayPal Access Token
export const getPayPalAccessToken = async () => {
    try {
        const response = await axios.post(
            `https://api-m.${paypalConfig.mode === 'sandbox' ? 'sandbox.' : ''}paypal.com/v1/oauth2/token`,
            'grant_type=client_credentials',
            {
                auth: {
                    username: paypalConfig.client_id,
                    password: paypalConfig.client_secret
                }
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error('PayPal Token Error:', error);
        throw error;
    }
};
