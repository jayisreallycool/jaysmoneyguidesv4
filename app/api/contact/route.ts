import { adminDb } from '@/lib/firebase-admin';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = typeof body?.name === 'string' ? body.name.trim().slice(0, 120) : '';
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const subject = typeof body?.subject === 'string' ? body.subject.trim().slice(0, 200) : '';
    const message = typeof body?.message === 'string' ? body.message.trim().slice(0, 5000) : '';
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message) return Response.json({ error: 'Name, valid email, and message are required' }, { status: 400 });
    const db = adminDb();
    if (!db) return Response.json({ error: 'Contact service is not configured' }, { status: 503 });
    await db.collection('contacts').add({ name, email, subject, message, createdAt: new Date().toISOString(), read: false });
    return Response.json({ success: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return Response.json({ error: 'Unable to send your message right now' }, { status: 500 });
  }
}
