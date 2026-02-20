import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with timeout
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 second timeout
});

// Request interceptor - add auth token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors with toast notifications
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<{ message?: string }>) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('token');
                        sessionStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.location.href = '/auth/login';
                    }
                    break;
                case 403:
                    toast.error(error.response.data?.message || 'Access denied');
                    break;
                case 404:
                    toast.error(error.response.data?.message || 'Resource not found');
                    break;
                case 422:
                    // Validation errors — don't toast here, let the caller handle specific field errors
                    break;
                case 429:
                    toast.error('Too many requests. Please slow down.');
                    break;
                case 500:
                    toast.error('Server error. Please try again later.');
                    break;
                default:
                    break;
            }
        } else if (error.code === 'ECONNABORTED') {
            toast.error('Request timed out. Please check your connection.');
        } else if (error.request) {
            toast.error('Network error. Please check your internet connection.');
        }
        return Promise.reject(error);
    }
);

export default api;
