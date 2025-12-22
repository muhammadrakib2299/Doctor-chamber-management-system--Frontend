'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/lib/store/authStore';
import { useQueueStore } from '@/lib/store/queueStore';

export function useSocket() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const { user } = useAuthStore();
    const { updatePatient, addPatient } = useQueueStore();

    useEffect(() => {
        if (!user) return;

        const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
            transports: ['websocket'],
        });

        setSocket(socketInstance);

        // Join appropriate room based on role
        if (user.role === 'doctor') {
            socketInstance.emit('join-doctor-room', user._id);
        } else if (user.role === 'assistant' && user.doctorId) {
            socketInstance.emit('join-assistant-room', user.doctorId);
        }

        // Listen for queue updates
        socketInstance.on('queue-updated', (data) => {
            console.log('Queue updated:', data);
            // Update queue state
        });

        socketInstance.on('patient-status-changed', (data) => {
            console.log('Patient status changed:', data);
            updatePatient(data.appointmentId, { status: data.status });
        });

        socketInstance.on('appointment-created', (data) => {
            console.log('New appointment:', data);
            addPatient(data);
        });

        return () => {
            socketInstance.disconnect();
        };
    }, [user]);

    return socket;
}
