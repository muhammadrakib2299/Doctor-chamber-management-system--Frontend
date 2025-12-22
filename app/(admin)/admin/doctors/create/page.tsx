'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { adminService } from '@/lib/services/adminService';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const doctorSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phone: z.string().min(11, 'Phone number must be valid'),
    specialization: z.string().min(2, 'Specialization is required'),
    qualification: z.string().min(2, 'Qualification is required'),
});

type DoctorFormData = z.infer<typeof doctorSchema>;

export default function CreateDoctor() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<DoctorFormData>({
        resolver: zodResolver(doctorSchema)
    });

    const onSubmit = async (data: DoctorFormData) => {
        setIsLoading(true);
        try {
            await adminService.createDoctor(data);
            toast.success('Doctor account created successfully!');
            router.push('/admin/doctors');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create doctor');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <Link
                    href="/admin/doctors"
                    className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 mb-2"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Doctors
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">Add New Doctor</h1>
                <p className="text-slate-500">Create a new doctor account with a 7-day trial.</p>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Info */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 border-b pb-2">Personal Info</h3>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input
                                    {...register('name')}
                                    placeholder="e.g. Dr. John Doe"
                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                <input
                                    {...register('email')}
                                    type="email"
                                    placeholder="doctor@example.com"
                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                                <input
                                    {...register('phone')}
                                    placeholder="017..."
                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                <input
                                    {...register('password')}
                                    type="password"
                                    placeholder="******"
                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
                            </div>
                        </div>

                        {/* Professional Info */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 border-b pb-2">Professional Info</h3>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Specialization</label>
                                <select
                                    {...register('specialization')}
                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                                >
                                    <option value="">Select Specialty</option>
                                    <option value="General Physician">General Physician</option>
                                    <option value="Cardiologist">Cardiologist</option>
                                    <option value="Dentist">Dentist</option>
                                    <option value="Neurologist">Neurologist</option>
                                    <option value="Pediatrician">Pediatrician</option>
                                    <option value="Gynecologist">Gynecologist</option>
                                    <option value="Orthopedic">Orthopedic</option>
                                </select>
                                {errors.specialization && <p className="mt-1 text-xs text-red-500">{errors.specialization.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Qualifications</label>
                                <input
                                    {...register('qualification')}
                                    placeholder="e.g. MBBS, FCPS"
                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                {errors.qualification && <p className="mt-1 text-xs text-red-500">{errors.qualification.message}</p>}
                            </div>

                            <div className="bg-blue-50 p-4 rounded-md mt-6">
                                <h4 className="text-sm font-semibold text-blue-800 mb-1">Subscription Details</h4>
                                <p className="text-xs text-blue-600">
                                    New doctors are automatically assigned a <strong>7-Day Free Trial</strong>. You can extend their subscription later from the doctor list.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="mr-3 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating...' : 'Create Doctor Account'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
