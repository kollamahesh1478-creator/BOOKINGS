import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { FaCreditCard, FaPaypal, FaGoogle, FaMobileAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function PaymentPage() {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const token = useAuthStore(state => state.token);
    const [paymentMethod, setPaymentMethod] = useState('stripe');
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        try {
            toast.success(`Payment initiated with ${paymentMethod}`);
            // Integration with actual payment gateway would go here
            setTimeout(() => {
                navigate('/patient/appointments');
            }, 2000);
        } catch (error) {
            toast.error('Payment failed');
        } finally {
            setLoading(false);
        }
    };

    const paymentMethods = [
        { id: 'stripe', name: 'Stripe', icon: FaCreditCard, color: 'bg-blue-600' },
        { id: 'paypal', name: 'PayPal', icon: FaPaypal, color: 'bg-blue-700' },
        { id: 'googlepay', name: 'Google Pay', icon: FaGoogle, color: 'bg-blue-500' },
        { id: 'razorpay', name: 'Razorpay', icon: FaMobileAlt, color: 'bg-purple-600' },
        { id: 'phonpe', name: 'PhonePe', icon: FaMobileAlt, color: 'bg-indigo-600' },
        { id: 'paytm', name: 'Paytm', icon: FaMobileAlt, color: 'bg-blue-600' }
    ];

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Complete Payment</h1>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Select Payment Method</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {paymentMethods.map(method => {
                        const Icon = method.icon;
                        return (
                            <button
                                key={method.id}
                                onClick={() => setPaymentMethod(method.id)}
                                className={`p-4 rounded-lg border-2 transition ${paymentMethod === method.id
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                <Icon className={`text-2xl mx-auto mb-2 ${paymentMethod === method.id ? 'text-blue-600' : 'text-gray-600'}`} />
                                <p className="font-semibold text-sm">{method.name}</p>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4 pb-4 border-b">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Consultation Fee</span>
                        <span className="font-semibold">₹500</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Taxes & Charges</span>
                        <span className="font-semibold">₹100</span>
                    </div>
                    <div className="flex justify-between text-lg">
                        <span className="font-bold">Total Amount</span>
                        <span className="font-bold text-blue-600">₹600</span>
                    </div>
                </div>

                <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Processing...' : `Pay ₹600 with ${paymentMethods.find(m => m.id === paymentMethod)?.name}`}
                </button>
            </div>
        </div>
    );
}
