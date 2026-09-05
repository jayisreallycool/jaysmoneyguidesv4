import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllCategories, getPostsByCategory } from '@/lib/posts';
import { PostCard } from '@/components/server/PostCard';
import { SITE } from '@/lib/seo';

export const dynamicParams = false;

export async function generateStaticParams() {
  const cats = await getAllCategories();
  return cats.map((c) => ({ category: encodeURIComponent(c) }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ category: string }> }
): Promise<Metadata> {
  const { category } = await params;
  const name = decodeURIComponent(category);
  return {
    title: `${name} Guides`,
    description: `All ${name} guides and tutorials from JaysMoneyGuides.`,
    alternates: { canonical: `${SITE}/category/${category}` },
  };
}

export default async function CategoryPage(
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;
  const name = decodeURIComponent(category);
  const posts = await getPostsByCategory(name);
  if (posts.length === 0) notFound();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-6">{name}</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => <PostCard key={p.id} post={p} />)}
      </div>
    </div>
  );
}
