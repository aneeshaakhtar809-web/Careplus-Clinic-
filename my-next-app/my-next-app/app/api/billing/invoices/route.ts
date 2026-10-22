import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { getCurrentUser } from '@/lib/auth/session';
import { Subscription } from '@/models/Subscription';
import { getStripe, isStripeConfigured } from '@/lib/stripe';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (!isStripeConfigured()) {
      return NextResponse.json({ success: true, invoices: [] });
    }

    await connectToDatabase();
    const subscription = await Subscription.findOne({ userId: user._id });

    if (!subscription?.stripeCustomerId) {
      return NextResponse.json({ success: true, invoices: [] });
    }

    try {
      const stripe = getStripe();
      const stripeInvoices = await stripe.invoices.list({
        customer: subscription.stripeCustomerId,
        limit: 12,
      });

      const invoices = stripeInvoices.data.map((invoice) => ({
        id: invoice.id,
        number: invoice.number,
        amountPaid: (invoice.amount_paid ?? 0) / 100,
        amountDue: (invoice.amount_due ?? 0) / 100,
        currency: invoice.currency,
        status: invoice.status,
        createdAt: new Date((invoice.created ?? 0) * 1000).toISOString(),
        hostedInvoiceUrl: invoice.hosted_invoice_url ?? null,
        invoicePdf: invoice.invoice_pdf ?? null,
      }));

      return NextResponse.json({ success: true, invoices });
    } catch (stripeError) {
      console.error(
        '⚠️ [Billing] Could not list Stripe invoices:',
        (stripeError as Error).message
      );
      return NextResponse.json({ success: true, invoices: [] });
    }
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}
