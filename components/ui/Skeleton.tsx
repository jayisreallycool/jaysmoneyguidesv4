export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-800/60 ${className}`} />;
}

/** Article/guide loading skeleton. */
export function ArticleSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Skeleton className="h-4 w-40 mb-6" />
      <Skeleton className="h-10 w-3/4 mb-3" />
      <Skeleton className="h-5 w-full mb-2" />
      <Skeleton className="h-5 w-5/6 mb-8" />
      <Skeleton className="h-64 w-full mb-8 rounded-2xl" />
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className={`h-4 ${i % 3 === 2 ? 'w-2/3' : 'w-full'}`} />
        ))}
      </div>
    </div>
  );
}

/** Grid-of-cards loading skeleton (homepage / category / ebooks). */
export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-800 overflow-hidden">
            <Skeleton className="aspect-[16/10] w-full rounded-none" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
