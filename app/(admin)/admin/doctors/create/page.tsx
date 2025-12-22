'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import api from '@/lib/api';
import { doctorSchema, type DoctorFormData } from '@/lib/validations/doctorSchema';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function CreateDoctorPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<DoctorFormData>({
        resolver: zodResolver(doctorSchema),
        defaultValues: {
            plan: 'trial',
        },
    });

    const onSubmit = async (data: DoctorFormData) => {
        setLoading(true);
        try {
            // Structure the data according to backend expectations
            const payload = {
                name: data.name,
                email: data.email,
                password: data.password,
                phone: data.phone,
                role: 'doctor',
                doctorInfo: {
                    specialization: data.specialization,
                    qualification: data.qualification,
                    registrationNumber: data.registrationNumber,
                    chamberName: data.chamberName,
                    chamberAddress: data.chamberAddress,
                },
                subscription: {
                    plan: data.plan,
                }
            };

            await api.post('/auth/register', payload);
            toast.success('Doctor account created successfully');
            router.push('/admin/doctors');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <div className="flex items-center text-sm text-slate-500">
                        <Link href="/admin/doctors" className="flex items-center hover:text-blue-600 transition-colors">
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Back to Doctors
                        </Link>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Add New Doctor</h1>
                    <p className="text-sm text-slate-500">Create a new doctor account and assign a portal.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Personal Information */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
                        <div className="h-8 w-1 bg-blue-500 rounded-full mr-3"></div>
                        Personal Information
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Full Name
                            </label>
                            <input
                                {...register('name')}
                                placeholder="Dr. John Doe"
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Email Address</label>
                            <input
                                {...register('email')}
                                type="email"
                                placeholder="doctor@example.com"
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Phone Number</label>
                            <input
                                {...register('phone')}
                                placeholder="+1 234 567 890"
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
                        <div className="h-8 w-1 bg-blue-500 rounded-full mr-3"></div>
                        Security
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Password</label>
                            <input
                                {...register('password')}
                                type="password"
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Confirm Password</label>
                            <input
                                {...register('confirmPassword')}
                                type="password"
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Professional Information */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
                        <div className="h-8 w-1 bg-blue-500 rounded-full mr-3"></div>
                        Professional Credentials
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Specialization</label>
                            <input
                                {...register('specialization')}
                                placeholder="e.g. Cardiologist"
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.specialization && <p className="text-sm text-red-500">{errors.specialization.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Qualification</label>
                            <input
                                {...register('qualification')}
                                placeholder="e.g. MBBS, FCPS"
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.qualification && <p className="text-sm text-red-500">{errors.qualification.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Registration Number (BMDC)</label>
                            <input
                                {...register('registrationNumber')}
                                placeholder="Doctor License No"
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.registrationNumber && <p className="text-sm text-red-500">{errors.registrationNumber.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Chamber Information */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
                        <div className="h-8 w-1 bg-blue-500 rounded-full mr-3"></div>
                        Chamber Details
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Chamber Name</label>
                            <input
                                {...register('chamberName')}
                                placeholder="e.g. City Heart Center"
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.chamberName && <p className="text-sm text-red-500">{errors.chamberName.message}</p>}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium leading-none">Chamber Address</label>
                            <textarea
                                {...register('chamberAddress')}
                                placeholder="Full address of the chamber"
                                className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.chamberAddress && <p className="text-sm text-red-500">{errors.chamberAddress.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Subscription */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
                        <div className="h-8 w-1 bg-blue-500 rounded-full mr-3"></div>
                        Subscription Plan
                    </h2>
                    <div className="grid gap-4 md:grid-cols-4">
                        {['trial', 'monthly', 'quarterly', 'yearly'].map((plan) => (
                            <label key={plan} className="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none">
                                <input
                                    type="radio"
                                    {...register('plan')}
                                    value={plan}
                                    className="sr-only peer"
                                />
                                <div className="flex flex-1 flex-col peer-checked:text-blue-600 peer-checked:ring-2 peer-checked:ring-blue-500 peer-checked:ring-offset-2 rounded-lg p-2 transition-all">
                                    <span className="block text-sm font-medium uppercase text-slate-900 peer-checked:text-blue-900">
                                        {plan}
                                    </span>
                                    <span className="mt-1 flex items-center text-sm text-slate-500">
                                        {plan === 'trial' ? '7 Days' : 'Full Access'}
                                    </span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end pt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating Portal...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Create Doctor Portal
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Spacer */}
            <div className="h-20"></div>
        </div>
    );
}
