'use client';

import { useState, useEffect } from 'react';
import { patientService } from '@/lib/services/patientService';
import { useAuthStore } from '@/lib/store/authStore';
import toast from 'react-hot-toast';
import {
    Search,
    User,
    Phone,
    Fingerprint,
    Edit2,
    Trash2,
    Loader2,
    MoreVertical,
    Calendar,
    MapPin,
    Filter,
    ArrowLeft,
    ArrowRight,
    TicketPlus,
    Plus
} from 'lucide-react';
import PatientEditModal from './PatientEditModal';
import AppointmentBookingModal from './AppointmentBookingModal';
import Swal from 'sweetalert2';
import Link from 'next/link';

interface PatientListProps {
    refreshTrigger?: number;
}

export default function PatientList({ refreshTrigger = 0 }: PatientListProps) {
    const { user } = useAuthStore();
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [bookingPatient, setBookingPatient] = useState<any>(null);
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const doctorId = user?.role === 'doctor' ? (user.id || user._id) : user?.doctorId;

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1); // Reset to page 1 on search
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchPatients = async () => {
        if (!doctorId) return;

        try {
            setLoading(true);
            const params: any = {
                page,
                limit: 10,
                doctorId,
                sort: '-createdAt'
            };

            if (debouncedSearch) {
                params.search = debouncedSearch;
            }

            const res = await patientService.getPatients(params);
            setPatients(res.data);
            if (res.pagination) {
                const count = res.count || 0;
                setTotalPages(Math.ceil(count / 10));
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch patients");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, [doctorId, page, debouncedSearch, refreshTrigger]);

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await patientService.deletePatient(id);
                toast.success('Patient deleted successfully');
                fetchPatients();
            } catch (error) {
                console.error(error);
                toast.error('Failed to delete patient');
            }
        }
    };

    const handleEdit = (patient: any) => {
        setSelectedPatient(patient);
        setShowEditModal(true);
    };

    const handleTakeSerial = (patient: any) => {
        setBookingPatient(patient);
    };

    return (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Left: Search */}
                <div className="relative w-full sm:w-80 group/search">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within/search:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, phone or ID..."
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all font-bold text-sm text-slate-700 placeholder:text-slate-400 outline-none"
                    />
                </div>

                {/* Right: New Registration */}
                <Link
                    href="/assistant/dashboard"
                    className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                    <Plus className="h-4 w-4" />
                    <span>New Registration</span>
                </Link>
            </div>

            <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                {loading && patients.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                        <Loader2 className="h-8 w-8 animate-spin mb-2" />
                        <p className="text-xs font-bold uppercase tracking-widest">Loading Registry...</p>
                    </div>
                ) : patients.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                        <User className="h-10 w-10 mb-3 opacity-20" />
                        <p className="text-sm font-bold">No patients found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {patients.map((patient) => (
                            <div
                                key={patient._id}
                                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300"
                            >
                                <div className="flex items-center gap-4 w-full sm:w-auto flex-1">
                                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-slate-400 group-hover:from-blue-500 group-hover:to-blue-600 group-hover:text-white transition-all shadow-inner shrink-0">
                                        <span className="text-lg font-black">{patient.name.charAt(0)}</span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-black text-slate-800 text-sm group-hover:text-blue-700 transition-colors truncate">{patient.name}</h4>
                                            <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-500 uppercase">{patient.patientId}</span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                                            <span className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                <Phone className="h-3 w-3 mr-1" /> {patient.phone}
                                            </span>
                                            {patient.address && (
                                                <span className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate max-w-[200px]" title={patient.address}>
                                                    <MapPin className="h-3 w-3 mr-1" /> {patient.address}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-4 sm:mt-0 w-full sm:w-auto justify-end border-t sm:border-t-0 border-slate-50 pt-3 sm:pt-0">
                                    <button
                                        onClick={() => handleTakeSerial(patient)}
                                        className="flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl transition-all text-xs font-black uppercase tracking-wide mr-2"
                                        title="Take Serial"
                                    >
                                        <TicketPlus className="h-4 w-4" />
                                        <span className="hidden sm:inline">Take Serial</span>
                                    </button>
                                    <button
                                        onClick={() => handleEdit(patient)}
                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                        title="Edit Patient"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(patient._id)}
                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                        title="Delete Patient"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

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
                    Page {page} of {totalPages || 1}
                </div>
                <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 disabled:opacity-50 hover:bg-slate-50 transition-all font-bold text-xs flex items-center gap-1"
                >
                    Next <ArrowRight className="h-3 w-3" />
                </button>
            </div>

            {showEditModal && selectedPatient && (
                <PatientEditModal
                    patient={selectedPatient}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedPatient(null);
                    }}
                    onSuccess={() => {
                        fetchPatients();
                        setShowEditModal(false);
                        setSelectedPatient(null);
                    }}
                />
            )}

            {bookingPatient && (
                <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-lg animate-in zoom-in-95 duration-300">
                        <AppointmentBookingModal
                            patient={bookingPatient}
                            onCancel={() => setBookingPatient(null)}
                            onSuccess={() => {
                                setBookingPatient(null);
                                // Optional: trigger a refresh or toast
                                toast.success("Appointment booked successfully!");
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
