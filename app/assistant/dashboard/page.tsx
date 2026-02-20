'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { appointmentService } from '@/lib/services/appointmentService';
import PatientRegistrationForm from '@/components/assistant/PatientRegistrationForm';
import SearchPatient from '@/components/assistant/SearchPatient';
import QueueList from '@/components/assistant/QueueList';
import AppointmentBookingModal from '@/components/assistant/AppointmentBookingModal';
import PatientList from '@/components/assistant/PatientList';
import toast from 'react-hot-toast';
import {
    LayoutDashboard,
    Users,
    Search,
    UserPlus,
    Clock,
    RefreshCw,
    CalendarCheck,
    Stethoscope,
    CalendarClock,
    AlertCircle
} from 'lucide-react';
import { QueueItem, Patient } from '@/lib/types';

export default function AssistantDashboard() {
    const { user } = useAuthStore();
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [viewMode, setViewMode] = useState<'queue' | 'registry'>('queue');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const doctorId = user?.role === 'doctor' ? (user.id || user._id) : user?.doctorId;

    const fetchQueue = async () => {
        if (!doctorId) return;
        try {
            setIsRefreshing(true);
            const res = await appointmentService.getTodayQueue(doctorId);
            setQueue(res.data);
            setLastUpdated(new Date());
        } catch {
            toast.error("Could not load today's queue");
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchQueue();
    }, [doctorId, refreshTrigger]);

    // Listen for socket-driven refresh from layout
    useEffect(() => {
        const interval = setInterval(() => {
            fetchQueue();
        }, 30000); // Auto-refresh every 30 seconds
        return () => clearInterval(interval);
    }, [doctorId]);

    const handlePatientSelect = (patient: Patient) => {
        setSelectedPatient(patient);
        setShowBookingModal(true);
    };

    const handleRegistrationSuccess = (patient: Patient) => {
        handlePatientSelect(patient);
    };

    const handleBookingSuccess = () => {
        setShowBookingModal(false);
        setSelectedPatient(null);
        setRefreshTrigger(prev => prev + 1);
    };

    // Escape key to close modal
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && showBookingModal) {
                setShowBookingModal(false);
                setSelectedPatient(null);
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [showBookingModal]);

    // Computed stats
    const waitingCount = queue.filter(q => q.status === 'waiting').length;
    const bookedCount = queue.filter(q => q.status === 'booked').length;
    const completedCount = queue.filter(q => q.status === 'completed').length;
    const inProgressCount = queue.filter(q => q.status === 'in_progress').length;
    const cancelledCount = queue.filter(q => q.status === 'cancelled').length;

    // Revenue calculation
    const totalRevenue = queue
        .filter(q => q.paymentStatus === 'paid')
        .reduce((sum, q) => sum + (q.feeAmount || 0), 0);

    const stats = [
        {
            label: 'Today Total',
            value: queue.length,
            icon: CalendarCheck,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-100',
            sub: cancelledCount > 0 ? `${cancelledCount} cancelled` : 'All active',
        },
        {
            label: 'Currently Waiting',
            value: waitingCount,
            icon: Clock,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            border: 'border-amber-100',
            sub: bookedCount > 0 ? `${bookedCount} not arrived` : 'None pending',
        },
        {
            label: 'In Consultation',
            value: inProgressCount,
            icon: Stethoscope,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            border: 'border-indigo-100',
            sub: waitingCount > 0 ? `${waitingCount} in line` : 'Queue clear',
        },
        {
            label: 'Consulted',
            value: completedCount,
            icon: LayoutDashboard,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            border: 'border-emerald-100',
            sub: totalRevenue > 0 ? `৳${totalRevenue} collected` : 'No payments',
        },
    ];

    return (
        <div className="space-y-10 pb-20">
            {/* Header Row */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <span className="h-5 w-1 bg-blue-600 rounded-full"></span>
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Queue Intelligence</h3>
                </div>
                <div className="flex items-center gap-4">
                    {lastUpdated && (
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider hidden sm:block">
                            Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    )}
                    <button
                        onClick={() => setRefreshTrigger(p => p + 1)}
                        disabled={isRefreshing}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-500 font-bold text-xs hover:bg-slate-50 transition-all ${isRefreshing ? 'opacity-50' : ''}`}
                    >
                        <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm group hover:scale-[1.02] transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3.5 ${stat.bg} ${stat.color} rounded-2xl shadow-sm border ${stat.border}`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">{stat.label}</p>
                        <h4 className="text-4xl font-black text-slate-900 mt-1">{stat.value}</h4>
                        <p className="text-[10px] font-bold text-slate-400 mt-2 ml-1">{stat.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Left Panel: Registration & Search */}
                <div className="lg:col-span-4 space-y-10">
                    <section>
                        <div className="flex items-center gap-3 mb-5 ml-1">
                            <div className="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center">
                                <Search className="h-4 w-4 text-blue-600" />
                            </div>
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Database Lookup</h3>
                        </div>
                        <SearchPatient onSelect={handlePatientSelect} />
                    </section>

                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-[#f8fafc] px-6 text-[10px] font-black text-slate-300 tracking-[0.25em] uppercase">Registration Pipeline</span>
                        </div>
                    </div>

                    <section>
                        <div className="flex items-center gap-3 mb-5 ml-1">
                            <div className="h-8 w-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                                <UserPlus className="h-4 w-4 text-indigo-600" />
                            </div>
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">New Admission</h3>
                        </div>
                        <PatientRegistrationForm onSuccess={handleRegistrationSuccess} />
                    </section>
                </div>

                {/* Right Panel: Active Queue & Registry */}
                <div className="lg:col-span-8 space-y-6">
                    {/* View Switcher */}
                    <div className="flex items-center justify-between">
                        <div className="flex p-1 bg-slate-100/50 rounded-2xl w-fit">
                            <button
                                onClick={() => setViewMode('queue')}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${viewMode === 'queue'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                Active Queue
                                {waitingCount > 0 && (
                                    <span className="ml-2 px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-md text-[9px]">{waitingCount}</span>
                                )}
                            </button>
                            <button
                                onClick={() => setViewMode('registry')}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${viewMode === 'registry'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                Patient Registry
                            </button>
                        </div>
                    </div>

                    <section>
                        {viewMode === 'queue' ? (
                            <QueueList queue={queue} setQueue={setQueue} />
                        ) : (
                            <PatientList refreshTrigger={refreshTrigger} />
                        )}
                    </section>
                </div>
            </div>

            {/* Booking Modal */}
            {showBookingModal && selectedPatient && (
                <div
                    className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowBookingModal(false);
                            setSelectedPatient(null);
                        }
                    }}
                >
                    <div className="w-full max-w-lg animate-in zoom-in-95 duration-300">
                        <AppointmentBookingModal
                            patient={selectedPatient}
                            onCancel={() => {
                                setShowBookingModal(false);
                                setSelectedPatient(null);
                            }}
                            onSuccess={handleBookingSuccess}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
