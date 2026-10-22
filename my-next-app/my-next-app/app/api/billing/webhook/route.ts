import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Subscription } from '@/models/Subscription';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { upsertSubscriptionFromStripe } from '@/lib/billing/sync';
import { isPlanId } from '@/lib/billing/plans';

// Stripe webhooks need the raw request body and the Node.js runtime.
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { success: false, error: 'Stripe is not configured' },
      { status: 503 }
    );
  }

  const rawBody = await req.text();
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    if (webhookSecret) {
      if (!signature) {
        return NextResponse.json(
          { success: false, error: 'Missing stripe-signature header' },
          { status: 400 }
        );
      }
      // Verified path: only trust events Stripe actually signed.
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } else {
      // Dev fallback: signature verification is skipped ONLY when
      // STRIPE_WEBHOOK_SECRET is not set (e.g. quick local testing).
      // Always set the secret in production.
      event = JSON.parse(rawBody) as Stripe.Event;
    }
  } catch (err) {
    console.error('❌ [Stripe Webhook] Could not parse event:', (err as Error).message);
    return NextResponse.json(
      { success: false, error: 'Invalid webhook payload or signature' },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();
    const stripe = getStripe();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const stripeSubscriptionId =
          typeof session.subscription === 'string'
            ? session.subscription
            : session.subscription?.id;
        if (stripeSubscriptionId) {
          const stripeSub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
          const metaPlan = session.metadata?.plan;
          const customerId =
            typeof session.customer === 'string'
              ? session.customer
              : session.customer?.id;
          await upsertSubscriptionFromStripe(stripeSub, {
            userId:
              session.metadata?.userId ||
              session.client_reference_id ||
              undefined,
            plan: isPlanId(metaPlan) ? metaPlan : undefined,
            customerId: customerId ?? undefined,
          });
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const stripeSub = event.data.object as Stripe.Subscription;
        await upsertSubscriptionFromStripe(stripeSub);
        break;
      }

      case 'customer.subscription.deleted': {
        const stripeSub = event.data.object as Stripe.Subscription;
        const doc = await Subscription.findOne({
          stripeSubscriptionId: stripeSub.id,
        });
        if (doc) {
          doc.status = 'canceled';
          doc.plan = 'basic';
          doc.cancelAtPeriodEnd = false;
          await doc.save();
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId =
          typeof invoice.customer === 'string'
            ? invoice.customer
            : invoice.customer?.id;
        if (customerId) {
          const doc = await Subscription.findOne({ stripeCustomerId: customerId });
          if (doc) {
            doc.status = 'past_due';
            await doc.save();
          }
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId =
          typeof invoice.customer === 'string'
            ? invoice.customer
            : invoice.customer?.id;
        if (customerId) {
          const doc = await Subscription.findOne({ stripeCustomerId: customerId });
          if (doc && doc.status === 'past_due') {
            doc.status = 'active';
            await doc.save();
          }
        }
        break;
      }

      default:
        // Unhandled event types are acknowledged and ignored.
        break;
    }
  } catch (handlerError) {
    // Log handler errors but still acknowledge the event so Stripe does not
    // retry forever; the GET subscription endpoint re-syncs from Stripe.
    console.error(
      `❌ [Stripe Webhook] Error handling ${event.type}:`,
      (handlerError as Error).message
    );
  }

  return NextResponse.json({ received: true });
}
