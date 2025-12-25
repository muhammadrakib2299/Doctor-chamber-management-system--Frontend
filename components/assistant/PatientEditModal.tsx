'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { patientService } from '@/lib/services/patientService';
import toast from 'react-hot-toast';
import { X, Phone, User, Calendar, MapPin, Save, Loader2, Users } from 'lucide-react';

const patientSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().min(11, 'Invalid phone number (min 11 digits)'),
    age: z.string().refine((val) => !isNaN(Number(val)), 'Age must be a number').transform((val) => parseInt(val, 10)),
    gender: z.enum(['male', 'female', 'other']),
    address: z.string().optional(),
});

interface PatientEditModalProps {
    patient: any;
    onClose: () => void;
    onSuccess: () => void;
}

export default function PatientEditModal({ patient, onClose, onSuccess }: PatientEditModalProps) {
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(patientSchema),
        defaultValues: {
            name: patient.name,
            phone: patient.phone,
            age: patient.age.toString(),
            gender: patient.gender,
            address: patient.address || ''
        }
    });

    const onSubmit = async (data: any) => {
        try {
            setLoading(true);
            await patientService.updatePatient(patient._id, data);
            toast.success("Patient updated successfully!");
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error("Update error:", error);
            toast.error(error.response?.data?.message || "Failed to update patient");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                            <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white">Edit Patient</h2>
                            <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mt-0.5">#{patient.patientId}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2.5 hover:bg-white/10 rounded-xl transition-colors">
                        <X className="h-6 w-6 text-white/70" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="group md:col-span-2">
                            <label className="block text-sm font-black text-slate-700 mb-2 ml-1 uppercase tracking-wider">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    {...register('name')}
                                    type="text"
                                    placeholder="Enter patient name"
                                    className="w-full pl-11 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                                />
                            </div>
                            {errors.name && <p className="mt-2 text-[10px] font-black text-rose-500 ml-2 uppercase tracking-widest">{String(errors.name.message)}</p>}
                        </div>

                        {/* Phone */}
                        <div className="group">
                            <label className="block text-sm font-black text-slate-700 mb-2 ml-1 uppercase tracking-wider">
                                Phone Number
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    {...register('phone')}
                                    type="text"
                                    placeholder="01XXX XXXXXX"
                                    className="w-full pl-11 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                                />
                            </div>
                            {errors.phone && <p className="mt-2 text-[10px] font-black text-rose-500 ml-2 uppercase tracking-widest">{String(errors.phone.message)}</p>}
                        </div>

                        {/* Age */}
                        <div className="group">
                            <label className="block text-sm font-black text-slate-700 mb-2 ml-1 uppercase tracking-wider">
                                Age
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    {...register('age')}
                                    type="number"
                                    placeholder="25"
                                    className="w-full pl-11 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                                />
                            </div>
                            {errors.age && <p className="mt-2 text-[10px] font-black text-rose-500 ml-2 uppercase tracking-widest">{String(errors.age.message)}</p>}
                        </div>

                        {/* Gender */}
                        <div className="group">
                            <label className="block text-sm font-black text-slate-700 mb-2 ml-1 uppercase tracking-wider">
                                Gender
                            </label>
                            <div className="relative">
                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <select
                                    {...register('gender')}
                                    className="w-full pl-11 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-black text-slate-900 appearance-none"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="group md:col-span-2">
                            <label className="block text-sm font-black text-slate-700 mb-2 ml-1 uppercase tracking-wider">
                                Residential Address
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-4 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <textarea
                                    {...register('address')}
                                    rows={3}
                                    placeholder="Enter full address"
                                    className="w-full pl-11 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900 resize-none"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 px-6 rounded-2xl border border-slate-200 text-sm font-black text-slate-600 hover:bg-slate-50 transition-all active:scale-[0.98]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-blue-600 text-sm font-black text-white shadow-xl shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    <Save className="h-5 w-5" />
                                    <span>Update Patient Profile</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
