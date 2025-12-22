'use client';

import {
    Clock,
    MoreVertical,
    User,
    ArrowRight,
    Pause,
    Play
} from 'lucide-react';

export default function DoctorQueuePage() {
    const currentPatient = {
        name: 'John Doe',
        id: 'P-12345',
        age: 45,
        gender: 'Male',
        issue: 'Severe Headache & Fever',
        waitingTime: '15 mins',
        status: 'In Consultation'
    };

    const waitingQueue = [
        {
            id: 1,
            name: 'Sarah Smith',
            type: 'New Visit',
            token: '04',
            waitingTime: '10 mins'
        },
        {
            id: 2,
            name: 'Mike Johnson',
            type: 'Follow-up',
            token: '05',
            waitingTime: '25 mins'
        },
        {
            id: 3,
            name: 'Emily Davis',
            type: 'Report Check',
            token: '06',
            waitingTime: '30 mins'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Live Queue</h1>
                    <p className="text-sm text-slate-500">Manage real-time patient flow.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-sm font-medium text-slate-600">Live Status: Active</span>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Current Patient Card */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-semibold text-slate-900">Current Patient</h2>
                    <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                <User className="h-10 w-10" />
                            </div>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-slate-900">{currentPatient.name}</h3>
                                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                            {currentPatient.status}
                                        </span>
                                    </div>
                                    <p className="text-slate-500">
                                        {currentPatient.age} yrs • {currentPatient.gender} • ID: {currentPatient.id}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-white p-4 shadow-sm border border-blue-100">
                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Chief Complaint</h4>
                                    <p className="text-slate-900 font-medium">{currentPatient.issue}</p>
                                </div>

                                <div className="flex flex-wrap gap-3 pt-2">
                                    <button className="flex-1 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
                                        Complete Visit
                                    </button>
                                    <button className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
                                        <Pause className="mr-2 h-4 w-4" />
                                        Hold
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Waiting List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-900">Waiting ({waitingQueue.length})</h2>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
                    </div>

                    <div className="rounded-xl border bg-white shadow-sm divide-y divide-slate-100">
                        {waitingQueue.map((patient) => (
                            <div key={patient.id} className="p-4 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600">
                                            {patient.token}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900 text-sm">{patient.name}</h4>
                                            <p className="text-xs text-slate-500">{patient.type}</p>
                                        </div>
                                    </div>
                                    <button className="p-2 text-slate-400 hover:text-slate-600">
                                        <MoreVertical className="h-4 w-4" />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between mt-3 text-xs">
                                    <div className="flex items-center text-slate-500">
                                        <Clock className="mr-1 h-3 w-3" />
                                        Waiting: {patient.waitingTime}
                                    </div>
                                    <button className="inline-flex items-center text-blue-600 font-medium hover:underline">
                                        Call Now <ArrowRight className="ml-1 h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
