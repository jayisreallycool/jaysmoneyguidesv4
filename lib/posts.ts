import 'server-only';
import { INITIAL_POSTS } from './posts-data/initialPosts';
import type { BlogPost } from './types';

export type { BlogPost };

/** All published posts (server-side; no client bundle cost). */
export async function getAllPosts(): Promise<BlogPost[]> {
  return INITIAL_POSTS.filter((p) => !(p as { isDraft?: boolean }).isDraft);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  return INITIAL_POSTS.find((p) => p.slug === slug);
}

export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  return INITIAL_POSTS.filter((p) => p.category === category);
}

export async function getAllCategories(): Promise<string[]> {
  return Array.from(new Set(INITIAL_POSTS.map((p) => p.category)));
}

/** 3–4 related posts in the same category (internal linking for SEO). */
export async function getRelatedPosts(post: BlogPost, limit = 4): Promise<BlogPost[]> {
  return INITIAL_POSTS.filter(
    (p) => p.category === post.category && p.slug !== post.slug
  ).slice(0, limit);
}
