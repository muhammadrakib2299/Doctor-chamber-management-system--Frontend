'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    ClipboardList,
    History,
    Settings,
    LogOut,
    Stethoscope,
    Calendar,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/store/authStore';
import { useUIStore } from '@/lib/store/uiStore';

const menuItems = [
    {
        title: 'Dashboard',
        icon: LayoutDashboard,
        href: '/doctor/dashboard',
    },
    {
        title: 'Live Queue',
        icon: Users,
        href: '/doctor/queue',
    },
    {
        title: 'Create Prescription',
        icon: ClipboardList,
        href: '/doctor/prescriptions/create',
    },
    {
        title: 'Appointments',
        icon: Calendar,
        href: '/doctor/appointments',
    },
    {
        title: 'Patient History',
        icon: History,
        href: '/doctor/patients',
    },
    {
        title: 'Settings',
        icon: Settings,
        href: '/doctor/settings',
    },
];

export default function DoctorSidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuthStore();
    const { isSidebarOpen, closeSidebar } = useUIStore();

    return (
        <>
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col bg-slate-900 text-white transition-transform duration-300 ease-in-out md:static md:translate-x-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Brand */}
                <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6">
                    <div className="flex items-center">
                        <Stethoscope className="mr-2 h-6 w-6 text-green-500" />
                        <span className="text-lg font-bold">Doctor Portal</span>
                    </div>
                    <button onClick={closeSidebar} className="md:hidden text-slate-400 hover:text-white">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 px-3 py-4">
                    {menuItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={closeSidebar} // Close on nav for mobile
                                className={cn(
                                    'group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-green-600 text-white'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        'mr-3 h-5 w-5 flex-shrink-0',
                                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                                    )}
                                />
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile */}
                <div className="border-t border-slate-800 p-4">
                    <div className="mb-4 flex items-center">
                        <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-sm font-bold text-white">
                            {user?.name?.charAt(0) || 'D'}
                        </div>
                        <div className="ml-3 overflow-hidden">
                            <p className="text-sm font-medium truncate">{user?.name || 'Doctor'}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            logout();
                            window.location.href = '/auth/login';
                        }}
                        className="flex w-full items-center rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
                    >
                        <LogOut className="mr-3 h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </div>
        </>
    );
}
