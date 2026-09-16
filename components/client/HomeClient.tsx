'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/client/AuthProvider';
import { getFirebaseAuth } from '@/lib/firebase-client';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { HeroHeader } from '@/components/ui/HeroHeader';
import { PostCard } from '@/components/ui/PostCard';
import { CategoryTabs } from '@/components/ui/CategoryTabs';
import { StoreSection } from '@/components/ui/StoreSection';
import { EbooksBanner, BlogIntro } from '@/components/ui/SectionIntro';
import dynamic from 'next/dynamic';

// Lazy-load the PDF viewer — only pulled in when a user actually opens a book,
// keeping it out of the initial homepage bundle.
const EbookViewer = dynamic(
  () => import('@/components/client/EbookViewer').then((m) => m.EbookViewer),
  { ssr: false, loading: () => <div className="h-[60vh] grid place-items-center text-slate-400">Loading viewer…</div> }
);
import { ProductPreviewModal } from '@/components/ui/ProductPreviewModal';
const PostReaderModal = dynamic(
  () => import('@/components/ui/PostReaderModal').then((m) => m.PostReaderModal),
  { ssr: false }
);
import type { BlogPost, BlogPostSummary, Product, Category } from '@/lib/types';

const INITIAL_COUNT = 6;
const LOAD_STEP = 5;

