'use client';

import { Bell, Search, Menu } from 'lucide-react';

export default function DoctorHeader() {
    return (
        <header className="flex h-16 items-center justify-between bg-white px-6 shadow-sm border-b">

            {/* Search Bar - Patient Search */}
            <div className="flex w-96 items-center rounded-lg bg-slate-100 px-4 py-2">
                <Search className="h-5 w-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search patients by name or ID..."
                    className="ml-2 w-full bg-transparent text-sm focus:outline-none"
                />
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
                {/* Connection Status - Using Socket */}
                <div className="hidden md:flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                    Live Connected
                </div>

                <button className="relative rounded-full p-2 hover:bg-slate-100 text-slate-600">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
                </button>
            </div>
        </header>
    );
}
