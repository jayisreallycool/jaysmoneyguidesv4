import { getAllPosts } from '@/lib/posts';
import { PRODUCTS } from '@/lib/products';
import { HomeClient } from '@/components/client/HomeClient';

export default async function HomePage() {
  const posts = await getAllPosts();
  return <HomeClient posts={posts} products={PRODUCTS} />;
}
