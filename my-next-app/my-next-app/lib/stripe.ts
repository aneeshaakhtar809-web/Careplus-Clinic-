import Stripe from 'stripe';

/**
 * Lazy Stripe client.
 *
 * The client is created on first use — never at module import time — so the
 * app builds and runs fine on machines where Stripe keys are not set yet.
 * Call `isStripeConfigured()` first (or catch the error from `getStripe()`).
 */

let stripeClient: Stripe | null = null;

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error(
      'Stripe is not configured — set STRIPE_SECRET_KEY in your environment variables (see STRIPE-SETUP.md).'
    );
  }
  if (!stripeClient) {
    stripeClient = new Stripe(secretKey);
  }
  return stripeClient;
}

/**
 * Read the current billing period from a Stripe subscription.
 *
 * In older Stripe API versions the period lives on the subscription itself;
 * in newer versions it lives on each subscription item. Read both places
 * defensively so either shape works.
 */
export function getSubscriptionPeriod(sub: Stripe.Subscription): {
  start: Date | null;
  end: Date | null;
} {
  const raw = sub as unknown as {
    current_period_start?: number;
    current_period_end?: number;
  };
  const firstItem = sub.items?.data?.[0] as
    | (Stripe.SubscriptionItem & {
        current_period_start?: number;
        current_period_end?: number;
      })
    | undefined;

  const startUnix = raw.current_period_start ?? firstItem?.current_period_start;
  const endUnix = raw.current_period_end ?? firstItem?.current_period_end;

  return {
    start: startUnix ? new Date(startUnix * 1000) : null,
    end: endUnix ? new Date(endUnix * 1000) : null,
  };
}

/** The Price ID of the first item on a Stripe subscription, if any. */
export function getSubscriptionPriceId(
  sub: Stripe.Subscription
): string | undefined {
  return sub.items?.data?.[0]?.price?.id;
}
