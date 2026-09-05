import type { BlogPost } from './types';

export const SITE = 'https://www.jaysmoneyguides.com';
export const SITE_NAME = 'JaysMoneyGuides';

export function articleSchema(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: [post.coverImage],
    datePublished: post.publishedAt,
    dateModified: (post as { updatedAt?: string }).updatedAt ?? post.publishedAt,
    author: { '@type': 'Person', name: post.author?.name ?? 'Jay Lopez' },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE}/images/jaysmoneyguides-logo.webp`,
      },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}/guide/${post.slug}` },
  };
}

export function breadcrumbSchema(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      {
        '@type': 'ListItem',
        position: 2,
        name: post.category,
        item: `${SITE}/category/${encodeURIComponent(post.category)}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${SITE}/guide/${post.slug}`,
      },
    ],
  };
}
