'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Trash2, Save, Printer, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { prescriptionSchema, type PrescriptionFormData } from '@/lib/validations/prescriptionSchema';

export default function CreatePrescriptionPage() {
    const [loading, setLoading] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<PrescriptionFormData>({
        resolver: zodResolver(prescriptionSchema),
        defaultValues: {
            patientGender: 'Male',
            medicines: [{ name: '', dosage: '1+0+1', duration: '7 days', timing: 'After Meal' }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'medicines',
    });

    const onSubmit = async (data: PrescriptionFormData) => {
        setLoading(true);
        try {
            // API call would go here
            console.log('Prescription Data:', data);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
            toast.success('Prescription created successfully');
            // Redirect or Show PDF
        } catch (error) {
            toast.error('Failed to save prescription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 bg-slate-50 py-4 z-10">
                <div className="space-y-1">
                    <Link href="/doctor/dashboard" className="flex items-center text-sm text-slate-500 hover:text-blue-600">
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">New Prescription</h1>
                </div>
                <div className="flex gap-3">
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                    >
                        <Printer className="mr-2 h-4 w-4" />
                        Print Preview
                    </button>
                    <button
                        onClick={handleSubmit(onSubmit)}
                        disabled={loading}
                        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Prescription
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Patient Details Section */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Patient Information</h2>
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-medium">Patient Name</label>
                            <input {...register('patientName')} className="flex h-10 w-full rounded-md border border-slate-200 px-3 text-sm" placeholder="Name" />
                            {errors.patientName && <p className="text-xs text-red-500">{errors.patientName.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Age</label>
                            <input {...register('patientAge')} className="flex h-10 w-full rounded-md border border-slate-200 px-3 text-sm" placeholder="Years" />
                            {errors.patientAge && <p className="text-xs text-red-500">{errors.patientAge.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Gender</label>
                            <select {...register('patientGender')} className="flex h-10 w-full rounded-md border border-slate-200 px-3 text-sm bg-white">
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Vitals */}
                    <div className="mt-4 grid gap-4 grid-cols-3 md:grid-cols-6 bg-slate-50 p-4 rounded-lg">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500">BP</label>
                            <input {...register('bp')} className="flex h-8 w-full rounded border border-slate-200 px-2 text-sm" placeholder="120/80" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500">Weight</label>
                            <input {...register('weight')} className="flex h-8 w-full rounded border border-slate-200 px-2 text-sm" placeholder="kg" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500">Temp</label>
                            <input {...register('temp')} className="flex h-8 w-full rounded border border-slate-200 px-2 text-sm" placeholder="°F" />
                        </div>
                    </div>
                </div>

                {/* Diagnosis Section */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Clinical Diagnosis</h2>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Chief Complaints (C/C)</label>
                            <textarea {...register('chiefComplaints')} rows={2} className="flex w-full rounded-md border border-slate-200 px-3 py-2 text-sm" placeholder="Describe symptoms..." />
                            {errors.chiefComplaints && <p className="text-xs text-red-500">{errors.chiefComplaints.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Diagnosis / Observations</label>
                            <textarea {...register('diagnosis')} rows={2} className="flex w-full rounded-md border border-slate-200 px-3 py-2 text-sm" placeholder="Clinical findings..." />
                        </div>
                    </div>
                </div>

                {/* Medicines Section */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-900">Rx / Medicines</h2>
                        <button
                            type="button"
                            onClick={() => append({ name: '', dosage: '1+0+1', duration: '7 days', timing: 'After Meal' })}
                            className="inline-flex items-center rounded-md bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-100"
                        >
                            <Plus className="mr-1 h-4 w-4" /> Add Medicine
                        </button>
                    </div>

                    <div className="space-y-3">
                        {fields.map((field, index) => (
                            <div key={field.id} className="grid gap-3 md:grid-cols-12 items-start bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div className="md:col-span-1 flex items-center justify-center pt-2">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">{index + 1}</span>
                                </div>
                                <div className="md:col-span-4 space-y-1">
                                    <input
                                        {...register(`medicines.${index}.name`)}
                                        placeholder="Medicine Name / Brand"
                                        className="flex h-9 w-full rounded border border-slate-200 px-3 text-sm font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                    {errors.medicines?.[index]?.name && <p className="text-xs text-red-500">{errors.medicines[index]?.name?.message}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <input {...register(`medicines.${index}.dosage`)} placeholder="1+0+1" className="flex h-9 w-full rounded border border-slate-200 px-3 text-sm" />
                                </div>
                                <div className="md:col-span-2">
                                    <input {...register(`medicines.${index}.duration`)} placeholder="Duration" className="flex h-9 w-full rounded border border-slate-200 px-3 text-sm" />
                                </div>
                                <div className="md:col-span-2">
                                    <select {...register(`medicines.${index}.timing`)} className="flex h-9 w-full rounded border border-slate-200 px-2 text-sm bg-white">
                                        <option>After Meal</option>
                                        <option>Before Meal</option>
                                        <option>Empty Stomach</option>
                                    </select>
                                </div>
                                <div className="md:col-span-1 flex justify-center pt-1">
                                    <button type="button" onClick={() => remove(index)} className="text-red-400 hover:text-red-600">
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Advice Section */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tests / Investigations</label>
                            <textarea {...register('investigations')} rows={4} className="flex w-full rounded-md border border-slate-200 px-3 py-2 text-sm" placeholder="List required tests..." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Advice & Instructions</label>
                            <textarea {...register('advice')} rows={4} className="flex w-full rounded-md border border-slate-200 px-3 py-2 text-sm" placeholder="Special outcome instructions..." />
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                        <label className="text-sm font-medium">Next Visit</label>
                        <input {...register('nextVisit')} className="flex h-10 w-full sm:w-64 rounded-md border border-slate-200 px-3 text-sm mt-1" placeholder="e.g., After 7 days" />
                    </div>
                </div>
            </form>
        </div>
    );
}
