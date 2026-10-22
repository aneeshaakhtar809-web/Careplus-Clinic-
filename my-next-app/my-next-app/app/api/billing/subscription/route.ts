import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { getCurrentUser } from '@/lib/auth/session';
import { Subscription, ISubscriptionDocument } from '@/models/Subscription';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { applyStripeSubscription } from '@/lib/billing/sync';

function serializeSubscription(
  sub: ISubscriptionDocument,
  isDefault = false
) {
  return {
    plan: sub.plan,
    status: sub.status,
    isDefault,
    stripeCustomerId: sub.stripeCustomerId ?? null,
    stripeSubscriptionId: sub.stripeSubscriptionId ?? null,
    stripePriceId: sub.stripePriceId ?? null,
    currentPeriodStart: sub.currentPeriodStart
      ? new Date(sub.currentPeriodStart).toISOString()
      : null,
    currentPeriodEnd: sub.currentPeriodEnd
      ? new Date(sub.currentPeriodEnd).toISOString()
      : null,
    cancelAtPeriodEnd: Boolean(sub.cancelAtPeriodEnd),
  };
}

const DEFAULT_SUBSCRIPTION = {
  plan: 'basic' as const,
  status: 'active' as const,
  isDefault: true,
  stripeCustomerId: null,
  stripeSubscriptionId: null,
  stripePriceId: null,
  currentPeriodStart: null,
  currentPeriodEnd: null,
  cancelAtPeriodEnd: false,
};

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const subscription = await Subscription.findOne({ userId: user._id });

    if (!subscription) {
      return NextResponse.json({
        success: true,
        subscription: DEFAULT_SUBSCRIPTION,
      });
    }

    // If this user has a Stripe subscription, refresh the local copy from
    // Stripe so the UI never shows stale status or renewal dates. A Stripe
    // failure must not break the page — fall back to the local data.
    if (subscription.stripeSubscriptionId && isStripeConfigured()) {
      try {
        const stripe = getStripe();
        const stripeSub = await stripe.subscriptions.retrieve(
          subscription.stripeSubscriptionId
        );
        await applyStripeSubscription(subscription, stripeSub);
      } catch (syncError) {
        console.error(
          '⚠️ [Billing] Could not sync subscription from Stripe:',
          (syncError as Error).message
        );
      }
    }

    return NextResponse.json({
      success: true,
      subscription: serializeSubscription(subscription),
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}
