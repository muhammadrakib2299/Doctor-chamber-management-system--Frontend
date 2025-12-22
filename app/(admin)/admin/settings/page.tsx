'use client';

import { Bell, Lock, User, Globe, Moon } from 'lucide-react';

export default function AdminSettingsPage() {
    return (
        <div className="max-w-4xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Settings</h1>
                <p className="text-sm text-slate-500">Manage your account preferences and application settings.</p>
            </div>

            {/* Profile Section */}
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                        <User className="h-4 w-4" /> Profile Information
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Full Name</label>
                            <input type="text" defaultValue="Admin User" className="flex h-10 w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Email Address</label>
                            <input type="email" defaultValue="admin@medcore.com" className="flex h-10 w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Save Changes</button>
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                        <Bell className="h-4 w-4" /> Notifications
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-slate-900">Email Notifications</p>
                            <p className="text-sm text-slate-500">Receive daily summaries and alerts.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Security */}
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                        <Lock className="h-4 w-4" /> Security
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    <button className="text-sm text-blue-600 hover:underline">Change Password</button>
                    <div className="pt-2">
                        <button className="text-sm text-red-600 hover:underline">Log out of all devices</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
