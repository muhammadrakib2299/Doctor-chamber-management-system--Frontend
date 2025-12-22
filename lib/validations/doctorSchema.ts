import { z } from 'zod';

export const doctorSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),

    // Professional Details
    specialization: z.string().min(2, 'Specialization is required'),
    qualification: z.string().min(2, 'Qualification is required'),
    registrationNumber: z.string().min(2, 'Registration number is required'),
    chamberName: z.string().min(2, 'Chamber name is required'),
    chamberAddress: z.string().min(5, 'Chamber address is required'),

    // Subscription
    plan: z.enum(['trial', 'monthly', 'quarterly', 'yearly']),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export type DoctorFormData = z.infer<typeof doctorSchema>;
