import Link from 'next/link';

export function Breadcrumbs({ category, title }: { category: string; title: string }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate-400 mb-4">
      <ol className="flex flex-wrap items-center gap-2">
        <li><Link href="/" className="hover:text-brand">Home</Link></li>
        <li aria-hidden>/</li>
        <li>
          <Link href={`/category/${encodeURIComponent(category)}`} className="hover:text-brand">
            {category}
          </Link>
        </li>
        <li aria-hidden>/</li>
        <li className="text-slate-300 line-clamp-1">{title}</li>
      </ol>
    </nav>
  );
}
