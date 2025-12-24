'use client';

import { useState } from 'react';
import { appointmentService, Appointment } from '@/lib/services/appointmentService';
import toast from 'react-hot-toast';
import {
    Clock,
    CheckCircle2,
    XCircle,
    User,
    Phone,
    MoreVertical,
    Activity,
    MapPin,
    Calendar,
    ChevronRight,
    Loader2,
    Ticket,
    Fingerprint
} from 'lucide-react';

interface QueueListProps {
    queue: any[];
    setQueue: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function QueueList({ queue, setQueue }: QueueListProps) {
    const [processingId, setProcessingId] = useState<string | null>(null);

    const handleConfirmArrival = async (id: string) => {
        try {
            setProcessingId(id);
            await appointmentService.confirmArrival(id);
            toast.success("Patient check-in confirmed!");
            // Queue will be updated via socket, but we can also update locally for snappiness
            setQueue(prev => prev.map(q => q._id === id ? { ...q, status: 'waiting' } : q));
        } catch (error) {
            toast.error("Failed to confirm arrival");
        } finally {
            setProcessingId(null);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            setProcessingId(id);
            await appointmentService.updateAppointment(id, { status: newStatus });
            toast.success(`Patient marked as ${newStatus}`);
            setQueue(prev => prev.map(q => q._id === id ? { ...q, status: newStatus } : q));
        } catch (error) {
            toast.error("Status update failed");
        } finally {
            setProcessingId(null);
        }
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
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                        <Activity className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Todays Active Queue</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">{queue.length} Active Slots</p>
                    </div>
                </div>
            </div>

            <div className="divide-y divide-slate-50">
                {queue.length === 0 ? (
                    <div className="py-28 text-center bg-slate-50/30">
                        <div className="inline-flex items-center justify-center p-6 bg-white rounded-3xl shadow-sm border border-slate-100 mb-4 transform hover:scale-110 transition-transform">
                            <Ticket className="h-10 w-10 text-slate-200" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-400">Queue is currently empty</h4>
                        <p className="text-sm text-slate-300 mt-1">New registrations will appear here in real-time</p>
                    </div>
                ) : (
                    queue.map((item, idx) => (
                        <div key={item._id} className="group p-6 hover:bg-blue-50/40 transition-all">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                <div className="flex items-start gap-5">
                                    <div className="relative">
                                        <div className="h-16 w-16 bg-white border border-slate-100 rounded-[1.25rem] shadow-sm flex flex-col items-center justify-center group-hover:border-blue-200 transition-colors">
                                            <span className="text-[10px] uppercase font-black text-slate-400 leading-none">Serial</span>
                                            <span className="text-2xl font-black text-slate-900 mt-1">#{item.serialNumber}</span>
                                        </div>
                                        <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shadow-md border-2 border-white">
                                            {idx + 1}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 pt-1">
                                        <div className="flex items-center gap-2">
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
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* Action Buttons Based on Status */}
                                    {item.status === 'booked' && (
                                        <button
                                            onClick={() => handleConfirmArrival(item._id)}
                                            disabled={processingId === item._id}
                                            className="px-6 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-700 hover:shadow-emerald-200 transition-all flex items-center gap-2"
                                        >
                                            {processingId === item._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                            Confirm Arrival
                                        </button>
                                    )}

                                    {item.status === 'waiting' && (
                                        <span className="text-xs font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-4 py-3 rounded-2xl border border-emerald-100 flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4" />
                                            Checked In
                                        </span>
                                    )}

                                    {item.status === 'in_progress' && (
                                        <span className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-3 rounded-2xl border border-blue-100 flex items-center gap-2">
                                            <Activity className="h-4 w-4 animate-pulse" />
                                            Inside Cabin
                                        </span>
                                    )}

                                    <div className="relative group/menu">
                                        <button className="p-3 text-slate-300 hover:text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-2xl transition-all">
                                            <MoreVertical className="h-5 w-5" />
                                        </button>
                                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-20 overflow-hidden">
                                            <button
                                                onClick={() => handleStatusUpdate(item._id, 'cancelled')}
                                                className="w-full px-5 py-3.5 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-3 transition-colors"
                                            >
                                                <XCircle className="h-4 w-4" /> Cancel Appointment
                                            </button>
                                        </div>
                                    </div>

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
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">End of Daily Queue</p>
                <div className="flex gap-2">
                    <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                    <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                    <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                </div>
            </div>
        </div>
    );
}
