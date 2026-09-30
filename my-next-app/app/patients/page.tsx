'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import PatientModal from '@/components/PatientModal';
import { Users, Plus, Search, Mail, Phone, MapPin, HeartPulse, Trash2 } from 'lucide-react';
import { IPatient } from '@/types';

export default function PatientsPage() {
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [patients, setPatients] = useState<IPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPatients();
  }, [searchQuery]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/patients', window.location.origin);
      if (searchQuery) url.searchParams.set('search', searchQuery);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setPatients(data.patients);
      }
    } catch (e) {
      console.error('Failed to fetch patients:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePatient = async (id: string) => {
    if (!confirm('Are you sure you want to delete this patient record?')) return;
    try {
      const res = await fetch(`/api/patients/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchPatients();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Patients Directory" onOpenPatientModal={() => setIsPatientModalOpen(true)} />

        <main className="p-6 md:p-8 space-y-6 flex-1">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Directory</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Comprehensive health records, demographics, and clinical contacts
              </p>
            </div>

            <button
              onClick={() => setIsPatientModalOpen(true)}
              className="clinic-btn-primary text-xs py-2.5 px-4 font-semibold shadow-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Patient
            </button>
          </div>

          {/* Search Bar */}
          <div className="clinic-card p-4 bg-white">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search patient name, email, phone, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Patient Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full py-12 text-center text-xs text-slate-400">
                Loading patient records...
              </div>
            ) : patients.length === 0 ? (
              <div className="col-span-full py-12 text-center text-xs text-slate-400">
                No patients found matching your search.
              </div>
            ) : (
              patients.map((patient) => (
                <div key={patient._id} className="clinic-card p-5 bg-white flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-sm">
                          {patient.fullName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">{patient.fullName}</h3>
                          <p className="text-[11px] text-slate-500 font-medium">
                            {patient.gender} • {patient.age} yrs old
                          </p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 font-bold text-[10px]">
                        Blood: {patient.bloodGroup || 'O+'}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{patient.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{patient.phoneNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{patient.address}</span>
                      </div>
                    </div>

                    {patient.medicalHistory && patient.medicalHistory.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <HeartPulse className="w-3 h-3 text-teal-600" /> Medical Conditions
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {patient.medicalHistory.map((cond, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium">
                              {cond}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400">
                      Reg: {new Date(patient.registrationDate).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleDeletePatient(patient._id!)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Patient Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      <PatientModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSuccess={fetchPatients}
      />
    </div>
  );
}
