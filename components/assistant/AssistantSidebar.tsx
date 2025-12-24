'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Calendar,
    Settings,
    LogOut,
    Activity,
    X,
    UserCircle,
    ClipboardList
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/store/authStore';
import { useUIStore } from '@/lib/store/uiStore';

const menuItems = [
    {
        title: 'Dashboard',
        icon: LayoutDashboard,
        href: '/assistant/dashboard',
    },
    // Future expansion:
    // {
    //     title: 'Appointments',
    //     icon: Calendar,
    //     href: '/assistant/appointments',
    // },
    // {
    //     title: 'Patients',
    //     icon: Users,
    //     href: '/assistant/patients',
    // },
];

export default function AssistantSidebar() {
    const pathname = usePathname();
    const { logout, user } = useAuthStore();
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
                "fixed inset-y-0 left-0 z-50 flex h-full w-72 flex-col bg-[#0f172a] text-white transition-transform duration-300 ease-in-out md:static md:translate-x-0 border-r border-slate-800",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Logo Section */}
                <div className="flex h-20 items-center justify-between border-b border-slate-800/50 px-8 bg-[#0f172a]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
                            <Activity className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <span className="text-xl font-black tracking-tight text-white">MedCore</span>
                            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-none mt-1">Assistant Hub</p>
                        </div>
                    </div>
                    <button onClick={closeSidebar} className="md:hidden p-2 text-slate-400 hover:text-white transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Navigation Section */}
                <div className="flex-1 overflow-y-auto px-4 py-8 space-y-10">
                    <div className="space-y-2">
                        <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Main Navigation</p>
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => closeSidebar()}
                                    className={cn(
                                        'group flex items-center rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-200',
                                        isActive
                                            ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20'
                                            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
                                    )}
                                >
                                    <item.icon
                                        className={cn(
                                            'mr-3 h-5 w-5 transition-colors',
                                            isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
                                        )}
                                    />
                                    {item.title}
                                    {isActive && (
                                        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="space-y-2">
                        <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Support & Care</p>
                        <button className="w-full flex items-center rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-400 hover:bg-slate-800/50 hover:text-slate-100 transition-all duration-200">
                            <ClipboardList className="mr-3 h-5 w-5 text-slate-500" />
                            Emergency Log
                        </button>
                        <button className="w-full flex items-center rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-400 hover:bg-slate-800/50 hover:text-slate-100 transition-all duration-200">
                            <Settings className="mr-3 h-5 w-5 text-slate-500" />
                            Preferences
                        </button>
                    </div>
                </div>

                {/* Bottom Profile Section */}
                <div className="p-6 bg-[#1e293b]/30 border-t border-slate-800/50">
                    <div className="flex items-center gap-3 mb-6 px-2">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white shadow-lg">
                            {user?.name?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-extrabold text-white truncate">{user?.name}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">Doctor Assistant</p>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            logout();
                            window.location.href = '/auth/login';
                        }}
                        className="w-full flex items-center justify-center gap-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white px-4 py-3.5 text-sm font-black transition-all duration-300 group"
                    >
                        <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Sign Out
                    </button>
                </div>
            </div>
        </>
    );
}
