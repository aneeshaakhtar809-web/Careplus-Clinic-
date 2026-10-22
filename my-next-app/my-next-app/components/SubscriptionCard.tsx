'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Zap,
  FileText,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  CreditCard,
} from 'lucide-react';

interface SubscriptionInfo {
  plan: 'basic' | 'pro' | 'enterprise';
  status: string;
  isDefault?: boolean;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

interface InvoiceInfo {
  id: string;
  number: string | null;
  amountPaid: number;
  amountDue: number;
  currency: string;
  status: string | null;
  createdAt: string;
  hostedInvoiceUrl: string | null;
  invoicePdf: string | null;
}

const PLAN_NAMES: Record<SubscriptionInfo['plan'], string> = {
  basic: 'Basic Clinic',
  pro: 'Professional',
  enterprise: 'Enterprise',
};

function statusBadgeClasses(status: string): string {
  switch (status) {
    case 'active':
    case 'trialing':
      return 'bg-emerald-50 text-emerald-700';
    case 'past_due':
    case 'incomplete':
      return 'bg-amber-50 text-amber-700';
    case 'canceled':
      return 'bg-slate-100 text-slate-600';
    default:
      return 'bg-slate-100 text-slate-600';
  }
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: (currency || 'usd').toUpperCase(),
  }).format(amount);
}

export default function SubscriptionCard() {
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [invoices, setInvoices] = useState<InvoiceInfo[]>([]);
  const [portalLoading, setPortalLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout') === 'success') {
      setCheckoutSuccess(true);
    }

    let cancelled = false;

    async function load() {
      try {
        const [subRes, invRes] = await Promise.all([
          fetch('/api/billing/subscription'),
          fetch('/api/billing/invoices'),
        ]);
        const subData = await subRes.json().catch(() => null);
        const invData = await invRes.json().catch(() => null);
        if (cancelled) return;
        if (subData?.subscription) setSubscription(subData.subscription);
        if (Array.isArray(invData?.invoices)) setInvoices(invData.invoices);
      } catch {
        // Keep the card quiet on network errors; the rest of the page works.
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const openPortal = async () => {
    setActionError('');
    setPortalLoading(true);
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' });
      const data = await res.json().catch(() => null);
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      setActionError(data?.error || 'Could not open the billing portal.');
    } catch {
      setActionError('Could not reach the server. Please try again.');
    } finally {
      setPortalLoading(false);
    }
  };

  const plan = subscription?.plan ?? 'basic';
  const status = subscription?.status ?? 'active';
  const periodEnd = formatDate(subscription?.currentPeriodEnd ?? null);

  return (
    <div className="clinic-card p-6 bg-white">
      <div className="flex items-center gap-2 mb-1">
        <CreditCard className="w-5 h-5 text-teal-600" />
        <h3 className="font-bold text-slate-900 text-base">Your CarePlus Plan</h3>
      </div>
      <p className="text-[11px] text-slate-400 mb-5 flex items-center gap-1">
        <Zap className="w-3 h-3 text-amber-500" /> Powered by Stripe (test mode)
      </p>

      {checkoutSuccess && (
        <div className="mb-5 flex items-start gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-emerald-800">
              Subscription activated — welcome to Pro!
            </p>
            <p className="text-[11px] text-emerald-700 mt-0.5">
              If your plan still shows as Basic below, give it a few seconds and
              refresh — Stripe confirms new subscriptions almost immediately.
            </p>
          </div>
        </div>
      )}

      {actionError && (
        <div className="mb-5 flex items-start gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <p className="text-xs font-semibold text-red-700">{actionError}</p>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-slate-400 animate-pulse">
          Loading your plan…
        </p>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-2xl font-extrabold text-slate-900">
              {PLAN_NAMES[plan]}
            </span>
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${statusBadgeClasses(status)}`}
            >
              {status.replace('_', ' ')}
            </span>
          </div>

          {periodEnd && plan !== 'basic' && (
            <p className="text-xs text-slate-500 mt-2">
              {subscription?.cancelAtPeriodEnd
                ? `Your plan cancels on ${periodEnd}.`
                : `Current billing period ends ${periodEnd} — your plan renews automatically.`}
            </p>
          )}
          {plan === 'basic' && (
            <p className="text-xs text-slate-500 mt-2">
              You are on the free plan. Upgrade to Professional for up to 10
              doctors, unlimited patients, analytics and SMS reminders.
            </p>
          )}

          <div className="flex flex-wrap gap-3 mt-5">
            {plan === 'basic' && (
              <Link
                href="/pricing"
                className="py-2.5 px-5 rounded-xl font-bold text-sm text-white bg-indigo-500 hover:bg-indigo-600 shadow-md shadow-indigo-500/20 transition-colors"
              >
                Upgrade to Pro
              </Link>
            )}
            {plan === 'pro' && (
              <>
                <button
                  onClick={openPortal}
                  disabled={portalLoading}
                  className="py-2.5 px-5 rounded-xl font-bold text-sm text-white bg-indigo-500 hover:bg-indigo-600 shadow-md shadow-indigo-500/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {portalLoading ? 'Opening portal…' : 'Manage Billing'}
                </button>
                <Link
                  href="/pricing"
                  className="py-2.5 px-5 rounded-xl font-bold text-sm text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors"
                >
                  Change Plan
                </Link>
              </>
            )}
            {plan === 'enterprise' && (
              <button
                onClick={openPortal}
                disabled={portalLoading}
                className="py-2.5 px-5 rounded-xl font-bold text-sm text-white bg-indigo-500 hover:bg-indigo-600 shadow-md shadow-indigo-500/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {portalLoading ? 'Opening portal…' : 'Manage Billing'}
              </button>
            )}
          </div>
        </>
      )}

      {/* Subscription invoices */}
      <div className="mt-8 pt-6 border-t border-slate-100">
        <h4 className="font-bold text-slate-900 text-sm mb-4">
          Subscription Invoices
        </h4>
        {loading ? (
          <p className="text-xs text-slate-400 animate-pulse">
            Loading invoices…
          </p>
        ) : invoices.length === 0 ? (
          <p className="text-xs text-slate-400">
            No subscription invoices yet — they appear here after your first
            payment.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                  <th className="pb-3 pr-4">Invoice</th>
                  <th className="pb-3 px-4">Date</th>
                  <th className="pb-3 px-4">Amount</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 pl-4 text-right">Links</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50">
                    <td className="py-3 pr-4 font-mono text-slate-500">
                      {invoice.number ?? invoice.id}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {formatDate(invoice.createdAt) ?? '—'}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {formatMoney(
                        invoice.amountPaid || invoice.amountDue,
                        invoice.currency
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${statusBadgeClasses(invoice.status ?? '')}`}
                      >
                        {invoice.status ?? '—'}
                      </span>
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <span className="inline-flex items-center gap-3">
                        {invoice.hostedInvoiceUrl && (
                          <a
                            href={invoice.hostedInvoiceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-teal-600 hover:text-teal-700"
                            title="View invoice"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        {invoice.invoicePdf && (
                          <a
                            href={invoice.invoicePdf}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-500 hover:text-slate-700"
                            title="Download PDF"
                          >
                            <FileText className="w-4 h-4" />
                          </a>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
