'use client';

import { useState } from 'react';
import { patientService } from '@/lib/services/patientService';
import { useAuthStore } from '@/lib/store/authStore';
import toast from 'react-hot-toast';
import { Search, User, Phone, Fingerprint, ChevronRight, Loader2, Sparkles } from 'lucide-react';

interface SearchPatientProps {
    onSelect: (patient: any) => void;
}

export default function SearchPatient({ onSelect }: SearchPatientProps) {
    const { user } = useAuthStore();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setHasSearched(true);
        try {
            const doctorId = user?.role === 'doctor' ? (user.id || user._id) : user?.doctorId;
            if (!doctorId) {
                toast.error("Doctor association not found.");
                return;
            }

            const res = await patientService.searchPatients(query, doctorId);
            setResults(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Search failed");
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden group transition-all hover:shadow-2xl">
            <div className="p-6">
                <form onSubmit={handleSearch} className="relative group/field">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-slate-50 group-focus-within/field:bg-blue-50 rounded-xl transition-colors">
                        <Search className="h-5 w-5 text-slate-400 group-focus-within/field:text-blue-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by Mobile or Patient ID..."
                        className="w-full pl-16 pr-32 py-5 rounded-[1.5rem] bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-bold text-slate-700 placeholder:text-slate-400 outline-none"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 shadow-lg shadow-slate-200 hover:shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
                    </button>
                </form>

                {hasSearched && (
                    <div className="mt-6 animate-in fade-in slide-in-from-top-4 duration-300">
                        {results.length === 0 ? (
                            <div className="p-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                <Sparkles className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                                <p className="text-sm font-bold text-slate-400">No matching patient files</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-3 max-h-[340px] overflow-y-auto pr-2 custom-scrollbar">
                                {results.map((patient: any) => (
                                    <div
                                        key={patient._id}
                                        className="group/item flex items-center justify-between p-5 bg-white border border-slate-100 rounded-3xl hover:border-blue-400 hover:bg-blue-50/30 cursor-pointer transition-all active:scale-[0.99]"
                                        onClick={() => onSelect(patient)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:bg-blue-500 group-hover/item:text-white transition-all">
                                                <User className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-extrabold text-slate-900 leading-none mb-1.5">{patient.name}</h4>
                                                <div className="flex items-center gap-3">
                                                    <span className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                                        <Fingerprint className="h-3 w-3 mr-1" /> {patient.patientId}
                                                    </span>
                                                    <span className="h-1 w-1 rounded-full bg-slate-200"></span>
                                                    <span className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                                        <Phone className="h-3 w-3 mr-1" /> {patient.phone}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-2 bg-slate-50 rounded-xl group-hover/item:bg-blue-100 text-slate-300 group-hover/item:text-blue-600 transition-all">
                                            <ChevronRight className="h-5 w-5" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
            {!hasSearched && (
                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center gap-2">
                    <Sparkles className="h-3 w-3 text-blue-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Global Database Access Active</span>
                </div>
            )}
        </div>
    );
}
