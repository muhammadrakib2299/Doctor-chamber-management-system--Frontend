'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { appointmentService } from '@/lib/services/appointmentService';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import {
    Clock,
    MoreVertical,
    User,
    ArrowRight,
    Pause,
    Play,
    CheckCircle,
    UserMinus,
    Loader2,
    RefreshCw,
    Activity
} from 'lucide-react';
import Link from 'next/link';

export default function DoctorQueuePage() {
    const { user } = useAuthStore();
    const [queue, setQueue] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const doctorId = user?.role === 'doctor' ? (user.id || user._id) : user?.doctorId;

    const fetchQueue = async () => {
        if (!doctorId) return;
        try {
            setRefreshing(true);
            const res = await appointmentService.getTodayQueue(doctorId);
            setQueue(res.data);
        } catch (error) {
            console.error("Failed to fetch queue", error);
            toast.error("Could not load today's queue");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchQueue();
    }, [doctorId]);

    // Socket.IO Integration
    useEffect(() => {
        if (!doctorId) return;

        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
        const socket = io(socketUrl);

        socket.on('connect', () => {
            socket.emit('join-doctor-room', doctorId);
        });

        socket.on('queue-update', () => {
            fetchQueue();
        });

        return () => {
            socket.disconnect();
        };
    }, [doctorId]);

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await appointmentService.updateAppointment(id, { status });
            toast.success(`Patient status updated to ${status}`);
            fetchQueue();
        } catch (error) {
            toast.error("Status update failed");
        }
    };

    const inProgressPatient = queue.find(q => q.status === 'in_progress');
    const waitingQueue = queue.filter(q => q.status === 'waiting' || q.status === 'booked');

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Page Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Clinical Live Queue</h1>
                    <p className="text-slate-500 font-bold mt-1">Real-time patient flow management</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchQueue}
                        className={`flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm ${refreshing ? 'opacity-50' : ''}`}
                    >
                        <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Sync System
                    </button>
                    <div className="px-5 py-3 rounded-2xl bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Live Monitoring
                    </div>
                </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-12 items-start">
                {/* Current Active Patient Case */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center gap-3 ml-2">
                        <Play className="h-5 w-5 text-blue-600 fill-blue-600" />
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Active Consultation</h3>
                    </div>

                    {inProgressPatient ? (
                        <div className="relative group overflow-hidden bg-white rounded-[2.5rem] border border-blue-100 shadow-2xl shadow-blue-500/10">
                            <div className="absolute top-0 right-0 p-8">
                                <span className="px-6 py-2 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-full shadow-lg">
                                    Serial #{inProgressPatient.serialNumber}
                                </span>
                            </div>

                            <div className="p-10">
                                <div className="flex flex-col sm:flex-row gap-10 items-start">
                                    <div className="h-28 w-28 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
                                        <User className="h-12 w-12" />
                                    </div>

                                    <div className="flex-1 space-y-6">
                                        <div>
                                            <h2 className="text-4xl font-black text-slate-900 leading-tight">
                                                {inProgressPatient.patientId?.name}
                                            </h2>
                                            <div className="flex flex-wrap gap-3 mt-3">
                                                <span className="px-4 py-1.5 bg-slate-50 text-slate-600 font-bold text-xs rounded-xl border border-slate-100">
                                                    {inProgressPatient.patientId?.age} Years
                                                </span>
                                                <span className="px-4 py-1.5 bg-slate-50 text-slate-600 font-bold text-xs rounded-xl border border-slate-100 uppercase">
                                                    {inProgressPatient.patientId?.gender}
                                                </span>
                                                <span className="px-4 py-1.5 bg-slate-50 text-slate-600 font-bold text-xs rounded-xl border border-slate-100">
                                                    ID: {inProgressPatient.patientId?.patientId}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Recorded Sensation</h4>
                                            <p className="text-slate-700 font-extrabold text-lg">"{inProgressPatient.patientId?.problem || 'General Check-up'}"</p>
                                        </div>

                                        <div className="flex items-center gap-4 pt-4">
                                            <Link
                                                href="/doctor/prescriptions/create"
                                                className="flex-1 px-8 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                                            >
                                                <CheckCircle className="h-5 w-5" />
                                                Complete & Prescribe
                                            </Link>
                                            <button
                                                onClick={() => handleStatusUpdate(inProgressPatient._id, 'waiting')}
                                                className="p-5 bg-white border-2 border-slate-100 text-slate-400 hover:text-amber-500 hover:border-amber-100 rounded-2xl transition-all active:scale-95"
                                            >
                                                <Pause className="h-6 w-6" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center">
                            <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center text-slate-200 shadow-sm mb-6">
                                <UserMinus className="h-10 w-10" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900">No Patient in Room</h3>
                            <p className="text-slate-400 font-bold mt-2 max-w-xs">Call a patient from the waiting list below to start a consultation.</p>
                        </div>
                    )}
                </div>

                {/* Waiting Flow Panel */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-amber-500" />
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Waiting Pipeline</h3>
                        </div>
                        <span className="px-3 py-1 bg-amber-50 text-amber-600 font-black text-[10px] uppercase rounded-lg border border-amber-100">
                            {waitingQueue.length} Queue
                        </span>
                    </div>

                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden divide-y divide-slate-50">
                        {waitingQueue.length > 0 ? (
                            waitingQueue.map((patient) => (
                                <div key={patient._id} className="p-6 hover:bg-blue-50/50 transition-all group overflow-hidden relative">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 font-black text-sm group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all shadow-sm">
                                                {patient.serialNumber}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-900 text-sm">{patient.patientId?.name}</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    {patient.status === 'booked' ? 'Remote Entry' : 'Checked In'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-1.5 text-slate-400">
                                            <Clock className="h-3 w-3" />
                                            <span className="text-[10px] font-bold uppercase tracking-tighter">Est: 15min</span>
                                        </div>

                                        <button
                                            onClick={() => handleStatusUpdate(patient._id, 'in_progress')}
                                            disabled={!!inProgressPatient}
                                            className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white disabled:opacity-30 disabled:hover:bg-blue-50 disabled:hover:text-blue-600 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] transition-all flex items-center gap-2"
                                        >
                                            Start Lab <ArrowRight className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-10 text-center">
                                <p className="text-sm font-bold text-slate-300">Queue Cleared</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
