'use client';

import Link from 'next/link';
import {
    Users,
    Clock,
    CheckCircle,
    Play,
    ClipboardList
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/store/authStore';

const queueStats = [
    {
        title: 'Waiting',
        value: '12',
        icon: Users,
        color: 'text-orange-600',
        bg: 'bg-orange-100',
    },
    {
        title: 'In Progress',
        value: '1',
        icon: Play,
        color: 'text-blue-600',
        bg: 'bg-blue-100',
    },
    {
        title: 'Completed',
        value: '24',
        icon: CheckCircle,
        color: 'text-green-600',
        bg: 'bg-green-100',
    },
    {
        title: 'Avg. Time',
        value: '14 min',
        icon: Clock,
        color: 'text-purple-600',
        bg: 'bg-purple-100',
    },
];

const currentPatient = {
    id: 'P000214',
    name: 'Rahim Uddin',
    age: 45,
    gender: 'Male',
    problem: 'High fever, severe headache for 3 days.',
    bp: '130/85',
    temp: '102°F',
    weight: '72kg',
    status: 'In Progress',
    serial: 15,
};

export default function DoctorDashboard() {
    const { user } = useAuthStore();
    const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date().toLocaleDateString('en-US', dateOptions);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Good Morning, {user?.name || 'Doctor'}
                    </h1>
                    <p className="text-sm text-slate-500">{today}</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/doctor/queue"
                        className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                    >
                        View Full Queue
                    </Link>
                    <button className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700">
                        Start Consulation
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {queueStats.map((item) => (
                    <div key={item.title} className="rounded-xl border bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-500">{item.title}</span>
                            <div className={cn("rounded-lg p-2", item.bg)}>
                                <item.icon className={cn("h-4 w-4", item.color)} />
                            </div>
                        </div>
                        <div className="mt-2 text-3xl font-bold text-slate-900">
                            {item.value}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Current Patient Card */}
                <div className="lg:col-span-2 rounded-xl border bg-white shadow-sm overflow-hidden">
                    <div className="border-b bg-slate-50 px-6 py-4 flex justify-between items-center">
                        <h3 className="font-semibold text-slate-900 flex items-center">
                            <span className="animate-pulse h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></span>
                            Current Patient
                        </h3>
                        <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                            Serial #{currentPatient.serial}
                        </span>
                    </div>

                    <div className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">{currentPatient.name}</h2>
                                <p className="text-slate-500 text-sm mt-1">
                                    {currentPatient.age} Years • {currentPatient.gender} • ID: {currentPatient.id}
                                </p>
                            </div>
                            <div className="text-right">
                                <Link
                                    href="/doctor/prescriptions/create"
                                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                                >
                                    <ClipboardList className="mr-2 h-4 w-4" />
                                    Prescribe
                                </Link>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-4 gap-4">
                            <div className="p-3 bg-slate-50 rounded-lg text-center">
                                <p className="text-xs text-slate-500">BP</p>
                                <p className="font-semibold text-slate-900">{currentPatient.bp}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg text-center">
                                <p className="text-xs text-slate-500">Temp</p>
                                <p className="font-semibold text-slate-900">{currentPatient.temp}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg text-center">
                                <p className="text-xs text-slate-500">Weight</p>
                                <p className="font-semibold text-slate-900">{currentPatient.weight}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg text-center">
                                <p className="text-xs text-slate-500">History</p>
                                <p className="font-semibold text-blue-600 cursor-pointer">View</p>
                            </div>
                        </div>

                        <div className="mt-6 border-t pt-4">
                            <h4 className="text-sm font-semibold text-slate-900 mb-2">Chief Complaint</h4>
                            <p className="text-slate-600 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                                {currentPatient.problem}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Up Next List */}
                <div className="rounded-xl border bg-white shadow-sm">
                    <div className="border-b px-6 py-4">
                        <h3 className="font-semibold text-slate-900">Up Next</h3>
                    </div>
                    <div className="p-0">
                        {[16, 17, 18, 19, 20].map((serial, index) => (
                            <div key={serial} className="flex items-center justify-between px-6 py-4 border-b last:border-0 hover:bg-slate-50 transition-colors cursor-pointer group">
                                <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 text-xs">
                                        {serial}
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-slate-900">Patient {serial}</p>
                                        <p className="text-xs text-slate-500">Waiting • 5 min</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="p-4 text-center border-t">
                            <Link href="/doctor/queue" className="text-sm text-blue-600 font-medium hover:underline">
                                View All Queue
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
