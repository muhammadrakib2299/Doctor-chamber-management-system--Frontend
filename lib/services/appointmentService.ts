import api from '../api';

export interface Appointment {
    _id: string;
    patientId: string | {
        _id: string;
        name: string;
        phone: string;
        patientId: string;
        age: number;
        gender: string;
    };
    doctorId: string;
    appointmentDate: string;
    serialNumber: number;
    status: 'booked' | 'waiting' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
    feeAmount: number;
    feeType: 'new_patient' | 'old_patient';
    paymentStatus: 'pending' | 'paid' | 'refunded';
    bookingType: 'phone' | 'walk-in' | 'online';
    createdAt: string;
}

export interface CreateAppointmentData {
    patientId: string;
    doctorId: string;
    appointmentDate: string;
    bookingType: 'phone' | 'walk-in';
    feeAmount: number;
    feeType: 'new_patient' | 'old_patient';
    paymentMethod: 'cash' | 'card' | 'mobile_banking';
    paymentStatus: 'pending' | 'paid';
    status?: 'booked';
}

export interface AppointmentListParams {
    page?: number;
    limit?: number;
    status?: string;
    sort?: string;
    dateFrom?: string;
    dateTo?: string;
}

export const appointmentService = {
    // Confirm patient arrival
    confirmArrival: async (id: string) => {
        const response = await api.put(`/appointments/${id}/confirm`);
        return response.data;
    },

    // Create new appointment
    createAppointment: async (data: CreateAppointmentData) => {
        const response = await api.post('/appointments', data);
        return response.data;
    },

    // Get appointments with pagination and filters
    getAppointments: async (params?: AppointmentListParams) => {
        const response = await api.get('/appointments', { params });
        return response.data;
    },

    // Get Today's queue
    getTodayQueue: async (doctorId: string) => {
        const response = await api.get('/appointments/today', {
            params: { doctorId }
        });
        return response.data;
    },

    // Get single appointment
    getAppointment: async (id: string) => {
        const response = await api.get(`/appointments/${id}`);
        return response.data;
    },

    // Update appointment status
    updateAppointment: async (id: string, data: Record<string, unknown>) => {
        const response = await api.put(`/appointments/${id}`, data);
        return response.data;
    }
};
