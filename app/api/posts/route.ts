import { getPostSummaries } from '@/lib/posts';

export const runtime = 'nodejs';
export const revalidate = 3600;

export async function GET() {
  const posts = await getPostSummaries();
  return Response.json(posts, { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } });
}
