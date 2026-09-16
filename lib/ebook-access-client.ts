'use client';
import type { Product } from './types';

const BUCKET = 'jaysmoneyguides.firebasestorage.app';
const FREE_PATH = 'ebooks/free/2.jaysmoneyguides Affiliate_Marketing_for_Beginners_free_book.pdf';
const FREE_TOKEN = '4123052f-7f35-4501-9139-7da278db03a9';

/** Free book: direct token URL. Paid: resolve via the gated API route. */
export async function resolveEbookDownloadUrl(product: Product): Promise<string> {
  const clean = (product.storagePath || '').replace(/^\/+/, '');
  if (product.isFree && clean === FREE_PATH) {
    return `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(clean)}?alt=media&token=${FREE_TOKEN}`;
  }
  // Paid — ask the server (enforces entitlement/admin).
  try {
    const res = await fetch(`/api/download-ebook?productId=${encodeURIComponent(product.id)}`);
    const data = await res.json();
    if (data.url) return data.url as string;
  } catch { /* fall through */ }
  return '';
}

export function getLocalEbookPdfPath(product: Product): string {
  const clean = (product?.storagePath || '').replace(/^\/+/, '');
  if (!clean) return '';
  if (clean === FREE_PATH) {
    return `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(clean)}?alt=media&token=${FREE_TOKEN}`;
  }
  return `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(clean)}?alt=media`;
}

export function formatEbookErrorMessage(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err ?? '');
  if (/purchase|403|own/i.test(msg)) return 'This ebook requires a purchase.';
  return 'This ebook is temporarily unavailable. Please try again.';
}
