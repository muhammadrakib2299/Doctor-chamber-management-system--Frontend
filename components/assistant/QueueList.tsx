'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { appointmentService } from '@/lib/services/appointmentService';
import toast from 'react-hot-toast';

interface QueueListProps {
    queue: any[];
    setQueue: (queue: any[]) => void;
}

export default function QueueList({ queue, setQueue }: QueueListProps) {

    // Status badges helper
    const getStatusBadge = (status: string) => {
        const styles: any = {
            waiting: 'bg-yellow-100 text-yellow-800',
            in_progress: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return (
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status] || 'bg-gray-100'}`}>
                {status.replace('_', ' ').toUpperCase()}
            </span>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Today's Queue</h2>
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">{queue.length}</span>
            </div>

            {queue.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                    No appointments for today yet.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SN</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {queue.map((apt) => (
                                <tr key={apt._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                        #{apt.serialNumber}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-900">{apt.patientId?.name || 'Unknown'}</span>
                                            <span className="text-xs text-gray-500">{apt.patientId?.phone}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(apt.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {apt.paymentStatus === 'paid' ? (
                                            <span className="text-green-600 font-medium">✓ Paid</span>
                                        ) : (
                                            <span className="text-orange-500 font-medium">Pending</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
