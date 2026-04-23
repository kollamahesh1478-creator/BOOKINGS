import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useAppointmentStore = create((set, get) => ({
    appointments: [],
    doctors: [],
    specialties: [],
    loading: false,

    fetchAppointments: async (token) => {
        set({ loading: true });
        try {
            const response = await axios.get(`${API_URL}/appointments`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({ appointments: response.data.appointments, loading: false });
            return response.data;
        } catch (error) {
            set({ loading: false });
            throw error.response?.data || error.message;
        }
    },

    fetchDoctors: async () => {
        try {
            const response = await axios.get(`${API_URL}/doctors`);
            set({ doctors: response.data.doctors });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    createAppointment: async (data, token) => {
        try {
            const response = await axios.post(`${API_URL}/appointments`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set(state => ({ appointments: [...state.appointments, response.data.appointment] }));
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    cancelAppointment: async (appointmentId, token) => {
        try {
            const response = await axios.delete(`${API_URL}/appointments/${appointmentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set(state => ({
                appointments: state.appointments.filter(apt => apt._id !== appointmentId)
            }));
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}));
