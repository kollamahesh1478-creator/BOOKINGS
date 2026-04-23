import React, { useEffect } from 'react';
import { useAppointmentStore } from '../../store/appointmentStore';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';
import moment from 'moment';
import toast from 'react-hot-toast';

export default function MyAppointments() {
    const { appointments, fetchAppointments, cancelAppointment } = useAppointmentStore();
    const token = useAuthStore(state => state.token);

    useEffect(() => {
        if (token) {
            fetchAppointments(token);
        }
    }, [token, fetchAppointments]);

    const handleCancel = async (appointmentId) => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            try {
                await cancelAppointment(appointmentId, token);
                toast.success('Appointment cancelled successfully');
            } catch (error) {
                toast.error(error.message || 'Failed to cancel appointment');
            }
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">My Appointments</h1>

            {appointments.length > 0 ? (
                <div className="grid gap-6">
                    {appointments.map(appointment => (
                        <div key={appointment._id} className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">
                                        Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                                    </h3>
                                    <p className="text-gray-600">{appointment.specialty?.name}</p>
                                </div>
                                <span className={`px-4 py-2 rounded-full font-semibold ${appointment.status === 'completed' ? 'bg-green-100 text-green-700' :
                                        appointment.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                            appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                                'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                                <div>
                                    <p className="text-gray-600">Date</p>
                                    <p className="font-semibold">{moment(appointment.appointmentDate).format('DD MMM YYYY')}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Time</p>
                                    <p className="font-semibold">{appointment.timeSlot?.startTime}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Type</p>
                                    <p className="font-semibold">{appointment.appointmentType}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Mode</p>
                                    <p className="font-semibold">{appointment.consultationMode}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {appointment.status === 'scheduled' && (
                                    <>
                                        <Link
                                            to={`/patient/payment/${appointment._id}`}
                                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                        >
                                            Pay Now
                                        </Link>
                                        <button
                                            onClick={() => handleCancel(appointment._id)}
                                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}
                                {appointment.status === 'completed' && !appointment.rating && (
                                    <Link
                                        to={`/patient/appointment/${appointment._id}/rate`}
                                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                                    >
                                        Rate & Review
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <p className="text-gray-600 text-lg mb-4">No appointments found</p>
                    <Link
                        to="/patient/book-appointment"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-block"
                    >
                        Book Your First Appointment
                    </Link>
                </div>
            )}
        </div>
    );
}
