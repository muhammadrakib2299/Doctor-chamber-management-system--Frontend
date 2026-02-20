'use client';

import { useState } from 'react';
import { User, Lock, Loader2, Eye, EyeOff, Building2, Award, CreditCard, Shield } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const inputClass =
    'flex h-10 w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';
const readOnlyClass =
    'flex h-10 w-full rounded-md border border-slate-200 px-3 py-2 text-sm bg-slate-50 text-slate-500 cursor-not-allowed';

export default function DoctorSettingsPage() {
    const { user, updateUser } = useAuthStore();

    // ── Profile form state ──
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [specialization, setSpecialization] = useState(user?.doctorInfo?.specialization || '');
    const [qualification, setQualification] = useState(user?.doctorInfo?.qualification || '');
    const [registrationNumber, setRegistrationNumber] = useState(user?.doctorInfo?.registrationNumber || '');
    const [chamberName, setChamberName] = useState(user?.doctorInfo?.chamberName || '');
    const [chamberAddress, setChamberAddress] = useState(user?.doctorInfo?.chamberAddress || '');
    const [profileSaving, setProfileSaving] = useState(false);

    // ── Password section state ──
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);

    // ── Profile save handler ──
    const handleProfileSave = async () => {
        const trimmedName = name.trim();
        if (!trimmedName || trimmedName.length < 2) {
            toast.error('Name must be at least 2 characters');
            return;
        }

        setProfileSaving(true);
        try {
            const res = await api.put('/auth/update-details', {
                name: trimmedName,
                phone: phone.trim(),
                doctorInfo: {
                    specialization: specialization.trim(),
                    qualification: qualification.trim(),
                    registrationNumber: registrationNumber.trim(),
                    chamberName: chamberName.trim(),
                    chamberAddress: chamberAddress.trim(),
                },
            });
            updateUser(res.data.data);
            toast.success('Profile updated successfully');
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Failed to update profile';
            toast.error(msg);
        } finally {
            setProfileSaving(false);
        }
    };

    // ── Password change handler ──
    const handlePasswordChange = async () => {
        if (newPassword.length < 6) {
            toast.error('New password must be at least 6 characters');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setPasswordSaving(true);
        try {
            const res = await api.put('/auth/update-password', {
                currentPassword,
                newPassword,
            });

            // Update token if returned
            const token = res.data?.token;
            if (token) {
                if (localStorage.getItem('token')) {
                    localStorage.setItem('token', token);
                } else {
                    sessionStorage.setItem('token', token);
                }
            }

            toast.success('Password changed successfully');
            setShowPasswordSection(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            const status = err?.response?.status;
            if (status === 401 || status === 400) {
                toast.error('Current password is incorrect');
            } else {
                const msg = err?.response?.data?.message || 'Failed to change password';
                toast.error(msg);
            }
        } finally {
            setPasswordSaving(false);
        }
    };

    // ── Subscription helpers ──
    const sub = user?.subscription;
    const formatDate = (d?: string) => {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };
    const planLabel = (p?: string) => {
        if (!p) return '—';
        return p.charAt(0).toUpperCase() + p.slice(1);
    };

    return (
        <div className="max-w-4xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Settings</h1>
                <p className="text-sm text-slate-500">Manage your profile and practice preferences.</p>
            </div>

            {/* ═══ Personal Info ═══ */}
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                        <User className="h-4 w-4" /> Personal Information
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Full Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Email Address</label>
                            <input type="email" value={user?.email || ''} readOnly className={readOnlyClass} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Phone</label>
                            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Role</label>
                            <input
                                type="text"
                                value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}
                                readOnly
                                className={readOnlyClass}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ Practice Details ═══ */}
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                        <Building2 className="h-4 w-4" /> Practice Details
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Specialization</label>
                            <input
                                type="text"
                                value={specialization}
                                onChange={(e) => setSpecialization(e.target.value)}
                                className={inputClass}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Qualification</label>
                            <input
                                type="text"
                                value={qualification}
                                onChange={(e) => setQualification(e.target.value)}
                                className={inputClass}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Registration Number</label>
                            <input
                                type="text"
                                value={registrationNumber}
                                onChange={(e) => setRegistrationNumber(e.target.value)}
                                placeholder="e.g. BMDC-12345"
                                className={inputClass}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Chamber Name</label>
                            <input
                                type="text"
                                value={chamberName}
                                onChange={(e) => setChamberName(e.target.value)}
                                placeholder="Clinic / Practice name"
                                className={inputClass}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Chamber Address</label>
                        <textarea
                            value={chamberAddress}
                            onChange={(e) => setChamberAddress(e.target.value)}
                            rows={2}
                            placeholder="Full address of your chamber"
                            className="flex w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={handleProfileSave}
                            disabled={profileSaving}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
                        >
                            {profileSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

            {/* ═══ Security — Change Password ═══ */}
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                        <Lock className="h-4 w-4" /> Security
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    <button
                        onClick={() => setShowPasswordSection((v) => !v)}
                        className="text-sm font-medium text-blue-600 hover:underline"
                    >
                        {showPasswordSection ? 'Cancel Password Change' : 'Change Password'}
                    </button>

                    {showPasswordSection && (
                        <div className="space-y-4 pt-2">
                            {/* Current Password */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPw ? 'text' : 'password'}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className={inputClass + ' pr-10'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPw((v) => !v)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* New Password */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showNewPw ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className={inputClass + ' pr-10'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPw((v) => !v)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {newPassword.length > 0 && newPassword.length < 6 && (
                                    <p className="text-xs text-red-500">Must be at least 6 characters</p>
                                )}
                            </div>

                            {/* Confirm New Password */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Confirm New Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPw ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={inputClass + ' pr-10'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPw((v) => !v)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                                    <p className="text-xs text-red-500">Passwords do not match</p>
                                )}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={handlePasswordChange}
                                    disabled={passwordSaving}
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
                                >
                                    {passwordSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                                    Update Password
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ═══ Subscription Info ═══ */}
            {sub && (
                <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                            <CreditCard className="h-4 w-4" /> Subscription
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Plan</p>
                                <p className="text-sm font-semibold text-slate-900">{planLabel(sub.plan)}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Status</p>
                                <span
                                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                                        sub.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                    }`}
                                >
                                    <Shield className="h-3 w-3" />
                                    {sub.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Max Assistants</p>
                                <p className="text-sm font-semibold text-slate-900">{sub.maxAssistants ?? '—'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Start Date</p>
                                <p className="text-sm text-slate-700">{formatDate(sub.startDate)}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">End Date</p>
                                <p className="text-sm text-slate-700">{formatDate(sub.endDate)}</p>
                            </div>
                        </div>
                        <p className="mt-4 text-xs text-slate-400">Subscription is managed by your administrator.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
