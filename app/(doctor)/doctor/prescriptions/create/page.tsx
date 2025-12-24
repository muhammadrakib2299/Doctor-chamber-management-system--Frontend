'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Trash2, Save, Printer, ArrowLeft, Thermometer, Weight, Activity, Heart, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { prescriptionSchema, type PrescriptionFormData } from '@/lib/validations/prescriptionSchema';
import { appointmentService } from '@/lib/services/appointmentService';
import { prescriptionService } from '@/lib/services/prescriptionService';
import { useAuthStore } from '@/lib/store/authStore';

export default function CreatePrescriptionPage() {
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [activeAppointment, setActiveAppointment] = useState<any>(null);
    const router = useRouter();
    const { user } = useAuthStore();

    const doctorId = user?.role === 'doctor' ? (user.id || user._id) : user?.doctorId;

    // Fetch active patient on load
    useEffect(() => {
        const fetchActiveCase = async () => {
            if (!doctorId) return;
            try {
                const res = await appointmentService.getTodayQueue(doctorId);
                const current = res.data.find((q: any) => q.status === 'in_progress');
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
                    toast.error("No active consultation found. Please 'Start Consultation' first.");
                }
            } catch (error) {
                console.error(error);
            } finally {
                setInitialLoading(false);
            }
        };
        fetchActiveCase();
    }, [doctorId]);

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

    const onSubmit = async (data: PrescriptionFormData) => {
        if (!activeAppointment) {
            toast.error("Missing clinical context. Cannot save.");
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
                    timing: m.timing?.toLowerCase().replace(' ', '_') as any,
                    type: 'tablet' as any
                })),
                advice: data.advice,
                investigations: data.investigations ? data.investigations.split(',').map(s => s.trim()) : [],
                followUp: {
                    required: !!data.nextVisit,
                    date: data.nextVisit
                }
            };

            await prescriptionService.createPrescription(payload as any);
            toast.success('Prescription generated successfully');

            // Mark appointment as completed
            await appointmentService.updateAppointment(activeAppointment._id, { status: 'completed' });

            router.push('/doctor/dashboard');
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Error saving prescription');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20 mt-4 px-4 sm:px-0">
            {/* Professional Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8 sticky top-0 bg-slate-50/80 backdrop-blur-md z-30 pt-2">
                <div className="space-y-1">
                    <Link href="/doctor/dashboard" className="group inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-colors mb-2">
                        <ArrowLeft className="mr-2 h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                        Exit & Terminate Board
                    </Link>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-none">Clinical Prescription</h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                        <Activity className="h-3 w-3 text-emerald-500" /> Authorized Medical Document Tier 1
                    </p>
                </div>
                <div className="flex gap-4">
                    <button
                        type="button"
                        className="px-6 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center"
                    >
                        <Printer className="mr-3 h-4 w-4" />
                        Live Draft
                    </button>
                    <button
                        onClick={handleSubmit(onSubmit)}
                        disabled={loading || !activeAppointment}
                        className="px-8 py-3.5 rounded-2xl bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="mr-3 h-4 w-4 animate-spin" /> : <Save className="mr-3 h-4 w-4" />}
                        Finalize & Close Case
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                {/* Visual Context Panel */}
                {activeAppointment && (
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-slate-300">
                        <div className="flex items-center gap-6">
                            <div className="h-20 w-20 rounded-3xl bg-blue-600 flex items-center justify-center text-3xl font-black shadow-lg shadow-blue-500/20 border border-blue-400/20">
                                {activeAppointment.patientId?.name?.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-3xl font-black leading-none mb-2">{activeAppointment.patientId?.name}</h2>
                                <div className="flex gap-3 items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/10 rounded-lg">ID: {activeAppointment.patientId?.patientId}</span>
                                    <span className="h-1 w-1 rounded-full bg-white/20"></span>
                                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/10 rounded-lg">{activeAppointment.patientId?.age}Y • {activeAppointment.patientId?.gender}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-6 py-3 bg-white/5 rounded-2xl border border-white/10">
                            <Heart className="h-4 w-4 text-emerald-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Stable Condition</span>
                        </div>
                    </div>
                )}

                {/* Vitals Grid */}
                <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                    {[
                        { label: 'Blood Pressure', icon: Activity, placeholder: '120/80', field: 'bp', color: 'text-rose-500', bg: 'bg-rose-50' },
                        { label: 'Body Temp', icon: Thermometer, placeholder: '98.6', field: 'temp', color: 'text-amber-500', bg: 'bg-amber-50' },
                        { label: 'Weight (KG)', icon: Weight, placeholder: '70', field: 'weight', color: 'text-indigo-500', bg: 'bg-indigo-50' },
                    ].map((vital) => (
                        <div key={vital.field} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm group hover:border-blue-100 transition-all">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={cn("p-2 rounded-xl", vital.bg, vital.color)}>
                                    <vital.icon className="h-4 w-4" />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{vital.label}</span>
                            </div>
                            <input
                                {...register(vital.field as any)}
                                className="w-full text-2xl font-black text-slate-900 border-none outline-none placeholder:text-slate-200"
                                placeholder={vital.placeholder}
                            />
                        </div>
                    ))}
                </div>

                <div className="grid gap-10 lg:grid-cols-12 items-start">
                    {/* Left: Complaints & Diagnosis */}
                    <div className="lg:col-span-4 space-y-10">
                        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                            <div className="flex items-center gap-3">
                                <Activity className="h-5 w-5 text-blue-600" />
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-none">Primary Symptoms</h3>
                            </div>
                            <textarea
                                {...register('chiefComplaints')}
                                rows={4}
                                className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-blue-100 transition-all"
                                placeholder="Describe symptoms..."
                            />
                        </section>

                        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                            <div className="flex items-center gap-3">
                                <ClipboardList className="h-5 w-5 text-indigo-600" />
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-none">Clinical Diagnosis</h3>
                            </div>
                            <textarea
                                {...register('diagnosis')}
                                rows={4}
                                className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-100 transition-all"
                                placeholder="Final assessment..."
                            />
                        </section>
                    </div>

                    {/* Right: Medicines Rx */}
                    <div className="lg:col-span-8 space-y-10">
                        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black">Rx</div>
                                    <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest">Medical Prescription</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => append({ name: '', dosage: '1+0+1', duration: '5 days', timing: 'After Meal' })}
                                    className="px-5 py-2.5 rounded-xl bg-blue-50 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm flex items-center gap-2"
                                >
                                    <Plus className="h-3.5 w-3.5" /> New Item
                                </button>
                            </div>

                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-slate-50 p-6 rounded-[2rem] border border-slate-100 group">
                                        <div className="sm:col-span-5 relative">
                                            <input
                                                {...register(`medicines.${index}.name`)}
                                                placeholder="Medicine Name / Brand"
                                                className="w-full bg-white border border-slate-100 px-5 py-3 rounded-xl text-sm font-black text-slate-700 placeholder:text-slate-200 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                            />
                                            {errors.medicines?.[index]?.name && <p className="text-[9px] font-black text-rose-500 uppercase mt-1 ml-1">{errors.medicines[index]?.name?.message}</p>}
                                        </div>
                                        <div className="sm:col-span-2">
                                            <input {...register(`medicines.${index}.dosage`)} placeholder="1+0+1" className="w-full bg-white border border-slate-100 px-4 py-3 rounded-xl text-sm font-bold text-center text-slate-600 placeholder:text-slate-200 outline-none" />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <input {...register(`medicines.${index}.duration`)} placeholder="7 Days" className="w-full bg-white border border-slate-100 px-4 py-3 rounded-xl text-sm font-bold text-center text-slate-600 placeholder:text-slate-200 outline-none" />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <select {...register(`medicines.${index}.timing`)} className="w-full bg-white border border-slate-100 px-3 py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter text-slate-600 outline-none appearance-none">
                                                <option>After Meal</option>
                                                <option>Before Meal</option>
                                                <option>Empty Stomach</option>
                                            </select>
                                        </div>
                                        <div className="sm:col-span-1 flex justify-center">
                                            <button type="button" onClick={() => remove(index)} className="p-3 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Additional Advice */}
                        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
                            <div className="grid gap-10 md:grid-cols-2">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Laboratory Investigations</label>
                                    <textarea {...register('investigations')} rows={4} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-blue-50" placeholder="List required tests..." />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lifestyle Advice</label>
                                    <textarea {...register('advice')} rows={4} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-blue-50" placeholder="Patient instructions..." />
                                </div>
                            </div>
                            <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 leading-none">Follow-up Visitation</label>
                                    <input {...register('nextVisit')} className="bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-black text-blue-600 placeholder:text-slate-200 w-full sm:w-64" placeholder="e.g. After 7 days" />
                                </div>
                                <button
                                    type="submit"
                                    onClick={handleSubmit(onSubmit)}
                                    className="px-10 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-95"
                                >
                                    Seal & Close Record
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
