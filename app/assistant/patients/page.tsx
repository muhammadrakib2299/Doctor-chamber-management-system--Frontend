'use client';

import PatientList from '@/components/assistant/PatientList';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function PatientsPage() {
    return (
        <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Patient Registry</h1>
                    <p className="text-slate-500 font-medium text-sm mt-1">Manage and update patient records</p>
                </div>
                <Link
                    href="/assistant/dashboard"
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                    <Plus className="h-4 w-4" />
                    <span>New Registration</span>
                </Link>
            </div>

            <div className="flex-1 min-h-0">
                <PatientList />
            </div>
        </div>
    );
}
