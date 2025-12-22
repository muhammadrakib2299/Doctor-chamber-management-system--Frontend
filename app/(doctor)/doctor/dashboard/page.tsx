'use client';

import Link from 'next/link';
import {
    Users,
    Clock,
    CheckCircle,
    Play,
    ClipboardList,
    TrendingUp,
    MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/store/authStore';

const queueStats = [
    {
        title: 'Waiting',
        value: '12',
        icon: Users,
        color: 'text-orange-600',
        bg: 'bg-orange-50',
    },
    {
        title: 'In Progress',
        value: '1',
        icon: Play,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
    },
    {
        title: 'Completed',
        value: '24',
        icon: CheckCircle,
        color: 'text-green-600',
        bg: 'bg-green-50',
    },
    {
        title: 'Avg. Time',
        value: '14 min',
        icon: Clock,
        color: 'text-purple-600',
        bg: 'bg-purple-50',
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
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Good Morning, {user?.name || 'Doctor'}
                    </h1>
                    <p className="text-slate-500 mt-1">{today}</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/doctor/queue"
                        className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-all hover:shadow-md"
                    >
                        View Full Queue
                    </Link>
                    <button className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 transition-all hover:shadow-lg hover:-translate-y-0.5">
                        <Play className="mr-2 h-4 w-4 fill-white" /> Start Consultation
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {queueStats.map((item) => (
                    <div key={item.title} className="group overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:border-blue-100">
                        <div className="flex items-center justify-between">
                            <div className={cn("rounded-xl p-3 transition-colors", item.bg)}>
                                <item.icon className={cn("h-6 w-6", item.color)} />
                            </div>
                            {item.title === 'Avg. Time' ? (
                                <span className="flex items-center text-xs font-semibold px-2 py-1 rounded-full text-green-700 bg-green-50">
                                    -2m <TrendingUp className="ml-1 h-3 w-3" />
                                </span>
                            ) : null}
                        </div>
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-slate-500">{item.title}</h3>
                            <div className="mt-1 flex items-baseline">
                                <p className="text-3xl font-bold text-slate-900">
                                    {item.value}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Current Patient Card */}
                <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                    <div className="border-b bg-gradient-to-r from-slate-50 to-white px-6 py-4 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900 flex items-center text-lg">
                            <span className="flex h-3 w-3 relative mr-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            Current Patient
                        </h3>
                        <span className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-700 rounded-full tracking-wide">
                            SERIAL #{currentPatient.serial}
                        </span>
                    </div>

                    <div className="p-8">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900">{currentPatient.name}</h2>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">{currentPatient.age} Years</span>
                                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">{currentPatient.gender}</span>
                                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">ID: {currentPatient.id}</span>
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                <Link
                                    href="/doctor/prescriptions/create"
                                    className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:-translate-y-0.5"
                                >
                                    <ClipboardList className="mr-2 h-5 w-5" />
                                    Prescribe Medicine
                                </Link>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="p-4 bg-slate-50 rounded-2xl text-center border border-slate-100 hover:border-blue-200 transition-colors">
                                <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-1">Blood Pressure</p>
                                <p className="text-xl font-bold text-slate-900">{currentPatient.bp}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl text-center border border-slate-100 hover:border-red-200 transition-colors">
                                <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-1">Temperature</p>
                                <p className="text-xl font-bold text-slate-900">{currentPatient.temp}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl text-center border border-slate-100 hover:border-green-200 transition-colors">
                                <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-1">Weight</p>
                                <p className="text-xl font-bold text-slate-900">{currentPatient.weight}</p>
                            </div>
                            <div className="p-4 bg-blue-50/50 rounded-2xl text-center border border-blue-100 hover:bg-blue-50 cursor-pointer transition-colors group">
                                <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-1">History</p>
                                <p className="text-sm font-bold text-blue-600 group-hover:underline">View Records</p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">Chief Complaint</h4>
                            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-amber-900">
                                <p className="font-medium">"{currentPatient.problem}"</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Up Next List */}
                <div className="rounded-2xl border border-slate-100 bg-white shadow-sm flex flex-col h-full">
                    <div className="border-b px-6 py-4">
                        <h3 className="font-semibold text-slate-900 text-lg">Up Next</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {[16, 17, 18, 19, 20, 21].map((serial, index) => (
                            <div key={serial} className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all text-sm shadow-sm group-hover:shadow-md">
                                        {serial}
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">Patient Name</p>
                                        <p className="text-xs text-slate-500">Waiting • {(index + 1) * 15} min</p>
                                    </div>
                                </div>
                                <button className="text-slate-300 hover:text-slate-600 p-1">
                                    <MoreHorizontal className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-slate-100 mt-auto">
                        <Link href="/doctor/queue" className="flex items-center justify-center w-full py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                            Manage Full Queue
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
