import AssistantSidebar from '@/components/assistant/AssistantSidebar';
import AssistantHeader from '@/components/assistant/AssistantHeader';

export default function AssistantLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-[#f8fafc]">
            {/* Sidebar */}
            <AssistantSidebar />

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <AssistantHeader />

                <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 custom-scrollbar">
                    <div className="max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
