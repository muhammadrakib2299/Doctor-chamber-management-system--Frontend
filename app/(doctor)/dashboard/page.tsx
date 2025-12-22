'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { appointmentService } from '@/lib/services/appointmentService';
import CreatePrescription from '@/components/doctor/CreatePrescription';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

export default function DoctorDashboard() {
    const { user } = useAuthStore();
    const [queue, setQueue] = useState<any[]>([]);
    const [currentPatient, setCurrentPatient] = useState<any>(null); // The patient currently being treated
    const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Fetch active queue
    useEffect(() => {
        const fetchQueue = async () => {
            if (!user?.id) return;
            try {
                const res = await appointmentService.getTodayQueue(user.id);
                setQueue(res.data);
            } catch (error) {
                console.error("Failed to fetch queue");
            }
        };
        fetchQueue();
    }, [user, refreshTrigger]);

    // Socket.IO
    useEffect(() => {
        if (!user?.id) return;
        const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000');

        socket.on('connect', () => {
            socket.emit('join-doctor-room', user.id);
        });

        socket.on('queue-update', () => {
            setRefreshTrigger(prev => prev + 1);
        });

        return () => {
            socket.disconnect();
        };
    }, [user]);

    const startConsultation = async (appointment: any) => {
        try {
            // Update status to in_progress
            await appointmentService.updateAppointment(appointment._id, { status: 'in_progress' });
            setCurrentPatient(appointment);
            setShowPrescriptionForm(false); // Reset view
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            toast.error("Failed to start consultation");
        }
    };

    const handlePrescriptionSuccess = () => {
        setShowPrescriptionForm(false);
        setCurrentPatient(null);
        setRefreshTrigger(prev => prev + 1);
        toast.success("Consultation completed.");
    };

    const handleBackToQueue = () => {
        setCurrentPatient(null);
    };

    // Derived active vs waiting
    const activeAppointment = queue.find(a => a.status === 'in_progress');
    const waitingQueue = queue.filter(a => a.status === 'waiting');

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Doctor Dashboard</h1>
                    <p className="text-gray-500">Welcome, Dr. {user?.name}</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow border text-center">
                    <span className="block text-2xl font-bold text-blue-600">{waitingQueue.length}</span>
                    <span className="text-xs text-gray-500 uppercase font-semibold">Waiting</span>
                </div>
            </header>

            {/* If currently treating a patient (either Active in Queue or Selected Manually) */}
            {(currentPatient || activeAppointment) ? (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 min-h-[600px] flex flex-col">
                    {/* Patient Header */}
                    <div className="bg-blue-600 text-white p-6 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold">Currently Treating: {(currentPatient || activeAppointment).patientId?.name}</h2>
                            <p className="text-blue-100 text-sm">
                                {(currentPatient || activeAppointment).patientId?.age} Years • {(currentPatient || activeAppointment).patientId?.gender} • ID: {(currentPatient || activeAppointment).patientId?.patientId}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            {!showPrescriptionForm && (
                                <button
                                    onClick={() => setShowPrescriptionForm(true)}
                                    className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold shadow hover:bg-gray-100 transition"
                                >
                                    ✍ Write Prescription
                                </button>
                            )}
                            <button
                                onClick={handleBackToQueue} // Just hide view, doesn't end appt
                                className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800"
                            >
                                Back to Queue
                            </button>
                        </div>
                    </div>

                    <div className="p-6 flex-1">
                        {showPrescriptionForm ? (
                            <CreatePrescription
                                patient={(currentPatient || activeAppointment).patientId}
                                appointmentId={(currentPatient || activeAppointment)._id}
                                onSuccess={handlePrescriptionSuccess}
                                onCancel={() => setShowPrescriptionForm(false)}
                            />
                        ) : (
                            <div className="text-center py-20">
                                <div className="inline-block p-6 rounded-full bg-blue-50 mb-4">
                                    <span className="text-4xl">🩺</span>
                                </div>
                                <h3 className="text-xl font-medium text-gray-800 mb-2">Consultation in Progress</h3>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    Review patient details, history, or click <b>"Write Prescription"</b> to begin documentation.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* Main Queue View */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                                <h3 className="font-semibold text-gray-700">Patient Queue</h3>
                            </div>
                            {waitingQueue.length === 0 ? (
                                <div className="p-12 text-center text-gray-500">
                                    No patients waiting. Time for a coffee? ☕
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {waitingQueue.map((apt) => (
                                        <div key={apt._id} className="p-4 flex items-center justify-between hover:bg-blue-50 transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                                                    {apt.serialNumber}
                                                </span>
                                                <div>
                                                    <p className="font-medium text-gray-900">{apt.patientId?.name}</p>
                                                    <p className="text-xs text-gray-500">{apt.patientId?.gender}, {apt.patientId?.age}y</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => startConsultation(apt)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-700"
                                            >
                                                Call Patient
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        {/* Summary / Stats / Quick Actions placeholder */}
                        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-lg shadow-lg p-6 text-white mb-6">
                            <h3 className="font-bold text-lg mb-2">Queue Status</h3>
                            <div className="flex justify-between items-end mt-4">
                                <div>
                                    <span className="text-3xl font-bold">{queue.filter(a => a.status === 'completed').length}</span>
                                    <p className="text-purple-200 text-sm">Completed</p>
                                </div>
                                <div>
                                    <span className="text-3xl font-bold">{queue.length}</span>
                                    <p className="text-purple-200 text-sm">Total Today</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
