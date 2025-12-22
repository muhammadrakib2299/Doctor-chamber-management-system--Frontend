'use client';

import Link from 'next/link';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Mail,
    Phone,
    UserCircle
} from 'lucide-react';

export default function AssistantsList() {
    const assistants = [
        {
            id: 1,
            name: 'Alice Johnson',
            email: 'alice.j@example.com',
            phone: '+1 555 123 4567',
            assignedTo: 'Dr. Sarah Wilson',
            status: 'Active',
            joinedDate: '2023-01-15',
        },
        {
            id: 2,
            name: 'Bob Smith',
            email: 'bob.s@example.com',
            phone: '+1 555 987 6543',
            assignedTo: 'Dr. Michael Brown',
            status: 'Inactive',
            joinedDate: '2023-03-22',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Assistants</h1>
                    <p className="text-sm text-slate-500">Manage doctor assistants and their permissions.</p>
                </div>
                <button
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Assistant
                </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search assistants..."
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
                                <th className="px-6 py-3 font-medium">Assistant</th>
                                <th className="px-6 py-3 font-medium">Contact</th>
                                <th className="px-6 py-3 font-medium">Assigned To</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium">Joined</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {assistants.map((assistant) => (
                                <tr key={assistant.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{assistant.name}</div>
                                        <div className="text-xs text-slate-500">ID: AST-{assistant.id}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-slate-500">
                                            <Mail className="mr-2 h-3 w-3" />
                                            {assistant.email}
                                        </div>
                                        <div className="mt-1 flex items-center text-slate-500">
                                            <Phone className="mr-2 h-3 w-3" />
                                            {assistant.phone}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-slate-600">
                                            <UserCircle className="mr-2 h-4 w-4 text-slate-400" />
                                            {assistant.assignedTo}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${assistant.status === 'Active'
                                            ? 'bg-green-50 text-green-700'
                                            : 'bg-slate-50 text-slate-700'
                                            }`}>
                                            <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${assistant.status === 'Active' ? 'bg-green-600' : 'bg-slate-600'
                                                }`} />
                                            {assistant.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {assistant.joinedDate}
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
