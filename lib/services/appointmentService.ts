import api from '../api';

export interface Appointment {
    _id: string;
    patientId: string | any;
    doctorId: string;
    appointmentDate: string;
    serialNumber: number;
    status: 'waiting' | 'in_progress' | 'completed' | 'cancelled';
    feeAmount: number;
    paymentStatus: 'pending' | 'paid';
}

export interface CreateAppointmentData {
    patientId: string;
    doctorId: string;
    appointmentDate: string; // ISO date string
    bookingType: 'phone' | 'walk-in';
    feeAmount: number;
    feeType: 'new_patient' | 'old_patient';
    paymentMethod: 'cash'; // as per requirement
    paymentStatus: 'pending' | 'paid';
}

export const appointmentService = {
    // Create new appointment
    createAppointment: async (data: CreateAppointmentData) => {
        const response = await api.post('/appointments', data);
        return response.data;
    },

    // Get Today's queue
    getTodayQueue: async (doctorId: string) => {
        const response = await api.get('/appointments/today', {
            params: { doctorId }
        });
        return response.data;
    },

    // Update appointment status
    updateAppointment: async (id: string, data: any) => {
        const response = await api.put(`/appointments/${id}`, data);
        return response.data;
    }
};
