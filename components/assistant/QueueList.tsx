'use client';

import { useState, useMemo } from 'react';
import { appointmentService } from '@/lib/services/appointmentService';
import toast from 'react-hot-toast';
import {
    Clock,
    CheckCircle2,
    XCircle,
    User,
    Phone,
    MoreVertical,
    Activity,
    Loader2,
    Ticket,
    Fingerprint,
    Timer,
    Ban,
    UserX
} from 'lucide-react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { QueueItem } from '@/lib/types';
import PreAssessmentModal from './PreAssessmentModal';

interface QueueListProps {
    queue: QueueItem[];
    setQueue: React.Dispatch<React.SetStateAction<QueueItem[]>>;
}

type StatusFilter = 'all' | 'booked' | 'waiting' | 'in_progress' | 'completed' | 'cancelled';

const STATUS_TABS: { key: StatusFilter; label: string; color: string }[] = [
    { key: 'all', label: 'All', color: 'text-slate-600 bg-slate-100' },
    { key: 'booked', label: 'Booked', color: 'text-amber-600 bg-amber-50' },
    { key: 'waiting', label: 'Waiting', color: 'text-emerald-600 bg-emerald-50' },
    { key: 'in_progress', label: 'In Progress', color: 'text-blue-600 bg-blue-50' },
    { key: 'completed', label: 'Completed', color: 'text-slate-500 bg-slate-50' },
];

const AVG_CONSULTATION_MINUTES = 10;

