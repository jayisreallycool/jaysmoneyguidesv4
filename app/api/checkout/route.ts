import Stripe from 'stripe';
import { getProductConfig } from '@/lib/ebook-access.server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return Response.json({ error: 'Payments are not configured yet.' }, { status: 503 });
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const body = (await req.json().catch(() => ({}))) as {
      productId?: string;
      origin?: string;
    };
    const productId = body.productId?.trim();

    if (!productId) {
      return Response.json({ error: 'Missing required field: productId' }, { status: 400 });
    }

    const product = getProductConfig(productId);
    if (!product) return Response.json({ error: 'Product not found' }, { status: 404 });
    if (product.isFree) return Response.json({ error: 'This ebook is free.' }, { status: 400 });

    // Reliable base URL: SITE_URL → client origin → request origin.
    const originHeader = req.headers.get('origin') || req.headers.get('referer') || undefined;
    const base = (
      process.env.SITE_URL ||
      body.origin ||
      (originHeader ? new URL(originHeader).origin : undefined) ||
      'https://www.jaysmoneyguides.com'
    ).replace(/\/+$/, '');

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      // Don't pre-fill email — let Stripe's form collect it from the user
      // This gives users a chance to use a different email if needed
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { 
              name: product.name,
              images: product.coverImage ? [product.coverImage] : undefined,
            },
            unit_amount: product.priceCents,
          },
          quantity: 1,
        },
      ],
      // Omitting payment_method_types lets Stripe show every enabled method.
      metadata: { productId: product.id },
      success_url: `${base}/?purchase=success&session_id={CHECKOUT_SESSION_ID}&product=${encodeURIComponent(product.id)}`,
      cancel_url: `${base}/?purchase=cancel`,
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error('[checkout] error', err);
    return Response.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
