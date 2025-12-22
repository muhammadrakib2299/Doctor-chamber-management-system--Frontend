'use client';

import { Check, CreditCard, Shield } from 'lucide-react';

export default function AdminSubscriptionsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Subscription & Billing</h1>
                <p className="text-sm text-slate-500">Manage your subscription plan and payment methods.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Current Plan */}
                <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-6 lg:col-span-2">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-semibold text-slate-900">Professional Plan</h2>
                                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">Active</span>
                            </div>
                            <p className="mt-1 text-sm text-slate-600">Your next billing date is January 15, 2025</p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-slate-900">$49<span className="text-sm font-normal text-slate-500">/mo</span></div>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-slate-900">Plan Features</h3>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-600" /> Unlimited Patients
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-600" /> Advanced Analytics
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-600" /> Priority Support
                                </li>
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-slate-900">Usage</h3>
                            <div className="space-y-2">
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                        <span>Storage</span>
                                        <span className="font-medium">45% used</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-blue-100">
                                        <div className="h-2 w-[45%] rounded-full bg-blue-600"></div>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                        <span>SMS Credits</span>
                                        <span className="font-medium">850/1000</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-blue-100">
                                        <div className="h-2 w-[85%] rounded-full bg-blue-600"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-3">
                        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                            Upgrade Plan
                        </button>
                        <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                            Cancel Subscription
                        </button>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Payment Method</h2>
                    <div className="rounded-lg border border-slate-200 p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                                <CreditCard className="h-5 w-5 text-slate-600" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">•••• 4242</p>
                                <p className="text-xs text-slate-500">Expires 12/28</p>
                            </div>
                        </div>
                    </div>
                    <button className="mt-4 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50">
                        Update Payment Method
                    </button>
                </div>
            </div>

            {/* Billing History */}
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900">Billing History</h2>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                        <tr>
                            <th className="px-6 py-3 font-medium">Invoice</th>
                            <th className="px-6 py-3 font-medium">Date</th>
                            <th className="px-6 py-3 font-medium">Amount</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium text-right">Download</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50">
                            <td className="px-6 py-4 font-medium text-slate-900">INV-2024-001</td>
                            <td className="px-6 py-4 text-slate-500">Dec 15, 2024</td>
                            <td className="px-6 py-4 text-slate-900">$49.00</td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                                    Paid
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-blue-600 hover:underline">PDF</button>
                            </td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                            <td className="px-6 py-4 font-medium text-slate-900">INV-2023-012</td>
                            <td className="px-6 py-4 text-slate-500">Nov 15, 2024</td>
                            <td className="px-6 py-4 text-slate-900">$49.00</td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                                    Paid
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-blue-600 hover:underline">PDF</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
