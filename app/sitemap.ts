import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { SITE } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const staticRoutes: MetadataRoute.Sitemap = ['', '/ebooks', '/about', '/privacy'].map((r) => ({
    url: `${SITE}${r}`,
    changeFrequency: 'weekly',
    priority: r === '' ? 1 : 0.6,
  }));
  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE}/guide/${p.slug}`,
    lastModified: (p as { updatedAt?: string }).updatedAt ?? p.publishedAt,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));
  return [...staticRoutes, ...postRoutes];
}
