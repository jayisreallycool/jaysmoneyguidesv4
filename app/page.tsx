import { getAllPosts } from '@/lib/posts';
import { HomeClient } from '@/components/client/HomeClient';

export default async function HomePage() {
  const posts = await getAllPosts();
  return <HomeClient posts={posts} />;
}
