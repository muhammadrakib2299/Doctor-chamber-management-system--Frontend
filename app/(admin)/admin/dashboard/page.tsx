'use client';

import {
    Users,
    Stethoscope,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';

const stats = [
    {
        title: 'Total Doctors',
        value: '24',
        change: '+12%',
        trend: 'up',
        icon: Stethoscope,
        color: 'text-blue-600',
        bg: 'bg-blue-100',
    },
    {
        title: 'Active Patients',
        value: '1,234',
        change: '+5.4%',
        trend: 'up',
        icon: Users,
        color: 'text-purple-600',
        bg: 'bg-purple-100',
    },
    {
        title: 'Total Revenue',
        value: '$45,231',
        change: '+2.3%',
        trend: 'up',
        icon: DollarSign,
        color: 'text-green-600',
        bg: 'bg-green-100',
    },
    {
        title: 'Subscriptions Expiring',
        value: '3',
        change: '-2',
        trend: 'down',
        icon: CreditCard,
        color: 'text-orange-600',
        bg: 'bg-orange-100',
    },
];

const recentDoctors = [
    {
        name: 'Dr. Sarah Wilson',
        specialty: 'Cardiologist',
        status: 'Active',
        joined: '2 days ago',
        email: 'sarah.w@example.com'
    },
    {
        name: 'Dr. James Chen',
        specialty: 'Pediatrician',
        status: 'Pending',
        joined: '5 hours ago',
        email: 'j.chen@example.com'
    },
    {
        name: 'Dr. Emily Brooks',
        specialty: 'Dermatologist',
        status: 'Active',
        joined: '1 week ago',
        email: 'emily.b@example.com'
    },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
                <p className="text-sm text-slate-500">Overview of your platform's performance.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((item) => (
                    <div key={item.title} className="rounded-xl border bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className={cn("rounded-lg p-2", item.bg)}>
                                <item.icon className={cn("h-6 w-6", item.color)} />
                            </div>
                            <span className={cn(
                                "flex items-center text-xs font-medium",
                                item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                            )}>
                                {item.change}
                                {item.trend === 'up' ? (
                                    <ArrowUpRight className="ml-1 h-3 w-3" />
                                ) : (
                                    <ArrowDownRight className="ml-1 h-3 w-3" />
                                )}
                            </span>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-slate-500">{item.title}</h3>
                            <p className="text-2xl font-bold text-slate-900">{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity & Charts Section */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Registrations */}
                <div className="rounded-xl border bg-white shadow-sm">
                    <div className="border-b px-6 py-4">
                        <h3 className="font-semibold text-slate-900">Recent Doctor Registrations</h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-6">
                            {recentDoctors.map((doctor) => (
                                <div key={doctor.email} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                                            {doctor.name.charAt(4)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{doctor.name}</p>
                                            <p className="text-xs text-slate-500">{doctor.specialty} • {doctor.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className={cn(
                                            "inline-flex rounded-full px-2 py-1 text-xs font-medium",
                                            doctor.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        )}>
                                            {doctor.status}
                                        </span>
                                        <span className="mt-1 text-xs text-slate-400">{doctor.joined}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-xl border bg-white shadow-sm">
                    <div className="border-b px-6 py-4">
                        <h3 className="font-semibold text-slate-900">Quick Actions</h3>
                    </div>
                    <div className="p-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <button className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 p-6 hover:border-blue-500 hover:bg-blue-50 transition-colors">
                                <Stethoscope className="mb-3 h-8 w-8 text-blue-500" />
                                <span className="font-medium text-slate-900">Search Doctor</span>
                            </button>
                            <button className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 p-6 hover:border-green-500 hover:bg-green-50 transition-colors">
                                <CreditCard className="mb-3 h-8 w-8 text-green-500" />
                                <span className="font-medium text-slate-900">View Payments</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
