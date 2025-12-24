'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { appointmentService } from '@/lib/services/appointmentService';
import PatientRegistrationForm from '@/components/assistant/PatientRegistrationForm';
import SearchPatient from '@/components/assistant/SearchPatient';
import QueueList from '@/components/assistant/QueueList';
import AppointmentBookingModal from '@/components/assistant/AppointmentBookingModal';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import {
    LayoutDashboard,
    Users,
    Activity,
    CalendarCheck,
    Bell,
    Search,
    UserPlus,
    Clock,
    RefreshCw,
    TrendingUp,
    ShieldCheck
} from 'lucide-react';

export default function AssistantDashboard() {
    const { user } = useAuthStore();
    const [queue, setQueue] = useState<any[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const doctorId = user?.role === 'doctor' ? (user.id || user._id) : user?.doctorId;

    // Initial Queue Load
    const fetchQueue = async () => {
        if (!doctorId) return;

        try {
            setIsRefreshing(true);
            const res = await appointmentService.getTodayQueue(doctorId);
            setQueue(res.data);
        } catch (error) {
            console.error("Failed to fetch queue", error);
            toast.error("Could not load today's queue");
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchQueue();
    }, [doctorId, refreshTrigger]);

    // Socket.IO Integration
    useEffect(() => {
        if (!doctorId) return;

        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
        const socket = io(socketUrl);

        socket.on('connect', () => {
            if (user?.role === 'assistant') {
                socket.emit('join-assistant-room', doctorId);
            } else if (user?.role === 'doctor') {
                socket.emit('join-doctor-room', doctorId);
            }
        });

        socket.on('queue-update', (data) => {
            setRefreshTrigger(prev => prev + 1);
            if (data.type === 'NEW_APPOINTMENT') {
                toast.success(`New booking: Serial #${data.appointment?.serialNumber}`, {
                    icon: '🎫',
                    duration: 4000
                });
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [doctorId]);

    const handlePatientSelect = (patient: any) => {
        setSelectedPatient(patient);
        setShowBookingModal(true);
    };

    const handleRegistrationSuccess = (patient: any) => {
        handlePatientSelect(patient);
    };

    const handleBookingSuccess = () => {
        setShowBookingModal(false);
        setSelectedPatient(null);
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Quick Actions Area */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <span className="h-5 w-1 bg-blue-600 rounded-full"></span>
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Queue Intelligence</h3>
                </div>
                <button
                    onClick={() => setRefreshTrigger(p => p + 1)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-500 font-bold text-xs hover:bg-slate-50 transition-all ${isRefreshing ? 'opacity-50' : ''}`}
                >
                    <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh Stats
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Today Total', value: queue.length, icon: CalendarCheck, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', trend: '+12%' },
                    { label: 'Currently Waiting', value: queue.filter(q => q.status === 'waiting').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', trend: 'High' },
                    { label: 'Booking Only', value: queue.filter(q => q.status === 'booked').length, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', trend: 'Wait' },
                    { label: 'Consulted', value: queue.filter(q => q.status === 'completed').length, icon: LayoutDashboard, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', trend: 'Done' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm group hover:scale-[1.02] transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3.5 ${stat.bg} ${stat.color} rounded-2xl shadow-sm border ${stat.border}`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${stat.bg} ${stat.color} border ${stat.border} uppercase tracking-wider`}>
                                {stat.trend}
                            </span>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">{stat.label}</p>
                        <h4 className="text-4xl font-black text-slate-900 mt-1">{stat.value}</h4>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Left Panel: Registration & Search */}
                <div className="lg:col-span-4 space-y-10">
                    <section className="animate-in slide-in-from-bottom duration-500">
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

                    <section className="animate-in slide-in-from-bottom duration-700">
                        <div className="flex items-center gap-3 mb-5 ml-1">
                            <div className="h-8 w-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                                <UserPlus className="h-4 w-4 text-indigo-600" />
                            </div>
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">New Admission</h3>
                        </div>
                        <PatientRegistrationForm onSuccess={handleRegistrationSuccess} />
                    </section>
                </div>

                {/* Right Panel: Active Queue */}
                <div className="lg:col-span-8">
                    <section className="animate-in slide-in-from-right duration-500">
                        <QueueList queue={queue} setQueue={setQueue} />
                    </section>
                </div>
            </div>

            {/* Modals */}
            {showBookingModal && selectedPatient && (
                <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
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