function shuffle<T>(arr: T[], seed = 1): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function HomeClient({ posts: initialPosts, products }: { posts: BlogPostSummary[]; products: Product[] }) {
  const router = useRouter();
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPostSummary[]>(initialPosts);
  const [category, setCategory] = useState<Category | 'All'>('All');
  const [postsLoaded, setPostsLoaded] = useState(initialPosts.length >= 50);
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_COUNT);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [likes, setLikes] = useState<string[]>([]);
  const [checkingOutId, setCheckingOutId] = useState<string | null>(null);
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);
  const [viewerProduct, setViewerProduct] = useState<Product | null>(null);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [viewerEmail, setViewerEmail] = useState<string>('');
  const [readingPost, setReadingPost] = useState<BlogPost | null>(null);

  // IMPORTANT: do not use Math.random() during the initial render.
  // Server and browser must produce identical markup or React hydration fails.
  const shuffled = useMemo(() => shuffle(posts, 1), [posts]);
  const filtered = useMemo(
    () => (category === 'All' ? shuffled : shuffled.filter((p) => p.category === category)),
    [shuffled, category]
  );
  const visible = filtered.slice(0, visibleCount);
  const remaining = filtered.length - visible.length;

  const counts = useMemo(
    () => posts.reduce(
      (acc, p) => { acc[p.category] = (acc[p.category] || 0) + 1; return acc; },
      { All: posts.length } as Record<string, number>
    ),
    [posts]
  );

  useEffect(() => {
    let cancelled = false;
    if (!user) { setPurchasedIds([]); return; }
    const firebaseAuth = getFirebaseAuth();
    if (!firebaseAuth?.currentUser) return;
    firebaseAuth.currentUser.getIdToken()
      .then((token) => fetch('/api/ebook-entitlements', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }))
      .then((res) => res.ok ? res.json() : { productIds: [] })
      .then((data) => { if (!cancelled && Array.isArray(data.productIds)) setPurchasedIds(data.productIds); })
      .catch((error) => console.error('Ebook entitlement load failed:', error));
    return () => { cancelled = true; };
  }, [user]);

  useEffect(() => {
    if (postsLoaded) return;
    let cancelled = false;
    fetch('/api/posts', { cache: 'force-cache' })
      .then((res) => { if (!res.ok) throw new Error('Failed to load posts'); return res.json() as Promise<BlogPostSummary[]>; })
      .then((data) => { if (!cancelled && Array.isArray(data)) { setPosts(data); setPostsLoaded(true); } })
      .catch((err) => console.error('Homepage post index load failed:', err));
    return () => { cancelled = true; };
  }, [postsLoaded]);

  const openPost = async (post: BlogPostSummary) => {
    try {
      const res = await fetch(`/api/posts/${encodeURIComponent(post.slug)}`, { cache: 'force-cache' });
      if (!res.ok) throw new Error('Article unavailable');
      const fullPost = await res.json() as BlogPost;
      setReadingPost(fullPost);
      if (typeof window !== 'undefined') window.history.pushState({}, '', `/guide/${fullPost.slug}`);
    } catch (error) {
      console.error('Article load failed:', error);
      setReadingPost(post as BlogPost);
      if (typeof window !== 'undefined') window.history.pushState({}, '', `/guide/${post.slug}`);
    }
  };
  const closeReader = () => {
    setReadingPost(null);
    if (typeof window !== 'undefined') window.history.pushState({}, '', '/');
  };

  // Browser back button closes the reader modal instead of leaving the site.
  useEffect(() => {
    const onPop = () => setReadingPost(null);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const toggleBookmark = (postId: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setBookmarks((b) => (b.includes(postId) ? b.filter((x) => x !== postId) : [...b, postId]));
  };
  const likePost = (postId: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setLikes((l) => (l.includes(postId) ? l.filter((x) => x !== postId) : [...l, postId]));
  };
  const onSelectCategory = (c: Category | 'All') => { setCategory(c); setVisibleCount(INITIAL_COUNT); };

  const handleBuy = useCallback(async (product: Product) => {
    const email = window.prompt('Enter your email to continue to checkout (download link is sent here):')?.trim() || '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('A valid email is required.'); return; }
    setCheckingOutId(product.id);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, email, origin: window.location.origin }),
      });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; return; }
      alert(data.error || 'Checkout failed.');
    } catch { alert('Checkout failed. Please try again.'); }
    finally { setCheckingOutId(null); }
  }, []);

  const handleOpenFree = useCallback((product: Product) => { setViewerEmail(''); setViewerProduct(product); }, []);
  const handlePreview = useCallback((product: Product) => { setPreviewProduct(product); }, []);

  return (
    <>
      <HeroHeader
        onSubscribeSuccess={() => {}}
        onSelectPost={(id: string) => { const p = posts.find((x) => x.id === id); if (p) openPost(p); }}
      />

      {/* Ebooks — full-width intro banner, then constrained store grid */}
      <EbooksBanner />
      <section id="ebooks" className="mx-auto max-w-7xl px-4 py-10">
        <div id="ebooks-grid">
          <StoreSection products={products} purchasedIds={purchasedIds} onPreview={handlePreview}
            onOpenFree={handleOpenFree} onBuy={handleBuy} checkingOutId={checkingOutId} />
        </div>
      </section>

      {/* Blog — full-width intro, then constrained article grid */}
      <BlogIntro />
      <section id="guides" className="mx-auto max-w-7xl px-4 py-10">
        <CategoryTabs
          selectedCategory={category}
          onSelectCategory={(c) => onSelectCategory(c)}
          postCounts={counts}
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => (
            <PostCard key={post.id} post={post} onOpenPost={openPost}
              isBookmarked={bookmarks.includes(post.id)} onToggleBookmark={toggleBookmark}
              onLikePost={likePost} isLiked={likes.includes(post.id)} />
          ))}
        </div>
        {remaining > 0 && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={() => setVisibleCount((c) => c + LOAD_STEP)}
              className="w-full sm:w-auto px-8 py-3 rounded-full bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20">
              Load {Math.min(LOAD_STEP, remaining)} more
            </button>
            <button onClick={() => setVisibleCount(filtered.length)}
              className="w-full sm:w-auto px-8 py-3 rounded-full bg-slate-800 text-slate-100 font-bold hover:bg-slate-700 border border-slate-700 transition-colors">
              Load all ({filtered.length})
            </button>
          </div>
        )}
      </section>

      {previewProduct && (
        <ProductPreviewModal
          product={previewProduct}
          onClose={() => setPreviewProduct(null)}
          onOpenFree={(pr) => { setPreviewProduct(null); handleOpenFree(pr); }}
          onBuy={(pr) => { setPreviewProduct(null); handleBuy(pr); }}
          isPurchased={false}
          isCheckingOut={checkingOutId === previewProduct.id}
        />
      )}

      {viewerProduct && (
        <div className="fixed inset-0 z-[80] bg-slate-950/90 backdrop-blur p-4 overflow-y-auto" onClick={() => setViewerProduct(null)}>
          <div className="mx-auto max-w-4xl mt-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-white">{viewerProduct.title}</h3>
              <button onClick={() => setViewerProduct(null)} className="px-3 py-1 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700">Close</button>
            </div>
            <EbookViewer productId={viewerProduct.id} email={viewerEmail || undefined} isFree={!!viewerProduct.isFree} />
          </div>
        </div>
      )}
      {readingPost && (
        <PostReaderModal
          post={readingPost}
          allPosts={posts as BlogPost[]}
          onClose={closeReader}
          isBookmarked={bookmarks.includes(readingPost.id)}
          onToggleBookmark={(id) => setBookmarks((b) => b.includes(id) ? b.filter((x) => x !== id) : [...b, id])}
          isLiked={likes.includes(readingPost.id)}
          onLikePost={(id) => setLikes((l) => l.includes(id) ? l.filter((x) => x !== id) : [...l, id])}
          comments={[]}
          onAddComment={() => {}}
          onSelectPost={(p) => openPost(p)}
        />
      )}
    </>
  );
}
