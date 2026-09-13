'use client';
import { useEffect, useState } from 'react';
import { Loader2, ExternalLink, Download, Smartphone } from 'lucide-react';

/**
 * Reliable cross-platform PDF viewer.
 *
 * Strategy (no pdf.js workers, no CORS-fetch, no version pitfalls):
 *  - Desktop: native inline embed via <iframe> (browsers render PDFs inline).
 *  - Mobile/tablet: native inline PDF is unreliable, so we render through the
 *    Google Docs viewer (docs.google.com/viewer), which displays ANY public PDF
 *    URL on ANY device without CORS or worker setup — plus clear "Open" and
 *    "Download" buttons that always work.
 *
 * Admin access: NEXT_PUBLIC_ADMIN_ACCESS_KEY is sent so the owner can view any
 * ebook without a purchase.
 */
export function EbookViewer({ productId, email }: { productId: string; email?: string }) {
  const [url, setUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect touch / small-screen devices.
    const check = () =>
      setIsMobile(
        typeof navigator !== 'undefined' &&
        (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 820)
      );
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const q = new URLSearchParams({ productId });
        if (email) q.set('email', email);
        const adminKey = process.env.NEXT_PUBLIC_ADMIN_ACCESS_KEY;
        if (adminKey) q.set('adminKey', adminKey);
        const res = await fetch(`/api/download-ebook?${q.toString()}`);
        const data = await res.json();
        if (!active) return;
        if (data.url) setUrl(data.url);
        else setError(data.error || 'Unable to load ebook.');
      } catch {
        if (active) setError('Unable to load ebook.');
      }
    })();
    return () => { active = false; };
  }, [productId, email]);

  if (error) {
    return (
      <div className="min-h-[50vh] grid place-items-center text-center p-6">
        <div>
          <p className="text-red-400 text-sm mb-2">{error}</p>
          <p className="text-slate-500 text-xs">If you purchased this ebook, use the same email you used at checkout.</p>
        </div>
      </div>
    );
  }

  if (!url) {
    return (
      <div className="min-h-[50vh] grid place-items-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          <p className="text-sm">Preparing your ebook…</p>
        </div>
      </div>
    );
  }

  // Google Docs viewer works on every device for any public PDF URL.
  const gviewUrl = `https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(url)}`;
  const embedUrl = isMobile ? gviewUrl : url;

  return (
    <div className="w-full flex flex-col rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
      {/* Action bar — always-working controls */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-slate-950/90 border-b border-slate-800">
        <span className="text-xs text-slate-400 flex items-center gap-1.5">
          {isMobile && <Smartphone className="h-3.5 w-3.5" />}
          {isMobile ? 'Mobile reader' : 'Reading'}
        </span>
        <div className="flex items-center gap-2">
          <a href={url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 active:scale-95 transition">
            <ExternalLink className="h-3.5 w-3.5" /> Open
          </a>
          <a href={url} download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 text-xs font-bold hover:bg-emerald-500/25 active:scale-95 transition">
            <Download className="h-3.5 w-3.5" /> Download
          </a>
        </div>
      </div>

      {/* The PDF surface */}
      <div className="bg-slate-800/40" style={{ height: '78vh' }}>
        <iframe
          src={embedUrl}
          title="Ebook"
          className="w-full h-full border-0"
          allow="autoplay"
          loading="lazy"
        />
      </div>

      {/* Mobile helper text */}
      {isMobile && (
        <div className="px-3 py-2 text-center text-[11px] text-slate-500 border-t border-slate-800">
          Trouble viewing? Tap <span className="text-emerald-400 font-semibold">Open</span> or{' '}
          <span className="text-emerald-400 font-semibold">Download</span> above.
        </div>
      )}
    </div>
  );
}
