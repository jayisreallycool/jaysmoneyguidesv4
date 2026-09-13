# Commerce Layer — What You Must Test Live

The full commerce layer is written and **builds clean**, but I cannot run it
against your real Stripe/Firebase from this environment. These are the exact
things only you can verify. Do them in Stripe **test mode** first.

## Environment variables (set in Vercel)

Server:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `FIREBASE_SERVICE_ACCOUNT_KEY`  (full service-account JSON, or `FIREBASE_PRIVATE_KEY` + `FIREBASE_CLIENT_EMAIL`)
- `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`
- `SITE_URL=https://www.jaysmoneyguides.com`

Client (if you add Firebase client auth later): `NEXT_PUBLIC_FIREBASE_*`
(Note: Next uses `NEXT_PUBLIC_` prefix, not `VITE_`.)

## Stripe webhook setup

1. Stripe Dashboard → Developers → Webhooks → add endpoint:
   `https://www.jaysmoneyguides.com/api/stripe-webhook`
2. Subscribe to `checkout.session.completed`.
3. Copy the signing secret → set as `STRIPE_WEBHOOK_SECRET`.

## The one test that proves everything

In Stripe **test mode**:
1. Open an ebook landing page → click **Buy now** → enter an email.
2. Complete checkout with a Stripe test card (`4242 4242 4242 4242`).
3. Confirm you're redirected back to `/ebooks?purchase=success&...`.
4. Confirm the webhook fired (Stripe Dashboard → webhook logs → 200).
5. Confirm an `entitlements/<email>__<productId>` doc appears in Firestore.
6. Hit `GET /api/download-ebook?productId=<id>&email=<the email>` → should
   return the real Storage URL (not 403).
7. Confirm the free book downloads with no email/purchase.

If all 7 pass, checkout + entitlement + download work end to end.

## Known-correct-but-unverified pieces

- **Raw-body webhook:** the handler uses `await req.text()` (required). If
  signature verification fails, it's almost always because a proxy/middleware
  altered the body — not the code.
- **Firebase Admin:** if `FIREBASE_SERVICE_ACCOUNT_KEY` is unset/malformed,
  `adminDb()`/`adminBucket()` return null and the code falls back to token URLs
  gracefully (free downloads still work; paid entitlement checks will fail
  closed → 403, which is the safe direction).
- **Storage rules:** publish rules so `ebooks/downloads/*` is server-only and
  `ebooks/free/*` + `ebooks/covers/*` are public (same as the Vite project's
  `storage.rules`).

## Still TODO (optional, non-blocking)

- Firebase **client** SDK + auth UI (login), if you want logged-in re-downloads
  without re-entering email. Currently email-based, which works fine.
- The post-checkout success handler on `/ebooks` (read `?purchase=success`,
  call `/api/verify-purchase`, show the download). Straightforward client island.
- AdSense slots once content + CWV are confirmed.
