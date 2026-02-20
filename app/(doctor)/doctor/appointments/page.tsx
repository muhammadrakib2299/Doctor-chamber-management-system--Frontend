'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Calendar,
    Clock,
    Search,
    Filter,
    User,
    CheckCircle2,
    XCircle,
    MoreVertical,
    Loader2,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { appointmentService } from '@/lib/services/appointmentService';
import toast from 'react-hot-toast';
import { AppointmentCardSkeleton } from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { format } from 'date-fns';

interface PatientInfo {
    _id: string;
    name: string;
    phone: string;
    patientId: string;
    age: number;
    gender: string;
}

interface AppointmentItem {
    _id: string;
    patientId: PatientInfo;
    appointmentDate: string;
    serialNumber: number;
    status: string;
    feeAmount: number;
    feeType: string;
    paymentStatus: string;
    bookingType: string;
    createdAt: string;
}

export default function DoctorAppointmentsPage() {
    const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, pages: 0, page: 1, limit: 10 });

    // Confirm dialog state
    const [confirmAction, setConfirmAction] = useState<{
        open: boolean;
        id: string;
        status: string;
        label: string;
    }>({ open: false, id: '', status: '', label: '' });

    const fetchAppointments = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const params: Record<string, string | number> = { page, limit: 10 };
            if (statusFilter) params.status = statusFilter;
            if (dateFilter) {
                params.dateFrom = dateFilter;
                params.dateTo = dateFilter + 'T23:59:59.999Z';
            }
            params.sort = '-appointmentDate';

            const res = await appointmentService.getAppointments(params);
            setAppointments(res.data);
            setPagination(res.pagination);
        } catch (err) {
            setError('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    }, [page, statusFilter, dateFilter]);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    // Debounced search — filter locally since we already have page data
    const filteredAppointments = appointments.filter((apt) => {
        if (!search) return true;
        const q = search.toLowerCase();
        const patient = apt.patientId;
        if (!patient || typeof patient === 'string') return true;
        return (
            patient.name?.toLowerCase().includes(q) ||
            patient.phone?.includes(q) ||
            patient.patientId?.toLowerCase().includes(q)
        );
    });

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await appointmentService.updateAppointment(id, { status });
            toast.success(`Status updated to ${status}`);
            fetchAppointments();
        } catch {
            toast.error('Failed to update status');
        }
        setConfirmAction({ open: false, id: '', status: '', label: '' });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'booked': return 'bg-blue-50 text-blue-700';
            case 'waiting': return 'bg-amber-50 text-amber-700';
            case 'in_progress': return 'bg-yellow-50 text-yellow-700';
            case 'completed': return 'bg-green-50 text-green-700';
            case 'cancelled': return 'bg-red-50 text-red-700';
            case 'no_show': return 'bg-slate-100 text-slate-600';
            default: return 'bg-slate-50 text-slate-700';
        }
    };

    const formatDate = (dateStr: string) => {
        try {
            return format(new Date(dateStr), 'dd MMM, yyyy');
        } catch {
            return dateStr;
        }
    };

    const formatTime = (dateStr: string) => {
        try {
            return format(new Date(dateStr), 'hh:mm a');
        } catch {
            return '';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Appointments</h1>
                    <p className="text-sm text-slate-500">Manage your schedule and patient visits.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex-1 w-full sm:w-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search patient name, phone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            aria-label="Search appointments"
                            className="h-9 w-full rounded-md border border-slate-200 bg-transparent pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                        aria-label="Filter by status"
                        className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="">All Status</option>
                        <option value="booked">Booked</option>
                        <option value="waiting">Waiting</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => { setDateFilter(e.target.value); setPage(1); }}
                        aria-label="Filter by date"
                        className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="grid gap-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <AppointmentCardSkeleton key={i} />
                    ))}
                </div>
            ) : error ? (
                <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
                    <p className="text-red-500 font-medium mb-4">{error}</p>
                    <button
                        onClick={fetchAppointments}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            ) : filteredAppointments.length === 0 ? (
                <div className="rounded-lg border bg-white shadow-sm">
                    <EmptyState
                        title="No appointments found"
                        description={search || statusFilter || dateFilter ? 'Try adjusting your filters.' : 'Appointments will appear here once created.'}
                    />
                </div>
            ) : (
                <>
                    {/* Appointments List */}
                    <div className="grid gap-4">
                        {filteredAppointments.map((apt) => {
                            const patient = typeof apt.patientId === 'object' ? apt.patientId : null;
                            return (
                                <div key={apt._id} className="group relative flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                                            <User className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900">{patient?.name || 'Unknown'}</h3>
                                            <p className="text-sm text-slate-500">
                                                {patient?.age} yrs - {patient?.gender} - Serial #{apt.serialNumber}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                                        <div className="flex items-center text-sm text-slate-500">
                                            <Calendar className="mr-1.5 h-4 w-4 text-slate-400" />
                                            {formatDate(apt.appointmentDate)}
                                        </div>
                                        <div className="flex items-center text-sm text-slate-500">
                                            <Clock className="mr-1.5 h-4 w-4 text-slate-400" />
                                            {formatTime(apt.createdAt)}
                                        </div>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${apt.paymentStatus === 'paid' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                                            {apt.paymentStatus}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(apt.status)}`}>
                                            {apt.status.replace('_', ' ')}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                                                <button
                                                    onClick={() => setConfirmAction({ open: true, id: apt._id, status: 'completed', label: 'Complete' })}
                                                    className="rounded-lg p-2 text-slate-400 hover:bg-green-50 hover:text-green-600"
                                                    aria-label="Mark as completed"
                                                >
                                                    <CheckCircle2 className="h-4 w-4" />
                                                </button>
                                            )}
                                            {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                                                <button
                                                    onClick={() => setConfirmAction({ open: true, id: apt._id, status: 'cancelled', label: 'Cancel' })}
                                                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                                    aria-label="Cancel appointment"
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="flex items-center justify-between border-t bg-white px-4 py-3 rounded-lg">
                            <p className="text-sm text-slate-500">
                                Page {pagination.page} of {pagination.pages} ({pagination.total} total)
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page <= 1}
                                    className="inline-flex items-center px-3 py-1.5 border rounded-md text-sm disabled:opacity-50 hover:bg-slate-50"
                                    aria-label="Previous page"
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                                    disabled={page >= pagination.pages}
                                    className="inline-flex items-center px-3 py-1.5 border rounded-md text-sm disabled:opacity-50 hover:bg-slate-50"
                                    aria-label="Next page"
                                >
                                    Next <ChevronRight className="h-4 w-4 ml-1" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Confirm Dialog */}
            <ConfirmDialog
                open={confirmAction.open}
                title={`${confirmAction.label} Appointment`}
                message={`Are you sure you want to mark this appointment as ${confirmAction.status}?`}
                confirmLabel={confirmAction.label}
                variant={confirmAction.status === 'cancelled' ? 'danger' : 'default'}
                onConfirm={() => handleStatusUpdate(confirmAction.id, confirmAction.status)}
                onCancel={() => setConfirmAction({ open: false, id: '', status: '', label: '' })}
            />
        </div>
    );
}
