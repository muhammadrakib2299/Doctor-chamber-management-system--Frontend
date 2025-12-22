'use client';

import Link from 'next/link';
import {
    Search,
    Filter,
    MoreVertical,
    Mail,
    Phone,
    UserCircle,
    FileText
} from 'lucide-react';

export default function DoctorPatientsPage() {
    const patients = [
        {
            id: 1,
            name: 'John Doe',
            age: 45,
            gender: 'Male',
            contact: '+1 555 0123',
            lastVisit: '22 Dec, 2024',
            condition: 'Hypertension'
        },
        {
            id: 2,
            name: 'Sarah Smith',
            age: 28,
            gender: 'Female',
            contact: '+1 555 0124',
            lastVisit: '20 Dec, 2024',
            condition: 'Migraine'
        },
        // Add more mock data...
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Patients</h1>
                    <p className="text-sm text-slate-500">Access patient records and history.</p>
                </div>
            </div>

            <div className="flex items-center gap-4 rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name, phone..."
                            className="h-9 w-full rounded-md border border-slate-200 bg-transparent pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <button className="inline-flex items-center justify-center rounded-md border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                </button>
            </div>

            <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                        <tr>
                            <th className="px-6 py-3 font-medium">Patient Details</th>
                            <th className="px-6 py-3 font-medium">Contact</th>
                            <th className="px-6 py-3 font-medium">Last Visit</th>
                            <th className="px-6 py-3 font-medium">Condition</th>
                            <th className="px-6 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {patients.map((patient) => (
                            <tr key={patient.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900">{patient.name}</div>
                                    <div className="text-xs text-slate-500">{patient.age} yrs, {patient.gender}</div>
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                    {patient.contact}
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                    {patient.lastVisit}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                                        {patient.condition}
                                    </span>
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
    );
}
