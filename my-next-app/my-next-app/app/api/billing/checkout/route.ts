import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { getCurrentUser } from '@/lib/auth/session';
import { Subscription } from '@/models/Subscription';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { getStripePriceId, isPlanId, BillingInterval } from '@/lib/billing/plans';

function appUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (!isStripeConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Stripe is not configured yet. Add your Stripe keys to the environment variables (see STRIPE-SETUP.md).',
        },
        { status: 503 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const plan = body?.plan ?? 'pro';
    const interval: BillingInterval = body?.interval === 'year' ? 'year' : 'month';

    if (!isPlanId(plan) || plan !== 'pro') {
      return NextResponse.json(
        {
          success: false,
          error: 'Only the Professional plan is available for self-serve checkout.',
        },
        { status: 400 }
      );
    }

    const priceId = getStripePriceId(plan, interval);
    if (!priceId) {
      return NextResponse.json(
        {
          success: false,
          error:
            interval === 'year'
              ? 'Stripe price not configured — add STRIPE_PRICE_PRO_YEARLY to your environment variables.'
              : 'Stripe price not configured — add STRIPE_PRICE_PRO_MONTHLY to your environment variables.',
        },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const stripe = getStripe();
    const userId = user._id.toString();

    // Reuse the user's Stripe customer if they already have one; otherwise
    // create it and remember it on their Subscription document.
    let subscription = await Subscription.findOne({ userId: user._id });
    let customerId = subscription?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId },
      });
      customerId = customer.id;

      subscription = await Subscription.findOneAndUpdate(
        { userId: user._id },
        {
          $set: { stripeCustomerId: customerId },
          $setOnInsert: { plan: 'basic', status: 'active' },
        },
        { upsert: true, new: true }
      );
    }

    const base = appUrl();
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${base}/billing?checkout=success`,
      cancel_url: `${base}/pricing?checkout=cancelled`,
      client_reference_id: userId,
      subscription_data: {
        metadata: { userId, plan },
      },
      metadata: { userId, plan },
    });

    return NextResponse.json({ success: true, url: session.url });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to start checkout' },
      { status: 500 }
    );
  }
}
