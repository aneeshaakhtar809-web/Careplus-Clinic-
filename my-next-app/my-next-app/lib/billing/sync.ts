import type Stripe from 'stripe';
import {
  Subscription,
  ISubscriptionDocument,
  SubscriptionPlan,
  SubscriptionStatus,
} from '@/models/Subscription';
import { getSubscriptionPeriod, getSubscriptionPriceId } from '@/lib/stripe';
import { planForStripePriceId, PlanId } from './plans';

/** Map a Stripe subscription status onto our database enum. */
export function toDbStatus(status: string | undefined): SubscriptionStatus {
  switch (status) {
    case 'active':
    case 'trialing':
    case 'past_due':
    case 'canceled':
    case 'incomplete':
      return status;
    case 'unpaid':
    case 'paused':
      return 'past_due';
    case 'incomplete_expired':
      return 'canceled';
    default:
      return 'none';
  }
}

function customerIdOf(sub: Stripe.Subscription): string | undefined {
  if (typeof sub.customer === 'string') return sub.customer;
  return sub.customer?.id;
}

/**
 * Copy the billing-relevant fields from a Stripe subscription object onto a
 * Subscription document and save it.
 */
export async function applyStripeSubscription(
  doc: ISubscriptionDocument,
  stripeSub: Stripe.Subscription,
  opts?: { plan?: SubscriptionPlan }
): Promise<ISubscriptionDocument> {
  const priceId = getSubscriptionPriceId(stripeSub);
  const { start, end } = getSubscriptionPeriod(stripeSub);

  const derivedPlan = opts?.plan ?? planForStripePriceId(priceId);
  if (derivedPlan) {
    doc.plan = derivedPlan as SubscriptionPlan;
  }

  doc.status = toDbStatus(stripeSub.status);
  doc.stripeSubscriptionId = stripeSub.id;
  if (priceId) doc.stripePriceId = priceId;

  const customerId = customerIdOf(stripeSub);
  if (customerId) doc.stripeCustomerId = customerId;

  if (start) doc.currentPeriodStart = start;
  if (end) doc.currentPeriodEnd = end;
  doc.cancelAtPeriodEnd = Boolean(stripeSub.cancel_at_period_end);

  await doc.save();
  return doc;
}

/**
 * Find the local Subscription document matching a Stripe subscription
 * (by subscription id, then customer id, then user id), creating one when a
 * userId is known, and sync the Stripe state onto it.
 * Returns null when no local document can be identified.
 */
export async function upsertSubscriptionFromStripe(
  stripeSub: Stripe.Subscription,
  opts?: { userId?: string; plan?: PlanId; customerId?: string }
): Promise<ISubscriptionDocument | null> {
  const customerId = opts?.customerId ?? customerIdOf(stripeSub);

  let doc: ISubscriptionDocument | null = await Subscription.findOne({
    stripeSubscriptionId: stripeSub.id,
  });
  if (!doc && customerId) {
    doc = await Subscription.findOne({ stripeCustomerId: customerId });
  }
  if (!doc && opts?.userId) {
    doc = await Subscription.findOne({ userId: opts.userId });
  }

  if (!doc) {
    if (!opts?.userId) return null;
    doc = new Subscription({
      userId: opts.userId,
      plan: 'basic',
      status: 'active',
    });
  }

  return applyStripeSubscription(doc, stripeSub, { plan: opts?.plan });
}
