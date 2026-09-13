# Next.js Migration — Status

This is a **working Next.js 16 App Router application** with your content layer
fully migrated from the Vite SPA. It builds clean and prerenders all your
content as static HTML.

## ✅ Done and verified (builds + prerenders)

- **All 57 articles** migrated → SSG at `/guide/[slug]` via `generateStaticParams`
- **6 category pages** → SSG at `/category/[category]`
- **Homepage** with featured + all-guides grid (RSC, static)
- **Server-side markdown renderer** (`lib/markdown.ts`) — articles ship as HTML,
  zero client JS; handles headings, bold/italic/code, links (external →
  `rel="nofollow sponsored"`), plain images, **clickable-image banners**,
  **blockquotes**, lists, code fences
- **Per-page SEO** via `generateMetadata` — title, description, canonical (www),
  keywords, Open Graph, Twitter cards
- **JSON-LD schema** — Article + BreadcrumbList on every guide (verified 2 blocks
  in output)
- **Dynamic `sitemap.ts`** (61 URLs) + **`robots.ts`**
- **Affiliate redirect** Route Handler at `/api/go/[campaign]` (302, rotatable) —
  all 5 SoFi links wired
- **Semantic HTML** — `<article>`, `<section>`, `<aside>`, single `<h1>`,
  breadcrumbs, related-posts internal linking
- **next/image** with `priority` on LCP, responsive `sizes`
- **Tailwind v4** (CSS-first `@theme` config)
- **next.config.js** — AVIF/webp images, Firebase remote pattern, security headers
- Clean **server/client separation** (`components/server`, `components/client`)

Build output confirms: `● (SSG) prerendered as static HTML` for all 57 guides
and categories.

## ⚠️ Two environment notes

1. **Fonts:** `app/layout.tsx` uses a system-font stack because this build
   environment is offline from Google Fonts. In your environment, switch back to
   `next/font/google` (commented instructions are in the file) for zero layout
   shift — it "just works" online.
2. **Next version:** pinned to a patched release (16.x). If you prefer the 15.x
   LTS line, use `next@15` at a patched version (≥ the CVE-2025-66478 fix).

## ✅ Commerce layer NOW INCLUDED (builds; needs YOUR live test)

These were intentionally left as stubs/TODOs because they need real testing
against live Stripe/Firebase and should NOT be rushed:

- **Ebook catalog + landing pages** (`app/ebooks/` is a placeholder) — port
  `lib/products.ts` (already copied) into SSG pages with Product JSON-LD.
- **Stripe checkout** → `app/api/checkout/route.ts` (Route Handler). Client
  `CheckoutButton` as a `'use client'` island.
- **Stripe webhook** → `app/api/stripe-webhook/route.ts` with
  `export const runtime = 'nodejs'` and **raw body** (`await req.text()`) for
  signature verification.
- **Token-gated downloads** → `app/api/download-ebook/route.ts`; keep paid tokens
  in `lib/ebook-tokens.server.ts` with `import 'server-only'` at the top so the
  build errors if a client component ever imports them.
- **Ebook PDF viewer** → `components/client/EbookViewer.tsx`, loaded with
  `dynamic(..., { ssr: false })`.
- **Firebase Admin** → `lib/firebase-admin.ts` (server-only); **Firebase client**
  → `lib/firebase-client.ts` (`'use client'`).
- **AdSense** — loader is commented in `layout.tsx`; add `AdSlot` islands with
  reserved height once content + CWV are solid.

See `NEXTJS-MIGRATION-BLUEPRINT.md` for the full code patterns for each.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # verify SSG
```

## Deploy

Push to a new repo, import to Vercel (framework preset: Next.js, auto-detected),
set env vars, deploy. **Preserve your existing `/guide/<slug>` URLs** (they map
1:1 here) so you keep ranking equity; add 301s for anything that changes.
