'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Trash2, Save, ArrowLeft, Thermometer, Weight, Activity, Heart, Stethoscope, FileText, FlaskConical, CalendarCheck, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { prescriptionSchema, type PrescriptionFormData } from '@/lib/validations/prescriptionSchema';
import { appointmentService } from '@/lib/services/appointmentService';
import { prescriptionService } from '@/lib/services/prescriptionService';
import { useAuthStore } from '@/lib/store/authStore';
import { QueueItem } from '@/lib/types';

export default function CreatePrescriptionPage() {
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [activeAppointment, setActiveAppointment] = useState<QueueItem | null>(null);
    const router = useRouter();
    const { user } = useAuthStore();

    const doctorId = user?.role === 'doctor' ? (user.id || user._id) : user?.doctorId;

    const {
        register,
        control,
        handleSubmit,
        reset,
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

    useEffect(() => {
        const fetchActiveCase = async () => {
            if (!doctorId) return;
            try {
                const res = await appointmentService.getTodayQueue(doctorId);
                const current = res.data.find((q: QueueItem) => q.status === 'in_progress');
                if (current) {
                    setActiveAppointment(current);
                    reset({
                        patientName: current.patientId?.name || '',
                        patientAge: current.patientId?.age?.toString() || '',
                        patientGender: current.patientId?.gender === 'Male' || current.patientId?.gender === 'Female' ? current.patientId?.gender : 'Other',
                        chiefComplaints: current.patientId?.problem || '',
                        medicines: [{ name: '', dosage: '1+0+1', duration: '7 days', timing: 'After Meal' }],
                    });
                } else {
                    toast.error("No active consultation found. Please start a consultation first from the queue.");
                }
            } catch {
                toast.error("Failed to load active consultation.");
            } finally {
                setInitialLoading(false);
            }
        };
        fetchActiveCase();
    }, [doctorId]);

    const onSubmit = async (data: PrescriptionFormData) => {
        if (!activeAppointment) {
            toast.error("No active consultation. Cannot save prescription.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                appointmentId: activeAppointment._id,
                patientId: activeAppointment.patientId?._id,
                chiefComplaints: [data.chiefComplaints],
                diagnosis: data.diagnosis || 'Clinical Assessment',
                vitals: {
                    bloodPressure: data.bp,
                    temperature: data.temp,
                    weight: data.weight,
                },
                medicines: data.medicines.map(m => ({
                    name: m.name,
                    dosage: m.dosage,
                    duration: m.duration,
                    timing: m.timing?.toLowerCase().replace(' ', '_') as 'before_meal' | 'after_meal' | 'with_meal' | 'empty_stomach' | 'as_needed',
                    type: 'tablet' as 'tablet' | 'capsule' | 'syrup' | 'injection' | 'ointment' | 'drops' | 'other'
                })),
                advice: data.advice,
                investigations: data.investigations ? data.investigations.split(',').map(s => s.trim()) : [],
                followUp: {
                    required: !!data.nextVisit,
                    date: data.nextVisit
                }
            };

            await prescriptionService.createPrescription(payload);
            toast.success('Prescription saved successfully');
            await appointmentService.updateAppointment(activeAppointment._id, { status: 'completed' });
            router.push('/doctor/dashboard');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Error saving prescription');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="text-center space-y-3">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                    <p className="text-sm text-slate-500">Loading consultation...</p>
                </div>
            </div>
        );
    }

    const patient = activeAppointment?.patientId;

    return (
        <div className="max-w-6xl mx-auto pb-20 px-4 sm:px-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-b border-slate-200 mb-8">
                <div>
                    <Link
                        href="/doctor/dashboard"
                        className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 transition-colors mb-2"
                    >
                        <ArrowLeft className="mr-1.5 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">Write Prescription</h1>
                </div>
                <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={loading || !activeAppointment}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save & Complete
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Patient Info Card */}
                {patient && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-xl bg-blue-600 flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
                                {patient.name?.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-lg font-bold text-slate-900 truncate">{patient.name}</h2>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                                    <span className="text-sm text-slate-500">ID: {patient.patientId}</span>
                                    <span className="text-sm text-slate-500">{patient.age} years</span>
                                    <span className="text-sm text-slate-500 capitalize">{patient.gender}</span>
                                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        In Consultation
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Vitals */}
                <section>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <Heart className="h-4 w-4 text-rose-500" />
                        Vitals
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl border border-slate-200 p-4">
                            <label className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2">
                                <Activity className="h-3.5 w-3.5 text-rose-400" />
                                Blood Pressure
                            </label>
                            <input
                                {...register('bp')}
                                placeholder="e.g. 120/80 mmHg"
                                className="w-full text-lg font-semibold text-slate-900 bg-transparent border-none outline-none placeholder:text-slate-300 placeholder:font-normal placeholder:text-sm"
                            />
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 p-4">
                            <label className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2">
                                <Thermometer className="h-3.5 w-3.5 text-amber-400" />
                                Temperature
                            </label>
                            <input
                                {...register('temp')}
                                placeholder="e.g. 98.6 °F"
                                className="w-full text-lg font-semibold text-slate-900 bg-transparent border-none outline-none placeholder:text-slate-300 placeholder:font-normal placeholder:text-sm"
                            />
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 p-4">
                            <label className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2">
                                <Weight className="h-3.5 w-3.5 text-indigo-400" />
                                Weight
                            </label>
                            <input
                                {...register('weight')}
                                placeholder="e.g. 70 kg"
                                className="w-full text-lg font-semibold text-slate-900 bg-transparent border-none outline-none placeholder:text-slate-300 placeholder:font-normal placeholder:text-sm"
                            />
                        </div>
                    </div>
                </section>

                {/* Complaints & Diagnosis - side by side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <section className="bg-white rounded-xl border border-slate-200 p-5">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-3">
                            <Stethoscope className="h-4 w-4 text-blue-500" />
                            Chief Complaints <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                            {...register('chiefComplaints')}
                            rows={4}
                            className="w-full bg-slate-50 rounded-lg p-3 text-sm text-slate-800 border border-slate-100 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none placeholder:text-slate-400"
                            placeholder="Describe the patient's symptoms..."
                        />
                        {errors.chiefComplaints && (
                            <p className="text-xs text-rose-500 mt-1">{errors.chiefComplaints.message}</p>
                        )}
                    </section>

                    <section className="bg-white rounded-xl border border-slate-200 p-5">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-3">
                            <ClipboardList className="h-4 w-4 text-indigo-500" />
                            Diagnosis
                        </label>
                        <textarea
                            {...register('diagnosis')}
                            rows={4}
                            className="w-full bg-slate-50 rounded-lg p-3 text-sm text-slate-800 border border-slate-100 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none placeholder:text-slate-400"
                            placeholder="Your clinical assessment..."
                        />
                    </section>
                </div>

                {/* Medicines (Rx) */}
                <section className="bg-white rounded-2xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="flex items-center gap-3 text-sm font-semibold text-slate-900">
                            <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-slate-900 text-white text-xs font-bold">Rx</span>
                            Medicines
                        </h3>
                        <button
                            type="button"
                            onClick={() => append({ name: '', dosage: '1+0+1', duration: '5 days', timing: 'After Meal' })}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Add Medicine
                        </button>
                    </div>

                    {/* Column headers (desktop) */}
                    <div className="hidden sm:grid grid-cols-12 gap-3 px-4 mb-2">
                        <span className="col-span-4 text-xs font-medium text-slate-400">Medicine Name</span>
                        <span className="col-span-2 text-xs font-medium text-slate-400">Dosage</span>
                        <span className="col-span-2 text-xs font-medium text-slate-400">Duration</span>
                        <span className="col-span-3 text-xs font-medium text-slate-400">Timing</span>
                        <span className="col-span-1" />
                    </div>

                    <div className="space-y-3">
                        {fields.map((field, index) => (
                            <div
                                key={field.id}
                                className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start bg-slate-50 p-4 rounded-xl border border-slate-100"
                            >
                                <div className="sm:col-span-4">
                                    <label className="sm:hidden text-xs text-slate-400 mb-1 block">Medicine Name</label>
                                    <input
                                        {...register(`medicines.${index}.name`)}
                                        placeholder="e.g. Napa Extra"
                                        className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-lg text-sm text-slate-800 placeholder:text-slate-300 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    />
                                    {errors.medicines?.[index]?.name && (
                                        <p className="text-xs text-rose-500 mt-1">{errors.medicines[index]?.name?.message}</p>
                                    )}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="sm:hidden text-xs text-slate-400 mb-1 block">Dosage</label>
                                    <input
                                        {...register(`medicines.${index}.dosage`)}
                                        placeholder="1+0+1"
                                        className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-lg text-sm text-slate-800 text-center placeholder:text-slate-300 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="sm:hidden text-xs text-slate-400 mb-1 block">Duration</label>
                                    <input
                                        {...register(`medicines.${index}.duration`)}
                                        placeholder="7 days"
                                        className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-lg text-sm text-slate-800 text-center placeholder:text-slate-300 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    />
                                </div>
                                <div className="sm:col-span-3">
                                    <label className="sm:hidden text-xs text-slate-400 mb-1 block">Timing</label>
                                    <select
                                        {...register(`medicines.${index}.timing`)}
                                        className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-lg text-sm text-slate-800 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none"
                                    >
                                        <option>After Meal</option>
                                        <option>Before Meal</option>
                                        <option>With Meal</option>
                                        <option>Empty Stomach</option>
                                        <option>As Needed</option>
                                    </select>
                                </div>
                                <div className="sm:col-span-1 flex sm:justify-center items-start pt-0 sm:pt-1">
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                        aria-label={`Remove medicine ${index + 1}`}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {fields.length === 0 && (
                            <div className="text-center py-8 text-slate-400">
                                <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
                                <p className="text-sm">No medicines added yet. Click &quot;Add Medicine&quot; to start.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Additional Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <section className="bg-white rounded-xl border border-slate-200 p-5">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-3">
                            <FlaskConical className="h-4 w-4 text-violet-500" />
                            Investigations
                        </label>
                        <textarea
                            {...register('investigations')}
                            rows={3}
                            className="w-full bg-slate-50 rounded-lg p-3 text-sm text-slate-800 border border-slate-100 focus:border-violet-300 focus:ring-2 focus:ring-violet-100 outline-none transition-all resize-none placeholder:text-slate-400"
                            placeholder="e.g. CBC, Blood Sugar, X-Ray Chest"
                        />
                    </section>

                    <section className="bg-white rounded-xl border border-slate-200 p-5">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-3">
                            <FileText className="h-4 w-4 text-teal-500" />
                            Advice
                        </label>
                        <textarea
                            {...register('advice')}
                            rows={3}
                            className="w-full bg-slate-50 rounded-lg p-3 text-sm text-slate-800 border border-slate-100 focus:border-teal-300 focus:ring-2 focus:ring-teal-100 outline-none transition-all resize-none placeholder:text-slate-400"
                            placeholder="e.g. Drink plenty of water, avoid spicy food..."
                        />
                    </section>
                </div>

                {/* Follow-up & Submit */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 w-full sm:w-auto">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2">
                            <CalendarCheck className="h-4 w-4 text-blue-500" />
                            Follow-up
                        </label>
                        <input
                            {...register('nextVisit')}
                            placeholder="e.g. After 7 days"
                            className="w-full sm:w-72 bg-slate-50 rounded-lg px-3 py-2.5 text-sm text-slate-800 border border-slate-100 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !activeAppointment}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Prescription
                    </button>
                </div>
            </form>
        </div>
    );
}
