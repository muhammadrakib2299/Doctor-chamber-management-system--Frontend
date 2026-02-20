'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/lib/store/authStore';
import { useQueueStore } from '@/lib/store/queueStore';

export function useSocket() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [connectionError, setConnectionError] = useState(false);
    const { user } = useAuthStore();
    const { updatePatient, addPatient } = useQueueStore();

    useEffect(() => {
        if (!user) return;

        const token = localStorage.getItem('token') || sessionStorage.getItem('token');

        const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
            transports: ['websocket'],
            auth: { token },
        });

        setSocket(socketInstance);
        setConnectionError(false);

        socketInstance.on('connect', () => {
            setConnectionError(false);
            // Join appropriate room based on role
            if (user.role === 'doctor') {
                socketInstance.emit('join-doctor-room', user._id || (user as any).id);
            } else if (user.role === 'assistant' && user.doctorId) {
                socketInstance.emit('join-assistant-room', user.doctorId);
            }
        });

        socketInstance.on('connect_error', () => {
            setConnectionError(true);
        });

        // Listen for queue updates
        socketInstance.on('queue-updated', (data) => {
            // Update queue state
        });

        socketInstance.on('patient-status-changed', (data) => {
            updatePatient(data.appointmentId, { status: data.status });
        });

        socketInstance.on('appointment-created', (data) => {
            addPatient(data);
        });

        return () => {
            socketInstance.removeAllListeners();
            socketInstance.disconnect();
        };
    }, [user]);

    return { socket, connectionError };
}
