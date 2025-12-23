'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Mail, ArrowRight, ArrowLeft, Activity } from 'lucide-react';
import { toast } from 'react-hot-toast';

const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // In a real app, call: await api.post('/auth/forgot-password', { email: data.email });

            setSubmitted(true);
            toast.success('Reset link sent to your email!');
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Left Side - Brand & Aesthetic (Same as Login) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 opacity-90"></div>
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
                            Recover your<br />
                            <span className="text-blue-200">account access.</span>
                        </h1>
                        <p className="text-xl text-blue-100/90 leading-relaxed font-medium">
                            Don't worry, happens to the best of us. We'll get you back to your patients in no time.
                        </p>
                    </div>
                    <div className="flex items-center gap-6 text-sm font-medium text-blue-200/60">
                        <span>© 2025 MedCore</span>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <Link href="/auth/login" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 mb-6 transition-colors">
                            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Login
                        </Link>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Forgot Password?</h2>
                        <p className="mt-2 text-slate-500">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    {!submitted ? (
                        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        Send Reset Link <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center space-y-4">
                            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <Mail className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-green-900">Check your email</h3>
                            <p className="text-green-700">
                                We've sent a password reset link to your email address. Please follow the instructions to reset your password.
                            </p>
                            <Link
                                href="/auth/login"
                                className="inline-block mt-4 text-sm font-medium text-green-700 hover:text-green-800 underline underline-offset-4"
                            >
                                Return to Sign In
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
