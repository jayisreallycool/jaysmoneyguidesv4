'use client';
import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Download, 
  CheckCircle2, 
  Mail, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  FileText, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Sparkles,
  ExternalLink,
  Printer,
  Lock,
  ShoppingBag,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { ref, getDownloadURL } from 'firebase/storage';
import { Product } from '@/lib/types';
import { EBOOK_CONTENT_MAP, EbookData, EbookPage } from '@/lib/ebookContent';
import { getLocalEbookPdfPath, resolveEbookDownloadUrl, formatEbookErrorMessage } from '@/lib/ebook-access-client';
import { generateEbookPdfBlob } from '@/utils/pdfGenerator';
import { getFirebaseStorageUrl } from '@/config/storageConfig';
import { getFirebaseStorage } from '@/lib/firebase-client';
import { SafeImage } from './SafeImage';

interface EbookViewerModalProps {
  product: Product;
  fileUrl: string;
  onClose: () => void;
  justPurchased?: boolean;
  purchaseEmail?: string | null;
  isPurchased?: boolean;
  onBuy?: (product: Product) => void;
  isCheckingOut?: boolean;
  isLoading?: boolean;
}

export const EbookViewerModal: React.FC<EbookViewerModalProps> = ({
  product,
  fileUrl,
  onClose,
  justPurchased = false,
  purchaseEmail,
  isPurchased = false,
  onBuy,
  isCheckingOut = false,
  isLoading = false,
}) => {
  const isUnlocked = product.isFree || isPurchased || justPurchased;

  // Only products with hand-curated content (the original two demo ebooks)
  // get the "Interactive Reader" experience. The three real uploaded PDFs
  // have no transcribed page data, so they always render as the raw embedded
  // PDF — defaulting to 'reader' mode for those would crash on undefined data.
  const ebookData: EbookData | undefined = EBOOK_CONTENT_MAP[product.id];
  const hasRichReader = !!ebookData;

  // Default to the REAL PDF from Firebase Storage. The structured "reader" view
  // (transcribed pages) is secondary and opt-in, so the viewer always shows the
  // authentic ebook file first rather than placeholder content.
  const [viewMode, setViewMode] = useState<'reader' | 'pdf'>('pdf');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [isResolvingUrl, setIsResolvingUrl] = useState<boolean>(false);
  const [resolvedPdfUrl, setResolvedPdfUrl] = useState<string>(() => {
    // For paid books, don't embed a tokenless URL initially (it would 403 until
    // the purchase-authorized URL resolves). Start empty and show the loader;
    // the effect below fills in the authorized URL. Free books can use their
    // token URL immediately.
    if (product && !product.isFree) return fileUrl && fileUrl.includes('token=') ? fileUrl : '';
    return fileUrl || getLocalEbookPdfPath(product);
  });
  const readerContainerRef = useRef<HTMLDivElement>(null);

  // Asynchronously resolve authentic Firebase Storage token URL upon modal opening
  useEffect(() => {
    let isCancelled = false;

    async function fetchTokenizedUrl() {
      setIsResolvingUrl(true);
      try {
        const resolved = await resolveEbookDownloadUrl(product);
        if (!isCancelled && resolved) {
          setResolvedPdfUrl(resolved);
        }
      } catch (err) {
        console.warn('[EbookViewerModal] Could not resolve tokenized storage URL, using fallback:', err);
        if (!isCancelled) {
          setResolvedPdfUrl(fileUrl || getLocalEbookPdfPath(product));
        }
      } finally {
        if (!isCancelled) {
          setIsResolvingUrl(false);
        }
      }
    }

    fetchTokenizedUrl();

    return () => {
      isCancelled = true;
    };
  }, [product, fileUrl]);

  const activePdfUrl = resolvedPdfUrl || fileUrl || getLocalEbookPdfPath(product);

  const pages: EbookPage[] = hasRichReader
    ? (isUnlocked ? ebookData!.pages : ebookData!.pages.slice(0, 4))
    : [];
  const totalPages = pages.length;
  const activePage = pages[currentPage - 1] || pages[0];

  // Reset scroll position on page change
  useEffect(() => {
    if (readerContainerRef.current) {
      readerContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  // Keyboard navigation for power reading
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalPages, onClose]);

  const handlePrint = () => {
    if (!isUnlocked) {
      if (onBuy) onBuy(product);
      return;
    }
    window.print();
  };

  const handleDownload = async () => {
    if (!isUnlocked) {
      if (onBuy) onBuy(product);
      return;
    }
    setIsDownloadingPdf(true);
    setDownloadError(null);
    
    // Derive clean filename from storagePath or product slug
    const storageFileName = product.storagePath
      ? product.storagePath.split('/').pop()?.replace(/\s+/g, '_')
      : null;
    const filename = storageFileName || `${product.slug || product.id || 'ebook'}.pdf`;

    try {
      // Prefer the REAL PDF from Firebase Storage that matches this product's
      // storagePath. Only fall back to a client-generated PDF if there is no
      // real file for this product. (Previously the generated PDF was tried
      // FIRST, which downloaded the wrong file instead of the Storage PDF.)
      let targetUrl = '';
      if (product.storagePath) {
        try {
          targetUrl = await resolveEbookDownloadUrl(product);
        } catch (e) {
          console.warn('[EbookViewerModal] resolveEbookDownloadUrl fallback:', e);
        }
        if (!targetUrl && product.downloadUrl) {
          targetUrl = product.downloadUrl;
        }
      }

      // If we have a real Storage/download URL, use it.
      if (targetUrl) {
        // Same-origin relative path → fetch as blob for a seamless download.
        if (targetUrl.startsWith('/') || targetUrl.startsWith('./')) {
          try {
            const res = await fetch(targetUrl);
            if (res.ok) {
              const blob = await res.blob();
              if (blob && blob.size > 0) {
                const blobUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
                setDownloadSuccess(true);
                setTimeout(() => setDownloadSuccess(false), 3500);
                return;
              }
            }
          } catch {
            // fall through to direct navigation
          }
        }
        // Remote URL (Firebase Storage) → direct navigation to avoid CORS blocks.
        const downloadLink = document.createElement('a');
        downloadLink.href = targetUrl;
        downloadLink.download = filename;
        downloadLink.target = '_blank';
        downloadLink.rel = 'noopener noreferrer';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3500);
        return;
      }

      // Fallback ONLY when there is no real file: generate a PDF from structured
      // content, if available.
      if (ebookData) {
        const blob = await generateEbookPdfBlob(ebookData);
        if (blob && blob.size > 0) {
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
          setDownloadSuccess(true);
          setTimeout(() => setDownloadSuccess(false), 3500);
          return;
        }
      }

      throw new Error('This ebook file is currently unavailable.');
    } catch (err: any) {
      console.error('Failed to download PDF:', err);
      setDownloadError(formatEbookErrorMessage(err));
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div 
      id="ebook-viewer-modal"
      className="fixed inset-0 z-[80] flex flex-col bg-slate-950/98 backdrop-blur-md select-text"
      role="dialog"
      aria-label={`${product.title} Ebook Reader`}
    >
      {/* Top Header Bar */}
      <header className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-slate-800 bg-slate-900/95 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white truncate">{product.title}</h2>
              <span className={`hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                product.isFree
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : isUnlocked
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
              }`}>
                {product.isFree
                  ? 'Free Full Edition'
                  : isUnlocked
                  ? `Purchased Edition ($${(product.priceCents / 100).toFixed(2)})`
                  : 'Sample Preview Mode'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">{product.subtitle}</p>
          </div>
        </div>

          {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Reader View vs Native PDF Switcher */}
          {isUnlocked && (
            <div className="flex items-center bg-slate-800/90 rounded-xl p-1 border border-slate-700">
              {hasRichReader && (
                <button
                  onClick={() => setViewMode('reader')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === 'reader'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Reader</span>
                </button>
              )}
              <button
                onClick={() => setViewMode('pdf')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'pdf'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>PDF View</span>
              </button>
            </div>
          )}

          {isUnlocked ? (
            <>
              <a
                href={activePdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-3 py-2 rounded-xl text-xs border border-slate-700 transition-all cursor-pointer"
                title="Open in New Tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Full Tab</span>
              </a>

              <button
                onClick={handleDownload}
                disabled={isDownloadingPdf}
                className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs transition-all shadow-sm shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
                title="Download PDF Ebook from Storage"
              >
                <Download className={`w-3.5 h-3.5 ${isDownloadingPdf ? 'animate-bounce' : ''}`} />
                <span>{isDownloadingPdf ? 'Downloading…' : 'Download PDF'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="hidden md:inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-3 py-2 rounded-xl text-xs border border-slate-700 transition-all cursor-pointer"
                title="Print or Save as PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => onBuy && onBuy(product)}
              disabled={isCheckingOut}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 active:scale-95 text-slate-950 font-black px-4 py-2 rounded-xl text-xs transition-all shadow-md shadow-amber-400/25 cursor-pointer disabled:opacity-60"
            >
              {isCheckingOut ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{isCheckingOut ? 'Redirecting to Stripe...' : `Buy & Download PDF ($${(product.priceCents / 100).toFixed(2)})`}</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition-all cursor-pointer"
            aria-label="Close ebook viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Download Error Notification */}
      {downloadError && (
        <div className="px-4 sm:px-6 py-2.5 bg-rose-500/10 border-b border-rose-500/30 flex items-center justify-between gap-2 text-rose-300 text-xs font-semibold shrink-0">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{downloadError}</span>
          </div>
          <button
            onClick={() => setDownloadError(null)}
            className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded bg-slate-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Just Purchased Notification */}
      {justPurchased && (
        <div className="px-4 sm:px-6 py-2.5 bg-emerald-500/10 border-b border-emerald-500/30 flex items-center justify-between gap-2 text-emerald-300 text-xs font-semibold shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Payment confirmed — your complete ebook and PDF download are unlocked!</span>
          </div>
          {purchaseEmail && (
            <span className="hidden sm:inline-flex items-center gap-1 text-emerald-400/90 font-normal">
              <Mail className="w-3.5 h-3.5" /> Emailed to {purchaseEmail}
            </span>
          )}
        </div>
      )}

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-8 bg-slate-950 text-center space-y-4">
          <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
          <h3 className="text-lg font-bold text-white">Opening Ebook & Securing Access…</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            Fetching secure reader session and loading handbook contents.
          </p>
        </div>
      ) : !isUnlocked ? (
        <div className="flex-1 min-h-0 flex items-center justify-center p-4 sm:p-8 bg-slate-950 overflow-y-auto">
          <div className="max-w-lg w-full bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl p-6 sm:p-8 text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center mx-auto shadow-lg shadow-amber-400/10">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <span className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-400/30 mb-2">
                Stripe Payment Required
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">{product.title}</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">{product.subtitle}</p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-left space-y-2.5">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Included With Purchase:</p>
              <ul className="text-xs text-slate-400 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-200">Full 29-page handbook (all 5 chapters & bonus plan)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-200">High-resolution PDF direct download to any device</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-200">Interactive digital reader with page bookmarks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-200">Permanent digital license & email delivery</span>
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onBuy && onBuy(product)}
                disabled={isCheckingOut}
                className="w-full bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 active:scale-95 text-slate-950 font-black py-3.5 px-6 rounded-2xl text-sm transition-all shadow-xl shadow-amber-400/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Redirecting to Stripe Checkout...</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Pay with Stripe — ${(product.priceCents / 100).toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-slate-500">
              🔒 Powered by secure Stripe Checkout with 256-bit SSL encryption.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
        
        {/* Interactive Reader View (Universal Compatibility across All Platforms) */}
        {viewMode === 'reader' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
            
            {/* Toolbar: Navigation, Zoom & Page jump */}
            <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-2.5 bg-slate-900/60 border-b border-slate-800 text-xs text-slate-300 shrink-0">
              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-30 disabled:pointer-events-none transition-all"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1 font-mono font-medium text-slate-200">
                  <span className="text-emerald-400 font-bold">{currentPage}</span>
                  <span className="text-slate-500">/</span>
                  <span>{totalPages}</span>
                </div>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-30 disabled:pointer-events-none transition-all"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Chapter Title Badge */}
              <div className="hidden lg:block text-slate-400 font-medium truncate max-w-md">
                {activePage.chapterTitle || product.title}
              </div>

              {/* Zoom & Quick Jump */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(80, z - 10))}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono text-slate-400 w-10 text-center">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(100)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Scrollable Reader Canvas */}
            <div 
              ref={readerContainerRef}
              className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start print:p-0 print:overflow-visible bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950"
            >
              <div 
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                className="w-full max-w-3xl bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 p-6 sm:p-12 transition-transform duration-150 print:shadow-none print:border-none print:max-w-none print:w-full print:p-0 print:rounded-none"
              >
                {/* Page Content Rendering */}
                {activePage.type === 'cover' ? (
                  /* Cover Page Layout */
                  <div className="flex flex-col items-center text-center space-y-6 py-6">
                    <div className="w-full max-w-md aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-slate-300 bg-slate-900">
                      <SafeImage
                        src={activePage.image || product.coverImage}
                        alt={product.title}
                        width={800}
                        height={1200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2 pt-4">
                      <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                        {product.title}
                      </h1>
                      <p className="text-base sm:text-lg font-semibold text-emerald-700">
                        {product.subtitle}
                      </p>
                      <p className="text-sm text-slate-600 font-medium pt-2">
                        {product.author}{ebookData?.date ? ` · ${ebookData.date}` : ''}
                      </p>
                    </div>
                    <div className="pt-6 border-t border-slate-200 w-full flex justify-center">
                      <button
                        onClick={() => setCurrentPage(2)}
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all active:scale-95"
                      >
                        <span>Start Reading</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : activePage.type === 'backCover' ? (
                  /* Back Cover Layout */
                  <div className="flex flex-col items-center justify-center text-center space-y-6 py-16">
                    <div className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center shadow-lg">
                      <SafeImage
                        src="/images/jaysmoneyguides-logo.webp"
                        alt="JaysMoneyGuides"
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">Thank You for Reading!</h2>
                    <div className="space-y-2 max-w-lg text-slate-600 text-sm">
                      {activePage.paragraphs?.map((p, idx) => (
                        <p key={idx}>{p}</p>
                      ))}
                    </div>
                    <div className="pt-6 flex flex-wrap gap-3 justify-center">
                      <button
                        onClick={() => setCurrentPage(1)}
                        className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-5 py-2.5 rounded-xl transition-all"
                      >
                        <RotateCcw className="w-4 h-4" /> Read Again
                      </button>
                      <button
                        onClick={handleDownload}
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all"
                      >
                        <Download className="w-4 h-4" /> Download PDF File
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Standard Content Page Layout */
                  <div className="space-y-6">
                    {/* Chapter & Section Header */}
                    <div className="border-b border-slate-200 pb-4">
                      {activePage.chapterTitle && (
                        <span className="text-xs uppercase tracking-widest font-black text-emerald-700">
                          {activePage.chapterTitle}
                        </span>
                      )}
                      {activePage.sectionTitle && (
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 leading-snug">
                          {activePage.sectionTitle}
                        </h2>
                      )}
                    </div>

                    {/* Paragraphs */}
                    {activePage.paragraphs && activePage.paragraphs.map((p, idx) => (
                      <p key={idx} className="text-slate-700 text-base leading-relaxed">
                        {p}
                      </p>
                    ))}

                    {/* Optional Inline Diagram / Infographic */}
                    {activePage.image && (
                      <div className="my-6 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-md">
                        <SafeImage
                          src={activePage.image}
                          alt={activePage.imageCaption || activePage.sectionTitle || 'Diagram'}
                          className="w-full max-h-80 object-contain mx-auto"
                        />
                        {activePage.imageCaption && (
                          <p className="text-xs text-center text-slate-500 italic p-2.5 bg-slate-100/70 border-t border-slate-200">
                            {activePage.imageCaption}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Optional Bullet Points */}
                    {activePage.bulletPoints && (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 my-4">
                        {activePage.bulletPoints.title && (
                          <h3 className="text-sm font-bold text-slate-900">
                            {activePage.bulletPoints.title}
                          </h3>
                        )}
                        <ul className="space-y-2 text-sm text-slate-700">
                          {activePage.bulletPoints.items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Optional Data Table */}
                    {activePage.table && (
                      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm my-4">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-emerald-900 text-white text-xs uppercase tracking-wider font-bold">
                            <tr>
                              {activePage.table.headers.map((h, idx) => (
                                <th key={idx} className="px-4 py-3 font-semibold">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 bg-white">
                            {activePage.table.rows.map((row, rIdx) => (
                              <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className={`px-4 py-3 text-slate-800 ${cIdx === 0 ? 'font-medium' : ''}`}>
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Optional Callout / Reality Check / Pro Tip */}
                    {activePage.callout && (
                      <div className={`p-5 rounded-xl border my-4 ${
                        activePage.callout.type === 'tip'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                          : activePage.callout.type === 'warning'
                          ? 'bg-amber-50 border-amber-200 text-amber-950'
                          : 'bg-slate-50 border-slate-300 text-slate-900 italic'
                      }`}>
                        <div className="font-bold text-sm not-italic flex items-center gap-2 mb-1.5">
                          <Sparkles className="w-4 h-4 text-emerald-600" />
                          <span>{activePage.callout.title}</span>
                        </div>
                        <p className="text-sm leading-relaxed whitespace-pre-line">
                          {activePage.callout.text}
                        </p>
                      </div>
                    )}

                    {/* Page Footer inside canvas */}
                    <div className="pt-8 mt-12 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
                      <span>JaysMoneyGuides · {product.title}</span>
                      <span className="font-mono font-medium">Page {currentPage} of {totalPages}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Nav Bar */}
            <div className="px-4 sm:px-6 py-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              {/* Progress Bar */}
              <div className="flex-1 max-w-xs mx-4 hidden sm:block">
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${(currentPage / totalPages) * 100}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2 rounded-xl text-xs font-bold disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

          {/* Native PDF Object / Iframe Hybrid Embed View from Firebase Storage */}
          {viewMode === 'pdf' && (
            <div className="flex-1 flex flex-col h-full bg-slate-950 relative">
              {/* PDF Toolbar Notice */}
              <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-medium text-slate-300">
                    {isResolvingUrl ? 'Authorizing & Loading PDF…' : 'Firebase Storage PDF Stream'}
                  </span>
                  {product.pageCount && (
                    <span className="hidden sm:inline-block text-slate-500">· {product.pageCount} Pages</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownload}
                    disabled={isDownloadingPdf}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isDownloadingPdf ? 'Downloading…' : 'Save PDF'}</span>
                  </button>
                  <a
                    href={activePdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>New Tab</span>
                  </a>
                </div>
              </div>

              {/* Main Embed Area */}
              <div className="flex-1 w-full h-full relative bg-slate-900 overflow-hidden">
                {isResolvingUrl && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2.5 text-center">
                      <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                      <p className="text-xs font-semibold text-slate-200">Loading authorized ebook stream…</p>
                    </div>
                  </div>
                )}
                
                {!activePdfUrl && !isResolvingUrl && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2.5 text-center">
                      <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                      <p className="text-xs font-semibold text-slate-200">Preparing your ebook…</p>
                    </div>
                  </div>
                )}

                {activePdfUrl && (
                <object
                  data={activePdfUrl}
                  type="application/pdf"
                  className="w-full h-full border-0"
                >
                  <iframe 
                    src={activePdfUrl} 
                    className="w-full h-full border-0"
                    title={`${product.title} PDF Document`}
                  >
                    <div className="flex flex-col items-center justify-center p-8 text-center h-full text-slate-300 space-y-4">
                      <FileText className="w-12 h-12 text-slate-500" />
                      <h4 className="text-base font-bold text-white">Previewing PDF in External Viewer</h4>
                      <p className="text-xs text-slate-400 max-w-sm">
                        Your browser doesn't support inline PDF embeds. You can open or download the complete PDF directly.
                      </p>
                      <div className="flex gap-3">
                        <a
                          href={activePdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded-xl border border-slate-700"
                        >
                          Open in New Tab
                        </a>
                        <button
                          onClick={handleDownload}
                          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl"
                        >
                          Download PDF
                        </button>
                      </div>
                    </div>
                  </iframe>
                </object>
                )}
              </div>
            </div>
          )}

      </div>
      )}
    </div>
  );
};
