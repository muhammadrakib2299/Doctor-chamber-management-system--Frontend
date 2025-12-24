'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminService, Doctor } from '@/lib/services/adminService';
import {
    Plus,
    Search,
    Filter,
    Edit,
    Mail,
    Phone,
    Trash2,
    Loader2,
    X,
    User,
    Stethoscope,
    Award,
    ShieldCheck,
    AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DoctorsList() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('');

    // Modal states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);
    const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Form state for edit
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        specialization: '',
        qualification: '',
        isActive: true
    });

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const params: any = {};
            if (search) params.search = search;
            if (filterStatus) params.status = filterStatus;

            const res = await adminService.getDoctors(params);
            setDoctors(res.data);
        } catch (error) {
            toast.error("Failed to fetch doctors");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const bounce = setTimeout(() => {
            fetchDoctors();
        }, 500);
        return () => clearTimeout(bounce);
    }, [search, filterStatus]);

    const handleEdit = (doctor: Doctor) => {
        setEditingDoctor(doctor);
        setFormData({
            name: doctor.name,
            email: doctor.email,
            phone: doctor.phone || '',
            specialization: doctor.doctorInfo?.specialization || '',
            qualification: doctor.doctorInfo?.qualification || '',
            isActive: doctor.isActive
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingDoctor) return;
        setSubmitting(true);
        try {
            await adminService.updateDoctor(editingDoctor._id, formData);
            toast.success('Doctor updated successfully');
            setIsEditModalOpen(false);
            fetchDoctors();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update doctor');
        } finally {
            setSubmitting(false);
        }
    };

    const confirmDelete = async () => {
        if (!doctorToDelete) return;
        setSubmitting(true);
        try {
            await adminService.deleteDoctor(doctorToDelete._id);
            toast.success('Doctor and linked data deleted');
            setDoctorToDelete(null);
            fetchDoctors();
        } catch (error) {
            toast.error('Failed to delete doctor');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString();
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Doctors Directory</h1>
                    <p className="text-slate-500 mt-1">Manage all registered medical professionals and their licenses.</p>
                </div>
                <Link
                    href="/admin/doctors/create"
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-100 hover:bg-blue-700 hover:shadow-blue-200 transition-all active:scale-95"
                >
                    <Plus className="mr-2 h-5 w-5" />
                    Register Doctor
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name, specialist or license..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="">All Account Status</option>
                        <option value="active">Active Only</option>
                        <option value="inactive">Inactive / Banned</option>
                    </select>
                    <button className="h-12 inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-bold hover:bg-slate-50 transition-colors">
                        <Filter className="mr-2 h-4 w-4 text-slate-500" />
                        Advanced
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50/80 backdrop-blur-sm border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-5 font-bold text-slate-700">DOCTOR PROFILE</th>
                                <th className="px-6 py-5 font-bold text-slate-700">EXPERTISE</th>
                                <th className="px-6 py-5 font-bold text-slate-700">LICENSING</th>
                                <th className="px-6 py-5 font-bold text-slate-700">SUBSCRIPTION</th>
                                <th className="px-6 py-5 font-bold text-slate-700 text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-8 py-10">
                                            <div className="h-4 bg-slate-100 rounded w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : doctors.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-24">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center">
                                                <User className="h-8 w-8 text-slate-300" />
                                            </div>
                                            <p className="text-slate-500 font-medium">No results found for your search criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                doctors.map((doctor) => (
                                    <tr key={doctor._id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-100">
                                                    {doctor.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{doctor.name}</div>
                                                    <div className="flex flex-col text-[10px] space-y-0.5 mt-0.5">
                                                        <span className="text-slate-400 font-medium flex items-center">
                                                            <Mail className="h-3 w-3 mr-1" /> {doctor.email}
                                                        </span>
                                                        <span className="text-slate-400 font-medium flex items-center">
                                                            <Phone className="h-3 w-3 mr-1" /> {doctor.phone || 'No phone'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 font-medium">
                                            <div className="inline-flex items-center rounded-lg bg-blue-50/50 px-3 py-1.5 text-xs font-bold text-blue-700 border border-blue-100">
                                                <Stethoscope className="mr-1.5 h-3.5 w-3.5" />
                                                {doctor.doctorInfo?.specialization || 'General Practitioner'}
                                            </div>
                                            <div className="text-[10px] text-slate-400 mt-1.5 ml-1">
                                                {doctor.doctorInfo?.qualification}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold ${doctor.isActive
                                                ? 'bg-green-100 text-green-700 ring-1 ring-inset ring-green-600/20'
                                                : 'bg-red-100 text-red-700 ring-1 ring-inset ring-red-600/20'
                                                }`}>
                                                <ShieldCheck className={`mr-1.5 h-3.5 w-3.5 ${doctor.isActive ? 'text-green-600' : 'text-red-600'}`} />
                                                {doctor.isActive ? 'Licensed' : 'Restricted'}
                                            </span>
                                            <div className="text-[10px] text-slate-400 mt-1.5 ml-1 font-medium">ID: #{doctor._id.slice(-6).toUpperCase()}</div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="space-y-1.5">
                                                <div className="text-slate-900 font-bold capitalize text-xs tracking-tight">{doctor.subscription?.plan} Plan</div>
                                                <div className={`text-[10px] font-bold ${doctor.subscription?.isActive ? 'text-emerald-600' : 'text-rose-500'}`}>
                                                    Until {formatDate(doctor.subscription?.endDate)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 text-right">
                                                <button
                                                    onClick={() => setDoctorToDelete(doctor)}
                                                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                    title="Delete Doctor"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(doctor)}
                                                    className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                    title="Edit Doctor"
                                                >
                                                    <Edit className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Doctor Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300"
                        onClick={() => setIsEditModalOpen(false)}
                    />
                    <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                                    <Edit className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Update Doctor</h3>
                                    <p className="text-blue-100 text-xs">Modify account details and professional status</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleUpdate} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Doctor Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Email address</label>
                                        <input
                                            required
                                            type="email"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Contact Phone</label>
                                        <input
                                            type="tel"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Expertise</label>
                                        <select
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none bg-white font-medium"
                                            value={formData.specialization}
                                            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                        >
                                            <option value="General Physician">General Physician</option>
                                            <option value="Cardiologist">Cardiologist</option>
                                            <option value="Dentist">Dentist</option>
                                            <option value="Neurologist">Neurologist</option>
                                            <option value="Medicine">Medicine</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Academic Info</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                            value={formData.qualification}
                                            placeholder="MBBS, FCPS"
                                            onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                                    <input
                                        type="checkbox"
                                        id="isActiveDoctor"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="h-5 w-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                                    />
                                    <div className="ml-1">
                                        <label htmlFor="isActiveDoctor" className="text-sm font-bold text-slate-700 block cursor-pointer">Active Doctor Account</label>
                                        <p className="text-[10px] text-slate-400 font-medium">Enables access to prescriptions and queue management</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-50">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={submitting}
                                    type="submit"
                                    className="px-8 py-2.5 rounded-xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                                    Apply Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {doctorToDelete && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300"
                        onClick={() => setDoctorToDelete(null)}
                    />
                    <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 text-center">
                            <div className="mx-auto w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                <AlertTriangle className="h-8 w-8 text-red-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Remove Doctor?</h3>
                            <p className="text-slate-500 mb-8 leading-relaxed">
                                You are about to permanentely delete <span className="font-bold text-slate-900">Dr. {doctorToDelete.name}</span>.
                                <br /><span className="text-xs text-red-500 font-bold mt-2 inline-block">Warning: This will also delete all their linked assistants.</span>
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    disabled={submitting}
                                    onClick={confirmDelete}
                                    className="w-full py-3.5 rounded-2xl bg-red-600 text-white font-bold shadow-lg shadow-red-100 hover:bg-red-700 hover:shadow-red-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                                    Confirm Permanent Deletion
                                </button>
                                <button
                                    onClick={() => setDoctorToDelete(null)}
                                    className="w-full py-3.5 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all active:scale-[0.98]"
                                >
                                    Keep Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Loader2({ className }: { className?: string }) {
    return (
        <svg
            className={`animate-spin ${className}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
        </svg>
    );
}
