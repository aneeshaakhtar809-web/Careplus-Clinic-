'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import BookingModal from '@/components/BookingModal';
import { Calendar, Plus, Search, CheckCircle2, XCircle, Clock, Filter } from 'lucide-react';
import { IAppointment } from '@/types';

export default function AppointmentsPage() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, searchQuery]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/appointments', window.location.origin);
      if (statusFilter !== 'All') url.searchParams.set('status', statusFilter);
      if (searchQuery) url.searchParams.set('search', searchQuery);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setAppointments(data.appointments);
      }
    } catch (e) {
      console.error('Failed to fetch appointments:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAppointments();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Appointments & Schedule" onOpenBookingModal={() => setIsBookingModalOpen(true)} />

        <main className="p-6 md:p-8 space-y-6 flex-1">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Appointments Management</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Book, track, and manage all patient consultations
              </p>
            </div>

            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="clinic-btn-teal text-xs py-2.5 px-4 font-semibold shadow-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Book Appointment
            </button>
          </div>

          {/* Filter Bar */}
          <div className="clinic-card p-4 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search patient, doctor, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium w-full sm:w-auto overflow-x-auto">
              {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
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

          {/* Appointments Table */}
          <div className="clinic-card p-6 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                    <th className="pb-3 pr-4">Patient</th>
                    <th className="pb-3 px-4">Doctor &amp; Dept</th>
                    <th className="pb-3 px-4">Date &amp; Time</th>
                    <th className="pb-3 px-4">Type</th>
                    <th className="pb-3 px-4">Fee &amp; Payment</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 pl-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        Loading appointment schedule...
                      </td>
                    </tr>
                  ) : appointments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No appointments found matching search criteria.
                      </td>
                    </tr>
                  ) : (
                    appointments.map((appt) => (
                      <tr key={appt._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 pr-4">
                          <div className="font-bold text-slate-900">{appt.patientName}</div>
                          <div className="text-[11px] text-slate-500 max-w-[180px] truncate">
                            {appt.reason}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-slate-800">{appt.doctorName}</div>
                          <div className="text-[10px] text-teal-600 font-semibold">{appt.department}</div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="text-slate-900 font-bold">{appt.appointmentDate}</div>
                          <div className="text-[10px] text-slate-500">{appt.timeSlot}</div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-slate-600">
                          {appt.type}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="font-bold text-slate-900">${appt.fee}</div>
                          <span
                            className={`text-[10px] font-semibold ${
                              appt.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'
                            }`}
                          >
                            {appt.paymentStatus}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
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
                        <td className="py-4 pl-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            {appt.status === 'Pending' && (
                              <button
                                onClick={() => handleUpdateStatus(appt._id!, 'Confirmed')}
                                className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-semibold hover:bg-blue-100"
                              >
                                Confirm
                              </button>
                            )}
                            {(appt.status === 'Pending' || appt.status === 'Confirmed') && (
                              <button
                                onClick={() => handleUpdateStatus(appt._id!, 'Completed')}
                                className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-semibold hover:bg-emerald-100"
                              >
                                Complete Visit
                              </button>
                            )}
                            {appt.status !== 'Cancelled' && appt.status !== 'Completed' && (
                              <button
                                onClick={() => handleUpdateStatus(appt._id!, 'Cancelled')}
                                className="px-2 py-1 rounded-lg bg-rose-50 text-rose-700 text-[11px] font-semibold hover:bg-rose-100"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSuccess={fetchAppointments}
      />
    </div>
  );
}
