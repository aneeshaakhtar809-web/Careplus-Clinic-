'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { FileText, Search, Activity, Pill, Stethoscope, Calendar } from 'lucide-react';
import { IMedicalRecord } from '@/types';

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<IMedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard/stats');
      const data = await res.json();
      if (data.success) {
        setRecords(data.recentRecords || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Medical Records & EHR" />

        <main className="p-6 md:p-8 space-y-6 flex-1">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Electronic Health Records (EHR)</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Clinical consultations, diagnoses, prescriptions, and vital sign logs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <div className="col-span-full py-12 text-center text-xs text-slate-400">
                Loading medical records...
              </div>
            ) : records.length === 0 ? (
              <div className="col-span-full py-12 text-center text-xs text-slate-400">
                No medical records logged yet. Records are auto-generated when doctor consultations complete.
              </div>
            ) : (
              records.map((rec) => (
                <div key={rec._id} className="clinic-card p-6 bg-white space-y-4">
                  <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{rec.patientName}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Stethoscope className="w-3.5 h-3.5 text-teal-600" /> {rec.doctorName}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(rec.date).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Diagnosis</span>
                    <p className="text-sm font-bold text-teal-700 mt-0.5">{rec.diagnosis}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Treatment Plan &amp; Notes</span>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{rec.treatmentPlan}</p>
                  </div>

                  {rec.prescriptions && rec.prescriptions.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Pill className="w-3.5 h-3.5 text-teal-600" /> Prescribed Medications
                      </span>
                      {rec.prescriptions.map((p, idx) => (
                        <div key={idx} className="text-xs font-semibold text-slate-800 flex justify-between">
                          <span>{p.medication} ({p.dosage})</span>
                          <span className="text-slate-500 font-normal">{p.frequency} • {p.duration}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
