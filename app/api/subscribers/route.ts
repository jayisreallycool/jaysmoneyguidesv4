import { adminDb } from '@/lib/firebase-admin';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: 'Valid email required' }, { status: 400 });
    const db = adminDb();
    if (!db) return Response.json({ error: 'Newsletter service is not configured' }, { status: 503 });
    await db.collection('subscribers').doc(email).set({ email, subscribedAt: new Date().toISOString(), source: 'website' }, { merge: true });
    return Response.json({ success: true });
  } catch (error) {
    console.error('Subscriber API error:', error);
    return Response.json({ error: 'Unable to subscribe right now' }, { status: 500 });
  }
}
