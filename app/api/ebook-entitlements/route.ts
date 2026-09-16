import { adminAuth, adminDb, isAdminEmail } from '@/lib/firebase-admin';
import { getProductConfig, PRODUCTS_CONFIG } from '@/lib/ebook-access.server';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const authorization = req.headers.get('authorization') || '';
  if (!authorization.startsWith('Bearer ')) return Response.json({ productIds: [] }, { status: 401 });

  try {
    const token = authorization.slice(7).trim();
    const auth = adminAuth();
    const db = adminDb();
    if (!auth || !db) return Response.json({ error: 'Firebase Admin is not configured' }, { status: 503 });

    const decoded = await auth.verifyIdToken(token);
    const email = decoded.email?.trim().toLowerCase();
    if (!email) return Response.json({ productIds: [] });

    if (isAdminEmail(email)) return Response.json({ productIds: Object.keys(PRODUCTS_CONFIG) });

    const snapshot = await db.collection('entitlements').where('email', '==', email).get();
    const productIds = snapshot.docs
      .map((doc) => doc.data()?.productId)
      .filter((id): id is string => typeof id === 'string' && !!getProductConfig(id));

    return Response.json({ productIds: Array.from(new Set(productIds)) });
  } catch (error) {
    console.error('Ebook entitlement lookup failed:', error);
    return Response.json({ error: 'Unable to check ebook access' }, { status: 500 });
  }
}
