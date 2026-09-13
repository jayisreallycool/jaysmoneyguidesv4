import { adminDb, adminBucket, isAdminEmail } from '@/lib/firebase-admin';
import { getProductConfig, resolveDownloadUrl } from '@/lib/ebook-access.server';

export const runtime = 'nodejs';

/** Has this email purchased this product? (permanent, order-based) */
async function hasEntitlement(email: string, productId: string): Promise<boolean> {
  const db = adminDb();
  if (!db) return false;
  try {
    const doc = await db.collection('entitlements').doc(`${email.toLowerCase()}__${productId}`).get();
    return doc.exists;
  } catch {
    return false;
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const productId = url.searchParams.get('productId');
  const email = url.searchParams.get('email')?.toLowerCase() || '';
  const wantsRedirect = url.searchParams.get('redirect') === '1';

  if (!productId) return Response.json({ error: 'Missing productId' }, { status: 400 });

  const product = getProductConfig(productId);
  if (!product) return Response.json({ error: 'Product not found' }, { status: 404 });

  // Access control:
  //  - free books: anyone
  //  - paid books: admin (email or ADMIN_ACCESS_KEY) OR a recorded purchase
  if (!product.isFree) {
    const adminKey = url.searchParams.get('adminKey') || req.headers.get('x-admin-key') || '';
    const isAdminByKey = !!process.env.ADMIN_ACCESS_KEY && adminKey === process.env.ADMIN_ACCESS_KEY;
    const allowed =
      isAdminByKey ||
      isAdminEmail(email) ||
      (email && (await hasEntitlement(email, product.id)));
    if (!allowed) {
      return Response.json({ error: 'Purchase required' }, { status: 403 });
    }
  }

  const downloadUrl = await resolveDownloadUrl(product.storagePath, adminBucket);
  if (!downloadUrl) return Response.json({ error: 'File unavailable' }, { status: 404 });

  if (wantsRedirect) {
    return Response.redirect(downloadUrl, 302);
  }
  return Response.json({ url: downloadUrl, filename: `${product.id}.pdf` });
}
