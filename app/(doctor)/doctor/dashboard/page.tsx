'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Users,
    Clock,
    CheckCircle,
    Play,
    ClipboardList,
    TrendingUp,
    MoreHorizontal,
    Activity,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/store/authStore';
import { appointmentService } from '@/lib/services/appointmentService';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

export default function DoctorDashboard() {
    const { user } = useAuthStore();
    const [queue, setQueue] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const doctorId = user?.role === 'doctor' ? (user.id || user._id) : user?.doctorId;

    const fetchQueue = async () => {
        if (!doctorId) return;
        try {
            const res = await appointmentService.getTodayQueue(doctorId);
            setQueue(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueue();
    }, [doctorId]);

    useEffect(() => {
        if (!doctorId) return;
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
        const socket = io(socketUrl);
        socket.on('connect', () => socket.emit('join-doctor-room', doctorId));
        socket.on('queue-update', fetchQueue);
        return () => { socket.disconnect(); };
    }, [doctorId]);

    const stats = [
        {
            title: 'Waiting',
            value: queue.filter(q => q.status === 'waiting' || q.status === 'booked').length,
            icon: Users,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
        },
        {
            title: 'Active Case',
            value: queue.filter(q => q.status === 'in_progress').length,
            icon: Play,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            title: 'Completed',
            value: queue.filter(q => q.status === 'completed').length,
            icon: CheckCircle,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
        },
        {
            title: 'Patients Today',
            value: queue.length,
            icon: Activity,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
        },
    ];

    const currentPatient = queue.find(q => q.status === 'in_progress');
    const upNext = queue.filter(q => q.status === 'waiting' || q.status === 'booked').slice(0, 5);

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Professional Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                        Hello, Dr. {user?.name?.split(' ')[0]}
                    </h1>
                    <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-[10px]">
                        Medical Command Center • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div className="flex gap-4">
                    <Link
                        href="/doctor/queue"
                        className="px-6 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                    >
                        Live Queue
                    </Link>
                    <Link
                        href="/doctor/queue"
                        className="px-6 py-3.5 rounded-2xl bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2"
                    >
                        <Play className="h-3.5 w-3.5 fill-white" /> Start Board
                    </Link>
                </div>
            </div>

            {/* Dynamic Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((item) => (
                    <div key={item.title} className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:scale-[1.02] transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className={cn("p-4 rounded-2xl shadow-sm", item.bg)}>
                                <item.icon className={cn("h-7 w-7", item.color)} />
                            </div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Real-time</span>
                        </div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{item.title}</h3>
                        <p className="text-4xl font-black text-slate-900">{item.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid gap-10 lg:grid-cols-3">
                {/* Active Consultation Panel */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-3 ml-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Live Consultation</h3>
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden relative">
                        {currentPatient ? (
                            <div className="p-10">
                                <div className="absolute top-8 right-8">
                                    <span className="px-6 py-2 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-full shadow-lg">
                                        Active Case
                                    </span>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-10 items-start">
                                    <div className="h-24 w-24 rounded-[2rem] bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
                                        <Users className="h-10 w-10" />
                                    </div>
                                    <div className="flex-1 space-y-6">
                                        <div>
                                            <h2 className="text-4xl font-black text-slate-900 leading-none mb-4">{currentPatient.patientId?.name}</h2>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-4 py-1.5 bg-slate-50 text-slate-600 font-bold text-[10px] rounded-xl uppercase tracking-wider border border-slate-100">
                                                    {currentPatient.patientId?.age}Y • {currentPatient.patientId?.gender}
                                                </span>
                                                <span className="px-4 py-1.5 bg-blue-50 text-blue-600 font-bold text-[10px] rounded-xl uppercase tracking-wider border border-blue-100">
                                                    Serial #{currentPatient.serialNumber}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100/50">
                                            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1.5 leading-none">Primary Concern</p>
                                            <p className="text-amber-900 font-extrabold text-lg">"{currentPatient.patientId?.problem || 'Clinical Examination'}"</p>
                                        </div>

                                        <div className="flex gap-4 pt-4">
                                            <Link
                                                href="/doctor/prescriptions/create"
                                                className="flex-1 px-8 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3"
                                            >
                                                <ClipboardList className="h-5 w-5" />
                                                Prescribe Meds
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-20 flex flex-col items-center justify-center text-center">
                                <Activity className="h-16 w-16 text-slate-100 mb-6" />
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Consultation Room Empty</h3>
                                <p className="text-slate-400 font-bold mt-2 max-w-xs">No active appointment. Check the queue to call the next patient.</p>
                                <Link href="/doctor/queue" className="mt-8 px-8 py-4 bg-slate-900 text-white flex items-center gap-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-slate-200">
                                    Call Next Patient
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Vertical Up Next Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Waiting List</h3>
                        <Link href="/doctor/queue" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View All</Link>
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden divide-y divide-slate-50">
                        {upNext.length > 0 ? (
                            upNext.map((patient) => (
                                <div key={patient._id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-900 text-xs shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all">
                                            {patient.serialNumber}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-900 leading-none mb-1 group-hover:text-blue-700">{patient.patientId?.name}</p>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Checked in • 15:30</p>
                                        </div>
                                    </div>
                                    <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="p-10 text-center">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Queue Empty</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
