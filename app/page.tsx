import { getPostSummaries } from '@/lib/posts';
import { PRODUCTS } from '@/lib/products';
import { HomeClient } from '@/components/client/HomeClient';

export default async function HomePage() {
  const posts = await getPostSummaries();
  // Keep the initial RSC/client payload small. Full article bodies are fetched on demand.
  const initialPosts = posts.slice(0, 6);
  return <HomeClient posts={initialPosts} products={PRODUCTS} />;
}
