'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Activity, Shield, Stethoscope, User, Lock, Mail, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { UserRole } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [role, setRole] = useState<UserRole>('patient');
  const [email, setEmail] = useState('patient@carepulse.com');
  const [password, setPassword] = useState('patient123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [seedingStatus, setSeedingStatus] = useState<string | null>(null);

  const fillCredentials = (targetRole: UserRole) => {
    setRole(targetRole);
    setError('');
    if (targetRole === 'admin') {
      setEmail('admin@carepulse.com');
      setPassword('admin123');
    } else if (targetRole === 'doctor') {
      setEmail('dr.sarah@carepulse.com');
      setPassword('doctor123');
    } else {
      setEmail('patient@carepulse.com');
      setPassword('patient123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password, role);
    if (!result.success) {
      setError(result.error || 'Failed to sign in. Please check your credentials.');
      setLoading(false);
    } else {
      if (role === 'admin') {
        router.push('/admin/dashboard');
      } else if (role === 'doctor') {
        router.push('/doctor/dashboard');
      } else {
        router.push('/patient/dashboard');
      }
    }
  };

  const handleQuickSeed = async () => {
    setSeedingStatus('Seeding demo database...');
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSeedingStatus('Database seeded successfully! Try logging in now.');
        setTimeout(() => setSeedingStatus(null), 5000);
      } else {
        setSeedingStatus(`Seeding error: ${data.error}`);
      }
    } catch {
      setSeedingStatus('Failed to connect to seed endpoint. Ensure database is running.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/60 via-slate-50 to-teal-50/40 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Activity className="w-7 h-7" />
          </div>
          <div className="text-left">
            <span className="text-2xl font-bold tracking-tight text-slate-900 block leading-tight">
              Care<span className="text-teal-600">Pulse</span>
            </span>
            <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
              Medical Clinic Suite
            </span>
          </div>
        </Link>
        <h2 className="mt-6 text-2xl font-bold text-slate-900 tracking-tight">
          Sign in to your account
        </h2>
        <p className="mt-1.5 text-sm text-slate-600">
          Access your clinical dashboard, records, and appointments
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-lg shadow-slate-200/60 rounded-2xl border border-slate-200/80">
          {/* Role Tabs */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Select Portal Role
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => fillCredentials('patient')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                  role === 'patient'
                    ? 'bg-white text-blue-600 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Patient
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('doctor')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                  role === 'doctor'
                    ? 'bg-white text-teal-600 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                Doctor
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('admin')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                  role === 'admin'
                    ? 'bg-white text-indigo-600 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Admin
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-sm text-red-700">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {seedingStatus && (
            <div className="mb-5 p-3.5 rounded-xl bg-teal-50 border border-teal-200 flex items-start gap-2.5 text-sm text-teal-800">
              <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <span>{seedingStatus}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md shadow-blue-500/20 disabled:opacity-60 transition-colors"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Signing in...
                  </span>
                ) : (
                  <>
                    Sign In to {role.charAt(0).toUpperCase() + role.slice(1)} Portal
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Credentials Guide */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Demo Accounts
              </span>
              <button
                type="button"
                onClick={handleQuickSeed}
                className="text-xs font-medium text-teal-600 hover:text-teal-700 underline"
              >
                Seed / Reset DB
              </button>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
              <button
                type="button"
                onClick={() => fillCredentials('admin')}
                className="p-1.5 rounded-lg bg-indigo-50/70 hover:bg-indigo-100/70 text-indigo-700 transition-colors"
              >
                Admin (Vance)
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('doctor')}
                className="p-1.5 rounded-lg bg-teal-50/70 hover:bg-teal-100/70 text-teal-700 transition-colors"
              >
                Doctor (Dr. Sarah)
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('patient')}
                className="p-1.5 rounded-lg bg-blue-50/70 hover:bg-blue-100/70 text-blue-700 transition-colors"
              >
                Patient (Eleanor)
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-slate-600">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Register as Patient
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
