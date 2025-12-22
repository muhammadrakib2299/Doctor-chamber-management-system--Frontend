'use client';

import { useState } from 'react';
import { patientService } from '@/lib/services/patientService';
import { useAuthStore } from '@/lib/store/authStore';
import toast from 'react-hot-toast';

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
            // Assuming assistant workflow
            const doctorId = user?.role === 'doctor' ? user.id : user?.doctorId;
            if (!doctorId) {
                toast.error("System Error: No doctor associated.");
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
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Search Patient</h2>
            <form onSubmit={handleSearch} className="flex gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter Phone Number or Patient ID"
                    className="flex-1 rounded-md border-gray-300 border p-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50"
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {hasSearched && (
                <div className="mt-4">
                    {results.length === 0 ? (
                        <p className="text-gray-500 text-center">No patients found.</p>
                    ) : (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {results.map((patient: any) => (
                                <div
                                    key={patient._id}
                                    className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                                    onClick={() => onSelect(patient)}
                                >
                                    <div>
                                        <p className="font-medium text-gray-900">{patient.name}</p>
                                        <p className="text-sm text-gray-500">ID: {patient.patientId} | 📞 {patient.phone}</p>
                                    </div>
                                    <button className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100">
                                        Select
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
