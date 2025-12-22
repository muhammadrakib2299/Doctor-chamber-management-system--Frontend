import Link from 'next/link';
import {
  Stethoscope,
  ShieldCheck,
  Clock,
  Users,
  ChevronRight,
  Activity,
  CalendarCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-600 p-2 text-white">
              <Activity className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">MedCore</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-blue-600">How it Works</a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-blue-600">Pricing</a>
          </div>
          <Link
            href="/auth/login"
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            Login Portal
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent opacity-70"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 mb-6 border border-blue-100">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">New: Smart Prescriptions</span>
          </div>
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl mb-6">
            Everything you need to run your <span className="text-blue-600">Doctor Chamber</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600 mb-10 leading-relaxed">
            Streamline patient management, automate prescriptions, and manage appointments effortlessly.
            Designed for modern healthcare professionals who value time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/login"
              className="flex items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-base font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5"
            >
              Get Started Now <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="#demo"
              className="flex items-center justify-center rounded-full bg-white border border-slate-200 px-8 py-3 text-base font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300"
            >
              View Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Role Navigation Cards (For Quick Access) */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">Access Your Portal</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Link href="/auth/login" className="group rounded-2xl border border-slate-100 bg-slate-50 p-6 transition-all hover:border-blue-200 hover:bg-blue-50 hover:shadow-md">
              <div className="mb-4 inline-flex rounded-xl bg-blue-100 p-3 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Stethoscope className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Doctor Portal</h3>
              <p className="mt-2 text-sm text-slate-600">Prepare prescriptions, view history, and manage your daily queue.</p>
            </Link>

            <Link href="/auth/login" className="group rounded-2xl border border-slate-100 bg-slate-50 p-6 transition-all hover:border-green-200 hover:bg-green-50 hover:shadow-md">
              <div className="mb-4 inline-flex rounded-xl bg-green-100 p-3 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Assistant Portal</h3>
              <p className="mt-2 text-sm text-slate-600">Register patients, manage serials, and print payment receipts.</p>
            </Link>

            <Link href="/auth/login" className="group rounded-2xl border border-slate-100 bg-slate-50 p-6 transition-all hover:border-purple-200 hover:bg-purple-50 hover:shadow-md">
              <div className="mb-4 inline-flex rounded-xl bg-purple-100 p-3 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Admin Console</h3>
              <p className="mt-2 text-sm text-slate-600">Manage doctors, subscription plans, and platform settings.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Platform Features</h2>
            <p className="mt-4 text-lg text-slate-600">Everything you need to modernize your medical practice.</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Smart Prescriptions',
                desc: 'Create detailed prescriptions in seconds with auto-suggestion and templates.',
                icon: Stethoscope
              },
              {
                title: 'Real-time Queue',
                desc: 'Live patient queue tracking shown on external displays for waiting rooms.',
                icon: Clock
              },
              {
                title: 'Online Appointment',
                desc: 'Allow patients to book slots online seamlessly from their mobile devices.',
                icon: CalendarCheck
              }
            ].map((feature, i) => (
              <div key={i} className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <feature.icon className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-500" />
            <span className="text-xl font-bold text-white">MedCore</span>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} MedCore Systems. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
