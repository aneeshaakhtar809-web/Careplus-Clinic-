'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { CreditCard, DollarSign, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';

export default function BillingPage() {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Billing & Revenue" />

        <main className="p-6 md:p-8 space-y-6 flex-1">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Payments &amp; Financial Ledger</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Consultation fees, payment statuses, and revenue analytics
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="clinic-card p-5 bg-white">
              <span className="text-xs font-semibold text-slate-500">Total Revenue Collected</span>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">$2,450.00</p>
              <p className="text-[11px] font-semibold text-emerald-600 mt-2 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +14.2% vs last month
              </p>
            </div>

            <div className="clinic-card p-5 bg-white">
              <span className="text-xs font-semibold text-slate-500">Pending Invoices</span>
              <p className="text-3xl font-extrabold text-amber-600 mt-2">$320.00</p>
              <p className="text-[11px] text-slate-400 mt-2">4 Pending Payments</p>
            </div>

            <div className="clinic-card p-5 bg-white">
              <span className="text-xs font-semibold text-slate-500">Average Consultation Fee</span>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">$85.00</p>
              <p className="text-[11px] text-teal-600 font-semibold mt-2">Standard Specialist Rate</p>
            </div>
          </div>

          <div className="clinic-card p-6 bg-white">
            <h3 className="font-bold text-slate-900 text-sm mb-4">Recent Payment Ledger</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                    <th className="pb-3 pr-4">Invoice ID</th>
                    <th className="pb-3 px-4">Patient</th>
                    <th className="pb-3 px-4">Department</th>
                    <th className="pb-3 px-4">Amount</th>
                    <th className="pb-3 pl-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr className="hover:bg-slate-50">
                    <td className="py-3.5 pr-4 font-mono text-slate-500">#INV-2026-001</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">Eleanor Sterling</td>
                    <td className="py-3.5 px-4 text-teal-600 font-semibold">Cardiology</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">$120.00</td>
                    <td className="py-3.5 pl-4 text-right">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                        Paid
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3.5 pr-4 font-mono text-slate-500">#INV-2026-002</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">David Miller</td>
                    <td className="py-3.5 px-4 text-teal-600 font-semibold">Cardiology</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">$120.00</td>
                    <td className="py-3.5 pl-4 text-right">
                      <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold">
                        Pending
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3.5 pr-4 font-mono text-slate-500">#INV-2026-003</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">Sophia Martinez</td>
                    <td className="py-3.5 px-4 text-teal-600 font-semibold">Pediatrics</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">$85.00</td>
                    <td className="py-3.5 pl-4 text-right">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                        Paid
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
