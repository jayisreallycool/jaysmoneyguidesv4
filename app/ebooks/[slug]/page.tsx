import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import { PRODUCTS, getProductBySlug, formatPrice } from '@/lib/products';
import { CheckoutButton } from '@/components/client/CheckoutButton';
import { JsonLd } from '@/components/server/JsonLd';
import { SITE } from '@/lib/seo';

export const dynamicParams = false;

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const p = getProductBySlug(slug);
  if (!p) return {};
  const url = `${SITE}/ebooks/${p.slug}`;
  return {
    title: p.title,
    description: p.description ?? p.subtitle,
    alternates: { canonical: url },
    openGraph: {
      type: 'website', url, title: p.title, description: p.subtitle,
      images: [{ url: p.coverImage, width: 1200, height: 630, alt: p.title }],
    },
  };
}

function productSchema(p: ReturnType<typeof getProductBySlug>) {
  if (!p) return {};
  return {
    '@context': 'https://schema.org', '@type': 'Product',
    name: p.title, description: p.description ?? p.subtitle, image: [p.coverImage],
    brand: { '@type': 'Brand', name: 'JaysMoneyGuides' },
    offers: {
      '@type': 'Offer', price: (p.priceCents / 100).toFixed(2), priceCurrency: 'USD',
      availability: 'https://schema.org/InStock', url: `${SITE}/ebooks/${p.slug}`,
    },
  };
}

export default async function EbookPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const p = getProductBySlug(slug);
  if (!p) notFound();

  return (
    <>
      <JsonLd data={productSchema(p)} />
      <div className="mx-auto max-w-4xl px-4 py-10 grid md:grid-cols-2 gap-8">
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
          <Image src={p.coverImage} alt={p.title} fill sizes="(max-width:768px) 100vw, 50vw" priority className="object-cover" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold">{p.title}</h1>
          <p className="mt-2 text-slate-400">{p.subtitle}</p>
          <p className="mt-4 text-2xl font-bold text-brand">{p.isFree ? 'Free' : formatPrice(p.priceCents)}</p>
          <p className="mt-4 text-slate-300">{p.description}</p>
          <div className="mt-6">
            <CheckoutButton
              productId={p.id}
              isFree={!!p.isFree}
              className="px-6 py-3 rounded-full bg-brand text-slate-950 font-bold hover:bg-brand-2 transition-colors"
            />
          </div>
        </div>
      </div>
    </>
  );
}
