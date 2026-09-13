import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/posts';
import { PostBody } from '@/components/server/PostBody';
import { Breadcrumbs } from '@/components/server/Breadcrumbs';
import { JsonLd } from '@/components/server/JsonLd';
import { articleSchema, breadcrumbSchema, SITE } from '@/lib/seo';

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const url = `${SITE}/guide/${post.slug}`;
  const description = (post as { metaDescription?: string }).metaDescription ?? post.excerpt;
  return {
    title: post.title,
    description,
    keywords: (post as { seoKeywords?: string[] }).seoKeywords,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description,
      images: [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }],
      publishedTime: post.publishedAt,
      authors: [post.author?.name ?? 'Jay Lopez'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [post.coverImage],
    },
  };
}

export default async function GuidePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const related = await getRelatedPosts(post);

  return (
    <>
      <JsonLd data={articleSchema(post)} />
      <JsonLd data={breadcrumbSchema(post)} />
      <article className="mx-auto max-w-3xl px-4 py-10">
        <Breadcrumbs category={post.category} title={post.title} />
        <header>
          <h1 className="text-4xl font-extrabold tracking-tight">{post.title}</h1>
          <p className="mt-3 text-lg text-slate-400">{post.excerpt}</p>
          <p className="mt-2 text-sm text-slate-500">
            By {post.author?.name ?? 'Jay Lopez'} · {post.publishedAt}
          </p>
        </header>

        <PostBody markdown={post.content} />

        {related.length > 0 && (
          <aside aria-label="Related guides" className="mt-12 border-t border-slate-800 pt-6">
            <h2 className="text-xl font-bold mb-3">Related guides</h2>
            <ul className="space-y-2">
              {related.map((r) => (
                <li key={r.id}>
                  <Link href={`/guide/${r.slug}`} className="text-brand hover:underline">
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </article>
    </>
  );
}
