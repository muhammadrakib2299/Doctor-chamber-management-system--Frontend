import { Stethoscope } from 'lucide-react';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            {/* Brand Header */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="rounded-full bg-blue-100 p-3">
                        <Stethoscope className="h-10 w-10 text-blue-600" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
                    MedCore Portal
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Doctor Chamber Management System
                </p>
            </div>

            {/* Main Card */}
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-100">
                    {children}
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-slate-500">
                    &copy; {new Date().getFullYear()} MedCore System. All rights reserved.
                </p>
            </div>
        </div>
    );
}
