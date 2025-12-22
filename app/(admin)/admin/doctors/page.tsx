'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminService, Doctor } from '@/lib/services/adminService';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Mail,
    Phone
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DoctorsList() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>(''); // 'active' | 'inactive' | ''

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

    // Simple function to format date
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Doctors Management</h1>
                    <p className="text-sm text-slate-500">Manage {doctors.length} registered doctors.</p>
                </div>
                <Link
                    href="/admin/doctors/create"
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Register New Doctor
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email or phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-10 w-full rounded-md border border-slate-200 bg-transparent pl-9 pr-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 border-b">
                            <tr>
                                <th className="px-6 py-4 font-medium">Doctor Profile</th>
                                <th className="px-6 py-4 font-medium">Contact Details</th>
                                <th className="px-6 py-4 font-medium">Specialty</th>
                                <th className="px-6 py-4 font-medium">Subscription</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-10 text-gray-400">Loading doctors...</td></tr>
                            ) : doctors.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-10 text-gray-400">No doctors found matching filters.</td></tr>
                            ) : (
                                doctors.map((doctor) => (
                                    <tr key={doctor._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-slate-900">{doctor.name}</div>
                                            <div className="text-xs text-slate-500 capitalize">{doctor.doctorInfo?.qualification || 'No Degree Listed'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-slate-600 mb-1">
                                                <Mail className="mr-2 h-3 w-3" /> {doctor.email}
                                            </div>
                                            <div className="flex items-center text-slate-600">
                                                <Phone className="mr-2 h-3 w-3" /> {doctor.phone || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                                                {doctor.doctorInfo?.specialization || 'General'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-700 font-medium capitalize">{doctor.subscription?.plan || 'Free'} Plan</div>
                                            <div className={`text-xs ${doctor.subscription?.isActive ? 'text-green-600' : 'text-red-500'}`}>
                                                Exp: {formatDate(doctor.subscription?.endDate)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${doctor.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                                }`}>
                                                <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${doctor.isActive ? 'bg-green-600' : 'bg-red-600'}`} />
                                                {doctor.isActive ? 'Active' : 'Banned'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-blue-600 p-2 rounded-full hover:bg-slate-100">
                                                <MoreVertical className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
