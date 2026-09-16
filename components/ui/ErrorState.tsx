'use client';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export function ErrorState({ reset, title, message }: { reset?: () => void; title?: string; message?: string }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/30">
        <AlertTriangle className="h-8 w-8 text-red-400" />
      </div>
      <h1 className="text-2xl font-extrabold text-white">{title ?? 'Something went wrong'}</h1>
      <p className="mt-3 text-slate-400">{message ?? 'We hit a snag loading this page. Please try again.'}</p>
      <div className="mt-8 flex items-center justify-center gap-3">
        {reset && (
          <button onClick={reset} className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-2.5 font-bold text-slate-950 hover:bg-emerald-400 transition-colors">
            <RotateCcw className="h-4 w-4" /> Try again
          </button>
        )}
        <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-6 py-2.5 font-bold text-slate-100 hover:bg-slate-700 transition-colors">
          <Home className="h-4 w-4" /> Home
        </Link>
      </div>
    </div>
  );
}
