import Stripe from 'stripe';
import { adminDb } from '@/lib/firebase-admin';

export const runtime = 'nodejs';

/**
 * Stripe webhook. MUST read the RAW request body for signature verification —
 * App Router gives us that via req.text() (do not parse as JSON first).
 * On a completed checkout, records a permanent entitlement in Firestore so the
 * buyer can re-download anytime.
 */
export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return Response.json({ error: 'Webhook not configured' }, { status: 503 });
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const sig = req.headers.get('stripe-signature');
  if (!sig) return Response.json({ error: 'Missing signature' }, { status: 400 });

  let event: Stripe.Event;
  try {
    const raw = await req.text(); // RAW body — critical for verification
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('[webhook] signature verification failed', err);
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = (session.metadata?.email || session.customer_email || '').toLowerCase();
    const productId = session.metadata?.productId;

    if (email && productId) {
      const db = adminDb();
      if (db) {
        try {
          // Permanent entitlement — keyed by email+product, never expires.
          await db
            .collection('entitlements')
            .doc(`${email}__${productId}`)
            .set(
              {
                email,
                productId,
                sessionId: session.id,
                purchasedAt: new Date().toISOString(),
              },
              { merge: true }
            );
        } catch (err) {
          console.error('[webhook] failed to record entitlement', err);
          // Still 200 so Stripe doesn't retry forever; investigate via logs.
        }
      }
    }
  }

  return Response.json({ received: true });
}
