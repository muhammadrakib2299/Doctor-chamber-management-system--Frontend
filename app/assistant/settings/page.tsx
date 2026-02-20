'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import {
    User,
    Lock,
    Loader2,
    Eye,
    EyeOff,
    Phone,
    Mail,
    Save,
    Shield,
    Stethoscope
} from 'lucide-react';

export default function AssistantSettingsPage() {
    const { user, updateUser } = useAuthStore();

    // Profile
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [profileSaving, setProfileSaving] = useState(false);

    // Password
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);

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
            });
            updateUser(res.data.data);
            toast.success('Profile updated successfully');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setProfileSaving(false);
        }
    };

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
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Failed to change password');
        } finally {
            setPasswordSaving(false);
        }
    };

    return (
        <div className="space-y-8 pb-10 max-w-3xl">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">Settings</h1>
                <p className="text-slate-500 font-medium text-sm mt-1">Manage your profile and security preferences</p>
            </div>

            {/* Profile Section */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-xl">
                        <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-800">Personal Information</h3>
                        <p className="text-xs text-slate-400 font-bold">Update your name and contact details</p>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    {/* Name */}
                    <div className="group">
                        <label className="block text-xs font-black text-slate-600 mb-2 ml-1 uppercase tracking-wider">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-11 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                            />
                        </div>
                    </div>

                    {/* Email (read-only) */}
                    <div>
                        <label className="block text-xs font-black text-slate-600 mb-2 ml-1 uppercase tracking-wider">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="w-full pl-11 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed font-bold"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="group">
                        <label className="block text-xs font-black text-slate-600 mb-2 ml-1 uppercase tracking-wider">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="01XXX XXXXXX"
                                className="w-full pl-11 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                            />
                        </div>
                    </div>

                    {/* Role & Doctor Info (read-only) */}
                    <div className="p-5 bg-blue-50/50 rounded-3xl border border-blue-100/50">
                        <h5 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Stethoscope className="h-3 w-3" /> Assignment Details
                        </h5>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Role</p>
                                <p className="text-sm font-bold text-slate-700 capitalize mt-0.5">{user?.role}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Doctor ID</p>
                                <p className="text-sm font-bold text-slate-700 mt-0.5">{user?.doctorId || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Account Status</p>
                                <p className={`text-sm font-bold mt-0.5 ${user?.isActive ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {user?.isActive ? 'Active' : 'Inactive'}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Last Login</p>
                                <p className="text-sm font-bold text-slate-700 mt-0.5">
                                    {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            onClick={handleProfileSave}
                            disabled={profileSaving}
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl text-sm font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 active:scale-[0.98]"
                        >
                            {profileSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

            {/* Security Section */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-50 rounded-xl">
                            <Shield className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-800">Security</h3>
                            <p className="text-xs text-slate-400 font-bold">Change your password</p>
                        </div>
                    </div>
                    {!showPasswordSection && (
                        <button
                            onClick={() => setShowPasswordSection(true)}
                            className="px-5 py-2.5 text-xs font-black text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-xl transition-all uppercase tracking-wider"
                        >
                            Change Password
                        </button>
                    )}
                </div>

                {showPasswordSection && (
                    <div className="p-8 space-y-6">
                        {/* Current Password */}
                        <div className="group">
                            <label className="block text-xs font-black text-slate-600 mb-2 ml-1 uppercase tracking-wider">Current Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type={showCurrentPw ? 'text' : 'password'}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Enter current password"
                                    className="w-full pl-11 pr-12 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="group">
                            <label className="block text-xs font-black text-slate-600 mb-2 ml-1 uppercase tracking-wider">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type={showNewPw ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Minimum 6 characters"
                                    className="w-full pl-11 pr-12 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPw(!showNewPw)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="group">
                            <label className="block text-xs font-black text-slate-600 mb-2 ml-1 uppercase tracking-wider">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type={showConfirmPw ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Repeat new password"
                                    className="w-full pl-11 pr-12 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPw(!showConfirmPw)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-2">
                            <button
                                onClick={() => {
                                    setShowPasswordSection(false);
                                    setCurrentPassword('');
                                    setNewPassword('');
                                    setConfirmPassword('');
                                }}
                                className="flex-1 py-4 px-6 rounded-2xl border border-slate-200 text-sm font-black text-slate-600 hover:bg-slate-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePasswordChange}
                                disabled={passwordSaving || !currentPassword || !newPassword || !confirmPassword}
                                className="flex-[2] flex items-center justify-center gap-2 py-4 px-6 bg-amber-600 text-white rounded-2xl text-sm font-black hover:bg-amber-700 transition-all shadow-lg shadow-amber-200 disabled:opacity-50 active:scale-[0.98]"
                            >
                                {passwordSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-5 w-5" />}
                                Update Password
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
