import DoctorSidebar from '@/components/doctor/DoctorSidebar';
import DoctorHeader from '@/components/doctor/DoctorHeader';

export default function DoctorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <DoctorSidebar />

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <DoctorHeader />

                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
