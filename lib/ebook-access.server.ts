import 'server-only';

/**
 * SERVER-ONLY ebook access config: real Storage download tokens + product
 * catalog used by the download/checkout routes. The `server-only` import above
 * makes the build FAIL if any client component imports this, so paid tokens can
 * never reach the browser.
 */

const BUCKET = 'jaysmoneyguides.firebasestorage.app';

export interface EbookConfig {
  id: string;
  name: string;
  priceCents: number;
  isFree: boolean;
  storagePath: string;
}

export const PRODUCTS_CONFIG: Record<string, EbookConfig> = {
  'ebook-affiliate-blueprint-vol1': {
    id: 'ebook-affiliate-blueprint-vol1',
    name: 'Affiliate Marketing Blueprint',
    priceCents: 999,
    isFree: false,
    storagePath: 'ebooks/downloads/1.JaysMoneyGuides_Affiliate_Marketing_For_Beginners_Vol_1.pdf',
  },
  'ebook-seo-mastery-guide': {
    id: 'ebook-seo-mastery-guide',
    name: 'Complete SEO Mastery Guide',
    priceCents: 999,
    isFree: false,
    storagePath: 'ebooks/downloads/3.Jaysmoneyguides complete seo guide.pdf',
  },
  'ebook-affiliate-beginners-free': {
    id: 'ebook-affiliate-beginners-free',
    name: 'Affiliate Marketing for Beginners',
    priceCents: 0,
    isFree: true,
    storagePath: 'ebooks/free/2.jaysmoneyguides Affiliate_Marketing_for_Beginners_free_book.pdf',
  },
  'ebook-start-successful-blog': {
    id: 'ebook-start-successful-blog',
    name: 'How to Start a Successful Blog',
    priceCents: 999,
    isFree: false,
    storagePath: 'ebooks/downloads/JaysMoneyGuides-How-to-Start-a-Successful-Blog.pdf',
  },
  'ebook-seo-digital-empire-blueprint': {
    id: 'ebook-seo-digital-empire-blueprint',
    name: 'SEO & Digital Empire Blueprint',
    priceCents: 999,
    isFree: false,
    storagePath: 'ebooks/downloads/Jaysmoneyguides_SEO & Digital Empire Blueprint.pdf',
  },
};

const TOKENS: Record<string, string> = {
  'ebooks/downloads/1.JaysMoneyGuides_Affiliate_Marketing_For_Beginners_Vol_1.pdf': '92c78078-2858-4b49-93e1-e95452a79900',
  'ebooks/downloads/3.Jaysmoneyguides complete seo guide.pdf': 'aeddaa6f-9e21-412b-9edf-a345fd1f5857',
  'ebooks/downloads/JaysMoneyGuides-How-to-Start-a-Successful-Blog.pdf': 'b275c937-ee6f-4ea2-ba2a-3dc367419c8a',
  'ebooks/downloads/Jaysmoneyguides_SEO & Digital Empire Blueprint.pdf': '03b5d134-8c45-4593-b4d3-c8722d46b1a3',
  'ebooks/free/2.jaysmoneyguides Affiliate_Marketing_for_Beginners_free_book.pdf': '4123052f-7f35-4501-9139-7da278db03a9',
};

export function getProductConfig(id: string): EbookConfig | null {
  return PRODUCTS_CONFIG[id] ?? null;
}

/** A working tokenized Storage URL for a given path, or '' if unknown. */
export function getTokenUrl(storagePath: string): string {
  const clean = storagePath.replace(/^\/+/, '');
  const token = TOKENS[clean];
  if (!token) return '';
  return `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(clean)}?alt=media&token=${token}`;
}

/**
 * Resolve a download URL for a product: prefer a short-lived Admin signed URL,
 * fall back to the durable token URL so downloads work even without Admin creds.
 */
export async function resolveDownloadUrl(
  storagePath: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adminBucket: (() => any) | null
): Promise<string> {
  const clean = storagePath.replace(/^\/+/, '');
  try {
    const bucket = adminBucket?.();
    if (bucket) {
      const [url] = await bucket.file(clean).getSignedUrl({
        action: 'read',
        expires: Date.now() + 60 * 60 * 1000, // 1 hour
      });
      if (url) return url as string;
    }
  } catch {
    // fall through to token URL
  }
  const tokenUrl = getTokenUrl(clean);
  if (tokenUrl) return tokenUrl;
  return `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(clean)}?alt=media`;
}
