'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Users,
    Clock,
    CheckCircle,
    Play,
    Activity,
    Loader2,
    CalendarDays,
    User,
    FileText,
    ArrowRight,
    Stethoscope,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/store/authStore';
import { appointmentService } from '@/lib/services/appointmentService';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { QueueItem } from '@/lib/types';

export default function DoctorDashboard() {
    const { user } = useAuthStore();
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [loading, setLoading] = useState(true);

    const doctorId = user?.role === 'doctor' ? (user.id || user._id) : user?.doctorId;

    const fetchQueue = async () => {
        if (!doctorId) return;
        try {
            const res = await appointmentService.getTodayQueue(doctorId);
            setQueue(res.data);
        } catch (error) {
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

    const waiting = queue.filter(q => q.status === 'waiting' || q.status === 'booked');
    const inProgress = queue.filter(q => q.status === 'in_progress');
    const completed = queue.filter(q => q.status === 'completed');

    const stats = [
        {
            title: 'Waiting',
            value: waiting.length,
            icon: Clock,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            border: 'border-amber-100',
        },
        {
            title: 'In Progress',
            value: inProgress.length,
            icon: Play,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-100',
        },
        {
            title: 'Completed',
            value: completed.length,
            icon: CheckCircle,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            border: 'border-emerald-100',
        },
        {
            title: 'Total Today',
            value: queue.length,
            icon: Activity,
            color: 'text-violet-600',
            bg: 'bg-violet-50',
            border: 'border-violet-100',
        },
    ];

    const currentPatient = queue.find(q => q.status === 'in_progress');
    const upNext = queue.filter(q => q.status === 'waiting' || q.status === 'booked').slice(0, 5);

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-16">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Welcome, Dr. {user?.name?.split(' ')[0]}
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/doctor/queue"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <CalendarDays className="h-4 w-4" />
                        Live Queue
                    </Link>
                    <Link
                        href="/doctor/queue"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <Play className="h-4 w-4 fill-white" />
                        Start Consultation
                    </Link>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((item) => (
                    <div
                        key={item.title}
                        className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className={cn('p-2.5 rounded-lg', item.bg, item.border, 'border')}>
                                <item.icon className={cn('h-5 w-5', item.color)} />
                            </div>
                            <span className="text-sm font-medium text-slate-500">{item.title}</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900">{item.value}</p>
                    </div>
                ))}
            </div>

            {/* Two-Column Layout */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Current Patient */}
                <div className="lg:col-span-2 space-y-3">
                    <div className="flex items-center gap-2 px-1">
                        <Stethoscope className="h-4 w-4 text-slate-400" />
                        <h2 className="text-sm font-semibold text-slate-700">Current Patient</h2>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        {currentPatient ? (
                            <div className="p-6">
                                <div className="flex flex-col sm:flex-row gap-6 items-start">
                                    <div className="h-16 w-16 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                                        <User className="h-7 w-7 text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900">
                                                    {currentPatient.patientId?.name}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                                    <span className="inline-flex items-center px-2.5 py-1 bg-slate-50 text-slate-600 text-sm font-medium rounded-lg border border-slate-100">
                                                        {currentPatient.patientId?.age} yrs, {currentPatient.patientId?.gender}
                                                    </span>
                                                    <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-100">
                                                        Serial #{currentPatient.serialNumber}
                                                    </span>
                                                    <span className="inline-flex items-center px-2.5 py-1 bg-slate-50 text-slate-500 text-sm font-medium rounded-lg border border-slate-100">
                                                        ID: {currentPatient.patientId?.patientId}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-100 flex-shrink-0">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                In Progress
                                            </span>
                                        </div>

                                        <div className="pt-4 border-t border-slate-100">
                                            <Link
                                                href="/doctor/prescriptions/create"
                                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
                                            >
                                                <FileText className="h-4 w-4" />
                                                Write Prescription
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-12 flex flex-col items-center justify-center text-center">
                                <div className="h-14 w-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                                    <User className="h-6 w-6 text-slate-300" />
                                </div>
                                <h3 className="text-base font-semibold text-slate-900">No active patient</h3>
                                <p className="text-sm text-slate-500 mt-1 max-w-sm">
                                    No consultation in progress. Go to the queue to call the next patient.
                                </p>
                                <Link
                                    href="/doctor/queue"
                                    className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
                                >
                                    <Play className="h-4 w-4 fill-white" />
                                    Go to Queue
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Waiting List */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-slate-400" />
                            <h2 className="text-sm font-semibold text-slate-700">Waiting List</h2>
                        </div>
                        <Link
                            href="/doctor/queue"
                            className="text-sm font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                        >
                            View all
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
                        {upNext.length > 0 ? (
                            upNext.map((patient) => (
                                <div
                                    key={patient._id}
                                    className="px-4 py-3.5 flex items-center gap-3 hover:bg-slate-50 transition-colors"
                                >
                                    <div className="h-9 w-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center font-semibold text-slate-700 text-sm flex-shrink-0">
                                        {patient.serialNumber}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-slate-900 truncate">
                                            {patient.patientId?.name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {patient.patientId?.age} yrs, {patient.patientId?.gender}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center">
                                <p className="text-sm text-slate-400">No patients waiting</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
