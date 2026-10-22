import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { getCurrentUser } from '@/lib/auth/session';
import { Subscription } from '@/models/Subscription';
import { getStripe, isStripeConfigured } from '@/lib/stripe';

export async function POST() {
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

    await connectToDatabase();
    const subscription = await Subscription.findOne({ userId: user._id });

    if (!subscription?.stripeCustomerId) {
      return NextResponse.json(
        {
          success: false,
          error: 'No billing account yet — subscribe to a paid plan first.',
        },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${appUrl}/billing`,
    });

    return NextResponse.json({ success: true, url: portalSession.url });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to open billing portal' },
      { status: 500 }
    );
  }
}
