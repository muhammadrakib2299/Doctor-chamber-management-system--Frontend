'use client';

import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { prescriptionService, Medicine } from '@/lib/services/prescriptionService';
import toast from 'react-hot-toast';

// Schema Definition
const medicineSchema = z.object({
    name: z.string().min(1, 'Medicine name is required'),
    type: z.enum(['tablet', 'capsule', 'syrup', 'injection', 'ointment', 'drops', 'other']),
    dosage: z.string().min(1, 'Dosage is required (e.g. 1+0+1)'),
    timing: z.enum(['before_meal', 'after_meal', 'with_meal', 'empty_stomach', 'as_needed']),
    duration: z.string().min(1, 'Duration is required'),
    instructions: z.string().optional()
});

const prescriptionSchema = z.object({
    chiefComplaints: z.array(z.string()).optional(), // Handled manually for UI simplicity usually, but here array
    diagnosis: z.string().min(1, 'Diagnosis is required'),
    medicines: z.array(medicineSchema).min(1, 'At least one medicine is required'),
    advice: z.string().optional(),
    investigations: z.string().optional(), // Entered as comma separated string then split
    notes: z.string().optional(),
    followUpDate: z.string().optional()
});

interface Props {
    patient: any;
    appointmentId: string;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function CreatePrescription({ patient, appointmentId, onSuccess, onCancel }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(prescriptionSchema),
        defaultValues: {
            chiefComplaints: [] as string[],
            diagnosis: '',
            medicines: [{ name: '', type: 'tablet', dosage: '1+0+1', timing: 'after_meal', duration: '7 days', instructions: '' }],
            advice: '',
            investigations: '',
            notes: '',
            followUpDate: ''
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "medicines"
    });

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            // Process data for API
            const payload = {
                appointmentId,
                patientId: patient._id,
                diagnosis: data.diagnosis,
                medicines: data.medicines,
                advice: data.advice,
                // Split investigations string to array if present
                investigations: data.investigations ? data.investigations.split(',').map((s: string) => s.trim()) : [],
                chiefComplaints: data.chiefComplaints, // logic to capture C/C needed
                notes: data.notes,
                followUp: data.followUpDate ? { required: true, date: data.followUpDate } : undefined
            };

            await prescriptionService.createPrescription(payload as any);
            toast.success("Prescription created successfully!");
            onSuccess();
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to create prescription");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto border border-gray-200">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">New Prescription</h2>
                    <p className="text-gray-500 text-sm">Patient: <span className="font-semibold text-gray-700">{patient.name}</span> ({patient.age}y / {patient.gender})</p>
                </div>
                <button onClick={onCancel} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* Clinical Info Group */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-md">

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Diagnosis <span className="text-red-500">*</span></label>
                        <textarea
                            {...register('diagnosis')}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2"
                            rows={3}
                            placeholder="e.g. Viral Fever, Hypertension"
                        ></textarea>
                        {errors.diagnosis && <p className="text-red-500 text-xs mt-1">{String(errors.diagnosis.message)}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Investigations (Comma separated)</label>
                        <textarea
                            {...register('investigations')}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2"
                            rows={3}
                            placeholder="e.g. CBC, Lipid Profile, X-Ray Chest"
                        ></textarea>
                    </div>
                </div>

                {/* Medicines Section */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-gray-800">Medicines (Rx)</h3>
                        <button
                            type="button"
                            onClick={() => append({ name: '', type: 'tablet', dosage: '1+0+1', timing: 'after_meal', duration: '5 days', instructions: '' })}
                            className="text-sm bg-blue-100 text-blue-700 px-3 py-1.5 rounded hover:bg-blue-200 font-medium"
                        >
                            + Add Medicine
                        </button>
                    </div>

                    <div className="space-y-3">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex flex-wrap md:flex-nowrap gap-3 items-start border p-3 rounded-md bg-gray-50 relative group">
                                <div className="w-full md:w-3/12">
                                    <input
                                        {...register(`medicines.${index}.name` as const)}
                                        placeholder="Medicine Name"
                                        className="w-full border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 border p-2 text-sm"
                                    />
                                    {errors.medicines?.[index]?.name && <span className="text-red-500 text-xs">Required</span>}
                                </div>
                                <div className="w-1/2 md:w-2/12">
                                    <select {...register(`medicines.${index}.type` as const)} className="w-full border-gray-300 rounded border p-2 text-sm bg-white">
                                        <option value="tablet">Tablet</option>
                                        <option value="capsule">Capsule</option>
                                        <option value="syrup">Syrup</option>
                                        <option value="injection">Injection</option>
                                        <option value="ointment">Ointment</option>
                                    </select>
                                </div>
                                <div className="w-1/2 md:w-2/12">
                                    <input
                                        {...register(`medicines.${index}.dosage` as const)}
                                        placeholder="1+0+1"
                                        className="w-full border-gray-300 rounded border p-2 text-sm"
                                    />
                                </div>
                                <div className="w-1/2 md:w-2/12">
                                    <input
                                        {...register(`medicines.${index}.duration` as const)}
                                        placeholder="Dur. (e.g 7d)"
                                        className="w-full border-gray-300 rounded border p-2 text-sm"
                                    />
                                </div>
                                <div className="w-1/2 md:w-2/12">
                                    <select {...register(`medicines.${index}.timing` as const)} className="w-full border-gray-300 rounded border p-2 text-sm bg-white">
                                        <option value="after_meal">After Meal</option>
                                        <option value="before_meal">Before Meal</option>
                                        <option value="with_meal">With Meal</option>
                                        <option value="empty_stomach">Empty Stomach</option>
                                    </select>
                                </div>

                                <button type="button" onClick={() => remove(index)} className="text-red-500 hover:bg-red-50 p-2 rounded self-center">
                                    🗑
                                </button>
                            </div>
                        ))}
                    </div>
                    {errors.medicines && <p className="text-red-500 text-sm mt-2">{errors.medicines.message}</p>}
                </div>

                {/* Advice & Follow-up */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Advice / Instructions</label>
                        <textarea
                            {...register('advice')}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2"
                            rows={3}
                            placeholder="e.g. Drink plenty of water, Avoid oily food..."
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Follow Up Date (Optional)</label>
                        <input
                            type="date"
                            {...register('followUpDate')}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t mt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium disabled:bg-gray-400"
                    >
                        {isSubmitting ? 'Saving...' : 'Save & Print Prescription'}
                    </button>
                </div>
            </form>
        </div>
    );
}
