'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, Menu, Calendar, LogOut, User, Settings, ChevronDown, Wifi, WifiOff } from 'lucide-react';
import { useUIStore } from '@/lib/store/uiStore';
import { useAuthStore } from '@/lib/store/authStore';
import Link from 'next/link';

interface AssistantHeaderProps {
    socketConnected?: boolean;
    notifications?: { id: string; message: string; time: string; read: boolean }[];
}

export default function AssistantHeader({ socketConnected = false, notifications = [] }: AssistantHeaderProps) {
    const { toggleSidebar } = useUIStore();
    const { user, logout } = useAuthStore();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setShowProfileMenu(false);
            }
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-6 sm:px-10 sticky top-0 z-40 transition-all">
            <div className="flex items-center gap-6">
                <button
                    onClick={toggleSidebar}
                    className="p-2.5 text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-xl md:hidden transition-all"
                >
                    <Menu className="h-6 w-6" />
                </button>

                <div className="flex flex-col">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">Clinical Dashboard</h2>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3 text-blue-500" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            {socketConnected ? (
                                <>
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">Live</span>
                                </>
                            ) : (
                                <>
                                    <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Offline</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* Notifications */}
                <div ref={notifRef} className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl border border-transparent hover:border-slate-200 transition-all"
                        aria-label="Notifications"
                    >
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 h-4.5 min-w-[18px] px-1 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
                            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                                <h4 className="text-sm font-black text-slate-800">Notifications</h4>
                                {unreadCount > 0 && (
                                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{unreadCount} new</span>
                                )}
                            </div>
                            <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                {notifications.length === 0 ? (
                                    <div className="py-10 text-center">
                                        <Bell className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                                        <p className="text-xs font-bold text-slate-400">No notifications yet</p>
                                    </div>
                                ) : (
                                    notifications.map((notif) => (
                                        <div key={notif.id} className={`px-5 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!notif.read ? 'bg-blue-50/30' : ''}`}>
                                            <p className="text-xs font-bold text-slate-700">{notif.message}</p>
                                            <p className="text-[10px] text-slate-400 mt-1">{notif.time}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Dropdown */}
                <div ref={profileRef} className="relative">
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
                    >
                        <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-sm">
                            {user?.name?.charAt(0)}
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-xs font-bold text-slate-700 leading-none">{user?.name}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Assistant</p>
                        </div>
                        <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
                    </button>

                    {showProfileMenu && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
                            <div className="px-5 py-4 border-b border-slate-100">
                                <p className="text-sm font-black text-slate-800">{user?.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold mt-0.5">{user?.email}</p>
                            </div>
                            <div className="py-2">
                                <Link
                                    href="/assistant/settings"
                                    onClick={() => setShowProfileMenu(false)}
                                    className="flex items-center gap-3 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    <Settings className="h-4 w-4 text-slate-400" />
                                    Settings
                                </Link>
                            </div>
                            <div className="border-t border-slate-100 py-2">
                                <button
                                    onClick={() => {
                                        logout();
                                        window.location.href = '/auth/login';
                                    }}
                                    className="w-full flex items-center gap-3 px-5 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
