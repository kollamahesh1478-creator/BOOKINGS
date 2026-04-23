import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useAppointmentStore } from '../../store/appointmentStore';
import { FaCalendar, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import moment from 'moment';

export default function PatientDashboard() {
    const { user } = useAuthStore();
    const { appointments, fetchAppointments } = useAppointmentStore();
    const token = useAuthStore(state => state.token);
    const [stats, setStats] = useState({
        totalAppointments: 0,
        upcomingAppointments: 0,
        completedAppointments: 0
    });

    useEffect(() => {
        if (token) {
            fetchAppointments(token);
        }
    }, [token, fetchAppointments]);

    useEffect(() => {
        if (appointments.length > 0) {
            const now = new Date();
            const upcoming = appointments.filter(apt => new Date(apt.appointmentDate) > now);
            const completed = appointments.filter(apt => apt.status === 'completed');

            setStats({
                totalAppointments: appointments.length,
                upcomingAppointments: upcoming.length,
                completedAppointments: completed.length
            });
        }
    }, [appointments]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome, {user?.firstName}!</h1>
                <p className="text-gray-600">Manage your medical appointments and health records</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                    <h3 className="text-gray-600 font-semibold text-sm uppercase">Total Appointments</h3>
                    <p className="text-4xl font-bold text-blue-500 mt-2">{stats.totalAppointments}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                    <h3 className="text-gray-600 font-semibold text-sm uppercase">Upcoming</h3>
                    <p className="text-4xl font-bold text-green-500 mt-2">{stats.upcomingAppointments}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                    <h3 className="text-gray-600 font-semibold text-sm uppercase">Completed</h3>
                    <p className="text-4xl font-bold text-purple-500 mt-2">{stats.completedAppointments}</p>
                </div>
            </div>

            {/* Recent Appointments */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Appointments</h2>
                {appointments.length > 0 ? (
                    <div className="space-y-4">
                        {appointments.slice(0, 5).map((appointment) => (
                            <div key={appointment._id} className="border rounded-lg p-4 hover:bg-gray-50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-gray-800">
                                            {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                                        </h3>
                                        <div className="flex gap-4 mt-2 text-gray-600 text-sm">
                                            <div className="flex items-center gap-2">
                                                <FaCalendar />
                                                {moment(appointment.appointmentDate).format('DD MMM YYYY')}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaClock />
                                                {appointment.timeSlot?.startTime}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaMapMarkerAlt />
                                                {appointment.consultationMode}
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${appointment.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            appointment.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                'bg-blue-100 text-blue-700'
                                        }`}>
                                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">No appointments yet. <a href="/patient/book-appointment" className="text-blue-600 hover:underline">Book one now!</a></p>
                )}
            </div>
        </div>
    );
}
