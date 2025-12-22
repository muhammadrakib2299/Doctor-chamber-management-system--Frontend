import api from '../api';

export interface Medicine {
    name: string;
    type: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'ointment' | 'drops' | 'other';
    dosage: string; // e.g. "1+0+1"
    timing: 'before_meal' | 'after_meal' | 'with_meal' | 'empty_stomach' | 'as_needed';
    duration: string; // e.g. "7 days"
    instructions?: string;
}

export interface PrescriptionData {
    appointmentId: string;
    patientId: string;
    chiefComplaints: string[];
    diagnosis: string;
    vitals?: {
        bloodPressure?: string;
        temperature?: string;
        weight?: string;
        pulse?: string;
    };
    medicines: Medicine[];
    investigations?: string[];
    advice?: string;
    followUp?: {
        required: boolean;
        date?: string;
    };
    notes?: string;
}

export const prescriptionService = {
    // Create new prescription
    createPrescription: async (data: PrescriptionData) => {
        const response = await api.post('/prescriptions', data);
        return response.data;
    },

    // Get prescriptions (filter by patient or doctor)
    getPrescriptions: async (params?: any) => {
        const response = await api.get('/prescriptions', { params });
        return response.data;
    },

    // Get single prescription
    getPrescription: async (id: string) => {
        const response = await api.get(`/prescriptions/${id}`);
        return response.data;
    },

    // Generate PDF url
    getPrescriptionPdfUrl: (id: string) => {
        return `${process.env.NEXT_PUBLIC_API_URL}/prescriptions/${id}/pdf`;
    }
};
