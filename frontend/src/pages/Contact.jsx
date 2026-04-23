import React from 'react';

export default function Contact() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Contact Us</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Get In Touch</h2>
                    <form className="space-y-4">
                        <input type="text" placeholder="Your Name" className="w-full px-4 py-2 border rounded-lg" />
                        <input type="email" placeholder="Your Email" className="w-full px-4 py-2 border rounded-lg" />
                        <textarea placeholder="Message" rows="4" className="w-full px-4 py-2 border rounded-lg"></textarea>
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Send</button>
                    </form>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Information</h2>
                    <p className="text-gray-600 mb-4">
                        <strong>Phone:</strong> +91-XXXXX-XXXXX
                    </p>
                    <p className="text-gray-600 mb-4">
                        <strong>Email:</strong> info@hospital.com
                    </p>
                    <p className="text-gray-600">
                        <strong>Address:</strong> Medical Center, City Name
                    </p>
                </div>
            </div>
        </div>
    );
}