export default function QueueList({ queue, setQueue }: QueueListProps) {
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [preAssessmentItem, setPreAssessmentItem] = useState<QueueItem | null>(null);
    const [confirmAction, setConfirmAction] = useState<{
        open: boolean;
        id: string;
        status: string;
        label: string;
        message: string;
    }>({ open: false, id: '', status: '', label: '', message: '' });

    const filteredQueue = useMemo(() => {
        if (statusFilter === 'all') return queue;
        return queue.filter(q => q.status === statusFilter);
    }, [queue, statusFilter]);

    // Calculate estimated wait time for a patient
    const getEstimatedWait = (item: QueueItem): string => {
        if (item.status === 'completed' || item.status === 'cancelled') return '-';
        if (item.status === 'in_progress') return 'Now';

        const waitingAhead = queue.filter(q =>
            (q.status === 'waiting' || q.status === 'in_progress') &&
            q.serialNumber < item.serialNumber
        ).length;

        if (item.status === 'booked') {
            const allAhead = queue.filter(q =>
                (q.status === 'waiting' || q.status === 'in_progress' || q.status === 'booked') &&
                q.serialNumber < item.serialNumber
            ).length;
            const mins = allAhead * AVG_CONSULTATION_MINUTES;
            return mins > 0 ? `~${mins} min` : 'Next';
        }

        const mins = waitingAhead * AVG_CONSULTATION_MINUTES;
        return mins > 0 ? `~${mins} min` : 'Next';
    };

    const handleConfirmArrival = async (id: string) => {
        try {
            setProcessingId(id);
            await appointmentService.confirmArrival(id);
            toast.success("Patient check-in confirmed!");
            setQueue(prev => prev.map(q => q._id === id ? { ...q, status: 'waiting' } : q));
        } catch {
            toast.error("Failed to confirm arrival");
        } finally {
            setProcessingId(null);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            setProcessingId(id);
            await appointmentService.updateAppointment(id, { status: newStatus });
            toast.success(`Patient marked as ${newStatus.replace('_', ' ')}`);
            setQueue(prev => prev.map(q => q._id === id ? { ...q, status: newStatus } : q));
        } catch {
            toast.error("Status update failed");
        } finally {
            setProcessingId(null);
            setConfirmAction({ open: false, id: '', status: '', label: '', message: '' });
            setOpenMenuId(null);
        }
    };

    const requestCancel = (id: string) => {
        setOpenMenuId(null);
        setConfirmAction({
            open: true,
            id,
            status: 'cancelled',
            label: 'Cancel Appointment',
            message: 'Are you sure you want to cancel this appointment? This action cannot be undone.',
        });
    };

    const requestNoShow = (id: string) => {
        setOpenMenuId(null);
        setConfirmAction({
            open: true,
            id,
            status: 'no_show',
            label: 'Mark as No Show',
            message: 'Mark this patient as a no-show? They did not arrive for their appointment.',
        });
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'booked':
                return 'bg-amber-100 text-amber-700 ring-amber-600/20';
            case 'waiting':
                return 'bg-emerald-100 text-emerald-700 ring-emerald-600/20';
            case 'in_progress':
                return 'bg-blue-100 text-blue-700 ring-blue-600/20 animate-pulse';
            case 'completed':
                return 'bg-slate-100 text-slate-600 ring-slate-600/10';
            case 'cancelled':
                return 'bg-rose-100 text-rose-600 ring-rose-600/10';
            case 'no_show':
                return 'bg-orange-100 text-orange-600 ring-orange-600/10';
            default:
                return 'bg-slate-100 text-slate-600';
        }
    };

    const statusCounts = useMemo(() => {
        const counts: Record<string, number> = { all: queue.length };
        queue.forEach(q => {
            counts[q.status] = (counts[q.status] || 0) + 1;
        });
        return counts;
    }, [queue]);

    return (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-100">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                            <Activity className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">Today&apos;s Active Queue</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5" aria-live="polite">
                                {queue.length} Total &middot; {queue.filter(q => q.status === 'waiting').length} Waiting
                            </p>
                        </div>
                    </div>
                </div>

                {/* Status Filter Tabs */}
                <div className="flex flex-wrap gap-2">
                    {STATUS_TABS.map((tab) => {
                        const count = statusCounts[tab.key] || 0;
                        const isActive = statusFilter === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setStatusFilter(tab.key)}
                                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${isActive
                                    ? `${tab.color} ring-2 ring-offset-1 ring-current shadow-sm`
                                    : 'text-slate-400 bg-white border border-slate-100 hover:bg-slate-50'
                                    }`}
                            >
                                {tab.label}
                                {count > 0 && <span className="ml-1.5 opacity-70">({count})</span>}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="divide-y divide-slate-50">
                {filteredQueue.length === 0 ? (
                    <div className="py-28 text-center bg-slate-50/30">
                        <div className="inline-flex items-center justify-center p-6 bg-white rounded-3xl shadow-sm border border-slate-100 mb-4">
                            <Ticket className="h-10 w-10 text-slate-200" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-400">
                            {statusFilter === 'all' ? 'Queue is currently empty' : `No ${statusFilter.replace('_', ' ')} appointments`}
                        </h4>
                        <p className="text-sm text-slate-300 mt-1">
                            {statusFilter === 'all' ? 'New registrations will appear here in real-time' : 'Try selecting a different filter'}
                        </p>
                    </div>
                ) : (
                    filteredQueue.map((item, idx) => (
                        <div key={item._id} className={`group p-6 hover:bg-blue-50/40 transition-all ${item.status === 'cancelled' || item.status === 'no_show' ? 'opacity-60' : ''}`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                <div className="flex items-start gap-5">
                                    <div className="relative">
                                        <div className="h-16 w-16 bg-white border border-slate-100 rounded-[1.25rem] shadow-sm flex flex-col items-center justify-center group-hover:border-blue-200 transition-colors">
                                            <span className="text-[10px] uppercase font-black text-slate-400 leading-none">Serial</span>
                                            <span className="text-2xl font-black text-slate-900 mt-1">#{item.serialNumber}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 pt-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">
                                                {item.patientId?.name}
                                            </h4>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ring-1 ${getStatusStyles(item.status)}`}>
                                                {item.status.replace('_', ' ')}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                            <div className="flex items-center text-xs font-bold text-slate-400">
                                                <Fingerprint className="h-3.5 w-3.5 mr-1.5" /> ID: {item.patientId?.patientId}
                                            </div>
                                            <div className="flex items-center text-xs font-bold text-slate-400">
                                                <Phone className="h-3.5 w-3.5 mr-1.5" /> {item.patientId?.phone}
                                            </div>
                                            <div className="flex items-center text-xs font-bold text-slate-400">
                                                <User className="h-3.5 w-3.5 mr-1.5" /> {item.patientId?.age}Y, {item.patientId?.gender}
                                            </div>
                                            {/* Estimated wait */}
                                            {item.status !== 'completed' && item.status !== 'cancelled' && item.status !== 'no_show' && (
                                                <div className="flex items-center text-xs font-bold text-blue-500">
                                                    <Timer className="h-3.5 w-3.5 mr-1.5" /> {getEstimatedWait(item)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* Action Buttons Based on Status */}
                                    {item.status === 'booked' && (
                                        <button
                                            onClick={() => handleConfirmArrival(item._id)}
                                            disabled={processingId === item._id}
                                            className="px-5 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-700 hover:shadow-emerald-200 transition-all flex items-center gap-2"
                                            aria-label={`Confirm arrival for ${item.patientId?.name}`}
                                        >
                                            {processingId === item._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                            Confirm Arrival
                                        </button>
                                    )}

                                    {item.status === 'waiting' && (
                                        <button
                                            onClick={() => setPreAssessmentItem(item)}
                                            className="text-xs font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-4 py-3 rounded-2xl border border-emerald-100 flex items-center gap-2 hover:bg-emerald-100 transition-colors cursor-pointer"
                                        >
                                            <CheckCircle2 className="h-4 w-4" />
                                            Vitals / Ready
                                        </button>
                                    )}

                                    {item.status === 'in_progress' && (
                                        <span className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-3 rounded-2xl border border-blue-100 flex items-center gap-2">
                                            <Activity className="h-4 w-4 animate-pulse" />
                                            Inside Cabin
                                        </span>
                                    )}

                                    {/* Context menu */}
                                    {item.status !== 'completed' && item.status !== 'cancelled' && item.status !== 'no_show' && (
                                        <div className="relative">
                                            <button
                                                onClick={() => setOpenMenuId(openMenuId === item._id ? null : item._id)}
                                                className="p-3 text-slate-300 hover:text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-2xl transition-all"
                                                aria-label={`More actions for ${item.patientId?.name}`}
                                                aria-expanded={openMenuId === item._id}
                                            >
                                                <MoreVertical className="h-5 w-5" />
                                            </button>
                                            {openMenuId === item._id && (
                                                <>
                                                    <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                                                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 z-20 overflow-hidden">
                                                        {item.status === 'booked' && (
                                                            <button
                                                                onClick={() => requestNoShow(item._id)}
                                                                className="w-full px-5 py-3.5 text-left text-xs font-bold text-orange-600 hover:bg-orange-50 flex items-center gap-3 transition-colors"
                                                            >
                                                                <UserX className="h-4 w-4" /> Mark as No Show
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => requestCancel(item._id)}
                                                            className="w-full px-5 py-3.5 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-3 transition-colors"
                                                        >
                                                            <XCircle className="h-4 w-4" /> Cancel Appointment
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    <div className="hidden sm:flex flex-col items-end pl-4 pb-1">
                                        <span className="text-[10px] font-black text-slate-300 uppercase leading-none">Registered</span>
                                        <span className="text-xs font-bold text-slate-500 mt-1">{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="p-6 bg-slate-50/50 flex items-center justify-between">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {filteredQueue.length} of {queue.length} shown
                </p>
                <div className="flex gap-2">
                    <div className="h-2 w-2 rounded-full bg-amber-400" title="Booked"></div>
                    <div className="h-2 w-2 rounded-full bg-emerald-400" title="Waiting"></div>
                    <div className="h-2 w-2 rounded-full bg-blue-400" title="In Progress"></div>
                </div>
            </div>

            {/* Cancel / No-Show Confirmation */}
            <ConfirmDialog
                open={confirmAction.open}
                title={confirmAction.label}
                message={confirmAction.message}
                confirmLabel={confirmAction.label}
                variant="danger"
                onConfirm={() => handleStatusUpdate(confirmAction.id, confirmAction.status)}
                onCancel={() => setConfirmAction({ open: false, id: '', status: '', label: '', message: '' })}
            />

            {/* Pre-Assessment Modal */}
            {preAssessmentItem && (
                <PreAssessmentModal
                    item={preAssessmentItem}
                    onClose={() => setPreAssessmentItem(null)}
                    onSuccess={(updatedItem) => {
                        setQueue(prev => prev.map(q => q._id === updatedItem._id ? { ...q, ...updatedItem } : q));
                        setPreAssessmentItem(null);
                    }}
                />
            )}
        </div>
    );
}
