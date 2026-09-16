import Link from 'next/link';
import { Compass, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30">
        <Compass className="h-8 w-8 text-emerald-400" />
      </div>
      <h1 className="text-5xl font-extrabold text-white">404</h1>
      <p className="mt-3 text-lg text-slate-300">This page wandered off.</p>
      <p className="mt-1 text-slate-400">The page you&apos;re looking for doesn&apos;t exist or was moved.</p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-2.5 font-bold text-slate-950 hover:bg-emerald-400 transition-colors">
          <Home className="h-4 w-4" /> Back home
        </Link>
        <Link href="/#guides" className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-6 py-2.5 font-bold text-slate-100 hover:bg-slate-700 transition-colors">
          Browse guides
        </Link>
      </div>
    </div>
  );
}
