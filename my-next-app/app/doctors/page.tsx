'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Stethoscope, Plus, Search, Star, Phone, Mail, Clock, CheckCircle2 } from 'lucide-react';
import { IDoctor } from '@/types';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<IDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, [searchQuery]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/doctors', window.location.origin);
      if (searchQuery) url.searchParams.set('search', searchQuery);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setDoctors(data.doctors);
      }
    } catch (e) {
      console.error('Failed to fetch doctors:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Doctors & Specializations" />

        <main className="p-6 md:p-8 space-y-6 flex-1">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Clinical Specialists</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Doctor roster, consultation fees, and available weekly schedules
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="clinic-card p-4 bg-white">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search doctor name, specialization, or qualification..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Doctor Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full py-12 text-center text-xs text-slate-400">
                Loading doctors roster...
              </div>
            ) : doctors.length === 0 ? (
              <div className="col-span-full py-12 text-center text-xs text-slate-400">
                No doctors found matching search.
              </div>
            ) : (
              doctors.map((doctor) => (
                <div key={doctor._id} className="clinic-card p-6 bg-white flex flex-col justify-between border-t-4 border-t-teal-600">
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 font-bold flex items-center justify-center text-base">
                          {doctor.name.charAt(4) || 'D'}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-base">{doctor.name}</h3>
                          <p className="text-xs text-teal-600 font-bold">{doctor.specialization}</p>
                          <p className="text-[11px] text-slate-400">{doctor.qualification}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
                        {doctor.rating || 4.9}
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {doctor.bio || 'Board certified specialist providing expert medical care and personalized treatment.'}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-xl bg-slate-50">
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Experience</span>
                        <span className="font-bold text-slate-900">{doctor.experience} Years</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50">
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Fee</span>
                        <span className="font-bold text-slate-900">${doctor.consultationFee} / visit</span>
                      </div>
                    </div>

                    <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{doctor.contactInformation?.phone || '+1 (555) 201-3000'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{doctor.contactInformation?.email || doctor.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span className="font-semibold text-slate-700">{doctor.contactInformation?.roomNumber || 'Suite 101'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Available for Booking
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
