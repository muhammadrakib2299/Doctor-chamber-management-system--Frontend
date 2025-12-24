'use client';

import { Bell, Search, Menu, SearchIcon, Calendar, Sparkles, RefreshCw } from 'lucide-react';
import { useUIStore } from '@/lib/store/uiStore';
import { useAuthStore } from '@/lib/store/authStore';

export default function AssistantHeader() {
    const { toggleSidebar } = useUIStore();
    const { user } = useAuthStore();

    return (
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-6 sm:px-10 sticky top-0 z-40 transition-all">

            <div className="flex items-center gap-6">
                {/* Mobile Menu Toggle */}
                <button
                    onClick={toggleSidebar}
                    className="p-2.5 text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-xl md:hidden transition-all"
                >
                    <Menu className="h-6 w-6" />
                </button>

                <div className="flex flex-col">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">Clinical Dashboard</h2>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-blue-500" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                </div>
            </div>

        </header>
    );
}
