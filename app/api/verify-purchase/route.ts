import Stripe from 'stripe';
import { adminDb } from '@/lib/firebase-admin';
import { getProductConfig } from '@/lib/ebook-access.server';

export const runtime = 'nodejs';

/**
 * Confirms a Stripe session paid, and (belt-and-suspenders) records the
 * entitlement in case the webhook was delayed. Called from the client after the
 * post-checkout redirect.
 */
export async function GET(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return Response.json({ error: 'Not configured' }, { status: 503 });
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const url = new URL(req.url);
  const sessionId = url.searchParams.get('session_id');
  const productId = url.searchParams.get('product');
  if (!sessionId || !productId) {
    return Response.json({ error: 'Missing session_id or product' }, { status: 400 });
  }

  const product = getProductConfig(productId);
  if (!product) return Response.json({ error: 'Product not found' }, { status: 404 });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === 'paid';
    const email = (session.metadata?.email || session.customer_email || '').toLowerCase();

    if (paid && email) {
      const db = adminDb();
      if (db) {
        await db
          .collection('entitlements')
          .doc(`${email}__${productId}`)
          .set(
            { email, productId, sessionId, purchasedAt: new Date().toISOString() },
            { merge: true }
          );
      }
      return Response.json({ verified: true, email, productId });
    }
    return Response.json({ verified: false }, { status: 402 });
  } catch (err) {
    console.error('[verify-purchase] error', err);
    return Response.json({ error: 'Verification failed' }, { status: 500 });
  }
}
