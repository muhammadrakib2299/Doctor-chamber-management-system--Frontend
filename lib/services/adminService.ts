import api from '../../lib/api';

export interface Doctor {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: 'doctor';
    isActive: boolean;
    doctorInfo?: {
        specialization?: string;
        qualification?: string;
    };
    subscription?: {
        plan: 'trial' | 'monthly' | 'quarterly' | 'yearly';
        isActive: boolean;
        startDate?: string;
        endDate?: string;
    };
}

export const adminService = {
    // Get all doctors (with pagination & filtering)
    getDoctors: async (params?: any) => {
        const response = await api.get('/admin/doctors', { params });
        return response.data;
    },

    // Create new doctor
    createDoctor: async (data: any) => {
        const response = await api.post('/admin/doctors', data);
        return response.data;
    },

    // Manage Subscription
    manageSubscription: async (data: {
        doctorId: string;
        plan: string;
        durationMonths?: number;
        amount: number;
        paymentMethod: string;
    }) => {
        const response = await api.put('/admin/subscription', data);
        return response.data;
    },

    // Get Stats
    getStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    },
};
