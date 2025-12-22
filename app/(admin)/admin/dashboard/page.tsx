'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/lib/services/adminService';
import {
    Users,
    UserPlus,
    CreditCard,
    Activity,
    TrendingUp,
    AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>({
        totalDoctors: 0,
        activeSubscriptions: 0,
        totalPatients: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await adminService.getStats();
                setStats(res.data);
            } catch (error) {
                console.error("Failed to load stats");
            }
        };
        fetchStats();
    }, []);

    const cards = [
        {
            title: 'Total Doctors',
            value: stats.totalDoctors,
            icon: UserPlus,
            color: 'text-blue-600',
            bg: 'bg-blue-100',
            link: '/admin/doctors'
        },
        {
            title: 'Active Subscriptions',
            value: stats.activeSubscriptions,
            icon: CreditCard,
            color: 'text-green-600',
            bg: 'bg-green-100',
            link: '/admin/subscriptions'
        },
        {
            title: 'Total Patients Managed',
            value: stats.totalPatients,
            icon: Users,
            color: 'text-purple-600',
            bg: 'bg-purple-100',
            link: '#'
        },
        {
            title: 'System Health',
            value: 'Good',
            icon: Activity,
            color: 'text-emerald-600',
            bg: 'bg-emerald-100',
            link: '#'
        }
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500">Welcome back, Admin.</p>
                </div>
                <div>
                    <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium">BETA V1.0</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                    <Link href={card.link} key={index} className="block transition-transform hover:-translate-y-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
                                    <h3 className="text-3xl font-bold text-gray-900">{card.value}</h3>
                                </div>
                                <div className={`p-3 rounded-lg ${card.bg}`}>
                                    <card.icon className={`w-6 h-6 ${card.color}`} />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Section: Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-gray-600" />
                        Quick Actions
                    </h3>
                    <div className="space-y-3">
                        <Link href="/admin/doctors/create" className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded text-blue-600">
                                    <UserPlus className="w-4 h-4" />
                                </div>
                                <span className="font-medium text-gray-700">Register a new Doctor</span>
                            </div>
                            <span className="text-gray-400 group-hover:text-blue-600 text-sm">→</span>
                        </Link>
                        <Link href="/admin/doctors" className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="bg-purple-100 p-2 rounded text-purple-600">
                                    <CreditCard className="w-4 h-4" />
                                </div>
                                <span className="font-medium text-gray-700">Manage Subscriptions</span>
                            </div>
                            <span className="text-gray-400 group-hover:text-purple-600 text-sm">→</span>
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-gray-600" />
                        System Notices
                    </h3>
                    <div className="text-center py-8 text-gray-500">
                        <p>No new alerts or system warnings.</p>
                        <p className="text-sm mt-2">Database is running optimally.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
