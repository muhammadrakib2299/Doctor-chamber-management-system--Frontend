'use client';

import { Bell, Search, Menu } from 'lucide-react';
import { useUIStore } from '@/lib/store/uiStore';

export default function AdminHeader() {
    const { toggleSidebar } = useUIStore();

    return (
        <header className="flex h-16 items-center justify-between bg-white px-4 sm:px-6 shadow-sm border-b">

            {/* Mobile Menu Toggle */}
            <button
                onClick={toggleSidebar}
                className="mr-4 p-2 text-slate-600 hover:bg-slate-100 rounded-md md:hidden"
            >
                <Menu className="h-6 w-6" />
            </button>

            {/* Search Bar - Hidden on small mobile */}
            <div className="hidden sm:flex w-96 items-center rounded-lg bg-slate-100 px-4 py-2">
                <Search className="h-5 w-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="ml-2 w-full bg-transparent text-sm focus:outline-none"
                />
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
                <button className="relative rounded-full p-2 hover:bg-slate-100 text-slate-600">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
                </button>
            </div>
        </header>
    );
}
