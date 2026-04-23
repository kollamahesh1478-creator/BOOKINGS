import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),

    register: async (data) => {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, data);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            set({ user: response.data.user, token: response.data.token, isAuthenticated: true });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    login: async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            set({ user: response.data.user, token: response.data.token, isAuthenticated: true });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false });
    },

    updateProfile: async (data) => {
        try {
            const response = await axios.put(`${API_URL}/auth/profile`, data, {
                headers: { Authorization: `Bearer ${useAuthStore.getState().token}` }
            });
            localStorage.setItem('user', JSON.stringify(response.data.user));
            set({ user: response.data.user });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}));
