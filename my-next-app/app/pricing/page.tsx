'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Check, Info, Shield, Zap } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        <Header title="Pricing Plans" />

        <main className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto w-full flex-1">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Simple, transparent pricing</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
              Choose the perfect plan for your clinic. Upgrade or downgrade at any time. No hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 pt-8">
            {/* Starter Plan */}
            <div className="clinic-card bg-white p-6 md:p-8 rounded-2xl flex flex-col border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Starter Clinic</h3>
              <p className="text-sm text-slate-500 mt-2 min-h-[40px]">Perfect for solo practitioners and small local clinics.</p>
              <div className="mt-6 mb-8">
                <span className="text-4xl font-extrabold text-slate-900">$49</span>
                <span className="text-slate-500 font-medium">/month</span>
              </div>
              <ul className="space-y-4 flex-1">
                {['Up to 2 Doctors', '500 Patients limit', 'Basic Scheduling', 'Email Support'].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                    <Check className="w-5 h-5 text-teal-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="mt-8 w-full py-3 px-4 rounded-xl font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors">
                Start Free Trial
              </button>
            </div>

            {/* Pro Plan */}
            <div className="clinic-card bg-slate-900 text-white p-6 md:p-8 rounded-2xl flex flex-col relative shadow-xl shadow-indigo-500/10 scale-100 md:scale-105 z-10 border border-indigo-500/30">
              <div className="absolute -top-4 inset-x-0 flex justify-center">
                <span className="bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Most Popular
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">Professional</h3>
              <p className="text-sm text-slate-400 mt-2 min-h-[40px]">Advanced features for growing medical centers.</p>
              <div className="mt-6 mb-8">
                <span className="text-4xl font-extrabold text-white">$149</span>
                <span className="text-slate-400 font-medium">/month</span>
              </div>
              <ul className="space-y-4 flex-1">
                {['Up to 10 Doctors', 'Unlimited Patients', 'Advanced Analytics', 'SMS Reminders', 'Priority 24/7 Support'].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-200 font-medium">
                    <Check className="w-5 h-5 text-indigo-400 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="mt-8 w-full py-3 px-4 rounded-xl font-bold text-white bg-indigo-500 hover:bg-indigo-600 shadow-md shadow-indigo-500/20 transition-colors">
                Upgrade to Pro
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="clinic-card bg-white p-6 md:p-8 rounded-2xl flex flex-col border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Enterprise</h3>
              <p className="text-sm text-slate-500 mt-2 min-h-[40px]">Custom solutions for large hospital networks.</p>
              <div className="mt-6 mb-8">
                <span className="text-4xl font-extrabold text-slate-900">Custom</span>
                <span className="text-slate-500 font-medium">/month</span>
              </div>
              <ul className="space-y-4 flex-1">
                {['Unlimited Doctors', 'Multiple Locations', 'Custom API Access', 'Dedicated Account Manager', 'White-glove Onboarding'].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                    <Check className="w-5 h-5 text-teal-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="mt-8 w-full py-3 px-4 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
          
          {/* FAQ or Trust badges */}
          <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-center gap-6 text-slate-500 text-sm font-medium">
            <span className="flex items-center gap-2"><Shield className="w-5 h-5 text-teal-500" /> HIPAA Compliant</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-2"><Check className="w-5 h-5 text-teal-500" /> Cancel anytime</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-2"><Info className="w-5 h-5 text-teal-500" /> 14-day free trial</span>
          </div>
        </main>
      </div>
    </div>
  );
}
