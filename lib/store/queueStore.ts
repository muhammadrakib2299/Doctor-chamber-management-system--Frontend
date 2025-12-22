import { create } from 'zustand';

interface QueuePatient {
    _id: string;
    serialNumber: number;
    patient: {
        _id: string;
        name: string;
        patientId: string;
    };
    status: 'waiting' | 'in_progress' | 'completed';
    appointmentDate: string;
}

interface QueueState {
    patients: QueuePatient[];
    currentPatient: QueuePatient | null;
    setPatients: (patients: QueuePatient[]) => void;
    addPatient: (patient: QueuePatient) => void;
    updatePatient: (id: string, updates: Partial<QueuePatient>) => void;
    removePatient: (id: string) => void;
    setCurrentPatient: (patient: QueuePatient | null) => void;
}

export const useQueueStore = create<QueueState>((set) => ({
    patients: [],
    currentPatient: null,
    setPatients: (patients) => set({ patients }),
    addPatient: (patient) =>
        set((state) => ({ patients: [...state.patients, patient] })),
    updatePatient: (id, updates) =>
        set((state) => ({
            patients: state.patients.map((p) =>
                p._id === id ? { ...p, ...updates } : p
            ),
        })),
    removePatient: (id) =>
        set((state) => ({
            patients: state.patients.filter((p) => p._id !== id),
        })),
    setCurrentPatient: (patient) => set({ currentPatient: patient }),
}));
