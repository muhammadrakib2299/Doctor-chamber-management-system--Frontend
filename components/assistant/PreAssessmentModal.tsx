'use client';

import { useState, useEffect } from 'react';
import { appointmentService } from '@/lib/services/appointmentService';
import toast from 'react-hot-toast';
import {
    X,
    Heart,
    Thermometer,
    Weight,
    Ruler,
    Activity,
    MessageSquare,
    Save,
    Loader2,
    Stethoscope
} from 'lucide-react';
import { QueueItem } from '@/lib/types';

interface PreAssessmentModalProps {
    item: QueueItem;
    onClose: () => void;
    onSuccess: (updatedItem: QueueItem) => void;
}

export default function PreAssessmentModal({ item, onClose, onSuccess }: PreAssessmentModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        bloodPressure: item.preAssessment?.bloodPressure || '',
        temperature: item.preAssessment?.temperature || '',
        weight: item.preAssessment?.weight || '',
        height: item.preAssessment?.height || '',
        pulse: item.preAssessment?.pulse || '',
        chiefComplaint: item.preAssessment?.chiefComplaint || '',
        notes: item.preAssessment?.notes || '',
    });

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await appointmentService.updateAppointment(item._id, {
                preAssessment: formData,
            });
            toast.success('Pre-assessment saved successfully!');
            onSuccess({ ...item, preAssessment: formData });
        } catch {
            toast.error('Failed to save pre-assessment');
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const vitalsFields = [
        { key: 'bloodPressure', label: 'Blood Pressure', placeholder: '120/80 mmHg', icon: Heart, unit: 'mmHg' },
        { key: 'temperature', label: 'Temperature', placeholder: '98.6', icon: Thermometer, unit: 'F' },
        { key: 'pulse', label: 'Pulse Rate', placeholder: '72', icon: Activity, unit: 'bpm' },
        { key: 'weight', label: 'Weight', placeholder: '70', icon: Weight, unit: 'kg' },
        { key: 'height', label: 'Height', placeholder: '170', icon: Ruler, unit: 'cm' },
    ];

    return (
        <div
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            role="dialog"
            aria-modal="true"
        >
            <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-teal-600 to-emerald-700 p-8 shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                                <Stethoscope className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white">Pre-Assessment</h2>
                                <p className="text-teal-100 text-xs font-bold uppercase tracking-widest mt-0.5">
                                    Serial #{item.serialNumber} &middot; {item.patientId?.name}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2.5 hover:bg-white/10 rounded-xl transition-colors" aria-label="Close">
                            <X className="h-6 w-6 text-white/70" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                    {/* Vitals Grid */}
                    <div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Heart className="h-3 w-3" /> Vital Signs
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            {vitalsFields.map((field) => (
                                <div key={field.key} className="group">
                                    <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
                                        {field.label}
                                    </label>
                                    <div className="relative">
                                        <field.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                                        <input
                                            type="text"
                                            value={formData[field.key as keyof typeof formData]}
                                            onChange={(e) => updateField(field.key, e.target.value)}
                                            placeholder={field.placeholder}
                                            className="w-full pl-10 pr-12 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-bold text-slate-700 text-sm"
                                        />
                                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                                            {field.unit}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chief Complaint */}
                    <div className="group">
                        <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1 flex items-center gap-2">
                            <MessageSquare className="h-3 w-3" /> Chief Complaint
                        </label>
                        <textarea
                            value={formData.chiefComplaint}
                            onChange={(e) => updateField('chiefComplaint', e.target.value)}
                            placeholder="Patient's primary complaint or reason for visit..."
                            rows={3}
                            className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-medium text-sm resize-none"
                        />
                    </div>

                    {/* Notes */}
                    <div className="group">
                        <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
                            Additional Notes
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => updateField('notes', e.target.value)}
                            placeholder="Any additional observations..."
                            rows={2}
                            className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-medium text-sm resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 px-6 rounded-2xl border border-slate-200 text-sm font-black text-slate-600 hover:bg-slate-50 transition-all active:scale-[0.98]"
                        >
                            Skip
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-teal-600 text-sm font-black text-white shadow-xl shadow-teal-200 hover:bg-teal-700 hover:shadow-teal-300 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    <Save className="h-5 w-5" />
                                    <span>Save Assessment</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
