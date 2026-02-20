// Shared type definitions for the Doctor Chamber Management System

export interface User {
    _id: string;
    id?: string;
    name: string;
    email: string;
    role: 'admin' | 'doctor' | 'assistant';
    phone?: string;
    doctorId?: string;
    isActive: boolean;
    doctorInfo?: {
        specialization?: string;
        qualification?: string;
        registrationNumber?: string;
        chamberName?: string;
        chamberAddress?: string;
    };
    subscription?: {
        plan: 'trial' | 'monthly' | 'quarterly' | 'yearly';
        startDate: string;
        endDate: string;
        isActive: boolean;
        maxAssistants: number;
    };
    lastLogin?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Patient {
    _id: string;
    patientId: string;
    name: string;
    phone: string;
    email?: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    address?: string;
    bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
    allergies?: string[];
    chronicConditions?: string[];
    patientType: 'new' | 'old';
    newPatientFee: number;
    oldPatientFee: number;
    doctorId: string;
    registeredBy: string;
    totalVisits: number;
    lastVisitDate?: string;
    isActive: boolean;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Appointment {
    _id: string;
    appointmentDate: string;
    serialNumber: number;
    patientId: string | Patient;
    doctorId: string;
    bookingType: 'phone' | 'walk-in' | 'online';
    bookedBy: string;
    feeAmount: number;
    feeType: 'new_patient' | 'old_patient';
    paymentStatus: 'pending' | 'paid' | 'refunded';
    paymentMethod: 'cash' | 'card' | 'mobile_banking';
    paidAt?: string;
    status: 'booked' | 'waiting' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
    preAssessment?: {
        bloodPressure?: string;
        temperature?: string;
        weight?: string;
        height?: string;
        pulse?: string;
        chiefComplaint?: string;
        notes?: string;
    };
    checkInTime?: string;
    consultationStartTime?: string;
    consultationEndTime?: string;
    prescriptionId?: string;
    nextVisitDate?: string;
    cancellationReason?: string;
    remarks?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Medicine {
    name: string;
    type: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'ointment' | 'drops' | 'other';
    dosage: string;
    timing: 'before_meal' | 'after_meal' | 'with_meal' | 'empty_stomach' | 'as_needed';
    duration: string;
    instructions?: string;
}

export interface Prescription {
    _id: string;
    appointmentId: string;
    patientId: string | Patient;
    doctorId: string | User;
    prescriptionDate: string;
    chiefComplaints?: string[];
    diagnosis: string;
    vitals?: {
        bloodPressure?: string;
        temperature?: string;
        weight?: string;
        height?: string;
        pulse?: string;
        spo2?: string;
    };
    medicines: Medicine[];
    investigations?: string[];
    advice?: string;
    specialInstructions?: string;
    followUp?: {
        required: boolean;
        date?: string;
        reason?: string;
    };
    notes?: string;
    pdfGenerated: boolean;
    pdfUrl?: string;
    createdAt: string;
    updatedAt: string;
}

// A queue item is an Appointment with patientId populated as a Patient object
export interface QueueItem {
    _id: string;
    appointmentDate: string;
    serialNumber: number;
    patientId: Patient;
    doctorId: string;
    bookingType: 'phone' | 'walk-in' | 'online';
    bookedBy: string;
    feeAmount: number;
    feeType: 'new_patient' | 'old_patient';
    paymentStatus: 'pending' | 'paid' | 'refunded';
    paymentMethod: 'cash' | 'card' | 'mobile_banking';
    status: string;
    preAssessment?: {
        bloodPressure?: string;
        temperature?: string;
        weight?: string;
        height?: string;
        pulse?: string;
        chiefComplaint?: string;
        notes?: string;
    };
    checkInTime?: string;
    consultationStartTime?: string;
    consultationEndTime?: string;
    nextVisitDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface DashboardStats {
    totalDoctors: number;
    activeSubscriptions: number;
    totalPatients: number;
}

export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    pages: number;
    next?: { page: number; limit: number };
    prev?: { page: number; limit: number };
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
    count?: number;
    pagination?: PaginationInfo;
}
