'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { appointmentService } from '@/lib/services/appointmentService';
import toast from 'react-hot-toast';
import {
    X,
    Calendar,
    CreditCard,
    ChevronRight,
    Loader2,
    ShieldCheck,
    Banknote,
    Smartphone,
    Wallet
} from 'lucide-react';
import { Patient } from '@/lib/types';

interface Props {
    patient: Patient;
    onCancel: () => void;
    onSuccess: (data?: { serialNumber?: number; appointmentId?: string }) => void;
}

export default function AppointmentBookingModal({ patient, onCancel, onSuccess }: Props) {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);

    const isNew = patient.patientType === 'new';
    const estimatedFee = isNew ? (patient.newPatientFee || 500) : (patient.oldPatientFee || 300);

    const [formData, setFormData] = useState({
        feeAmount: estimatedFee,
        bookingType: 'walk-in',
        paymentStatus: 'pending',
        paymentMethod: 'cash',
    });

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onCancel]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const doctorId = user?.role === 'doctor' ? (user.id || user._id) : user?.doctorId;

            if (!doctorId) {
                toast.error("Doctor ID not found");
                return;
            }

            const payload = {
                patientId: patient._id,
                doctorId,
                appointmentDate: new Date().toISOString(),
                bookingType: formData.bookingType as 'walk-in' | 'phone',
                feeAmount: formData.feeAmount,
                feeType: (isNew ? 'new_patient' : 'old_patient') as 'new_patient' | 'old_patient',
                paymentMethod: formData.paymentMethod as 'cash' | 'card' | 'mobile_banking',
                paymentStatus: formData.paymentStatus as 'pending' | 'paid',
                status: 'booked' as const,
            };

            const res = await appointmentService.createAppointment(payload);
            toast.success("Serial booked successfully!");
            onSuccess({
                serialNumber: res.data?.serialNumber,
                appointmentId: res.data?._id,
            });
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || "Booking failed");
        } finally {
            setLoading(false);
        }
    };

    const paymentMethods = [
        { value: 'cash', label: 'Cash', icon: Banknote },
        { value: 'card', label: 'Card', icon: CreditCard },
        { value: 'mobile_banking', label: 'Mobile Banking', icon: Smartphone },
    ];

    return (
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden max-w-lg w-full">
            {/* Modal Header */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-900 px-8 py-8 text-white relative">
                <button
                    onClick={onCancel}
                    className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all"
                    aria-label="Close booking modal"
                >
                    <X className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-blue-500 rounded-3xl flex items-center justify-center font-black text-2xl shadow-xl shadow-blue-500/30">
                        {patient.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-2xl font-black tracking-tight">{patient.name}</h3>
                        <div className="flex items-center gap-2 mt-1 opacity-70">
                            <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-md">ID: {patient.patientId}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest bg-blue-500/40 px-2 py-0.5 rounded-md">{patient.patientType || 'new'} CASE</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Fee & Payment Status */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Consultation Fee</label>
                        <div className="relative group">
                            <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="number"
                                value={formData.feeAmount}
                                onChange={(e) => setFormData({ ...formData, feeAmount: Number(e.target.value) })}
                                className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-700"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Status</label>
                        <div className="relative group">
                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <select
                                value={formData.paymentStatus}
                                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                                className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                            >
                                <option value="pending">Pay Later</option>
                                <option value="paid">Pre-paid</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Payment Method */}
                {formData.paymentStatus === 'paid' && (
                    <div className="p-5 bg-emerald-50/50 rounded-3xl border border-emerald-100/50">
                        <h5 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <CreditCard className="h-3 w-3" /> Payment Method
                        </h5>
                        <div className="grid grid-cols-3 gap-3">
                            {paymentMethods.map((method) => (
                                <label
                                    key={method.value}
                                    className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all cursor-pointer ${formData.paymentMethod === method.value
                                        ? 'bg-white border-emerald-500 shadow-lg shadow-emerald-100'
                                        : 'border-transparent bg-white/50 hover:bg-white'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        value={method.value}
                                        checked={formData.paymentMethod === method.value}
                                        onChange={() => setFormData({ ...formData, paymentMethod: method.value })}
                                        className="sr-only"
                                    />
                                    <method.icon className={`h-5 w-5 mb-1.5 ${formData.paymentMethod === method.value ? 'text-emerald-600' : 'text-slate-400'}`} />
                                    <span className="text-[10px] font-black text-slate-700">{method.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Booking Type */}
                <div className="p-5 bg-blue-50/50 rounded-3xl border border-blue-100/50">
                    <h5 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Calendar className="h-3 w-3" /> Booking Type
                    </h5>
                    <div className="grid grid-cols-2 gap-4">
                        <label className={`flex flex-col p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.bookingType === 'walk-in' ? 'bg-white border-blue-500 shadow-lg shadow-blue-100' : 'border-transparent bg-slate-100/50 hover:bg-white'}`}>
                            <input type="radio" value="walk-in" checked={formData.bookingType === 'walk-in'} onChange={() => setFormData({ ...formData, bookingType: 'walk-in' })} className="sr-only" />
                            <span className="text-xs font-black text-slate-800">Walk-in</span>
                            <span className="text-[10px] text-slate-400 font-bold mt-1">Direct Arrival</span>
                        </label>
                        <label className={`flex flex-col p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.bookingType === 'phone' ? 'bg-white border-blue-500 shadow-lg shadow-blue-100' : 'border-transparent bg-slate-100/50 hover:bg-white'}`}>
                            <input type="radio" value="phone" checked={formData.bookingType === 'phone'} onChange={() => setFormData({ ...formData, bookingType: 'phone' })} className="sr-only" />
                            <span className="text-xs font-black text-slate-800">Phone Call</span>
                            <span className="text-[10px] text-slate-400 font-bold mt-1">Remote Serial</span>
                        </label>
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-4 px-6 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                        Dismiss
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-[2] py-4 px-6 rounded-2xl bg-indigo-600 text-sm font-black text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:shadow-none"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                            <>
                                <span>Complete Booking</span>
                                <ChevronRight className="h-4 w-4" />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
