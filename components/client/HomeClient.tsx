'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { HeroHeader } from '@/components/vite/HeroHeader';
import { PostCard } from '@/components/vite/PostCard';
import { CategoryTabs } from '@/components/vite/CategoryTabs';
import type { BlogPost } from '@/lib/types';

/**
 * Client homepage that reuses the REAL Vite design components (HeroHeader,
 * PostCard, CategoryTabs). The SPA callback props are adapted to Next.js
 * navigation (router.push) so the look/behavior matches the original site.
 */
export function HomeClient({ posts }: { posts: BlogPost[] }) {
  const router = useRouter();
  const [category, setCategory] = useState<string>('All');
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [likes, setLikes] = useState<string[]>([]);

  const openPost = (post: BlogPost) => router.push(`/guide/${post.slug}`);
  const toggleBookmark = (postId: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setBookmarks((b) => (b.includes(postId) ? b.filter((x) => x !== postId) : [...b, postId]));
  };
  const likePost = (postId: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setLikes((l) => (l.includes(postId) ? l.filter((x) => x !== postId) : [...l, postId]));
  };

  const counts = posts.reduce(
    (acc, p) => { acc[p.category] = (acc[p.category] || 0) + 1; return acc; },
    { All: posts.length } as Record<string, number>
  );

  const visible = category === 'All' ? posts : posts.filter((p) => p.category === category);

  return (
    <>
      <HeroHeader onSubscribeSuccess={() => {}} onSelectPost={(id) => {
        const p = posts.find((x) => x.id === id);
        if (p) router.push(`/guide/${p.slug}`);
      }} />

      <div className="mx-auto max-w-7xl px-4 py-10">
        <CategoryTabs
          selectedCategory={category as never}
          onSelectCategory={(c) => setCategory(c as string)}
          postCounts={counts as never}
        />

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onOpenPost={openPost}
              isBookmarked={bookmarks.includes(post.id)}
              onToggleBookmark={toggleBookmark}
              onLikePost={likePost}
              isLiked={likes.includes(post.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
