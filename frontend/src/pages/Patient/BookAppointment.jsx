import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppointmentStore } from '../../store/appointmentStore';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function BookAppointment() {
    const [formData, setFormData] = useState({
        specialization: '',
        doctor: '',
        date: '',
        timeSlot: '',
        symptoms: '',
        appointmentType: 'consultation',
        consultationMode: 'inperson'
    });

    const [doctors, setDoctors] = useState([]);
    const [slots, setSlots] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const token = useAuthStore(state => state.token);
    const createAppointment = useAppointmentStore(state => state.createAppointment);

    useEffect(() => {
        fetchSpecialties();
        fetchDoctors();
    }, []);

    const fetchSpecialties = async () => {
        try {
            const response = await axios.get(`${API_URL}/specialties`);
            setSpecialties(response.data.specialties || []);
        } catch (error) {
            console.error('Error fetching specialties:', error);
        }
    };

    const fetchDoctors = async (specialization = '') => {
        try {
            const response = await axios.get(`${API_URL}/doctors`, {
                params: { specialization }
            });
            setDoctors(response.data.doctors || []);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const fetchSlots = async (doctorId, date) => {
        if (!doctorId || !date) return;
        try {
            const response = await axios.get(`${API_URL}/doctors/${doctorId}/available-slots`, {
                params: { doctorId, date }
            });
            setSlots(response.data.slots || []);
        } catch (error) {
            console.error('Error fetching slots:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'specialization') {
            fetchDoctors(value);
        }

        if (name === 'doctor' && formData.date) {
            fetchSlots(value, formData.date);
        }

        if (name === 'date' && formData.doctor) {
            fetchSlots(formData.doctor, value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await createAppointment({
                doctorId: formData.doctor,
                appointmentDate: formData.date,
                timeSlot: {
                    startTime: formData.timeSlot.split('-')[0].trim(),
                    endTime: formData.timeSlot.split('-')[1].trim()
                },
                symptoms: formData.symptoms,
                appointmentType: formData.appointmentType,
                consultationMode: formData.consultationMode
            }, token);

            toast.success('Appointment booked successfully!');
            navigate('/patient/appointments');
        } catch (error) {
            toast.error(error.message || 'Failed to book appointment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Book an Appointment</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Specialty *</label>
                        <select
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Select Specialty</option>
                            {specialties.map(spec => (
                                <option key={spec._id} value={spec._id}>{spec.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Doctor *</label>
                        <select
                            name="doctor"
                            value={formData.doctor}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Select Doctor</option>
                            {doctors.map(doc => (
                                <option key={doc._id} value={doc._id}>
                                    Dr. {doc.firstName} {doc.lastName} - ₹{doc.consultationFee}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Date *</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Time Slot *</label>
                        <select
                            name="timeSlot"
                            value={formData.timeSlot}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Select Time</option>
                            {slots.map((slot, idx) => (
                                <option key={idx} value={`${slot.startTime} - ${slot.endTime}`}>
                                    {slot.startTime} - {slot.endTime}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Appointment Type</label>
                        <select
                            name="appointmentType"
                            value={formData.appointmentType}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        >
                            <option value="consultation">Consultation</option>
                            <option value="followup">Follow-up</option>
                            <option value="procedure">Procedure</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Consultation Mode</label>
                        <select
                            name="consultationMode"
                            value={formData.consultationMode}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        >
                            <option value="inperson">In-Person</option>
                            <option value="online">Online</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Symptoms / Reason for Visit</label>
                    <textarea
                        name="symptoms"
                        value={formData.symptoms}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="Describe your symptoms or reason for visit..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Booking...' : 'Book Appointment'}
                </button>
            </form>
        </div>
    );
}
