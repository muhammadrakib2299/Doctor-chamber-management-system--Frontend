'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { appointmentService } from '@/lib/services/appointmentService';
import PatientRegistrationForm from '@/components/assistant/PatientRegistrationForm';
import SearchPatient from '@/components/assistant/SearchPatient';
import QueueList from '@/components/assistant/QueueList';
import AppointmentBookingModal from '@/components/assistant/AppointmentBookingModal';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

export default function AssistantDashboard() {
    const { user } = useAuthStore();
    const [queue, setQueue] = useState<any[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Initial Queue Load
    useEffect(() => {
        const fetchQueue = async () => {
            if (!user) return;
            // Determine doctorId: if user is doctor, it's their ID, else if assistant, it's linked ID
            const doctorId = user.role === 'doctor' ? user.id : user.doctorId;
            if (!doctorId) return;

            try {
                const res = await appointmentService.getTodayQueue(doctorId);
                setQueue(res.data);
            } catch (error) {
                console.error("Failed to fetch queue", error);
            }
        };

        fetchQueue();
    }, [user, refreshTrigger]);

    // Socket.IO Integration for Real-time Updates
    useEffect(() => {
        if (!user) return;
        const doctorId = user.role === 'doctor' ? user.id : user.doctorId;
        if (!doctorId) return;

        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
        const socket = io(socketUrl);

        socket.on('connect', () => {
            console.log('Connected to socket server');
            // Join appropriate room
            if (user.role === 'assistant') {
                socket.emit('join-assistant-room', doctorId);
            } else if (user.role === 'doctor') {
                socket.emit('join-doctor-room', doctorId);
            }
        });

        // Listen for queue updates
        socket.on('queue-update', (data) => {
            console.log('Queue update received:', data);
            // Simple strategy: re-fetch queue or append if optimal
            setRefreshTrigger(prev => prev + 1);
            if (data.type === 'NEW_APPOINTMENT') {
                toast.success(`New appointment: #${data.appointment?.serialNumber}`);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [user]);

    const handlePatientSelect = (patient: any) => {
        setSelectedPatient(patient);
        setShowBookingModal(true);
    };

    const handleRegistrationSuccess = (patient: any) => {
        // Auto-select registered patient for booking
        handlePatientSelect(patient);
    };

    const handleBookingSuccess = () => {
        setShowBookingModal(false);
        setSelectedPatient(null);
        setRefreshTrigger(prev => prev + 1); // Refresh queue
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Assistant Dashboard</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Actions */}
                <div className="lg:col-span-1 space-y-8">
                    {/* 1. Search Patient */}
                    <SearchPatient onSelect={handlePatientSelect} />

                    {/* 2. Divider or "OR" */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-2 bg-gray-50 text-sm text-gray-500">OR</span>
                        </div>
                    </div>

                    {/* 3. Register New Patient */}
                    <PatientRegistrationForm onSuccess={handleRegistrationSuccess} />
                </div>

                {/* Right Column: Queue Display */}
                <div className="lg:col-span-2">
                    <QueueList queue={queue} setQueue={setQueue} />
                </div>
            </div>

            {/* Modals */}
            {showBookingModal && selectedPatient && (
                <AppointmentBookingModal
                    patient={selectedPatient}
                    onCancel={() => setShowBookingModal(false)}
                    onSuccess={handleBookingSuccess}
                />
            )}
        </div>
    );
}
