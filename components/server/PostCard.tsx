import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost } from '@/lib/types';

export function PostCard({ post, priority = false }: { post: BlogPost; priority?: boolean }) {
  return (
    <Link
      href={`/guide/${post.slug}`}
      className="group block rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/40 hover:border-brand/50 transition-colors"
    >
      <div className="relative aspect-[16/10] bg-slate-950">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={priority}
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <span className="text-xs font-bold text-brand">{post.category}</span>
        <h2 className="mt-1 font-bold text-slate-100 line-clamp-2 group-hover:text-brand">
          {post.title}
        </h2>
        <p className="mt-2 text-sm text-slate-400 line-clamp-2">{post.excerpt}</p>
      </div>
    </Link>
  );
}
