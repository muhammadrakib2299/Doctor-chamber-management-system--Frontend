'use client';

import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    Edit,
    Mail,
    Phone,
    UserCircle,
    Trash2,
    Loader2,
    X,
    UserPlus,
    ShieldCheck,
    AlertTriangle
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

interface Assistant {
    _id: string;
    name: string;
    email: string;
    phone: string;
    doctorId: {
        _id: string;
        name: string;
    } | null;
    isActive: boolean;
    createdAt: string;
}

interface Doctor {
    _id: string;
    name: string;
}

export default function AssistantsList() {
    const [assistants, setAssistants] = useState<Assistant[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [assistantToDelete, setAssistantToDelete] = useState<Assistant | null>(null);
    const [editingAssistant, setEditingAssistant] = useState<Assistant | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        doctorId: '',
        isActive: true
    });

    const fetchAssistants = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/admin/assistants?search=${search}`);
            setAssistants(res.data.data);
        } catch (error) {
            toast.error('Failed to load assistants');
        } finally {
            setLoading(false);
        }
    };

    const fetchDoctors = async () => {
        try {
            const res = await api.get('/admin/doctors');
            setDoctors(res.data.data);
        } catch (error) {
            console.error('Failed to load doctors');
        }
    };

    useEffect(() => {
        fetchAssistants();
    }, [search]);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const confirmDelete = async () => {
        if (!assistantToDelete) return;
        setSubmitting(true);
        try {
            await api.delete(`/admin/assistants/${assistantToDelete._id}`);
            toast.success('Assistant deleted successfully');
            setAssistantToDelete(null);
            fetchAssistants();
        } catch (error) {
            toast.error('Failed to delete assistant');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (assistant: Assistant) => {
        setEditingAssistant(assistant);
        setFormData({
            name: assistant.name,
            email: assistant.email,
            password: '',
            phone: assistant.phone || '',
            doctorId: assistant.doctorId?._id || '',
            isActive: assistant.isActive
        });
        setIsModalOpen(true);
    };

    const handleOpenCreateModal = () => {
        setEditingAssistant(null);
        setFormData({ name: '', email: '', password: '', phone: '', doctorId: '', isActive: true });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingAssistant) {
                const payload = { ...formData };
                if (!payload.password) delete (payload as any).password;

                await api.put(`/admin/assistants/${editingAssistant._id}`, payload);
                toast.success('Assistant updated successfully');
            } else {
                await api.post('/admin/assistants', formData);
                toast.success('Assistant created successfully');
            }
            setIsModalOpen(false);
            fetchAssistants();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Assistants Management</h1>
                    <p className="text-slate-500 mt-1">Efficiently manage doctor assistants and their credentials.</p>
                </div>
                <button
                    onClick={handleOpenCreateModal}
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all active:scale-95"
                >
                    <Plus className="mr-2 h-5 w-5" />
                    Add New Assistant
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex-1 w-full">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search assistants by name, email or phone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-12 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                        />
                    </div>
                </div>
                <button className="h-12 inline-flex items-center justify-center rounded-xl border border-slate-200 px-6 py-2 text-sm font-medium hover:bg-slate-50 transition-colors">
                    <Filter className="mr-2 h-4 w-4 text-slate-500" />
                    Advanced Filters
                </button>
            </div>

            {/* List and Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50/80 backdrop-blur-sm border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-5 font-semibold text-slate-700">ASSISTANT</th>
                                <th className="px-6 py-5 font-semibold text-slate-700">CONTACT INFO</th>
                                <th className="px-6 py-5 font-semibold text-slate-700">ASSIGNED DOCTOR</th>
                                <th className="px-6 py-5 font-semibold text-slate-700">ACCOUNT STATUS</th>
                                <th className="px-6 py-5 font-semibold text-slate-700 text-right">ACTIONS</th>
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
                            ) : assistants.length > 0 ? (
                                assistants.map((assistant) => (
                                    <tr key={assistant._id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-100">
                                                    {assistant.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{assistant.name}</div>
                                                    <div className="text-xs font-medium text-slate-400 mt-0.5">Joined {new Date(assistant.createdAt).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center text-slate-600 hover:text-blue-600 transition-colors">
                                                    <Mail className="mr-2.5 h-4 w-4 text-slate-400" />
                                                    {assistant.email}
                                                </div>
                                                <div className="flex items-center text-slate-600">
                                                    <Phone className="mr-2.5 h-4 w-4 text-slate-400" />
                                                    {assistant.phone || 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            {assistant.doctorId ? (
                                                <div className="flex items-center bg-blue-50/50 w-fit px-3 py-1.5 rounded-full border border-blue-100 text-blue-700 font-medium">
                                                    <UserCircle className="mr-2 h-4 w-4" />
                                                    {assistant.doctorId.name}
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 text-xs italic">Not Assigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${assistant.isActive
                                                ? 'bg-green-100 text-green-700 ring-1 ring-inset ring-green-600/20'
                                                : 'bg-slate-100 text-slate-700'
                                                }`}>
                                                <ShieldCheck className={`mr-1.5 h-3.5 w-3.5 ${assistant.isActive ? 'text-green-600' : 'text-slate-600'}`} />
                                                {assistant.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 text-right">
                                                <button
                                                    onClick={() => setAssistantToDelete(assistant)}
                                                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                    title="Delete Assistant"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(assistant)}
                                                    className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                    title="Edit Assistant"
                                                >
                                                    <Edit className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center">
                                                <Search className="h-8 w-8 text-slate-300" />
                                            </div>
                                            <p className="text-slate-500 font-medium">No assistants found matching your criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Assistant Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300"
                        onClick={() => setIsModalOpen(false)}
                    />
                    <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                                    <UserPlus className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{editingAssistant ? 'Update Assistant' : 'New Assistant'}</h3>
                                    <p className="text-blue-100 text-xs">{editingAssistant ? 'Update assistant credentials and details' : 'Fill in the details to create a new portal'}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Enter assistant full name"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                        <input
                                            required
                                            type="email"
                                            placeholder="assistant@example.com"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            placeholder="+880..."
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        {editingAssistant ? 'Portal Password (Leave blank to keep current)' : 'Portal Password'}
                                    </label>
                                    <input
                                        required={!editingAssistant}
                                        type="password"
                                        placeholder={editingAssistant ? "Leave blank to keep current" : "Minimum 6 characters"}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Assign to Doctor</label>
                                    <select
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none bg-white font-medium text-slate-700"
                                        value={formData.doctorId}
                                        onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                                    >
                                        <option value="">Select a Doctor</option>
                                        {doctors.map(doctor => (
                                            <option key={doctor._id} value={doctor._id}>{doctor.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {editingAssistant && (
                                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <input
                                            type="checkbox"
                                            id="isActive"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                            className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="isActive" className="text-sm font-bold text-slate-700">Account is Active</label>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-50">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={submitting}
                                    type="submit"
                                    className="px-8 py-2.5 rounded-xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                                >
                                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : editingAssistant ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                    {editingAssistant ? 'Update Assistant' : 'Create Assistant'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Custom Delete Confirmation Modal */}
            {assistantToDelete && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300"
                        onClick={() => setAssistantToDelete(null)}
                    />
                    <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 text-center">
                            <div className="mx-auto w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                <AlertTriangle className="h-8 w-8 text-red-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Delete Account?</h3>
                            <p className="text-slate-500 mb-8 leading-relaxed">
                                You are about to delete <span className="font-bold text-slate-900">"{assistantToDelete.name}"</span>.
                                This action will permanently remove their access to the portal.
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    disabled={submitting}
                                    onClick={confirmDelete}
                                    className="w-full py-3.5 rounded-2xl bg-red-600 text-white font-bold shadow-lg shadow-red-100 hover:bg-red-700 hover:shadow-red-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                                    Yes, Delete Permanent
                                </button>
                                <button
                                    onClick={() => setAssistantToDelete(null)}
                                    className="w-full py-3.5 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all active:scale-[0.98]"
                                >
                                    Cancel & Stay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
