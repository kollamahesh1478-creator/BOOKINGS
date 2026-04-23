import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { FaHome, FaUsers, FaUserMD, FaCalendar, FaCreditCard, FaTags, FaSignOutAlt } from 'react-icons/fa';

export default function AdminLayout({ children }) {
    const { logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path ? 'bg-purple-50 border-l-4 border-purple-600 text-purple-600' : 'text-gray-600';

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg">
                <div className="p-6 border-b">
                    <h1 className="text-2xl font-bold text-purple-600">Admin Panel</h1>
                </div>

                <nav className="mt-6">
                    <Link to="/admin/dashboard" className={`flex items-center gap-3 px-6 py-3 ${isActive('/admin/dashboard')}`}>
                        <FaHome />
                        Dashboard
                    </Link>
                    <Link to="/admin/users" className={`flex items-center gap-3 px-6 py-3 ${isActive('/admin/users')}`}>
                        <FaUsers />
                        Users
                    </Link>
                    <Link to="/admin/doctors" className={`flex items-center gap-3 px-6 py-3 ${isActive('/admin/doctors')}`}>
                        <FaUserMD />
                        Doctors
                    </Link>
                    <Link to="/admin/appointments" className={`flex items-center gap-3 px-6 py-3 ${isActive('/admin/appointments')}`}>
                        <FaCalendar />
                        Appointments
                    </Link>
                    <Link to="/admin/payments" className={`flex items-center gap-3 px-6 py-3 ${isActive('/admin/payments')}`}>
                        <FaCreditCard />
                        Payments
                    </Link>
                    <Link to="/admin/specialties" className={`flex items-center gap-3 px-6 py-3 ${isActive('/admin/specialties')}`}>
                        <FaTags />
                        Specialties
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-6 py-3 text-red-600 hover:bg-red-50 mt-4">
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
