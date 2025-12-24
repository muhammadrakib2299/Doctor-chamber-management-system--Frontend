'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { adminService } from '@/lib/services/adminService';
import toast from 'react-hot-toast';
import { ArrowLeft, User, Mail, Phone, Lock, Stethoscope, Award, CreditCard, Calendar, Plus } from 'lucide-react';
import Link from 'next/link';

const doctorSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phone: z.string().min(11, 'Phone number must be valid'),
    specialization: z.string().min(2, 'Specialization is required'),
    qualification: z.string().min(2, 'Qualification is required'),
    plan: z.enum(['trial', 'monthly', 'quarterly', 'yearly']),
    durationMonths: z.string().optional(),
});

type DoctorFormData = z.infer<typeof doctorSchema>;

export default function CreateDoctor() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<DoctorFormData>({
        resolver: zodResolver(doctorSchema),
        defaultValues: {
            plan: 'trial',
            durationMonths: '1'
        }
    });

    const selectedPlan = watch('plan');

    const onSubmit = async (data: DoctorFormData) => {
        setIsLoading(true);
        try {
            await adminService.createDoctor(data);
            toast.success('Doctor account created successfully with subscription!');
            router.push('/admin/doctors');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create doctor');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-12 animate-in fade-in duration-500">
            <div className="mb-8">
                <Link
                    href="/admin/doctors"
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 mb-4 transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Doctors List
                </Link>
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Add New Doctor</h1>
                    <p className="text-slate-500">Onboard a new medical professional and configure their subscription plan.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Account & Professional Details */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <User className="h-5 w-5 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Account Credentials</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <input
                                            {...register('name')}
                                            placeholder="Dr. Samantha Smith"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                    {errors.name && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.name.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <input
                                            {...register('email')}
                                            type="email"
                                            placeholder="doctor@medcore.com"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                    {errors.email && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.email.message}</p>}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <input
                                                {...register('phone')}
                                                placeholder="01712345678"
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                            />
                                        </div>
                                        {errors.phone && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.phone.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Portal Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <input
                                                {...register('password')}
                                                type="password"
                                                placeholder="••••••••"
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                            />
                                        </div>
                                        {errors.password && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.password.message}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-indigo-50 rounded-lg">
                                    <Stethoscope className="h-5 w-5 text-indigo-600" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Professional Profile</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Specialization</label>
                                    <div className="relative">
                                        <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <select
                                            {...register('specialization')}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-white appearance-none"
                                        >
                                            <option value="">Select Specialty</option>
                                            <option value="General Physician">General Physician</option>
                                            <option value="Cardiologist">Cardiologist</option>
                                            <option value="Dentist">Dentist</option>
                                            <option value="Neurologist">Neurologist</option>
                                            <option value="Pediatrician">Pediatrician</option>
                                            <option value="Gynecologist">Gynecologist</option>
                                            <option value="Orthopedic">Orthopedic</option>
                                            <option value="Medicine">Medicine</option>
                                        </select>
                                    </div>
                                    {errors.specialization && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.specialization.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Academic Qualifications</label>
                                    <div className="relative">
                                        <Award className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <input
                                            {...register('qualification')}
                                            placeholder="e.g. MBBS, FCPS (Medicine)"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                    {errors.qualification && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.qualification.message}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Subscription Configuration */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6 h-full">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-emerald-50 rounded-lg">
                                    <CreditCard className="h-5 w-5 text-emerald-600" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Subscription Setup</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <label className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPlan === 'trial' ? 'border-blue-500 bg-blue-50/50 shadow-md ring-4 ring-blue-500/5' : 'border-slate-100 bg-slate-50/50 hover:bg-white'}`}>
                                        <input type="radio" {...register('plan')} value="trial" className="sr-only" />
                                        <span className={`text-xs font-bold uppercase tracking-wider mb-1 ${selectedPlan === 'trial' ? 'text-blue-600' : 'text-slate-400'}`}>Limited</span>
                                        <span className="text-sm font-extrabold text-slate-900">7-Day Trial</span>
                                        <span className="text-[10px] text-slate-500 mt-2 italic font-medium">Free of charge</span>
                                    </label>

                                    <label className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPlan === 'monthly' ? 'border-blue-500 bg-blue-50/50 shadow-md ring-4 ring-blue-500/5' : 'border-slate-100 bg-slate-50/50 hover:bg-white'}`}>
                                        <input type="radio" {...register('plan')} value="monthly" className="sr-only" />
                                        <span className={`text-xs font-bold uppercase tracking-wider mb-1 ${selectedPlan === 'monthly' ? 'text-blue-600' : 'text-slate-400'}`}>Popular</span>
                                        <span className="text-sm font-extrabold text-slate-900">Monthly</span>
                                        <span className="text-[10px] text-slate-500 mt-2 italic font-medium">Standard Billing</span>
                                    </label>

                                    <label className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPlan === 'quarterly' ? 'border-blue-500 bg-blue-50/50 shadow-md ring-4 ring-blue-500/5' : 'border-slate-100 bg-slate-50/50 hover:bg-white'}`}>
                                        <input type="radio" {...register('plan')} value="quarterly" className="sr-only" />
                                        <span className={`text-xs font-bold uppercase tracking-wider mb-1 ${selectedPlan === 'quarterly' ? 'text-blue-600' : 'text-slate-400'}`}>Value</span>
                                        <span className="text-sm font-extrabold text-slate-900">Quarterly</span>
                                        <span className="text-[10px] text-slate-500 mt-2 italic font-medium">3 Months Access</span>
                                    </label>

                                    <label className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPlan === 'yearly' ? 'border-blue-500 bg-blue-50/50 shadow-md ring-4 ring-blue-500/5' : 'border-slate-100 bg-slate-50/50 hover:bg-white'}`}>
                                        <input type="radio" {...register('plan')} value="yearly" className="sr-only" />
                                        <span className={`text-xs font-bold uppercase tracking-wider mb-1 ${selectedPlan === 'yearly' ? 'text-blue-600' : 'text-slate-400'}`}>Professional</span>
                                        <span className="text-sm font-extrabold text-slate-900">Yearly Plan</span>
                                        <span className="text-[10px] text-slate-500 mt-2 italic font-medium font-bold text-emerald-600">Save 20%</span>
                                    </label>
                                </div>

                                {selectedPlan !== 'trial' && (
                                    <div className="animate-in slide-in-from-top-2 duration-300">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Billing Cycles (Months)</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <select
                                                {...register('durationMonths')}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-white"
                                            >
                                                <option value="1">1 Month</option>
                                                <option value="3">3 Months</option>
                                                <option value="6">6 Months</option>
                                                <option value="12">12 Months (Yearly)</option>
                                                <option value="24">24 Months</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3">
                                    <h4 className="text-sm font-bold text-slate-800">Plan Summary</h4>
                                    <ul className="space-y-2 text-xs text-slate-600 font-medium">
                                        <li className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                            {selectedPlan === 'yearly' ? 'Up to 5 Assistants' : 'Up to 2 Assistants'}
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                            Complete Prescription Management
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                            Real-time Queue Monitoring
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-8 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-[0.98]"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-10 py-3 rounded-xl bg-blue-600 text-sm font-bold text-white shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] transition-all active:scale-[0.98] flex items-center gap-2 disabled:opacity-50 disabled:scale-100"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                        {isLoading ? 'Processing...' : 'Create Doctor Portal'}
                    </button>
                </div>
            </form>
        </div>
    );
}

function Loader2({ className }: { className?: string }) {
    return (
        <svg
            className={`animate-spin ${className}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
        </svg>
    );
}
