'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  Stethoscope,
  Users,
  FileText,
  CreditCard,
  Settings,
  Activity,
  LogOut,
  ChevronDown,
  Building2,
  ShieldCheck,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Appointments', href: '/appointments', icon: Calendar },
    { name: 'Doctors', href: '/doctors', icon: Stethoscope },
    { name: 'Patients', href: '/patients', icon: Users },
    { name: 'Medical Records', href: '/records', icon: FileText },
    { name: 'Payments', href: '/billing', icon: CreditCard },
    { name: 'Pricing', href: '/pricing', icon: Activity },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      <aside className="hidden lg:flex w-64 bg-slate-900 text-slate-300 flex-col shrink-0 h-screen sticky top-0 border-r border-slate-800 z-40 select-none">
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-teal-500 text-white flex items-center justify-center font-bold shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight block leading-none">
                CarePulse
              </span>
              <span className="text-[10px] text-teal-400 font-semibold tracking-wider uppercase">
                Clinic Suite
              </span>
            </div>
          </Link>
        </div>

        {/* Workspace Selector */}
        <div className="px-3 py-3 border-b border-slate-800/80">
          <div className="bg-slate-800/60 hover:bg-slate-800 p-2.5 rounded-xl border border-slate-700/60 flex items-center justify-between cursor-pointer transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="truncate text-xs">
                <p className="font-semibold text-slate-200 truncate leading-snug">Main Clinic Branch</p>
                <p className="text-[10px] text-slate-400 truncate">Metro City Workspace</p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Clinical Operations
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20 font-bold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-xs shrink-0 border border-indigo-500/30">
                {user ? user.name.charAt(0) : 'A'}
              </div>
              <div className="truncate text-xs">
                <p className="font-semibold text-slate-200 truncate leading-tight">
                  {user ? user.name : 'Dr. Arthur Vance'}
                </p>
                <span className="inline-flex items-center gap-1 text-[10px] text-teal-400 font-medium">
                  <ShieldCheck className="w-3 h-3" />
                  {user ? user.role.toUpperCase() : 'ADMIN'}
                </span>
              </div>
            </div>
            {user && (
              <button
                onClick={logout}
                title="Sign Out"
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex items-center justify-around pb-safe z-50 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] h-16 px-2">
        {navItems.slice(0, 5).map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
              <span className="text-[9px] font-semibold tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
