import api from '../api';

export interface Patient {
    _id: string;
    patientId: string;
    name: string;
    phone: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    address: string;
    // Add other fields as needed
}

export interface CreatePatientData {
    name: string;
    phone: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    address?: string;
    doctorId: string; // Typically current assistant's doctor or passed
    newPatientFee: number;
    oldPatientFee: number;
}

export const patientService = {
    // Create a new patient
    createPatient: async (data: CreatePatientData) => {
        const response = await api.post('/patients', data);
        return response.data;
    },

    // Search patients
    searchPatients: async (query: string, doctorId: string) => {
        const response = await api.get(`/patients/search`, {
            params: { query, doctorId }
        });
        return response.data;
    },

    getPatients: async (params?: any) => {
        const response = await api.get('/patients', { params });
        return response.data;
    },

    // Update patient
    updatePatient: async (id: string, data: any) => {
        const response = await api.put(`/patients/${id}`, data);
        return response.data;
    },

    // Delete patient
    deletePatient: async (id: string) => {
        const response = await api.delete(`/patients/${id}`);
        return response.data;
    }
};
