'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, LogIn, Lock, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';
import { loginSchema, type LoginFormData } from '@/lib/validations/authSchema';

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
    });

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        try {
            // 1. Call Login API
            const response = await api.post('/auth/login', {
                email: data.email,
                password: data.password,
            });

            const { user, token } = response.data.data;

            // 2. Update Store
            login(user, token);
            toast.success(`Welcome back, ${user.name}!`);

            // 3. Redirect based on Role
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
                    toast.error('Unknown role assigned to user');
            }
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            console.error('Login error:', err);
            const message = err.response?.data?.message || 'Invalid email or password';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-lg font-medium leading-6 text-slate-900">Sign in to your account</h3>
                <p className="mt-1 text-sm text-slate-500">
                    Enter your credentials to access the portal
                </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {/* Email Field */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                        Email address
                    </label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Mail className="h-4 w-4 text-slate-400" aria-hidden="true" />
                        </div>
                        <input
                            {...register('email')}
                            type="email"
                            id="email"
                            className={`block w-full rounded-md border py-2 pl-10 pr-3 focus:outline-none sm:text-sm ${errors.email
                                ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
                                : 'border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500'
                                }`}
                            placeholder="you@example.com"
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                </div>

                {/* Password Field */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                        Password
                    </label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Lock className="h-4 w-4 text-slate-400" aria-hidden="true" />
                        </div>
                        <input
                            {...register('password')}
                            type="password"
                            id="password"
                            className={`block w-full rounded-md border py-2 pl-10 pr-3 focus:outline-none sm:text-sm ${errors.password
                                ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
                                : 'border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500'
                                }`}
                            placeholder="••••••••"
                        />
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">
                            Remember me
                        </label>
                    </div>

                    <div className="text-sm">
                        <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                            Forgot password?
                        </a>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            <>
                                <LogIn className="mr-2 h-4 w-4" />
                                Sign in
                            </>
                        )}
                    </button>
                </div>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-slate-500">Demo Credentials</span>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-center text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                    <p className="font-semibold text-slate-700">Admin</p>
                    <p>admin@doctorchamber.com</p>
                    <p>Admin@123</p>
                </div>
                <div>
                    <p className="font-semibold text-slate-700">Doctor</p>
                    <p>doctor@example.com</p>
                    <p>Doctor@123</p>
                </div>
            </div>
        </div>
    );
}
