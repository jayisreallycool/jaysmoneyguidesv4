/**
 * Ebook preview content for the modal viewer
 * Contains chapter previews and supplementary content for all 3 ebooks
 * Supports multiple page types: text, section, image, heading, cover, backCover
 */

export type PageType = 'cover' | 'backCover' | 'text' | 'section' | 'image' | 'heading';

export interface BulletPoint {
  title?: string;
  items: string[];
}

export interface CalloutBox {
  type: 'tip' | 'warning' | 'note';
  title?: string;
  text?: string;
  message?: string;
}

export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface EbookPage {
  pageNumber: number;
  type?: PageType;
  chapterTitle?: string;
  content?: string;
  text?: string;
  sectionTitle?: string;
  paragraphs?: string[];
  bulletPoints?: BulletPoint;
  image?: string;
  imageCaption?: string;
  table?: TableData;
  callout?: CalloutBox;
  author?: string;
}

export interface EbookData {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  author?: string;
  pages: EbookPage[];
}

/**
 * Free Ebook Vol 1: Affiliate Marketing for Beginners
 */
export const FREE_EBOOK_VOL1: EbookData = {
  id: 'ebook-affiliate-beginners-free',
  title: 'Affiliate Marketing for Beginners',
  subtitle: 'Your First $1,000 in Affiliate Commissions',
  date: 'August 2026',
  author: 'Jay Lopez',
  pages: [
    {
      pageNumber: 1,
      type: 'cover',
      chapterTitle: 'Affiliate Marketing for Beginners',
      content: 'Your First $1,000 in Affiliate Commissions',
    },
    {
      pageNumber: 2,
      chapterTitle: 'Introduction',
      content: 'Learn the fundamentals of affiliate marketing and how to start earning your first commissions today.',
    },
    {
      pageNumber: 3,
      sectionTitle: 'Chapter 1: What is Affiliate Marketing?',
      paragraphs: [
        'Affiliate marketing is promoting other people\'s products in exchange for a commission on sales.',
        'This guide will teach you everything you need to know to get started.',
      ],
    },
    {
      pageNumber: 4,
      sectionTitle: 'Chapter 2: Getting Started',
      paragraphs: [
        'Sign up for affiliate programs, get your links, and start promoting within 5 minutes.',
        'Follow these simple steps to launch your affiliate career today.',
      ],
    },
  ],
};

/**
 * Paid Ebook Vol 2: Affiliate Marketing Blueprint (Master Edition)
 */
export const PAID_EBOOK_VOL2: EbookData = {
  id: 'ebook-affiliate-blueprint-vol1',
  title: 'Affiliate Marketing Blueprint',
  subtitle: 'The Complete System to Generate $10k/Month',
  date: 'August 2026',
  author: 'Jay Lopez',
  pages: [
    {
      pageNumber: 1,
      type: 'cover',
      chapterTitle: 'Affiliate Marketing Blueprint',
      content: 'The Complete System to Generate $10k/Month in Passive Income',
    },
    {
      pageNumber: 2,
      chapterTitle: 'Master Edition Introduction',
      content: 'This comprehensive guide contains everything you need to build a $10k+/month affiliate business.',
    },
    {
      pageNumber: 3,
      sectionTitle: 'Chapter 1: Niche Selection',
      paragraphs: [
        'Discover the exact criteria for choosing high-conversion affiliate niches.',
        'Your niche choice will determine 80% of your success.',
      ],
      bulletPoints: {
        title: 'Key Criteria:',
        items: [
          'Market size and demand',
          'Competition level',
          'Profit potential',
          'Audience interest',
        ],
      },
    },
    {
      pageNumber: 4,
      sectionTitle: 'Chapter 2: Landing Page Mastery',
      paragraphs: [
        'Learn the psychology and tactics behind high-converting landing pages.',
        'These techniques have been tested on thousands of visitors.',
      ],
    },
    {
      pageNumber: 5,
      sectionTitle: 'Chapter 3: Traffic Generation',
      paragraphs: [
        'Multiple traffic sources that generate consistent, qualified visitors.',
      ],
      bulletPoints: {
        title: 'Traffic Sources:',
        items: [
          'Content marketing',
          'Paid advertising',
          'Email marketing',
          'Social media',
          'Partnerships',
        ],
      },
    },
  ],
};

/**
 * Paid Ebook Vol 3: Complete SEO Mastery Guide
 */
export const SEO_GUIDE_EBOOK: EbookData = {
  id: 'ebook-seo-mastery-guide',
  title: 'Complete SEO Mastery Guide',
  subtitle: 'Rank #1 on Google Without Paid Ads',
  date: 'August 2026',
  author: 'Jay Lopez',
  pages: [
    {
      pageNumber: 1,
      type: 'cover',
      chapterTitle: 'Complete SEO Mastery Guide',
      content: 'Rank #1 on Google Without Paid Ads',
    },
    {
      pageNumber: 2,
      chapterTitle: 'Introduction',
      content: 'Master search engine optimization and dominate Google rankings organically.',
    },
    {
      pageNumber: 3,
      sectionTitle: 'Chapter 1: Keyword Research',
      paragraphs: [
        'Find zero-competition keywords that convert using proven research techniques.',
        'Keyword selection is the foundation of all SEO success.',
      ],
      bulletPoints: {
        title: 'Research Steps:',
        items: [
          'Use search volume data',
          'Analyze competition',
          'Focus on intent',
          'Find long-tail keywords',
        ],
      },
    },
    {
      pageNumber: 4,
      sectionTitle: 'Chapter 2: On-Page Optimization',
      paragraphs: [
        'Optimize every element of your pages for maximum search visibility.',
      ],
    },
    {
      pageNumber: 5,
      sectionTitle: 'Chapter 3: Technical SEO',
      paragraphs: [
        'Master technical SEO foundations for crawling and indexing.',
      ],
      callout: {
        type: 'tip',
        title: 'Pro Tip',
        message: 'Technical SEO is 30% of your ranking factor.',
      },
    },
  ],
};

/**
 * Map of all ebook content by product ID
 */
export const EBOOK_CONTENT_MAP: Record<string, EbookData> = {
  'ebook-affiliate-beginners-free': FREE_EBOOK_VOL1,
  'ebook-affiliate-blueprint-vol1': PAID_EBOOK_VOL2,
  'ebook-seo-mastery-guide': SEO_GUIDE_EBOOK,
};

/**
 * Get ebook content by product ID
 */
export function getEbookContent(productId: string): EbookData | null {
  return EBOOK_CONTENT_MAP[productId] || null;
}
