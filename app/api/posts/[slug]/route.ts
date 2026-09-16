import { getPostBySlug } from '@/lib/posts';

export const runtime = 'nodejs';
export const revalidate = 3600;

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.isDraft) return Response.json({ error: 'Post not found' }, { status: 404 });
  return Response.json(post, { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } });
}
