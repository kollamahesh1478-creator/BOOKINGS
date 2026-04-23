import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { FaHome, FaCalendar, FaUser, FaSignOutAlt } from 'react-icons/fa';

export default function PatientLayout({ children }) {
    const { logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path ? 'bg-blue-50 border-l-4 border-blue-600 text-blue-600' : 'text-gray-600';

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-blue-600">Patient Portal</h1>
                </div>

                <nav className="mt-6">
                    <Link to="/patient/dashboard" className={`flex items-center gap-3 px-6 py-3 ${isActive('/patient/dashboard')}`}>
                        <FaHome />
                        Dashboard
                    </Link>
                    <Link to="/patient/book-appointment" className={`flex items-center gap-3 px-6 py-3 ${isActive('/patient/book-appointment')}`}>
                        <FaCalendar />
                        Book Appointment
                    </Link>
                    <Link to="/patient/appointments" className={`flex items-center gap-3 px-6 py-3 ${isActive('/patient/appointments')}`}>
                        <FaCalendar />
                        My Appointments
                    </Link>
                    <Link to="/patient/profile" className={`flex items-center gap-3 px-6 py-3 ${isActive('/patient/profile')}`}>
                        <FaUser />
                        Profile
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-6 py-3 text-red-600 hover:bg-red-50">
                        <FaSignOutAlt />
                        Logout
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-gray-50 p-8">
                {children}
            </main>
        </div>
    );
}
