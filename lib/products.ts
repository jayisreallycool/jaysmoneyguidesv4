/**
 * Product Catalog - Updated to match src/types.ts Product interface
 */

import { Product } from './types';
const getFirebaseStorageUrl = (p: string) => `https://firebasestorage.googleapis.com/v0/b/jaysmoneyguides.firebasestorage.app/o/${encodeURIComponent(p)}?alt=media`;

// Ebook covers are served from Firebase Storage (bucket
// jaysmoneyguides.firebasestorage.app) via getFirebaseStorageUrl, which builds
// a tokenless ?alt=media URL against the real bucket. NOTE: for these to
// render, the cover files must actually exist at ebooks/covers/<name> in
// Storage AND Storage rules must allow public read of that path. If a cover is
// missing the card falls back to its onError placeholder.

export const PRODUCTS: Product[] = [
  {
    id: 'ebook-affiliate-blueprint-vol1',
    slug: 'affiliate-marketing-blueprint',
    type: 'ebook',
    title: 'Affiliate Marketing Blueprint',
    subtitle: 'Complete guide to building profitable affiliate businesses',
    author: 'Jay',
    coverImage: getFirebaseStorageUrl('ebooks/covers/affiliate marketing complete guide with 30 day program.webp'),
    priceCents: 999,
    isFree: false,
    category: 'Ebooks',
    description: 'Master affiliate marketing strategies and build a profitable business from scratch.',
    previewChapters: [
      'Chapter 1: Finding Your Niche',
      'Chapter 2: Building Authority',
      'Chapter 3: Monetization Strategies'
    ],
    previewExcerpt: 'Everything you need to know about affiliate marketing...',
    pageCount: 150,
    storagePath: 'ebooks/downloads/1.JaysMoneyGuides_Affiliate_Marketing_For_Beginners_Vol_1.pdf',
    featured: true,
  },
  {
    id: 'ebook-seo-mastery-guide',
    slug: 'seo-mastery-guide',
    type: 'ebook',
    title: 'Complete SEO Mastery Guide',
    subtitle: 'Advanced techniques to rank on Google and drive organic traffic',
    author: 'Jay',
    coverImage: getFirebaseStorageUrl('ebooks/covers/affiliatemarketingjaysmoneyguides seo guide for beginners.webp'),
    priceCents: 999,
    isFree: false,
    category: 'Ebooks',
    description: 'Master search engine optimization and drive consistent organic traffic to your sites.',
    previewChapters: [
      'Chapter 1: Keyword Research',
      'Chapter 2: On-Page SEO',
      'Chapter 3: Link Building'
    ],
    previewExcerpt: 'The complete guide to ranking higher on Google...',
    pageCount: 200,
    storagePath: 'ebooks/downloads/3.Jaysmoneyguides complete seo guide.pdf',
    featured: true,
  },
  {
    id: 'ebook-affiliate-beginners-free',
    slug: 'affiliate-marketing-beginners',
    type: 'ebook',
    title: 'Affiliate Marketing for Beginners',
    subtitle: 'Your first steps into profitable affiliate marketing',
    author: 'Jay',
    coverImage: getFirebaseStorageUrl('ebooks/covers/Affiliate Marketing Cover Page Jaysmoneyguides ebook.webp'),
    priceCents: 0,
    isFree: true,
    category: 'Ebooks',
    description: 'Learn the fundamentals of affiliate marketing completely free. Perfect starting point for beginners.',
    previewChapters: [
      'Chapter 1: Affiliate Marketing 101',
      'Chapter 2: Choosing Products',
      'Chapter 3: First Campaign'
    ],
    previewExcerpt: 'Get started with affiliate marketing today...',
    pageCount: 80,
    storagePath: 'ebooks/free/2.jaysmoneyguides Affiliate_Marketing_for_Beginners_free_book.pdf',
    featured: false,
  },
  {
    id: 'ebook-start-successful-blog',
    slug: 'how-to-start-a-successful-blog',
    type: 'ebook',
    title: 'How to Start a Successful Blog',
    subtitle: 'Launch, grow, and monetize a blog that lasts',
    author: 'Jay',
    coverImage: getFirebaseStorageUrl('ebooks/covers/affiliatemarketingjaysmoneyguides seo guide for beginners.webp'),
    priceCents: 999,
    isFree: false,
    category: 'Ebooks',
    description: 'A step-by-step guide to launching a blog, creating content that ranks, and turning it into a sustainable income stream.',
    previewChapters: [
      'Chapter 1: Choosing Your Niche',
      'Chapter 2: Setting Up Your Blog',
      'Chapter 3: Creating Content That Ranks'
    ],
    previewExcerpt: 'Everything you need to start a blog that actually earns...',
    pageCount: 60,
    storagePath: 'ebooks/downloads/JaysMoneyGuides-How-to-Start-a-Successful-Blog.pdf',
    featured: false,
  },
  {
    id: 'ebook-seo-digital-empire-blueprint',
    slug: 'seo-digital-empire-blueprint',
    type: 'ebook',
    title: 'SEO & Digital Empire Blueprint',
    subtitle: 'Build a scalable, search-driven online business',
    author: 'Jay',
    coverImage: getFirebaseStorageUrl('ebooks/covers/affiliate marketing complete guide with 30 day program.webp'),
    priceCents: 999,
    isFree: false,
    category: 'Ebooks',
    description: 'Advanced SEO and business-building strategies for creating a durable digital empire that compounds over time.',
    previewChapters: [
      'Chapter 1: The Empire Mindset',
      'Chapter 2: Search-Driven Growth',
      'Chapter 3: Scaling Systems'
    ],
    previewExcerpt: 'Turn search traffic into a scalable digital business...',
    pageCount: 150,
    storagePath: 'ebooks/downloads/Jaysmoneyguides_SEO & Digital Empire Blueprint.pdf',
    featured: false,
  },
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find(p => p.slug === slug);
}

export function getFreeProducts(): Product[] {
  return PRODUCTS.filter(p => p.isFree);
}

export function getPaidProducts(): Product[] {
  return PRODUCTS.filter(p => !p.isFree);
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter(p => p.featured);
}

export function formatPrice(priceCents: number): string {
  if (priceCents === 0) return 'Free';
  return `$${(priceCents / 100).toFixed(2)}`;
}
