'use client';
import { BookOpen, Sparkles, TrendingUp, Download, Zap, ArrowRight, Newspaper, Search, DollarSign } from 'lucide-react';

/** Full-width, engaging ebooks section intro banner (edge-to-edge). */
export function EbooksBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950/50 to-slate-950 border-y border-emerald-500/25">
      {/* decorative glows */}
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" aria-hidden />
      <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:py-20 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-300">
          <Sparkles className="h-3.5 w-3.5" /> Digital Guides &amp; Ebooks
        </span>
        <h2 className="mx-auto mt-5 max-w-3xl text-4xl sm:text-5xl font-extrabold leading-tight text-white">
          Ready-to-use playbooks for <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">building online income</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
          Skip the guesswork. Our downloadable ebooks hand you step-by-step systems for affiliate
          marketing, SEO, and blogging — start applying them today, not someday.
        </p>
        <div className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-semibold text-slate-300">
          <span className="inline-flex items-center gap-2"><Download className="h-4 w-4 text-emerald-400" /> Instant download</span>
          <span className="inline-flex items-center gap-2"><Zap className="h-4 w-4 text-emerald-400" /> Actionable systems</span>
          <span className="inline-flex items-center gap-2"><BookOpen className="h-4 w-4 text-emerald-400" /> One free guide inside</span>
          <span className="inline-flex items-center gap-2"><TrendingUp className="h-4 w-4 text-emerald-400" /> Beginner-friendly</span>
        </div>
        <a href="#ebooks-grid" className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-7 py-3 font-bold text-slate-950 shadow-lg shadow-emerald-500/25 transition-colors hover:bg-emerald-400">
          Browse the ebooks <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}

/** Full-width, engaging blog articles section intro (matches ebooks banner). */
export function BlogIntro() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900/60 to-slate-950 border-y border-slate-700/50">
      {/* decorative glows */}
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" aria-hidden />
      <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:py-20 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky-300">
          <Newspaper className="h-3.5 w-3.5" /> The Blog
        </span>
        <h2 className="mx-auto mt-5 max-w-3xl text-4xl sm:text-5xl font-extrabold leading-tight text-white">
          Latest <span className="bg-gradient-to-r from-sky-400 to-emerald-300 bg-clip-text text-transparent">guides &amp; tutorials</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
          In-depth, practical articles on affiliate marketing, SEO, blogging, e-commerce, and smart
          money moves — written to be applied, not just read.
        </p>
        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-semibold text-slate-300">
          <span className="inline-flex items-center gap-2"><DollarSign className="h-4 w-4 text-emerald-400" /> Affiliate Marketing</span>
          <span className="inline-flex items-center gap-2"><Search className="h-4 w-4 text-sky-400" /> SEO &amp; Organic</span>
          <span className="inline-flex items-center gap-2"><BookOpen className="h-4 w-4 text-emerald-400" /> Blogging</span>
          <span className="inline-flex items-center gap-2"><TrendingUp className="h-4 w-4 text-sky-400" /> Money Moves</span>
        </div>
        <a href="#guides" className="mt-8 inline-flex items-center gap-2 rounded-full bg-sky-500 px-7 py-3 font-bold text-slate-950 shadow-lg shadow-sky-500/25 transition-colors hover:bg-sky-400">
          Explore the guides <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
