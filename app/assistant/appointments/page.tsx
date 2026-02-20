'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { appointmentService, Appointment } from '@/lib/services/appointmentService';
import toast from 'react-hot-toast';
import {
    Calendar,
    Search,
    Filter,
    ArrowLeft,
    ArrowRight,
    Loader2,
    User,
    Phone,
    Clock,
    Fingerprint,
    Banknote,
    CalendarDays,
    FileText
} from 'lucide-react';

type StatusFilter = '' | 'booked' | 'waiting' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export default function AppointmentsPage() {
    const { user } = useAuthStore();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const doctorId = user?.role === 'doctor' ? (user.id || user._id) : user?.doctorId;

    const fetchAppointments = async () => {
        if (!doctorId) return;
        try {
            setLoading(true);
            const params: Record<string, string | number> = {
                page,
                limit: 15,
                sort: '-appointmentDate',
                doctorId,
            };
            if (statusFilter) params.status = statusFilter;
            if (dateFrom) params.dateFrom = dateFrom;
            if (dateTo) params.dateTo = dateTo;

            const res = await appointmentService.getAppointments(params);
            setAppointments(res.data || []);
            const count = res.count || res.total || 0;
            setTotalPages(Math.ceil(count / 15) || 1);
        } catch {
            toast.error('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [doctorId, page, statusFilter, dateFrom, dateTo]);

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

    const getPaymentBadge = (status: string) => {
        if (status === 'paid') return 'bg-emerald-100 text-emerald-700';
        if (status === 'refunded') return 'bg-purple-100 text-purple-700';
        return 'bg-amber-100 text-amber-700';
    };

    const getPatientInfo = (patientId: Appointment['patientId']) => {
        if (typeof patientId === 'string') return { name: 'Unknown', phone: '-', patientId: patientId, age: 0, gender: '-' };
        return patientId;
    };

    return (
        <div className="space-y-6 pb-10">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">Appointment History</h1>
                <p className="text-slate-500 font-medium text-sm mt-1">View and filter all past and upcoming appointments</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                    {/* Status Filter */}
                    <div className="flex-1">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Status</label>
                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => { setStatusFilter(e.target.value as StatusFilter); setPage(1); }}
                                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-sm text-slate-700 appearance-none"
                            >
                                <option value="">All Statuses</option>
                                <option value="booked">Booked</option>
                                <option value="waiting">Waiting</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="no_show">No Show</option>
                            </select>
                        </div>
                    </div>

                    {/* Date From */}
                    <div className="flex-1">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">From Date</label>
                        <div className="relative">
                            <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-sm text-slate-700"
                            />
                        </div>
                    </div>

                    {/* Date To */}
                    <div className="flex-1">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">To Date</label>
                        <div className="relative">
                            <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
                                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-sm text-slate-700"
                            />
                        </div>
                    </div>

                    {/* Clear */}
                    {(statusFilter || dateFrom || dateTo) && (
                        <button
                            onClick={() => { setStatusFilter(''); setDateFrom(''); setDateTo(''); setPage(1); }}
                            className="px-5 py-3 text-xs font-black text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Appointments Table */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                        <Loader2 className="h-8 w-8 animate-spin mb-2" />
                        <p className="text-xs font-bold uppercase tracking-widest">Loading appointments...</p>
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                        <FileText className="h-12 w-12 mb-3 opacity-20" />
                        <h4 className="text-lg font-bold text-slate-400">No appointments found</h4>
                        <p className="text-sm text-slate-300 mt-1">Try adjusting your filters</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Serial</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fee</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {appointments.map((apt) => {
                                    const patient = getPatientInfo(apt.patientId);
                                    return (
                                        <tr key={apt._id} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="text-lg font-black text-slate-900">#{apt.serialNumber}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm">{patient.name}</p>
                                                    <div className="flex items-center gap-3 mt-0.5">
                                                        <span className="flex items-center text-[10px] font-bold text-slate-400">
                                                            <Fingerprint className="h-3 w-3 mr-1" /> {patient.patientId}
                                                        </span>
                                                        <span className="flex items-center text-[10px] font-bold text-slate-400">
                                                            <Phone className="h-3 w-3 mr-1" /> {patient.phone}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-xs font-bold text-slate-600">
                                                    {new Date(apt.appointmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                                <p className="text-[10px] text-slate-400 mt-0.5">
                                                    {new Date(apt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${getStatusBadge(apt.status)}`}>
                                                    {apt.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-bold text-slate-700">৳{apt.feeAmount}</span>
                                                <p className="text-[10px] text-slate-400 capitalize mt-0.5">{apt.feeType?.replace('_', ' ')}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${getPaymentBadge(apt.paymentStatus)}`}>
                                                    {apt.paymentStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold text-slate-500 capitalize">{apt.bookingType?.replace('-', ' ')}</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 disabled:opacity-50 hover:bg-slate-50 transition-all font-bold text-xs flex items-center gap-1"
                    >
                        <ArrowLeft className="h-3 w-3" /> Prev
                    </button>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Page {page} of {totalPages}
                    </div>
                    <button
                        disabled={page >= totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 disabled:opacity-50 hover:bg-slate-50 transition-all font-bold text-xs flex items-center gap-1"
                    >
                        Next <ArrowRight className="h-3 w-3" />
                    </button>
                </div>
            </div>
        </div>
    );
}
