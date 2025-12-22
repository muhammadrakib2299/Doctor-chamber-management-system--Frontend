import { z } from 'zod';

export const medicineSchema = z.object({
    name: z.string().min(1, 'Medicine name is required'),
    type: z.string().optional(),
    dosage: z.string().min(1, 'Dosage is required (e.g. 1+0+1)'),
    timing: z.string().optional(),
    duration: z.string().min(1, 'Duration is required'),
    instructions: z.string().optional(),
});

export const prescriptionSchema = z.object({
    patientName: z.string().min(1, 'Patient name is required'),
    patientAge: z.string().min(1, 'Age is required'),
    patientGender: z.enum(['Male', 'Female', 'Other']),

    // Vitals
    bp: z.string().optional(),
    weight: z.string().optional(),
    temp: z.string().optional(),

    // Diagnosis
    chiefComplaints: z.string().min(1, 'Chief complaint is required'),
    diagnosis: z.string().optional(),

    // Medicines
    medicines: z.array(medicineSchema).min(1, 'At least one medicine is required'),

    // Advice
    investigations: z.string().optional(),
    advice: z.string().optional(),
    nextVisit: z.string().optional(),
});

export type PrescriptionFormData = z.infer<typeof prescriptionSchema>;
