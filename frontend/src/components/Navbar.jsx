import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-blue-600">
                    🏥 Hospital Booking
                </Link>

                <div className="flex gap-6">
                    <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
                    <Link to="/doctors" className="text-gray-600 hover:text-blue-600">Doctors</Link>
                    <Link to="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link>

                    {isAuthenticated ? (
                        <div className="flex gap-4 items-center">
                            <span className="text-gray-600">{user?.firstName}</span>
                            {user?.role === 'patient' && (
                                <Link to="/patient/dashboard" className="text-blue-600 hover:text-blue-800 font-semibold">Dashboard</Link>
                            )}
                            {user?.role === 'admin' && (
                                <Link to="/admin/dashboard" className="text-purple-600 hover:text-purple-800 font-semibold">Admin</Link>
                            )}
                            <button onClick={handleLogout} className="text-red-600 hover:text-red-800">
                                <FaSignOutAlt />
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-4">
                            <Link to="/patient/login" className="text-gray-600 hover:text-blue-600">Patient Login</Link>
                            <Link to="/admin/login" className="text-gray-600 hover:text-purple-600">Admin Login</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
