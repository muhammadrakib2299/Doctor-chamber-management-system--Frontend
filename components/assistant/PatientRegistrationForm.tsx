'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { patientService } from '@/lib/services/patientService';
import { useAuthStore } from '@/lib/store/authStore';
import toast from 'react-hot-toast';

const patientSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().min(11, 'Invalid phone number'),
    age: z.string().transform((val) => parseInt(val, 10)),
    gender: z.enum(['male', 'female', 'other']),
    address: z.string().optional(),
});

interface PatientRegistrationFormProps {
    onSuccess?: (patient: any) => void;
}

export default function PatientRegistrationForm({ onSuccess }: PatientRegistrationFormProps) {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(patientSchema)
    });

    const onSubmit = async (data: any) => {
        try {
            setLoading(true);
            // Assuming current user is assistant and has doctorId link
            // Or if doctor is logging in, user.id is the doctorId
            const doctorId = user?.role === 'doctor' ? user.id : user?.doctorId;

            if (!doctorId) {
                toast.error("Doctor association not found");
                return;
            }

            // Hardcoded fees for now - in real app, fetch from Doctor settings
            const payload = {
                ...data,
                doctorId,
                newPatientFee: 500, // Default or fetch from settings
                oldPatientFee: 300
            };

            const res = await patientService.createPatient(payload);
            toast.success("Patient registered successfully!");
            reset();
            if (onSuccess) onSuccess(res.data);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to register patient");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">New Patient Registration</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                        {...register('phone')}
                        type="text"
                        placeholder="017..."
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    />
                    {errors.phone && <span className="text-red-500 text-xs">{String(errors.phone.message)}</span>}
                </div>

                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        {...register('name')}
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    />
                    {errors.name && <span className="text-red-500 text-xs">{String(errors.name.message)}</span>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Age */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Age</label>
                        <input
                            {...register('age')}
                            type="number"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        />
                        {errors.age && <span className="text-red-500 text-xs">{String(errors.age.message)}</span>}
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Gender</label>
                        <select
                            {...register('gender')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                {/* Address */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Address (Optional)</label>
                    <textarea
                        {...register('address')}
                        rows={2}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                >
                    {loading ? 'Registering...' : 'Register Patient'}
                </button>
            </form>
        </div>
    );
}
