import { Metadata } from 'next';
import { ToolsContent } from '@/components/client/ToolsContent';

export const metadata: Metadata = {
  title: 'Recommended Tools & Affiliate Programs | JaysMoneyGuides',
  description: 'Curated list of tools, platforms, and affiliate programs I personally use and recommend for affiliate marketing, blogging, e-commerce, and online business.',
  openGraph: {
    title: 'Tools & Resources for Online Entrepreneurs',
    description: 'Recommended affiliate programs and tools to grow your online business',
  },
};

export default function ToolsPage() {
  return <ToolsContent />;
}
