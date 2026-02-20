'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { appointmentService } from '@/lib/services/appointmentService';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import {
    Clock,
    User,
    ArrowRight,
    Pause,
    Loader2,
    RefreshCw,
    WifiOff,
    FileText,
    UserX,
} from 'lucide-react';
import Link from 'next/link';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { QueueItem } from '@/lib/types';

export default function DoctorQueuePage() {
    const { user } = useAuthStore();
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [socketError, setSocketError] = useState(false);

    // Confirmation dialog state
    const [confirmAction, setConfirmAction] = useState<{
        open: boolean;
        id: string;
        status: string;
        label: string;
    }>({ open: false, id: '', status: '', label: '' });

    const doctorId = user?.role === 'doctor' ? (user.id || user._id) : user?.doctorId;

    const fetchQueue = async () => {
        if (!doctorId) return;
        try {
            setRefreshing(true);
            const res = await appointmentService.getTodayQueue(doctorId);
            setQueue(res.data);
        } catch {
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
        const token = typeof window !== 'undefined'
            ? (localStorage.getItem('token') || sessionStorage.getItem('token'))
            : null;

        const socket = io(socketUrl, {
            auth: { token },
        });

        socket.on('connect', () => {
            setSocketError(false);
            socket.emit('join-doctor-room', doctorId);
        });

        socket.on('connect_error', () => {
            setSocketError(true);
        });

        socket.on('queue-update', () => {
            fetchQueue();
        });

        return () => {
            socket.removeAllListeners();
            socket.disconnect();
        };
    }, [doctorId]);

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await appointmentService.updateAppointment(id, { status });
            toast.success(`Patient status updated to ${status.replace('_', ' ')}`);
            fetchQueue();
        } catch {
            toast.error("Status update failed");
        }
        setConfirmAction({ open: false, id: '', status: '', label: '' });
    };

    const requestStatusChange = (id: string, status: string, label: string) => {
        setConfirmAction({ open: true, id, status, label });
    };

    const inProgressPatient = queue.find(q => q.status === 'in_progress');
    const waitingQueue = queue.filter(q => q.status === 'waiting' || q.status === 'booked');

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="text-center space-y-3">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                    <p className="text-sm text-slate-500">Loading queue...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20">
            {/* Socket connection error banner */}
            {socketError && (
                <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800">
                    <WifiOff className="h-5 w-5 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold">Real-time connection lost</p>
                        <p className="text-xs text-amber-600">Queue updates may be delayed. Data will sync on refresh.</p>
                    </div>
                    <button
                        onClick={fetchQueue}
                        className="px-4 py-2 bg-amber-100 hover:bg-amber-200 rounded-lg text-xs font-semibold transition-colors"
                    >
                        Refresh
                    </button>
                </div>
            )}

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Patient Queue</h1>
                    <p className="text-sm text-slate-500 mt-1">Real-time patient flow</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchQueue}
                        disabled={refreshing}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm ${refreshing ? 'opacity-50' : ''}`}
                        aria-label="Refresh queue"
                    >
                        <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                    <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-sm font-medium text-emerald-700" aria-live="polite">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        Live
                    </div>
                </div>
            </div>

            {/* Two-column layout */}
            <div className="grid gap-6 lg:grid-cols-3 items-start">
                {/* Active Consultation - Left 2/3 */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-sm font-semibold text-slate-700">Active Consultation</h3>

                    {inProgressPatient ? (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                            <div className="flex items-start gap-4">
                                <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
                                    {inProgressPatient.patientId?.name?.charAt(0) || <User className="h-5 w-5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-lg font-bold text-slate-900 truncate">
                                        {inProgressPatient.patientId?.name}
                                    </h2>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                                        <span className="text-sm text-slate-500">
                                            {inProgressPatient.patientId?.age} years
                                        </span>
                                        <span className="text-sm text-slate-500 capitalize">
                                            {inProgressPatient.patientId?.gender}
                                        </span>
                                        <span className="text-sm text-slate-500">
                                            Serial #{inProgressPatient.serialNumber}
                                        </span>
                                        <span className="text-sm text-slate-500">
                                            ID: {inProgressPatient.patientId?.patientId}
                                        </span>
                                    </div>
                                    <div className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        In Progress
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mt-6 pt-5 border-t border-slate-100">
                                <Link
                                    href="/doctor/prescriptions/create"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors"
                                >
                                    <FileText className="h-4 w-4" />
                                    Write Prescription
                                </Link>
                                <button
                                    onClick={() => requestStatusChange(inProgressPatient._id, 'waiting', 'Pause consultation')}
                                    className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-600 hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50 rounded-xl text-sm font-medium transition-colors"
                                    aria-label="Pause consultation"
                                >
                                    <Pause className="h-4 w-4" />
                                    Pause
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 flex flex-col items-center justify-center text-center">
                            <div className="h-14 w-14 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 mb-4">
                                <UserX className="h-7 w-7" />
                            </div>
                            <h3 className="text-base font-semibold text-slate-900">No active patient</h3>
                            <p className="text-sm text-slate-500 mt-1 max-w-sm">
                                Call a patient from the waiting list to begin consultation.
                            </p>
                        </div>
                    )}
                </div>

                {/* Waiting List - Right 1/3 */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-400" />
                            Waiting List
                        </h3>
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg" aria-live="polite">
                            {waitingQueue.length} patient{waitingQueue.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
                        {waitingQueue.length > 0 ? (
                            waitingQueue.map((patient) => (
                                <div key={patient._id} className="p-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-700 flex-shrink-0">
                                            {patient.serialNumber}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-semibold text-slate-900 truncate">
                                                {patient.patientId?.name}
                                            </h4>
                                            <p className="text-xs text-slate-500">
                                                {patient.patientId?.age} yrs, {patient.patientId?.gender}
                                                {patient.status === 'booked' ? ' - Booked' : ' - Checked in'}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => requestStatusChange(patient._id, 'in_progress', 'Start consultation')}
                                            disabled={!!inProgressPatient}
                                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white disabled:opacity-30 disabled:hover:bg-blue-50 disabled:hover:text-blue-600 rounded-lg text-xs font-semibold transition-colors flex-shrink-0"
                                            aria-label={`Call patient ${patient.patientId?.name}`}
                                        >
                                            Call Patient
                                            <ArrowRight className="h-3 w-3" />
                                        </button>
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

            {/* Confirm Dialog */}
            <ConfirmDialog
                open={confirmAction.open}
                title={confirmAction.label}
                message={`Are you sure you want to ${confirmAction.label.toLowerCase()}?`}
                confirmLabel="Yes, proceed"
                variant={confirmAction.status === 'cancelled' ? 'danger' : 'default'}
                onConfirm={() => handleStatusUpdate(confirmAction.id, confirmAction.status)}
                onCancel={() => setConfirmAction({ open: false, id: '', status: '', label: '' })}
            />
        </div>
    );
}
