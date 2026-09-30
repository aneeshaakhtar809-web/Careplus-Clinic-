'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Settings, Building2, Phone, Mail, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    clinicName: 'CarePulse Medical & Specialty Clinic',
    tagline: 'Precision Care, Modern Telehealth & Patient-First Medicine',
    contactEmail: 'contact@carepulse-medical.com',
    contactPhone: '+1 (555) 234-5678',
    emergencyPhone: '+1 (555) 911-HELP',
    address: '742 Evergreen Healthcare Blvd, Suite 400, Metro City, NY 10016',
    weekdayHours: '08:00 AM - 08:00 PM',
    weekendHours: '09:00 AM - 04:00 PM',
    slotDuration: '30',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Clinic Settings" />

        <main className="p-6 md:p-8 space-y-6 flex-1 max-w-4xl">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Clinic Configuration</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Operating hours, emergency contact channels, and appointment parameters
            </p>
          </div>

          {saved && (
            <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 flex items-center gap-2.5 text-xs text-teal-800 font-medium">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Clinic settings saved successfully!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="clinic-card p-6 bg-white space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-teal-600" /> Clinic Identity &amp; Branding
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Clinic Name
                  </label>
                  <input
                    type="text"
                    value={form.clinicName}
                    onChange={(e) => setForm({ ...form, clinicName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={form.tagline}
                    onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-teal-600" /> Contact &amp; Emergency Lines
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Front Desk Phone
                  </label>
                  <input
                    type="text"
                    value={form.contactPhone}
                    onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Emergency Hotline
                  </label>
                  <input
                    type="text"
                    value={form.emergencyPhone}
                    onChange={(e) => setForm({ ...form, emergencyPhone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-600" /> Hours &amp; Appointment Intervals
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Weekday Hours
                  </label>
                  <input
                    type="text"
                    value={form.weekdayHours}
                    onChange={(e) => setForm({ ...form, weekdayHours: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Weekend Hours
                  </label>
                  <input
                    type="text"
                    value={form.weekendHours}
                    onChange={(e) => setForm({ ...form, weekendHours: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Default Slot Duration (mins)
                  </label>
                  <input
                    type="number"
                    value={form.slotDuration}
                    onChange={(e) => setForm({ ...form, slotDuration: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button type="submit" className="clinic-btn-teal text-xs py-2.5 px-6 font-semibold shadow-xs">
                Save Clinic Configuration
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
