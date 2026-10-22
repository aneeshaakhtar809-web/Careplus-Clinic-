/**
 * CarePlus subscription plan configuration (server-side only).
 *
 * This module reads Stripe price IDs from environment variables, so it must
 * only be imported from server code (route handlers, server components).
 * Display data (names, prices, features) mirrors app/pricing/page.tsx.
 */

export type PlanId = 'basic' | 'pro' | 'enterprise';
export type BillingInterval = 'month' | 'year';

export interface PlanConfig {
  id: PlanId;
  name: string;
  tagline: string;
  /** Monthly price in USD. `null` means custom pricing (no self-serve checkout). */
  monthlyPrice: number | null;
  features: string[];
  /** Stripe Price IDs, resolved from environment variables. */
  stripePriceIds: {
    month?: string;
    year?: string;
  };
  /** True when the plan can be purchased through Stripe Checkout. */
  checkoutEnabled: boolean;
}

export const PLANS: Record<PlanId, PlanConfig> = {
  basic: {
    id: 'basic',
    name: 'Basic Clinic',
    tagline: 'Perfect for solo practitioners just getting started.',
    monthlyPrice: 0,
    features: [
      '1 Doctor Account',
      'Up to 50 Patients',
      'Basic Scheduling',
      'Community Support',
    ],
    stripePriceIds: {},
    checkoutEnabled: false,
  },
  pro: {
    id: 'pro',
    name: 'Professional',
    tagline: 'Advanced features for growing medical centers.',
    monthlyPrice: 149,
    features: [
      'Up to 10 Doctors',
      'Unlimited Patients',
      'Advanced Analytics',
      'SMS Reminders',
      'Priority 24/7 Support',
    ],
    stripePriceIds: {
      month: process.env.STRIPE_PRICE_PRO_MONTHLY || undefined,
      year: process.env.STRIPE_PRICE_PRO_YEARLY || undefined,
    },
    checkoutEnabled: true,
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Custom solutions for large hospital networks.',
    monthlyPrice: null,
    features: [
      'Unlimited Doctors',
      'Multiple Locations',
      'Custom API Access',
      'Dedicated Account Manager',
      'White-glove Onboarding',
    ],
    stripePriceIds: {},
    checkoutEnabled: false,
  },
};

export const PLAN_IDS = Object.keys(PLANS) as PlanId[];

export function isPlanId(value: unknown): value is PlanId {
  return typeof value === 'string' && PLAN_IDS.includes(value as PlanId);
}

/** Resolve the Stripe Price ID for a plan + billing interval. */
export function getStripePriceId(
  planId: PlanId,
  interval: BillingInterval = 'month'
): string | undefined {
  const plan = PLANS[planId];
  return interval === 'year' ? plan.stripePriceIds.year : plan.stripePriceIds.month;
}

/** Derive which plan a Stripe Price ID belongs to (null when unknown). */
export function planForStripePriceId(
  priceId: string | null | undefined
): PlanId | null {
  if (!priceId) return null;
  if (
    priceId === PLANS.pro.stripePriceIds.month ||
    priceId === PLANS.pro.stripePriceIds.year
  ) {
    return 'pro';
  }
  return null;
}
