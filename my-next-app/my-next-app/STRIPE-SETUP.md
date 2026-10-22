# Stripe Setup Guide — CarePlus Billing (Test Mode)

This guide connects your CarePlus app to **Stripe in test mode**, so clinics
can subscribe to the Professional plan with a fake test card. No real money
moves in test mode, and real bank cards will NOT work there — that is on
purpose and completely safe.

You will end up with 5 values to copy into your environment variables:

| Variable | Where it comes from |
| --- | --- |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API keys (starts with `sk_test_`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Same page (starts with `pk_test_`) |
| `STRIPE_PRICE_PRO_MONTHLY` | Your product's price (starts with `price_`) |
| `STRIPE_WEBHOOK_SECRET` | Webhooks page (starts with `whsec_`) |
| `NEXT_PUBLIC_APP_URL` | Your deployed app URL, e.g. `https://your-app.vercel.app` |

---

## Step 1 — Create a Stripe account (test mode)

1. Go to [stripe.com](https://stripe.com) and sign up for a free account.
2. After logging in, look at the top of the Stripe Dashboard and make sure
   the **Test mode** toggle is switched **ON**. Everything in this guide is
   done in test mode.

## Step 2 — Create the Professional plan product and price

1. In the Stripe Dashboard, go to **Products** → **Add product**.
2. Name it **CarePlus Professional**.
3. Under pricing, choose **Recurring**, set the price to **$149**, and set the
   billing period to **Monthly**.
4. Click **Save product**.
5. On the product page, find the price and copy its **Price ID** — it starts
   with `price_`. This is your `STRIPE_PRICE_PRO_MONTHLY`.

*(Optional: add a second price of $1,490 with a **Yearly** period if you want
annual billing. Its ID goes into `STRIPE_PRICE_PRO_YEARLY`.)*

## Step 3 — Copy your API keys

1. Go to **Developers** → **API keys**.
2. Copy the **Publishable key** (starts with `pk_test_`) →
   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
3. Click **Reveal** on the **Secret key** (starts with `sk_test_`) and copy it
   → `STRIPE_SECRET_KEY`.

> ⚠️ Keep the secret key private. Never put it in GitHub code or share it in
> chat. Environment variables are the safe place for it.

## Step 4 — Add the variables to Vercel (and locally)

**On Vercel (your deployed app):**

1. Open your project in Vercel → **Settings** → **Environment Variables**.
2. Add each variable from the table above, one by one.
3. Set `NEXT_PUBLIC_APP_URL` to your deployed domain, for example
   `https://your-app.vercel.app` (no trailing slash).
4. **Redeploy** the project (Deployments → ⋯ → Redeploy) so the new variables
   take effect.

**Locally (only if you run the app on your own computer):**

Create a file named `.env.local` in the `my-next-app` folder with the same
variables, then restart `npm run dev`.

## Step 5 — Set up the webhook

The webhook is how Stripe tells your app "this clinic just paid" or "this
subscription was cancelled", so the plan updates automatically.

1. In the Stripe Dashboard go to **Developers** → **Webhooks** →
   **Add endpoint**.
2. Endpoint URL:
   `https://YOUR-DEPLOYED-DOMAIN/api/billing/webhook`
   (replace `YOUR-DEPLOYED-DOMAIN` with your real Vercel domain).
3. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
4. Click **Add endpoint**.
5. On the endpoint page, click **Reveal** under **Signing secret** and copy
   the value (starts with `whsec_`) → `STRIPE_WEBHOOK_SECRET`.
6. Add/update that variable in Vercel and **redeploy once more**.

## Step 6 — Test the whole flow

1. Open your deployed app and **log in**.
2. Go to **Pricing** and click **Upgrade to Pro** on the Professional plan.
3. You are redirected to Stripe's secure checkout page. Pay with the test
   card:
   - Card number: **4242 4242 4242 4242**
   - Expiry: any future date (e.g. 12/34)
   - CVC: any 3 digits (e.g. 123)
4. After payment you land back on the **Billing** page with a green
   "Subscription activated" message. Your plan now shows **Professional ·
   Active**, and the first invoice appears in the **Subscription Invoices**
   table.
5. Click **Manage Billing** — it opens the Stripe billing portal, where you
   can update the card or **cancel** the subscription. After cancelling, the
   app shows the plan ending at the current period end.

---

### Good to know

- Test mode is fully separate from real payments: test cards like
  `4242 4242 4242 4242` only work in test mode, and real cards never work
  there. **No real money ever moves.**
- If checkout says "Stripe price not configured", the
  `STRIPE_PRICE_PRO_MONTHLY` variable is missing — redo Step 4 and redeploy.
- If the plan doesn't update after payment, the webhook is usually the
  problem — check the endpoint URL and `STRIPE_WEBHOOK_SECRET` (Step 5).
  The Billing page also re-checks your status directly with Stripe each time
  it loads.
