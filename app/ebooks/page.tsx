import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { PRODUCTS, formatPrice } from '@/lib/products';
import { SITE } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Ebooks & Digital Guides',
  description: 'Downloadable ebooks on affiliate marketing, SEO, blogging, and building digital income.',
  alternates: { canonical: `${SITE}/ebooks` },
};

export default function EbooksPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-2">Ebooks & Digital Guides</h1>
      <p className="text-slate-400 mb-8">Practical, downloadable guides you can start using today.</p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((p) => (
          <Link key={p.id} href={`/ebooks/${p.slug}`}
            className="group block rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/40 hover:border-brand/50 transition-colors">
            <div className="relative aspect-[3/4] bg-slate-950">
              <Image src={p.coverImage} alt={p.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" />
            </div>
            <div className="p-4">
              <h2 className="font-bold text-slate-100 group-hover:text-brand">{p.title}</h2>
              <p className="mt-1 text-sm text-slate-400 line-clamp-2">{p.subtitle}</p>
              <p className="mt-2 font-bold text-brand">{p.isFree ? 'Free' : formatPrice(p.priceCents)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
