'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { appointmentService, Appointment } from '@/lib/services/appointmentService';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import {
    Calendar,
    Users,
    Banknote,
    XCircle,
    CheckCircle2,
    Clock,
    Loader2,
    Printer,
    BarChart3,
    TrendingUp,
    CreditCard,
    Smartphone,
    UserX,
    CalendarDays,
    ArrowLeft,
    ArrowRight
} from 'lucide-react';

export default function ReportsPage() {
    const { user } = useAuthStore();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const doctorId = user?.role === 'doctor' ? (user.id || user._id) : user?.doctorId;

    const fetchReport = async () => {
        if (!doctorId) return;
        try {
            setLoading(true);
            const res = await appointmentService.getAppointments({
                doctorId,
                dateFrom: selectedDate,
                dateTo: selectedDate,
                limit: 200,
                sort: 'serialNumber',
            } as Record<string, string | number>);
            setAppointments(res.data || []);
        } catch {
            toast.error('Failed to load report data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [doctorId, selectedDate]);

    const navigateDate = (direction: number) => {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() + direction);
        setSelectedDate(date.toISOString().split('T')[0]);
    };

    // Computed report data
    const report = useMemo(() => {
        const total = appointments.length;
        const completed = appointments.filter(a => a.status === 'completed').length;
        const cancelled = appointments.filter(a => a.status === 'cancelled').length;
        const noShow = appointments.filter(a => a.status === 'no_show').length;
        const waiting = appointments.filter(a => a.status === 'waiting' || a.status === 'booked').length;
        const inProgress = appointments.filter(a => a.status === 'in_progress').length;

        const paid = appointments.filter(a => a.paymentStatus === 'paid');
        const pending = appointments.filter(a => a.paymentStatus === 'pending');
        const totalRevenue = paid.reduce((sum, a) => sum + (a.feeAmount || 0), 0);
        const pendingRevenue = pending.reduce((sum, a) => sum + (a.feeAmount || 0), 0);

        const newPatients = appointments.filter(a => a.feeType === 'new_patient').length;
        const oldPatients = appointments.filter(a => a.feeType === 'old_patient').length;

        const walkIn = appointments.filter(a => a.bookingType === 'walk-in').length;
        const phoneBooking = appointments.filter(a => a.bookingType === 'phone').length;

        return {
            total, completed, cancelled, noShow, waiting, inProgress,
            totalRevenue, pendingRevenue, paidCount: paid.length, pendingCount: pending.length,
            newPatients, oldPatients, walkIn, phoneBooking,
        };
    }, [appointments]);

    const printReport = () => {
        const doc = new jsPDF();
        const dateStr = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        let y = 20;

        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('MediCore - Daily Report', 105, y, { align: 'center' });
        y += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(dateStr, 105, y, { align: 'center' });
        y += 12;

        doc.setDrawColor(200);
        doc.line(20, y, 190, y);
        y += 10;

        const addSection = (title: string) => {
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(title, 20, y);
            y += 8;
        };

        const addRow = (label: string, value: string | number) => {
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(label, 25, y);
            doc.setFont('helvetica', 'bold');
            doc.text(String(value), 120, y);
            y += 6;
        };

        addSection('Patient Summary');
        addRow('Total Appointments', report.total);
        addRow('Completed', report.completed);
        addRow('Cancelled', report.cancelled);
        addRow('No Show', report.noShow);
        addRow('Waiting/Booked', report.waiting);
        addRow('New Patients', report.newPatients);
        addRow('Returning Patients', report.oldPatients);
        y += 5;

        addSection('Revenue Summary');
        addRow('Total Collected', `Tk ${report.totalRevenue}`);
        addRow('Pending Collection', `Tk ${report.pendingRevenue}`);
        addRow('Paid Appointments', report.paidCount);
        addRow('Unpaid Appointments', report.pendingCount);
        y += 5;

        addSection('Booking Breakdown');
        addRow('Walk-in', report.walkIn);
        addRow('Phone Booking', report.phoneBooking);
        y += 10;

        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.text(`Generated on ${new Date().toLocaleString()}`, 105, y, { align: 'center' });

        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');
    };

    const isToday = selectedDate === new Date().toISOString().split('T')[0];

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Daily Report</h1>
                    <p className="text-slate-500 font-medium text-sm mt-1">Revenue tracking and appointment summary</p>
                </div>
                <button
                    onClick={printReport}
                    disabled={loading || appointments.length === 0}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50"
                >
                    <Printer className="h-4 w-4" />
                    Print Report
                </button>
            </div>

            {/* Date Selector */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={() => navigateDate(-1)}
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 transition-all"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="flex items-center gap-3">
                        <CalendarDays className="h-5 w-5 text-blue-500" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="text-lg font-black text-slate-800 bg-transparent outline-none border-none"
                        />
                        {isToday && (
                            <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider rounded-lg">Today</span>
                        )}
                    </div>
                    <button
                        onClick={() => navigateDate(1)}
                        disabled={isToday}
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 transition-all disabled:opacity-30"
                    >
                        <ArrowRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'Total Patients', value: report.total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                            { label: 'Completed', value: report.completed, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                            { label: 'Cancelled', value: report.cancelled, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
                            { label: 'No Show', value: report.noShow, icon: UserX, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                                <div className={`p-3 ${stat.bg} ${stat.color} rounded-2xl w-fit border ${stat.border} mb-3`}>
                                    <stat.icon className="h-5 w-5" />
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                <h4 className="text-3xl font-black text-slate-900 mt-1">{stat.value}</h4>
                            </div>
                        ))}
                    </div>

                    {/* Revenue & Breakdown */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Revenue */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-100 bg-emerald-50/30 flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 rounded-xl">
                                    <Banknote className="h-5 w-5 text-emerald-600" />
                                </div>
                                <h3 className="text-lg font-black text-slate-800">Revenue Summary</h3>
                            </div>
                            <div className="p-8 space-y-5">
                                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl">
                                    <div>
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Collected</p>
                                        <p className="text-2xl font-black text-emerald-700 mt-1">৳{report.totalRevenue.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-emerald-600">{report.paidCount} paid</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl">
                                    <div>
                                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Pending</p>
                                        <p className="text-2xl font-black text-amber-700 mt-1">৳{report.pendingRevenue.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-amber-600">{report.pendingCount} unpaid</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl">
                                    <div>
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Total Expected</p>
                                        <p className="text-2xl font-black text-blue-700 mt-1">৳{(report.totalRevenue + report.pendingRevenue).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Breakdown */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-xl">
                                    <BarChart3 className="h-5 w-5 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-black text-slate-800">Breakdown</h3>
                            </div>
                            <div className="p-8 space-y-5">
                                {/* Patient Type */}
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Patient Type</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-4 bg-indigo-50 rounded-2xl text-center">
                                            <p className="text-2xl font-black text-indigo-700">{report.newPatients}</p>
                                            <p className="text-[10px] font-bold text-indigo-500 uppercase mt-1">New Patients</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-2xl text-center">
                                            <p className="text-2xl font-black text-slate-700">{report.oldPatients}</p>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Returning</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Booking Type */}
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Booking Source</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-4 bg-blue-50 rounded-2xl text-center">
                                            <p className="text-2xl font-black text-blue-700">{report.walkIn}</p>
                                            <p className="text-[10px] font-bold text-blue-500 uppercase mt-1">Walk-in</p>
                                        </div>
                                        <div className="p-4 bg-purple-50 rounded-2xl text-center">
                                            <p className="text-2xl font-black text-purple-700">{report.phoneBooking}</p>
                                            <p className="text-[10px] font-bold text-purple-500 uppercase mt-1">Phone</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Summary */}
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Status Distribution</p>
                                    {report.total > 0 && (
                                        <div className="flex rounded-full overflow-hidden h-3 bg-slate-100">
                                            {report.completed > 0 && (
                                                <div
                                                    className="bg-emerald-500 transition-all"
                                                    style={{ width: `${(report.completed / report.total) * 100}%` }}
                                                    title={`Completed: ${report.completed}`}
                                                />
                                            )}
                                            {report.waiting > 0 && (
                                                <div
                                                    className="bg-amber-400 transition-all"
                                                    style={{ width: `${(report.waiting / report.total) * 100}%` }}
                                                    title={`Waiting: ${report.waiting}`}
                                                />
                                            )}
                                            {report.cancelled > 0 && (
                                                <div
                                                    className="bg-rose-400 transition-all"
                                                    style={{ width: `${(report.cancelled / report.total) * 100}%` }}
                                                    title={`Cancelled: ${report.cancelled}`}
                                                />
                                            )}
                                            {report.noShow > 0 && (
                                                <div
                                                    className="bg-orange-400 transition-all"
                                                    style={{ width: `${(report.noShow / report.total) * 100}%` }}
                                                    title={`No Show: ${report.noShow}`}
                                                />
                                            )}
                                        </div>
                                    )}
                                    <div className="flex flex-wrap gap-3 mt-3">
                                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                                            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Completed
                                        </span>
                                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                                            <span className="h-2 w-2 rounded-full bg-amber-400" /> Waiting
                                        </span>
                                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                                            <span className="h-2 w-2 rounded-full bg-rose-400" /> Cancelled
                                        </span>
                                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                                            <span className="h-2 w-2 rounded-full bg-orange-400" /> No Show
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Appointment Details Table */}
                    {appointments.length > 0 && (
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="text-lg font-black text-slate-800">Detailed Log</h3>
                                <p className="text-xs text-slate-400 font-bold mt-0.5">{appointments.length} appointments</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            <th className="text-left px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">#</th>
                                            <th className="text-left px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</th>
                                            <th className="text-left px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                            <th className="text-left px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fee</th>
                                            <th className="text-left px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment</th>
                                            <th className="text-left px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {appointments.map((apt) => {
                                            const patient = typeof apt.patientId === 'string' ? { name: 'Unknown', phone: '-' } : apt.patientId;
                                            const statusColors: Record<string, string> = {
                                                completed: 'bg-emerald-100 text-emerald-700',
                                                cancelled: 'bg-rose-100 text-rose-600',
                                                no_show: 'bg-orange-100 text-orange-600',
                                                booked: 'bg-amber-100 text-amber-700',
                                                waiting: 'bg-emerald-100 text-emerald-700',
                                                in_progress: 'bg-blue-100 text-blue-700',
                                            };
                                            return (
                                                <tr key={apt._id} className="hover:bg-slate-50/50">
                                                    <td className="px-6 py-3 text-sm font-black text-slate-800">#{apt.serialNumber}</td>
                                                    <td className="px-6 py-3">
                                                        <p className="text-sm font-bold text-slate-700">{patient.name}</p>
                                                        <p className="text-[10px] text-slate-400">{patient.phone}</p>
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${statusColors[apt.status] || 'bg-slate-100 text-slate-600'}`}>
                                                            {apt.status.replace('_', ' ')}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-3 text-sm font-bold text-slate-700">৳{apt.feeAmount}</td>
                                                    <td className="px-6 py-3">
                                                        <span className={`text-[10px] font-black uppercase ${apt.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                            {apt.paymentStatus}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-3 text-xs font-bold text-slate-500 capitalize">{apt.bookingType?.replace('-', ' ')}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
