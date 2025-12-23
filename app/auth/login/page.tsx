'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, LogIn, Lock, Mail, Activity, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';
import { loginSchema, type LoginFormData } from '@/lib/validations/authSchema';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuthStore();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: true
        }
    });

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        try {
            const response = await api.post('/auth/login', {
                email: data.email,
                password: data.password,
            });

            const { user, token } = response.data.data;
            login(user, token, data.rememberMe);
            toast.success(`Welcome back, ${user.name}!`);

            switch (user.role) {
                case 'admin':
                    router.push('/admin/dashboard');
                    break;
                case 'doctor':
                    router.push('/doctor/dashboard');
                    break;
                case 'assistant':
                    router.push('/assistant/dashboard');
                    break;
                default:
                    toast.error('Unknown role, contact support.');
            }
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            console.error('Login error:', err);
            // Fallback for demo if API fails
            if (process.env.NODE_ENV === 'development') {
                toast.error('API Error. Attempting Mock Login...');
                // Simulation logic could go here if needed, but for now we stick to error
            }
            const message = err.response?.data?.message || 'Invalid credentials. Please try again.';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Left Side - Brand & Aesthetic */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 opacity-90"></div>

                {/* Abstract Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:32px_32px]"></div>

                <div className="relative z-10 flex flex-col justify-between p-16 text-white h-full">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-white/10 p-2.5 backdrop-blur-md border border-white/20 shadow-xl">
                            <Activity className="h-8 w-8 text-blue-100" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white/95">MedCore</span>
                    </div>

                    <div className="space-y-8 max-w-lg">
                        <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white drop-shadow-sm">
                            Run your practice<br />
                            <span className="text-blue-200">like clockwork.</span>
                        </h1>
                        <p className="text-xl text-blue-100/90 leading-relaxed font-medium">
                            The all-in-one platform for modern doctor chambers. Streamline appointments, manage queues, and focus on care.
                        </p>
                    </div>

                    <div className="flex items-center gap-6 text-sm font-medium text-blue-200/60">
                        <span className="hover:text-white transition-colors cursor-pointer">© 2025 MedCore</span>
                        <span className="h-1 w-1 rounded-full bg-blue-400/50"></span>
                        <span className="hover:text-white transition-colors cursor-pointer">Privacy</span>
                        <span className="h-1 w-1 rounded-full bg-blue-400/50"></span>
                        <span className="hover:text-white transition-colors cursor-pointer">Terms</span>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <div className="inline-flex lg:hidden items-center gap-2 mb-8">
                            <div className="rounded-lg bg-blue-600 p-2 text-white">
                                <Activity className="h-6 w-6" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-900">MedCore</span>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome Back</h2>
                        <p className="mt-2 text-slate-500">
                            Please enter your details to sign in.
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        {...register('email')}
                                        type="email"
                                        className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow ${errors.email ? 'border-red-300 focus:ring-red-500' : 'border-slate-200'}`}
                                        placeholder="doctor@example.com"
                                    />
                                </div>
                                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-sm font-medium text-slate-700">Password</label>
                                    <Link href="/auth/forgot-password" className="text-xs font-medium text-blue-600 hover:text-blue-500">
                                        Forgot Password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        {...register('password')}
                                        type="password"
                                        className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow ${errors.password ? 'border-red-300 focus:ring-red-500' : 'border-slate-200'}`}
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                {...register('rememberMe')}
                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
                                Remember me for 30 days
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    Sign in <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mt-6">
                        <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wide text-center">Demo Accounts (For Testing)</p>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs p-2 bg-white rounded border border-slate-100">
                                <span className="font-semibold text-slate-700 w-16">Admin</span>
                                <div className="text-right">
                                    <p className="text-slate-600 font-medium">admin@gmail.com</p>
                                    <p className="text-slate-400">password123</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-xs p-2 bg-white rounded border border-slate-100">
                                <span className="font-semibold text-slate-700 w-16">Doctor</span>
                                <div className="text-right">
                                    <p className="text-slate-600 font-medium">doctor@gmail.com</p>
                                    <p className="text-slate-400">password123</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-xs p-2 bg-white rounded border border-slate-100">
                                <span className="font-semibold text-slate-700 w-16">Assistant</span>
                                <div className="text-right">
                                    <p className="text-slate-600 font-medium">assistant@gmail.com</p>
                                    <p className="text-slate-400">password123</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
