'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Stethoscope,
    Users,
    CreditCard,
    Settings,
    LogOut,
    Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/store/authStore';

const menuItems = [
    {
        title: 'Dashboard',
        icon: LayoutDashboard,
        href: '/admin/dashboard',
    },
    {
        title: 'Doctors',
        icon: Stethoscope,
        href: '/admin/doctors',
    },
    {
        title: 'Assistants',
        icon: Users,
        href: '/admin/assistants',
    },
    {
        title: 'Subscriptions',
        icon: CreditCard,
        href: '/admin/subscriptions',
    },
    {
        title: 'Settings',
        icon: Settings,
        href: '/admin/settings',
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const { logout } = useAuthStore();

    return (
        <div className="flex h-screen w-64 flex-col bg-slate-900 text-white">
            {/* Logo */}
            <div className="flex h-16 items-center border-b border-slate-800 px-6">
                <Activity className="mr-2 h-6 w-6 text-blue-500" />
                <span className="text-lg font-bold">MedCore Admin</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
                {menuItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-blue-600 text-white'
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

            {/* User Profile & Logout */}
            <div className="border-t border-slate-800 p-4">
                <div className="mb-4 flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
                        A
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium">Administrator</p>
                        <p className="text-xs text-slate-500">admin@system.com</p>
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
    );
}
