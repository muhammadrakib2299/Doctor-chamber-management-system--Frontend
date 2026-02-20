'use client';

import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/lib/store/authStore';
import AssistantSidebar from '@/components/assistant/AssistantSidebar';
import AssistantHeader from '@/components/assistant/AssistantHeader';

interface Notification {
    id: string;
    message: string;
    time: string;
    read: boolean;
}

export default function AssistantLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuthStore();
    const [socketConnected, setSocketConnected] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const doctorId = user?.role === 'doctor' ? (user.id || user._id) : user?.doctorId;

    useEffect(() => {
        if (!doctorId) return;

        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
        const socket: Socket = io(socketUrl, {
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 2000,
        });

        socket.on('connect', () => {
            setSocketConnected(true);
            if (user?.role === 'assistant') {
                socket.emit('join-assistant-room', doctorId);
            } else if (user?.role === 'doctor') {
                socket.emit('join-doctor-room', doctorId);
            }
        });

        socket.on('disconnect', () => {
            setSocketConnected(false);
        });

        socket.on('queue-update', (data) => {
            if (data.type === 'NEW_APPOINTMENT') {
                const newNotif: Notification = {
                    id: Date.now().toString(),
                    message: `New booking: Serial #${data.appointment?.serialNumber}`,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    read: false,
                };
                setNotifications(prev => [newNotif, ...prev].slice(0, 20));
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [doctorId, user?.role]);

    return (
        <div className="flex h-screen bg-[#f8fafc]">
            <AssistantSidebar />

            <div className="flex flex-1 flex-col overflow-hidden">
                <AssistantHeader
                    socketConnected={socketConnected}
                    notifications={notifications}
                />

                <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 custom-scrollbar">
                    <div className="max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
