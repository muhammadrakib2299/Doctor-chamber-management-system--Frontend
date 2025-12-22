'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { appointmentService } from '@/lib/services/appointmentService';
import toast from 'react-hot-toast';

interface Props {
    patient: any;
    onCancel: () => void;
    onSuccess: () => void;
}

export default function AppointmentBookingModal({ patient, onCancel, onSuccess }: Props) {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);

    // Fee logic: simplified. In real app, check patient.patientType (new/old) and use doctor fee settings.
    const isNew = patient.patientType === 'new';
    const estimatedFee = isNew ? (patient.newPatientFee || 500) : (patient.oldPatientFee || 300);

    const [formData, setFormData] = useState({
        feeAmount: estimatedFee,
        bookingType: 'walk-in',
        paymentStatus: 'pending' // Default pending
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const doctorId = user?.role === 'doctor' ? user.id : user?.doctorId;

            const payload = {
                patientId: patient._id,
                doctorId,
                appointmentDate: new Date().toISOString(),
                bookingType: formData.bookingType as any,
                feeAmount: formData.feeAmount,
                feeType: (isNew ? 'new_patient' : 'old_patient') as 'new_patient' | 'old_patient',
                paymentMethod: 'cash' as 'cash',
                paymentStatus: formData.paymentStatus as any // 'pending' or 'paid'
            };

            await appointmentService.createAppointment(payload);
            toast.success("Appointment booked successfully!");
            onSuccess();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Booking failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Book Appointment</h3>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>

                <div className="mb-4 bg-blue-50 p-3 rounded text-sm text-blue-800">
                    <p><strong>Patient:</strong> {patient.name}</p>
                    <p><strong>ID:</strong> {patient.patientId}</p>
                    <p><strong>Type:</strong> {patient.patientType.toUpperCase()}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Consultation Fee (Cash)</label>
                        <input
                            type="number"
                            value={formData.feeAmount}
                            onChange={(e) => setFormData({ ...formData, feeAmount: Number(e.target.value) })}
                            className="mt-1 block w-full rounded-md border-gray-300 border p-2 bg-gray-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                        <select
                            value={formData.paymentStatus}
                            onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 border p-2"
                        >
                            <option value="pending">Pay Later (Pending)</option>
                            <option value="paid">Paid Now</option>
                        </select>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
                        >
                            {loading ? 'Booking...' : 'Confirm & Book'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
