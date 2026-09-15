import {
  adminAuth,
  adminDb,
  adminBucket,
  isAdminEmail,
} from '@/lib/firebase-admin';

import {
  getProductConfig,
  resolveDownloadUrl,
} from '@/lib/ebook-access.server';

export const runtime = 'nodejs';

/**
 * Check whether this email has a permanent entitlement for the product.
 */
async function hasEntitlement(
  email: string,
  productId: string
): Promise<boolean> {
  const db = adminDb();

  if (!db) return false;

  try {
    const entitlementId =
      `${email.trim().toLowerCase()}__${productId}`;

    const doc = await db
      .collection('entitlements')
      .doc(entitlementId)
      .get();

    return doc.exists;
  } catch (error) {
    console.error('Entitlement lookup failed:', error);
    return false;
  }
}

/**
 * Verify the Firebase ID token sent by the browser.
 */
async function getAuthenticatedEmail(
  req: Request
): Promise<string | null> {
  try {
    const authorization = req.headers.get('authorization') || '';

    if (!authorization.startsWith('Bearer ')) {
      return null;
    }

    const idToken = authorization.substring(7).trim();

    if (!idToken) {
      return null;
    }

    const auth = adminAuth();

    if (!auth) {
      console.error('Firebase Admin Auth is not configured.');
      return null;
    }

    const decodedToken = await auth.verifyIdToken(idToken);

    const email = decodedToken.email?.trim().toLowerCase();

    return email || null;
  } catch (error) {
    console.error('Firebase ID token verification failed:', error);
    return null;
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const productId =
      url.searchParams.get('productId')?.trim() || '';

    const wantsRedirect =
      url.searchParams.get('redirect') === '1';

    if (!productId) {
      return Response.json(
        { error: 'Missing productId' },
        { status: 400 }
      );
    }

    const product = getProductConfig(productId);

    if (!product) {
      return Response.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    /*
     * Free books:
     * Anyone can access.
     *
     * Paid books:
     * The browser must provide a valid Firebase ID token.
     *
     * The email is taken from the VERIFIED Firebase token,
     * never from a URL parameter.
     */
    let authenticatedEmail: string | null = null;

    if (!product.isFree) {
      authenticatedEmail = await getAuthenticatedEmail(req);

      if (!authenticatedEmail) {
        return Response.json(
          { error: 'Please sign in to access this ebook.', code: 'AUTH_REQUIRED' },
          { status: 401 }
        );
      }

      const isAdmin = isAdminEmail(authenticatedEmail);
      const hasPurchase = await hasEntitlement(authenticatedEmail, product.id);

      if (!isAdmin && !hasPurchase) {
        return Response.json(
          { error: 'Purchase required', code: 'PURCHASE_REQUIRED' },
          { status: 403 }
        );
      }
    }

    /*
     * Resolve Firebase Storage file.
     */
    const downloadUrl = await resolveDownloadUrl(
      product.storagePath,
      adminBucket
    );

    if (!downloadUrl) {
      return Response.json(
        { error: 'File unavailable' },
        { status: 404 }
      );
    }

    /*
     * Redirect mode.
     */
    if (wantsRedirect) {
      return Response.redirect(downloadUrl, 302);
    }

    /*
     * JSON mode.
     */
    return Response.json({
      url: downloadUrl,
      filename: `${product.id}.pdf`,
    });
  } catch (error) {
    console.error('Ebook access API error:', error);

    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}