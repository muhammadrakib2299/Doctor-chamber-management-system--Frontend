'use client';

import {
    Calendar,
    Clock,
    Search,
    Filter,
    MoreVertical,
    User,
    CheckCircle2,
    XCircle,
    MapPin
} from 'lucide-react';

export default function DoctorAppointmentsPage() {
    const appointments = [
        {
            id: 1,
            patientName: 'John Doe',
            age: 45,
            gender: 'Male',
            time: '09:00 AM',
            date: 'Today, Dec 22',
            type: 'General Checkup',
            status: 'Scheduled',
            location: 'Room 302',
            image: null
        },
        {
            id: 2,
            patientName: 'Sarah Smith',
            age: 28,
            gender: 'Female',
            time: '10:30 AM',
            date: 'Today, Dec 22',
            type: 'Follow Up',
            status: 'In Progress',
            location: 'Room 302',
            image: null
        },
        {
            id: 3,
            patientName: 'Robert Wilson',
            age: 62,
            gender: 'Male',
            time: '02:15 PM',
            date: 'Tomorrow, Dec 23',
            type: 'Consultation',
            status: 'Confirmed',
            location: 'Room 302',
            image: null
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'scheduled': return 'bg-blue-50 text-blue-700';
            case 'in progress': return 'bg-yellow-50 text-yellow-700';
            case 'confirmed': return 'bg-green-50 text-green-700';
            case 'cancelled': return 'bg-red-50 text-red-700';
            default: return 'bg-slate-50 text-slate-700';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Appointments</h1>
                    <p className="text-sm text-slate-500">Manage your schedule and patient visits.</p>
                </div>
                <div className="flex gap-2">
                    <button className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
                        <Calendar className="mr-2 h-4 w-4" />
                        Calendar View
                    </button>
                    <button className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
                        <User className="mr-2 h-4 w-4" />
                        New Appointment
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search patient, time or type..."
                            className="h-9 w-full rounded-md border border-slate-200 bg-transparent pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="inline-flex items-center justify-center rounded-md border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50">
                        <Filter className="mr-2 h-4 w-4" />
                        All Status
                    </button>
                    <input
                        type="date"
                        className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Appointments List */}
            <div className="grid gap-4">
                {appointments.map((apt) => (
                    <div key={apt.id} className="group relative flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                                <User className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900">{apt.patientName}</h3>
                                <p className="text-sm text-slate-500">
                                    {apt.age} yrs • {apt.gender} • {apt.type}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                            <div className="flex items-center text-sm text-slate-500">
                                <Calendar className="mr-2 h-4 w-4 text-slate-400" />
                                {apt.date}
                            </div>
                            <div className="flex items-center text-sm text-slate-500">
                                <Clock className="mr-2 h-4 w-4 text-slate-400" />
                                {apt.time}
                            </div>
                            <div className="flex items-center text-sm text-slate-500">
                                <MapPin className="mr-2 h-4 w-4 text-slate-400" />
                                {apt.location}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(apt.status)}`}>
                                {apt.status}
                            </span>
                            <div className="flex items-center gap-2">
                                <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600">
                                    <CheckCircle2 className="h-4 w-4" />
                                </button>
                                <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600">
                                    <XCircle className="h-4 w-4" />
                                </button>
                                <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600">
                                    <MoreVertical className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
