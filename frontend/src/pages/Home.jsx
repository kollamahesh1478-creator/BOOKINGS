import React from 'react';
import { Link } from 'react-router-dom';
import { FaStethoscope, FaClock, FaCreditCard, FaShieldAlt } from 'react-icons/fa';

export default function Home() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold mb-4">Your Health, Our Priority</h1>
                    <p className="text-xl text-blue-100 mb-8">Book appointments with top doctors online. Secure, fast, and convenient.</p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            to="/patient/register"
                            className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50"
                        >
                            Get Started
                        </Link>
                        <Link
                            to="/doctors"
                            className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-blue-700"
                        >
                            Browse Doctors
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="max-w-7xl mx-auto px-4 py-16">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Why Choose Us?</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="text-center">
                        <FaStethoscope className="text-4xl text-blue-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Expert Doctors</h3>
                        <p className="text-gray-600">Qualified healthcare professionals from top institutions</p>
                    </div>
                    <div className="text-center">
                        <FaClock className="text-4xl text-blue-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Easy Scheduling</h3>
                        <p className="text-gray-600">Book appointments at your convenience anytime</p>
                    </div>
                    <div className="text-center">
                        <FaCreditCard className="text-4xl text-blue-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Multiple Payment Options</h3>
                        <p className="text-gray-600">Pay securely with your preferred payment method</p>
                    </div>
                    <div className="text-center">
                        <FaShieldAlt className="text-4xl text-blue-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Data Security</h3>
                        <p className="text-gray-600">Your medical records are completely secure</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-blue-50 py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Book Your Appointment?</h2>
                    <p className="text-gray-600 mb-8">Schedule a consultation with experienced doctors today</p>
                    <Link
                        to="/patient/register"
                        className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 inline-block"
                    >
                        Register as Patient
                    </Link>
                </div>
            </section>
        </div>
    );
}
