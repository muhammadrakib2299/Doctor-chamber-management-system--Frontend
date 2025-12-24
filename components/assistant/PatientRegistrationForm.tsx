'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { patientService } from '@/lib/services/patientService';
import { useAuthStore } from '@/lib/store/authStore';
import toast from 'react-hot-toast';
import { UserPlus, Phone, User, Calendar, MapPin, ChevronRight, Loader2, Users } from 'lucide-react';

const patientSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().min(11, 'Invalid phone number (min 11 digits)'),
    age: z.string().refine((val) => !isNaN(Number(val)), 'Age must be a number').transform((val) => parseInt(val, 10)),
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
        resolver: zodResolver(patientSchema),
        defaultValues: {
            gender: 'male' as const,
            address: ''
        }
    });

    const onSubmit = async (data: any) => {
        try {
            setLoading(true);

            // Handle both _id and id for consistency
            const doctorId = user?.role === 'doctor'
                ? (user.id || user._id)
                : user?.doctorId;

            if (!doctorId) {
                toast.error("Doctor association not found. Please log in again.");
                return;
            }

            const payload = {
                ...data,
                doctorId,
                newPatientFee: 500, // Default fees
                oldPatientFee: 300
            };

            const res = await patientService.createPatient(payload);
            toast.success("Patient registered successfully!");
            reset();
            if (onSuccess) onSuccess(res.data);
        } catch (error: any) {
            console.error("Registration error:", error);
            toast.error(error.response?.data?.message || "Failed to register patient");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden transform transition-all hover:shadow-2xl hover:shadow-blue-100/50">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
                        <UserPlus className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Register Patient</h2>
                        <p className="text-blue-100 text-xs font-medium">Create a new patient file instantly</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                <div className="space-y-5">
                    {/* Phone */}
                    <div className="group">
                        <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1 transition-colors group-focus-within:text-blue-600">
                            Phone Number
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                {...register('phone')}
                                type="text"
                                placeholder="01XXX XXXXXX"
                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-medium"
                            />
                        </div>
                        {errors.phone && <p className="mt-1.5 text-[10px] font-bold text-rose-500 ml-2 uppercase tracking-wider">{String(errors.phone.message)}</p>}
                    </div>

                    {/* Name */}
                    <div className="group">
                        <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1 transition-colors group-focus-within:text-blue-600">
                            Full Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                {...register('name')}
                                type="text"
                                placeholder="Enter patient name"
                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                            />
                        </div>
                        {errors.name && <p className="mt-1.5 text-[10px] font-bold text-rose-500 ml-2 uppercase tracking-wider">{String(errors.name.message)}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Age */}
                        <div className="group">
                            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Age</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    {...register('age')}
                                    type="number"
                                    placeholder="25"
                                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                />
                            </div>
                            {errors.age && <p className="mt-1.5 text-[10px] font-bold text-rose-500 ml-2 uppercase tracking-wider">{String(errors.age.message)}</p>}
                        </div>

                        {/* Gender */}
                        <div className="group">
                            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Gender</label>
                            <div className="relative">
                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <select
                                    {...register('gender')}
                                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium appearance-none"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="group">
                        <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Address (Optional)</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-4 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <textarea
                                {...register('address')}
                                rows={2}
                                placeholder="Enter area or village"
                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium resize-none"
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-blue-600 text-sm font-extrabold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none"
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                <span>Create Patient Profile</span>
                                <ChevronRight className="h-4 w-4" />
                            </>
                        )}
                    </button>
                    <p className="text-center text-[10px] text-slate-400 font-bold mt-4 uppercase tracking-tighter">
                        Profile will be linked to your current doctor session
                    </p>
                </div>
            </form>
        </div>
    );
}
