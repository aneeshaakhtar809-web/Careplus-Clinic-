'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import BookingModal from '@/components/BookingModal';
import PatientModal from '@/components/PatientModal';
import {
  Users,
  Calendar,
  Clock,
  Stethoscope,
  TrendingUp,
  ArrowUpRight,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  DollarSign,
  UserPlus,
  CalendarPlus,
  CreditCard,
  RefreshCw,
  Search,
  ChevronRight,
} from 'lucide-react';
import { IAppointment, IDoctor, IPatient, IMedicalRecord } from '@/types';

export default function ProductionDashboardPage() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    availableDoctors: 0,
    completedVisits: 0,
    monthlyRevenue: 0,
  });

  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [doctors, setDoctors] = useState<IDoctor[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<IMedicalRecord[]>([]);

  const [statusFilter, setStatusFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Auto-seed if empty database so app works immediately out-of-the-box!
      const resStats = await fetch('/api/dashboard/stats');
      const dataStats = await resStats.json();

      if (dataStats.success) {
        if (dataStats.stats.totalPatients === 0 && dataStats.stats.availableDoctors === 0) {
          // Auto seed
          await fetch('/api/seed', { method: 'POST' });
          const retryRes = await fetch('/api/dashboard/stats');
          const retryData = await retryRes.json();
          if (retryData.success) {
            setStats(retryData.stats);
            setAppointments(retryData.recentAppointments || []);
            setDoctors(retryData.doctorsList || []);
            setMedicalRecords(retryData.recentRecords || []);
          }
        } else {
          setStats(dataStats.stats);
          setAppointments(dataStats.recentAppointments || []);
          setDoctors(dataStats.doctorsList || []);
          setMedicalRecords(dataStats.recentRecords || []);
        }
      }
    } catch (e) {
      console.error('Failed to load dashboard:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchDashboardData();
      }
    } catch (e) {
      console.error('Failed to update status:', e);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredAppointments = statusFilter === 'All'
    ? appointments
    : appointments.filter((a) => a.status === statusFilter);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Dark Sidebar matching Rice SaaS screenshot */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        {/* Top Header */}
        <Header
          title="Dashboard"
          onOpenBookingModal={() => setIsBookingModalOpen(true)}
          onOpenPatientModal={() => setIsPatientModalOpen(true)}
        />

        {/* Dashboard Main Content */}
        <main className="p-6 md:p-8 space-y-8 flex-1">
          {/* Top Actions Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Clinical Overview</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time patient bookings, doctor schedules, and practice management metrics
              </p>
            </div>

            {/* Quick Action Pill Buttons matching screenshot */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="clinic-btn-teal text-xs py-2 px-4 shadow-xs font-semibold rounded-xl flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> New Appointment
              </button>
              <button
                onClick={() => setIsPatientModalOpen(true)}
                className="clinic-btn-primary text-xs py-2 px-4 shadow-xs font-semibold rounded-xl flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> New Patient
              </button>
              <button
                onClick={fetchDashboardData}
                className="py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Refresh Dashboard Data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Sync</span>
              </button>
            </div>
          </div>

          {/* Metric Cards Grid matching the screenshot design */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Total Patients */}
            <div className="clinic-card p-5 relative overflow-hidden bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500">Total Patients</p>
                  <p className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                    {loading ? '...' : stats.totalPatients}
                  </p>
                  <p className="text-[11px] font-medium text-emerald-600 mt-2 flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5" /> Registered in clinic
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Card 2: Today's Appointments */}
            <div className="clinic-card p-5 relative overflow-hidden bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500">Today&apos;s Appointments</p>
                  <p className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                    {loading ? '...' : stats.todayAppointments}
                  </p>
                  <p className="text-[11px] font-medium text-blue-600 mt-2 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Scheduled today
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Card 3: Pending Consultations */}
            <div className="clinic-card p-5 relative overflow-hidden bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500">Pending Consultations</p>
                  <p className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                    {loading ? '...' : stats.pendingAppointments}
                  </p>
                  <p className="text-[11px] font-medium text-amber-600 mt-2 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Needs doctor action
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Card 4: Available Doctors */}
            <div className="clinic-card p-5 relative overflow-hidden bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500">Available Doctors</p>
                  <p className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                    {loading ? '...' : stats.availableDoctors}
                  </p>
                  <p className="text-[11px] font-medium text-teal-600 mt-2 flex items-center gap-1">
                    <Stethoscope className="w-3.5 h-3.5" /> Active in suite
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Stethoscope className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Footer Bar matching bottom buttons in screenshot */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="p-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <CalendarPlus className="w-4 h-4" /> Schedule Visit
            </button>
            <button
              onClick={() => setIsPatientModalOpen(true)}
              className="p-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <UserPlus className="w-4 h-4" /> Add New Patient
            </button>
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="p-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <CreditCard className="w-4 h-4" /> Record Consultation Payment
            </button>
          </div>

          {/* Main Content Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Columns: Appointments Queue */}
            <div className="lg:col-span-2 space-y-6">
              <div className="clinic-card p-6 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Appointments Queue</h3>
                    <p className="text-xs text-slate-500">Live clinical workflow management</p>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
                    {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setStatusFilter(f)}
                        className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                          statusFilter === f
                            ? 'bg-white text-slate-900 font-bold shadow-xs'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table */}
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                        <th className="pb-3 pr-4">Patient</th>
                        <th className="pb-3 px-4">Doctor &amp; Dept</th>
                        <th className="pb-3 px-4">Date &amp; Time</th>
                        <th className="pb-3 px-4">Status</th>
                        <th className="pb-3 pl-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredAppointments.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-400">
                            No appointments found matching current filter.
                          </td>
                        </tr>
                      ) : (
                        filteredAppointments.map((appt) => (
                          <tr key={appt._id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 pr-4">
                              <div className="font-bold text-slate-900">{appt.patientName}</div>
                              <div className="text-[11px] text-slate-500 truncate max-w-[150px]">
                                {appt.reason}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-slate-800">{appt.doctorName}</div>
                              <div className="text-[10px] text-teal-600 font-semibold">{appt.department}</div>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="text-slate-800 font-semibold">{appt.appointmentDate}</div>
                              <div className="text-[10px] text-slate-500">{appt.timeSlot}</div>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  appt.status === 'Confirmed'
                                    ? 'badge-confirmed'
                                    : appt.status === 'Completed'
                                    ? 'badge-completed'
                                    : appt.status === 'Cancelled'
                                    ? 'badge-cancelled'
                                    : 'badge-pending'
                                }`}
                              >
                                {appt.status}
                              </span>
                            </td>
                            <td className="py-3.5 pl-4 text-right whitespace-nowrap">
                              {updatingId === appt._id ? (
                                <span className="text-[10px] text-slate-400">Updating...</span>
                              ) : (
                                <div className="flex items-center justify-end gap-1">
                                  {appt.status === 'Pending' && (
                                    <button
                                      onClick={() => handleUpdateStatus(appt._id!, 'Confirmed')}
                                      className="p-1 rounded-lg text-blue-600 hover:bg-blue-50"
                                      title="Confirm Appointment"
                                    >
                                      <CheckCircle2 className="w-4 h-4" />
                                    </button>
                                  )}
                                  {(appt.status === 'Pending' || appt.status === 'Confirmed') && (
                                    <button
                                      onClick={() => handleUpdateStatus(appt._id!, 'Completed')}
                                      className="p-1 rounded-lg text-emerald-600 hover:bg-emerald-50"
                                      title="Mark Completed & Consulted"
                                    >
                                      <CheckCircle2 className="w-4 h-4" />
                                    </button>
                                  )}
                                  {appt.status !== 'Cancelled' && appt.status !== 'Completed' && (
                                    <button
                                      onClick={() => handleUpdateStatus(appt._id!, 'Cancelled')}
                                      className="p-1 rounded-lg text-rose-600 hover:bg-rose-50"
                                      title="Cancel Appointment"
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column: Doctors & Medical Records */}
            <div className="space-y-6">
              {/* Doctor Roster Card */}
              <div className="clinic-card p-5 bg-white">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm">Specialist Doctors</h3>
                  <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                    {doctors.length} On Duty
                  </span>
                </div>
                <div className="mt-3 divide-y divide-slate-100">
                  {doctors.map((doc) => (
                    <div key={doc._id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 font-bold flex items-center justify-center text-xs">
                          {doc.name.charAt(4) || 'D'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{doc.name}</p>
                          <p className="text-[11px] text-teal-600 font-semibold">{doc.specialization}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-900">${doc.consultationFee}</p>
                        <p className="text-[10px] text-slate-400">{doc.experience} yrs exp</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Consultations Card */}
              <div className="clinic-card p-5 bg-white">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm">Recent Consultations</h3>
                  <FileText className="w-4 h-4 text-slate-400" />
                </div>
                <div className="mt-3 space-y-3">
                  {medicalRecords.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No recent records.</p>
                  ) : (
                    medicalRecords.map((rec) => (
                      <div key={rec._id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span>{rec.patientName}</span>
                          <span className="text-[10px] font-normal text-slate-400">
                            {new Date(rec.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-teal-700 font-semibold text-[11px] mt-1">{rec.diagnosis}</p>
                        <p className="text-slate-500 text-[10px] mt-1 truncate">{rec.treatmentPlan}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
      <PatientModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
    </div>
  );
}
