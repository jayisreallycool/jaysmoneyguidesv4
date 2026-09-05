'use client';
import { useEffect, useState } from 'react';

/**
 * PDF viewer island. Resolves the real Storage URL via the download route
 * (which enforces entitlement server-side), then embeds it. For paid books the
 * caller must pass the buyer's email.
 */
export function EbookViewer({ productId, email }: { productId: string; email?: string }) {
  const [url, setUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const q = new URLSearchParams({ productId });
        if (email) q.set('email', email);
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

  if (error) return <p className="text-red-400 text-sm">{error}</p>;
  if (!url) return <div className="h-[600px] grid place-items-center text-slate-400">Preparing your ebook…</div>;

  return (
    <div className="w-full h-[80vh] rounded-xl overflow-hidden border border-slate-800">
      <object data={url} type="application/pdf" className="w-full h-full">
        <iframe src={url} className="w-full h-full" title="Ebook" />
        <p className="p-4">
          Can’t display inline. <a href={url} target="_blank" rel="noopener noreferrer" className="text-brand underline">Open in a new tab</a>.
        </p>
      </object>
    </div>
  );
}
