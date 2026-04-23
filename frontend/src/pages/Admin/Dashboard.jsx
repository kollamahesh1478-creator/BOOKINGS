import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/admin/dashboard`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(response.data.stats);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-gray-600">Hospital Management Overview</p>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                    <h3 className="text-gray-600 font-semibold text-sm uppercase">Total Patients</h3>
                    <p className="text-4xl font-bold text-blue-500 mt-2">{stats?.totalPatients || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                    <h3 className="text-gray-600 font-semibold text-sm uppercase">Total Doctors</h3>
                    <p className="text-4xl font-bold text-green-500 mt-2">{stats?.totalDoctors || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                    <h3 className="text-gray-600 font-semibold text-sm uppercase">Appointments</h3>
                    <p className="text-4xl font-bold text-purple-500 mt-2">{stats?.totalAppointments || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
                    <h3 className="text-gray-600 font-semibold text-sm uppercase">Total Revenue</h3>
                    <p className="text-4xl font-bold text-orange-500 mt-2">₹{stats?.totalRevenue?.toLocaleString() || 0}</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Appointments by Status</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={stats?.appointmentsByStatus || []}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${value}`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="count"
                            >
                                {COLORS.map((color, index) => (
                                    <Cell key={`cell-${index}`} fill={color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Revenue</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={[
                            { month: 'Jan', revenue: 40000 },
                            { month: 'Feb', revenue: 35000 },
                            { month: 'Mar', revenue: 45000 },
                            { month: 'Apr', revenue: 55000 }
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="revenue" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Appointments */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Appointments</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold">Patient</th>
                                <th className="px-4 py-2 text-left font-semibold">Doctor</th>
                                <th className="px-4 py-2 text-left font-semibold">Date</th>
                                <th className="px-4 py-2 text-left font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats?.recentAppointments?.map((apt) => (
                                <tr key={apt._id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-2">{apt.patient?.firstName} {apt.patient?.lastName}</td>
                                    <td className="px-4 py-2">Dr. {apt.doctor?.firstName} {apt.doctor?.lastName}</td>
                                    <td className="px-4 py-2">{new Date(apt.appointmentDate).toLocaleDateString()}</td>
                                    <td className="px-4 py-2">
                                        <span className={`px-2 py-1 rounded text-sm font-semibold ${apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-blue-100 text-blue-700'
                                            }`}>
                                            {apt.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
