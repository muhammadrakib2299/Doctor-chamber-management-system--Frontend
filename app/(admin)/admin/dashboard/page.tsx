'use client';

import {
    Users,
    Stethoscope,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const stats = [
    {
        title: 'Total Doctors',
        value: '24',
        change: '+12%',
        trend: 'up',
        icon: Stethoscope,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
    },
    {
        title: 'Active Patients',
        value: '1,234',
        change: '+5.4%',
        trend: 'up',
        icon: Users,
        color: 'text-purple-600',
        bg: 'bg-purple-50',
    },
    {
        title: 'Total Revenue',
        value: '$45,231',
        change: '+2.3%',
        trend: 'up',
        icon: DollarSign,
        color: 'text-green-600',
        bg: 'bg-green-50',
    },
    {
        title: 'Subscriptions Expiring',
        value: '3',
        change: '-2',
        trend: 'down',
        icon: CreditCard,
        color: 'text-orange-600',
        bg: 'bg-orange-50',
    },
];

const recentDoctors = [
    {
        id: 1,
        name: 'Dr. Sarah Wilson',
        specialty: 'Cardiologist',
        status: 'Active',
        joined: '2 days ago',
        email: 'sarah.w@example.com',
        avatar: 'SW'
    },
    {
        id: 2,
        name: 'Dr. James Chen',
        specialty: 'Pediatrician',
        status: 'Pending',
        joined: '5 hours ago',
        email: 'j.chen@example.com',
        avatar: 'JC'
    },
    {
        id: 3,
        name: 'Dr. Emily Brooks',
        specialty: 'Dermatologist',
        status: 'Active',
        joined: '1 week ago',
        email: 'emily.b@example.com',
        avatar: 'EB'
    },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
                    <p className="text-slate-500 mt-1">Overview of your platform's performance.</p>
                </div>
                <div className="flex gap-3">
                    <button className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-all hover:shadow-md">
                        Download Report
                    </button>
                    <Link
                        href="/admin/doctors/create"
                        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-all hover:shadow-lg hover:-translate-y-0.5"
                    >
                        + Add New Doctor
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((item) => (
                    <div key={item.title} className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:border-blue-100">
                        <div className="flex items-center justify-between">
                            <div className={cn("rounded-xl p-3 transition-colors", item.bg)}>
                                <item.icon className={cn("h-6 w-6", item.color)} />
                            </div>
                            <span className={cn(
                                "flex items-center text-xs font-semibold px-2 py-1 rounded-full",
                                item.trend === 'up' ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
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
                            <p className="text-2xl font-bold text-slate-900 mt-1">{item.value}</p>
                        </div>
                        {/* Decorative background element */}
                        <div className="absolute -right-6 -bottom-6 opacity-[0.03] rotate-12 transform scale-150 transition-transform group-hover:scale-175 pointer-events-none text-slate-900">
                            <item.icon className="h-32 w-32" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity & Charts Section */}
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Recent Registrations */}
                <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                        <h3 className="font-semibold text-slate-900 text-lg">Recent Doctor Registrations</h3>
                        <Link href="/admin/doctors" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
                            View All
                        </Link>
                    </div>
                    <div className="p-2">
                        {recentDoctors.map((doctor) => (
                            <div key={doctor.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors group">
                                <div className="flex items-center space-x-4">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                        {doctor.avatar}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{doctor.name}</p>
                                        <p className="text-xs text-slate-500">{doctor.specialty} • {doctor.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden sm:block">
                                        <span className={cn(
                                            "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                                            doctor.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        )}>
                                            {doctor.status}
                                        </span>
                                        <p className="mt-1 text-xs text-slate-400">{doctor.joined}</p>
                                    </div>
                                    <button className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-white hover:shadow-sm">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-md text-white">
                        <h3 className="font-semibold text-lg mb-2">Premium Features</h3>
                        <p className="text-sm text-slate-300 mb-6">Upgrade platform capabilities or manage active licenses.</p>
                        <button className="w-full rounded-lg bg-white/10 border border-white/20 py-2.5 text-sm font-medium hover:bg-white/20 transition-colors">
                            Manage Licenses
                        </button>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-6">
                        <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Link href="/admin/doctors" className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-4 hover:border-blue-500 hover:bg-blue-50 transition-all hover:shadow-md group">
                                <Stethoscope className="mb-2 h-6 w-6 text-slate-600 group-hover:text-blue-600 transition-colors" />
                                <span className="text-xs font-medium text-slate-900">Doctors</span>
                            </Link>
                            <Link href="/admin/subscriptions" className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-4 hover:border-green-500 hover:bg-green-50 transition-all hover:shadow-md group">
                                <CreditCard className="mb-2 h-6 w-6 text-slate-600 group-hover:text-green-600 transition-colors" />
                                <span className="text-xs font-medium text-slate-900">Billing</span>
                            </Link>
                            <Link href="/admin/settings" className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-4 hover:border-purple-500 hover:bg-purple-50 transition-all hover:shadow-md group">
                                <Users className="mb-2 h-6 w-6 text-slate-600 group-hover:text-purple-600 transition-colors" />
                                <span className="text-xs font-medium text-slate-900">Users</span>
                            </Link>
                            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-4 text-slate-400 cursor-help hover:border-slate-400 hover:text-slate-600 transition-colors">
                                <span className="text-xs font-medium">Help</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
