'use client';

import Link from 'next/link';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Mail,
    Phone
} from 'lucide-react';

export default function DoctorsList() {
    const doctors = [
        {
            id: 1,
            name: 'Dr. Sarah Wilson',
            email: 'sarah.w@example.com',
            phone: '+1 234 567 890',
            specialty: 'Cardiologist',
            status: 'Active',
            patients: 1240,
            subscription: 'Premium',
        },
        {
            id: 2,
            name: 'Dr. Michael Brown',
            email: 'm.brown@example.com',
            phone: '+1 987 654 321',
            specialty: 'Neurologist',
            status: 'Expired',
            patients: 856,
            subscription: 'Basic',
        },
        // Add more mock data as needed
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Doctors</h1>
                    <p className="text-sm text-slate-500">Manage doctor accounts and subscriptions.</p>
                </div>
                <Link
                    href="/admin/doctors/create"
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Doctor
                </Link>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search details..."
                            className="h-9 w-full rounded-md border border-slate-200 bg-transparent pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <button className="inline-flex items-center justify-center rounded-md border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                </button>
            </div>

            {/* Table */}
            <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="px-6 py-3 font-medium">Doctor</th>
                                <th className="px-6 py-3 font-medium">Contact</th>
                                <th className="px-6 py-3 font-medium">Specialty</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium">Plan</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {doctors.map((doctor) => (
                                <tr key={doctor.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{doctor.name}</div>
                                        <div className="text-xs text-slate-500">ID: DOC-{doctor.id}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-slate-500">
                                            <Mail className="mr-2 h-3 w-3" />
                                            {doctor.email}
                                        </div>
                                        <div className="mt-1 flex items-center text-slate-500">
                                            <Phone className="mr-2 h-3 w-3" />
                                            {doctor.phone}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                                            {doctor.specialty}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${doctor.status === 'Active'
                                                ? 'bg-green-50 text-green-700'
                                                : 'bg-red-50 text-red-700'
                                            }`}>
                                            <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${doctor.status === 'Active' ? 'bg-green-600' : 'bg-red-600'
                                                }`} />
                                            {doctor.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {doctor.subscription}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-slate-600">
                                            <MoreVertical className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
