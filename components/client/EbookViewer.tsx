'use client';

import { useEffect, useState } from 'react';
import {
  Loader2,
  ExternalLink,
  Download,
  Smartphone,
} from 'lucide-react';

import { getFirebaseAuth } from '@/lib/firebase-client';

export function EbookViewer({
  productId,
  email,
}: {
  productId: string;
  email?: string;
}) {
  const [url, setUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);

  /*
   * Detect mobile/tablet.
   */
  useEffect(() => {
    const check = () => {
      setIsMobile(
        typeof navigator !== 'undefined' &&
          (/Mobi|Android|iPhone|iPad|iPod/i.test(
            navigator.userAgent
          ) ||
            window.innerWidth < 820)
      );
    };

    check();

    window.addEventListener('resize', check);

    return () => {
      window.removeEventListener('resize', check);
    };
  }, []);

  /*
   * Load the ebook.
   *
   * For paid books, send the Firebase ID token.
   * The server verifies the token and determines the
   * user's real email.
   */
  useEffect(() => {
    let active = true;

    async function loadEbook() {
      try {
        setLoading(true);
        setError(null);
        setUrl('');

        const auth = getFirebaseAuth();

        /*
         * Wait briefly for Firebase Auth to restore the
         * existing login session.
         */
        if (!auth) {
          if (active) {
            setError(
              'Sign-in is not available right now.'
            );
            setLoading(false);
          }

          return;
        }

        /*
         * Firebase normally restores currentUser automatically,
         * but on initial page load it may not be ready immediately.
         */
        const firebaseUser = await new Promise<
          typeof auth.currentUser
        >((resolve) => {
          if (auth.currentUser) {
            resolve(auth.currentUser);
            return;
          }

          let unsubscribe: (() => void) | undefined;

          unsubscribe = auth.onAuthStateChanged((user) => {
            if (unsubscribe) unsubscribe();
            resolve(user);
          });
        });

        const headers: HeadersInit = {};

        /*
         * If the user is logged in, send the verified Firebase
         * ID token to the server.
         */
        if (firebaseUser) {
          const idToken = await firebaseUser.getIdToken();

          headers.Authorization = `Bearer ${idToken}`;
        }

        const q = new URLSearchParams({
          productId,
        });

        /*
         * We intentionally DO NOT send the email as an
         * authorization mechanism.
         *
         * The server gets the email from the verified token.
         */
        const res = await fetch(
          `/api/download-ebook?${q.toString()}`,
          {
            method: 'GET',
            headers,
            cache: 'no-store',
          }
        );

        const data = await res.json();

        if (!active) return;

        if (!res.ok) {
          if (data.code === 'AUTH_REQUIRED') {
            setError(
              'Please sign in to access this ebook.'
            );
          } else if (data.code === 'PURCHASE_REQUIRED') {
            setError(
              'Purchase required. Please sign in with the email used at checkout.'
            );
          } else {
            setError(
              data.error || 'Unable to load ebook.'
            );
          }

          setLoading(false);
          return;
        }

        if (data.url) {
          setUrl(data.url);
        } else {
          setError(
            data.error || 'Unable to load ebook.'
          );
        }

        setLoading(false);
      } catch (err) {
        console.error('Ebook viewer error:', err);

        if (active) {
          setError(
            'Unable to load ebook. Please sign in again and try again.'
          );

          setLoading(false);
        }
      }
    }

    loadEbook();

    return () => {
      active = false;
    };
  }, [productId, email]);

  if (loading) {
    return (
      <div className="min-h-[50vh] grid place-items-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />

          <p className="text-sm">
            Preparing your ebook…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] grid place-items-center text-center p-6">
        <div>
          <p className="text-red-400 text-sm mb-2">
            {error}
          </p>

          <p className="text-slate-500 text-xs">
            If you purchased this ebook, make sure you are
            signed in with the same Firebase account/email
            used at checkout.
          </p>
        </div>
      </div>
    );
  }

  if (!url) {
    return (
      <div className="min-h-[50vh] grid place-items-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />

          <p className="text-sm">
            Preparing your ebook…
          </p>
        </div>
      </div>
    );
  }

  /*
   * Google Docs viewer for mobile/tablet.
   */
  const gviewUrl =
    `https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(
      url
    )}`;

  const embedUrl = isMobile ? gviewUrl : url;

  return (
    <div className="w-full flex flex-col rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
      {/* Action bar */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-slate-950/90 border-b border-slate-800">
        <span className="text-xs text-slate-400 flex items-center gap-1.5">
          {isMobile && (
            <Smartphone className="h-3.5 w-3.5" />
          )}

          {isMobile ? 'Mobile reader' : 'Reading'}
        </span>

        <div className="flex items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 active:scale-95 transition"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open
          </a>

          <a
            href={url}
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 text-xs font-bold hover:bg-emerald-500/25 active:scale-95 transition"
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </a>
        </div>
      </div>

      {/* PDF */}
      <div
        className="bg-slate-800/40"
        style={{ height: '78vh' }}
      >
        <iframe
          src={embedUrl}
          title="Ebook"
          className="w-full h-full border-0"
          allow="autoplay"
          loading="lazy"
        />
      </div>

      {/* Mobile helper */}
      {isMobile && (
        <div className="px-3 py-2 text-center text-[11px] text-slate-500 border-t border-slate-800">
          Trouble viewing? Tap{' '}
          <span className="text-emerald-400 font-semibold">
            Open
          </span>{' '}
          or{' '}
          <span className="text-emerald-400 font-semibold">
            Download
          </span>{' '}
          above.
        </div>
      )}
    </div>
  );
}