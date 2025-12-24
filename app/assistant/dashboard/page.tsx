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
    RefreshCw
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
        <div className="min-h-screen bg-[#f8fafc] pb-20">
            {/* Top Navigation / Dashboard Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
                                <Activity className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Assistant Command Center</h1>
                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Live Queue Systems Active
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setRefreshTrigger(p => p + 1)}
                                className={`p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`}
                            >
                                <RefreshCw className="h-5 w-5" />
                            </button>
                            <div className="h-10 w-px bg-slate-200 mx-2 invisible sm:visible"></div>
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-sm font-bold text-slate-900">{user?.name}</span>
                                <span className="text-[10px] font-bold text-blue-600 uppercase">Primary Assistant</span>
                            </div>
                            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-100 border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-600">
                                {user?.name?.charAt(0)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    {[
                        { label: 'Total SeriesToday', value: queue.length, icon: CalendarCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Patients Waiting', value: queue.filter(q => q.status === 'waiting').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                        { label: 'Already Booked', value: queue.filter(q => q.status === 'booked').length, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'Completed', value: queue.filter(q => q.status === 'completed').length, icon: LayoutDashboard, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
                                <h4 className="text-3xl font-black text-slate-900">{stat.value}</h4>
                            </div>
                            <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl group-hover:scale-110 transition-transform`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Panel: Registration & Search */}
                    <div className="lg:col-span-4 space-y-8">
                        <section className="animate-in slide-in-from-left duration-500">
                            <div className="flex items-center gap-2 mb-4 ml-1">
                                <Search className="h-4 w-4 text-blue-600" />
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Find Existing Patient</h3>
                            </div>
                            <SearchPatient onSelect={handlePatientSelect} />
                        </section>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-[#f8fafc] px-4 text-[10px] font-black text-slate-400 tracking-widest uppercase">Start New Entry</span>
                            </div>
                        </div>

                        <section className="animate-in slide-in-from-left duration-700">
                            <div className="flex items-center gap-2 mb-4 ml-1">
                                <UserPlus className="h-4 w-4 text-indigo-600" />
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Walk-in Admission</h3>
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
            </main>

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
