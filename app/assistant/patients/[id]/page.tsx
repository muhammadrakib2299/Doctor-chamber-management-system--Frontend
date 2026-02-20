'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { patientService } from '@/lib/services/patientService';
import { appointmentService, Appointment } from '@/lib/services/appointmentService';
import { useAuthStore } from '@/lib/store/authStore';
import toast from 'react-hot-toast';
import Link from 'next/link';
import {
    ArrowLeft,
    User,
    Phone,
    MapPin,
    Calendar,
    Fingerprint,
    Loader2,
    Edit2,
    TicketPlus,
    Heart,
    Droplets,
    AlertTriangle,
    Clock,
    Banknote
} from 'lucide-react';
import { Patient } from '@/lib/types';
import PatientEditModal from '@/components/assistant/PatientEditModal';
import AppointmentBookingModal from '@/components/assistant/AppointmentBookingModal';

export default function PatientDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuthStore();
    const [patient, setPatient] = useState<Patient | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);

    const patientId = params.id as string;
    const doctorId = user?.role === 'doctor' ? (user.id || user._id) : user?.doctorId;

    const fetchData = async () => {
        try {
            setLoading(true);
            const [patientRes, appointmentsRes] = await Promise.all([
                patientService.getPatient(patientId),
                appointmentService.getAppointments({
                    patientId: patientId,
                    sort: '-appointmentDate',
                    limit: 20,
                } as Record<string, string | number>),
            ]);
            setPatient(patientRes.data);
            setAppointments(appointmentsRes.data || []);
        } catch {
            toast.error('Failed to load patient details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (patientId) fetchData();
    }, [patientId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
                <User className="h-12 w-12 mb-3 opacity-20" />
                <h4 className="text-lg font-bold">Patient not found</h4>
                <Link href="/assistant/patients" className="text-sm text-blue-600 font-bold mt-2 hover:underline">
                    Back to Patient Registry
                </Link>
            </div>
        );
    }

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            booked: 'bg-amber-100 text-amber-700',
            waiting: 'bg-emerald-100 text-emerald-700',
            in_progress: 'bg-blue-100 text-blue-700',
            completed: 'bg-slate-100 text-slate-600',
            cancelled: 'bg-rose-100 text-rose-600',
            no_show: 'bg-orange-100 text-orange-600',
        };
        return styles[status] || 'bg-slate-100 text-slate-600';
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Back Button & Actions */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowBookingModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                    >
                        <TicketPlus className="h-4 w-4" />
                        Take Serial
                    </button>
                    <button
                        onClick={() => setShowEditModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-50 transition-all"
                    >
                        <Edit2 className="h-4 w-4" />
                        Edit
                    </button>
                </div>
            </div>

            {/* Patient Profile Card */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8">
                    <div className="flex items-center gap-5">
                        <div className="h-20 w-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-white font-black text-3xl">
                            {patient.name.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tight">{patient.name}</h1>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-xs font-bold text-blue-100 bg-white/20 px-3 py-1 rounded-lg uppercase tracking-wider">
                                    ID: {patient.patientId}
                                </span>
                                <span className="text-xs font-bold text-blue-100 bg-white/20 px-3 py-1 rounded-lg uppercase tracking-wider">
                                    {patient.patientType || 'new'} Patient
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                <Phone className="h-3 w-3" /> Phone
                            </p>
                            <p className="text-sm font-bold text-slate-800">{patient.phone}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> Age & Gender
                            </p>
                            <p className="text-sm font-bold text-slate-800">{patient.age} years, {patient.gender}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> Address
                            </p>
                            <p className="text-sm font-bold text-slate-800">{patient.address || 'Not provided'}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                <Clock className="h-3 w-3" /> Total Visits
                            </p>
                            <p className="text-sm font-bold text-slate-800">{patient.totalVisits || 0}</p>
                        </div>
                    </div>

                    {/* Medical Info */}
                    {(patient.bloodGroup || patient.allergies?.length || patient.chronicConditions?.length) && (
                        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
                            {patient.bloodGroup && (
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                        <Droplets className="h-3 w-3" /> Blood Group
                                    </p>
                                    <p className="text-sm font-bold text-slate-800">{patient.bloodGroup}</p>
                                </div>
                            )}
                            {patient.allergies && patient.allergies.length > 0 && (
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" /> Allergies
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {patient.allergies.map((a, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-md">{a}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {patient.chronicConditions && patient.chronicConditions.length > 0 && (
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                        <Heart className="h-3 w-3" /> Chronic Conditions
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {patient.chronicConditions.map((c, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-md">{c}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Last Visit */}
                    {patient.lastVisitDate && (
                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Visit</p>
                            <p className="text-sm font-bold text-slate-800 mt-1">
                                {new Date(patient.lastVisitDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Visit History */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-lg font-black text-slate-800">Visit History</h3>
                    <p className="text-xs text-slate-400 font-bold mt-0.5">{appointments.length} recorded visits</p>
                </div>

                {appointments.length === 0 ? (
                    <div className="py-16 text-center">
                        <Calendar className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                        <p className="text-sm font-bold text-slate-400">No visit history yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {appointments.map((apt) => (
                            <div key={apt._id} className="px-8 py-5 hover:bg-blue-50/30 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
                                            <span className="text-sm font-black">#{apt.serialNumber}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">
                                                {new Date(apt.appointmentDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                            <div className="flex items-center gap-3 mt-0.5">
                                                <span className="text-[10px] font-bold text-slate-400 capitalize">{apt.bookingType?.replace('-', ' ')}</span>
                                                <span className="text-[10px] font-bold text-slate-400 capitalize">{apt.feeType?.replace('_', ' ')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-slate-700 flex items-center gap-1">
                                                <Banknote className="h-3.5 w-3.5" /> ৳{apt.feeAmount}
                                            </p>
                                            <p className={`text-[10px] font-bold capitalize ${apt.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                {apt.paymentStatus}
                                            </p>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${getStatusBadge(apt.status)}`}>
                                            {apt.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {showEditModal && patient && (
                <PatientEditModal
                    patient={patient}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={() => {
                        setShowEditModal(false);
                        fetchData();
                    }}
                />
            )}

            {/* Booking Modal */}
            {showBookingModal && patient && (
                <div
                    className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={(e) => { if (e.target === e.currentTarget) setShowBookingModal(false); }}
                >
                    <div className="w-full max-w-lg animate-in zoom-in-95 duration-300">
                        <AppointmentBookingModal
                            patient={patient}
                            onCancel={() => setShowBookingModal(false)}
                            onSuccess={() => {
                                setShowBookingModal(false);
                                fetchData();
                                toast.success('Appointment booked!');
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
