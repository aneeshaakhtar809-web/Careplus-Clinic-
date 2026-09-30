'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Search, Bell, Plus, UserPlus, CalendarPlus, Shield, Stethoscope, User } from 'lucide-react';
import { UserRole } from '@/types';

interface HeaderProps {
  title?: string;
  onOpenBookingModal?: () => void;
  onOpenPatientModal?: () => void;
}

export default function Header({ title = 'Dashboard', onOpenBookingModal, onOpenPatientModal }: HeaderProps) {
  const { user, login } = useAuth();

  const handleQuickRoleSwitch = async (role: UserRole) => {
    if (role === 'admin') {
      await login('admin@carepulse.com', 'admin123', 'admin');
    } else if (role === 'doctor') {
      await login('dr.sarah@carepulse.com', 'doctor123', 'doctor');
    } else {
      await login('patient@carepulse.com', 'patient123', 'patient');
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Title & Global Search */}
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>

        <div className="relative hidden md:block w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search patients, doctors, records..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
          />
        </div>
      </div>

      {/* Quick Actions & Role Indicator */}
      <div className="flex items-center gap-3">
        {/* Role Quick Switcher Pill */}
        <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-semibold">
          <span className="px-2 text-slate-400 font-bold uppercase tracking-wider text-[9px]">Role:</span>
          <button
            onClick={() => handleQuickRoleSwitch('admin')}
            className={`px-2 py-1 rounded-lg flex items-center gap-1 transition-all ${
              user?.role === 'admin' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3 h-3" /> Admin
          </button>
          <button
            onClick={() => handleQuickRoleSwitch('doctor')}
            className={`px-2 py-1 rounded-lg flex items-center gap-1 transition-all ${
              user?.role === 'doctor' ? 'bg-white text-teal-600 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-3 h-3" /> Doctor
          </button>
          <button
            onClick={() => handleQuickRoleSwitch('patient')}
            className={`px-2 py-1 rounded-lg flex items-center gap-1 transition-all ${
              user?.role === 'patient' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-3 h-3" /> Patient
          </button>
        </div>

        {/* Primary Action Buttons matching screenshot design */}
        {onOpenBookingModal && (
          <button
            onClick={onOpenBookingModal}
            className="clinic-btn-teal text-xs py-2 px-3.5 shadow-sm"
          >
            <CalendarPlus className="w-4 h-4" />
            <span className="hidden sm:inline">New Appointment</span>
          </button>
        )}

        {onOpenPatientModal && (
          <button
            onClick={onOpenPatientModal}
            className="clinic-btn-primary text-xs py-2 px-3.5 shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Patient</span>
          </button>
        )}

        {/* Notifications & Profile Icon */}
        <div className="flex items-center gap-2 border-l border-slate-200 pl-3 ml-1">
          <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl relative">
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-teal-500 absolute top-1.5 right-1.5 ring-2 ring-white"></span>
          </button>

          {!user ? (
            <Link
              href="/login"
              className="text-xs font-semibold text-teal-600 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-xl border border-teal-200"
            >
              Sign In
            </Link>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-xs shadow-xs">
              {user.name.charAt(0)}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
