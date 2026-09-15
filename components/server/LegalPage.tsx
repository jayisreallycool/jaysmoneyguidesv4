export function LegalPage({ title, updated, children }: { title: string; updated?: string; children: React.ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">{title}</h1>
      {updated && <p className="mt-3 text-sm text-slate-400">Last updated: {updated}</p>}
      <div className="mt-8 space-y-5 text-[17px] leading-8 text-slate-200
        [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-emerald-300 [&_h2]:mt-10 [&_h2]:mb-3
        [&_p]:text-slate-200
        [&_a]:text-emerald-400 [&_a]:font-semibold [&_a]:underline [&_a]:decoration-emerald-400/40 hover:[&_a]:decoration-emerald-400
        [&_strong]:text-white [&_strong]:font-semibold
        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:text-slate-200
        [&_li]:marker:text-emerald-400">
        {children}
      </div>
    </article>
  );
}
