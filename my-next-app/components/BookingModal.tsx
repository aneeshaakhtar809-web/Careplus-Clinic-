'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Stethoscope, User, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { IDoctor, IPatient } from '@/types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BookingModal({ isOpen, onClose, onSuccess }: BookingModalProps) {
  const [patients, setPatients] = useState<IPatient[]>([]);
  const [doctors, setDoctors] = useState<IDoctor[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('09:30 AM');
  const [type, setType] = useState('In-Person');
  const [reason, setReason] = useState('');
  const [symptoms, setSymptoms] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [resP, resD] = await Promise.all([
        fetch('/api/patients'),
        fetch('/api/doctors'),
      ]);
      const dataP = await resP.json();
      const dataD = await resD.json();

      if (dataP.success && dataP.patients.length > 0) {
        setPatients(dataP.patients);
        setPatientId(dataP.patients[0]._id);
      }
      if (dataD.success && dataD.doctors.length > 0) {
        setDoctors(dataD.doctors);
        setDoctorId(dataD.doctors[0]._id);
      }
    } catch {
      setError('Failed to load clinic doctors or patient roster');
    } finally {
      setLoadingData(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!patientId || !doctorId || !appointmentDate || !timeSlot || !reason) {
      setError('Please fill in all required appointment details');
      return;
    }

    setSubmitting(true);

    try {
      const selectedDoc = doctors.find((d) => d._id === doctorId);
      const selectedPat = patients.find((p) => p._id === patientId);

      const payload = {
        patientId,
        doctorId,
        patientName: selectedPat ? selectedPat.fullName : '',
        doctorName: selectedDoc ? selectedDoc.name : '',
        department: selectedDoc ? selectedDoc.specialization : 'General Medicine',
        appointmentDate,
        timeSlot,
        type,
        reason,
        symptoms,
        fee: selectedDoc ? selectedDoc.consultationFee : 60,
      };

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Booking failed');
      } else {
        setSuccessMsg('Appointment successfully booked and confirmed!');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1200);
      }
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj.message || 'Network error during appointment booking');
    } finally {
      setSubmitting(false);
    }
  };

  const availableSlots = [
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500 text-white flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Schedule New Appointment</h3>
              <p className="text-[11px] text-teal-400">CarePulse Clinical Booking System</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 flex items-start gap-2.5 text-xs text-teal-800">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {loadingData ? (
            <div className="py-8 text-center text-xs text-slate-500">
              Loading doctor schedules and patient directory...
            </div>
          ) : (
            <>
              {/* Select Patient */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" /> Select Patient *
                </label>
                <select
                  required
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none bg-slate-50/50"
                >
                  {patients.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.fullName} ({p.gender}, Age {p.age}) — {p.phoneNumber}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Doctor */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-teal-600" /> Select Specialist / Doctor *
                </label>
                <select
                  required
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none bg-slate-50/50"
                >
                  {doctors.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name} — {d.specialization} (${d.consultationFee} Fee)
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Appointment Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> Time Slot *
                  </label>
                  <select
                    required
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none bg-slate-50/50"
                  >
                    {availableSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Consultation Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['In-Person', 'Video Consultation', 'Follow-up'].map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setType(t)}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold transition-all border ${
                        type === t
                          ? 'bg-teal-50 border-teal-500 text-teal-700 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reason for Visit */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" /> Reason for Visit *
                </label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Annual cardiovascular checkup & ECG"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none bg-slate-50/50"
                />
              </div>

              {/* Symptoms */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Symptoms / Clinical Notes (Optional)
                </label>
                <input
                  type="text"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g. Mild shortness of breath after climbing stairs"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none bg-slate-50/50"
                />
              </div>
            </>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || loadingData}
              className="clinic-btn-teal text-xs py-2 px-5 font-semibold disabled:opacity-60"
            >
              {submitting ? 'Confirming...' : 'Confirm Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
