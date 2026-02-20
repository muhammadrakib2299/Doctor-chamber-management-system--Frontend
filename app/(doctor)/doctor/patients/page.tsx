'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Search,
    Filter,
    MoreVertical,
    Phone,
    UserCircle,
    Loader2,
    ChevronLeft,
    ChevronRight,
    Calendar
} from 'lucide-react';
import { patientService } from '@/lib/services/patientService';
import toast from 'react-hot-toast';
import { TableSkeleton } from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import { format } from 'date-fns';

interface PatientItem {
    _id: string;
    patientId: string;
    name: string;
    phone: string;
    age: number;
    gender: string;
    patientType: string;
    lastVisitDate: string | null;
    totalVisits: number;
    chronicConditions: string[];
    createdAt: string;
}

export default function DoctorPatientsPage() {
    const [patients, setPatients] = useState<PatientItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, pages: 0, page: 1, limit: 10 });

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchPatients = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const params: Record<string, string | number> = { page, limit: 10 };
            if (debouncedSearch) params.search = debouncedSearch;
            params.sort = '-createdAt';

            const res = await patientService.getPatients(params);
            setPatients(res.data);
            setPagination(res.pagination || { total: res.count, pages: 1, page: 1, limit: 10 });
        } catch (err) {
            setError('Failed to load patients');
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch]);

    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '-';
        try {
            return format(new Date(dateStr), 'dd MMM, yyyy');
        } catch {
            return '-';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Patients</h1>
                    <p className="text-sm text-slate-500">Access patient records and history.</p>
                </div>
                {!loading && (
                    <p className="text-sm text-slate-400">{pagination.total} patient{pagination.total !== 1 ? 's' : ''} total</p>
                )}
            </div>

            {/* Search */}
            <div className="flex items-center gap-4 rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name, phone, patient ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            aria-label="Search patients"
                            className="h-9 w-full rounded-md border border-slate-200 bg-transparent pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <TableSkeleton rows={6} columns={5} />
            ) : error ? (
                <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
                    <p className="text-red-500 font-medium mb-4">{error}</p>
                    <button
                        onClick={fetchPatients}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            ) : patients.length === 0 ? (
                <div className="rounded-lg border bg-white shadow-sm">
                    <EmptyState
                        title="No patients found"
                        description={debouncedSearch ? 'Try a different search term.' : 'Patient records will appear here once registered.'}
                    />
                </div>
            ) : (
                <>
                    <div className="rounded-lg border bg-white shadow-sm overflow-x-auto">
                        <table className="w-full text-left text-sm min-w-[640px]">
                            <thead className="bg-slate-50 text-slate-500">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Patient Details</th>
                                    <th className="px-6 py-3 font-medium">Contact</th>
                                    <th className="px-6 py-3 font-medium">Last Visit</th>
                                    <th className="px-6 py-3 font-medium">Visits</th>
                                    <th className="px-6 py-3 font-medium">Type</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {patients.map((patient) => (
                                    <tr key={patient._id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                    <UserCircle className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900">{patient.name}</div>
                                                    <div className="text-xs text-slate-500">{patient.age} yrs, {patient.gender} - {patient.patientId}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            <div className="flex items-center gap-1.5">
                                                <Phone className="h-3.5 w-3.5" />
                                                {patient.phone}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {formatDate(patient.lastVisitDate)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {patient.totalVisits}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                patient.patientType === 'new'
                                                    ? 'bg-blue-50 text-blue-700'
                                                    : 'bg-slate-100 text-slate-600'
                                            }`}>
                                                {patient.patientType}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="flex items-center justify-between border-t bg-white px-4 py-3 rounded-lg">
                            <p className="text-sm text-slate-500">
                                Page {pagination.page} of {pagination.pages} ({pagination.total} total)
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page <= 1}
                                    className="inline-flex items-center px-3 py-1.5 border rounded-md text-sm disabled:opacity-50 hover:bg-slate-50"
                                    aria-label="Previous page"
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                                    disabled={page >= pagination.pages}
                                    className="inline-flex items-center px-3 py-1.5 border rounded-md text-sm disabled:opacity-50 hover:bg-slate-50"
                                    aria-label="Next page"
                                >
                                    Next <ChevronRight className="h-4 w-4 ml-1" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
