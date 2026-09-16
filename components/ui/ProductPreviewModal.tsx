'use client';
import React from 'react';
import { X, BookOpen, User, FileText, Lock, Sparkles, ShoppingCart } from 'lucide-react';
import { Product } from '@/lib/types';
import { SafeImage } from './SafeImage';

interface ProductPreviewModalProps {
  product: Product;
  onClose: () => void;
  onOpenFree: (product: Product) => void;
  onBuy: (product: Product) => void;
  isPurchased: boolean;
  isCheckingOut: boolean;
}

export const ProductPreviewModal: React.FC<ProductPreviewModalProps> = ({
  product,
  onClose,
  onOpenFree,
  onBuy,
  isPurchased,
  isCheckingOut,
}) => {
  const priceLabel = product.isFree ? 'Free' : `$${(product.priceCents / 100).toFixed(2)}`;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-slate-800/90 text-slate-300 hover:text-white hover:bg-slate-700"
          aria-label="Close preview"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-0">
          <div className="sm:col-span-2 bg-slate-950 p-6 flex items-center justify-center">
            <div className="w-40 sm:w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-emerald-500/40 bg-slate-950 animate-ebook-glow relative group">
              <SafeImage 
                src={product.coverImage} 
                alt={`${product.title} - ${product.subtitle}`}
                width={800}
                height={1200}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-white/10 pointer-events-none" />
            </div>
          </div>

          <div className="sm:col-span-3 p-6 space-y-4">
            <div>
              {product.isFree ? (
                <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-500/30 mb-2">
                  <Sparkles className="w-3 h-3" /> Free Guide
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-300 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-400/30 mb-2">
                  Premium Ebook
                </span>
              )}
              <h2 className="text-xl font-extrabold text-white leading-snug">{product.title}</h2>
              <p className="text-sm text-slate-400">{product.subtitle}</p>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <User className="w-3 h-3" /> {product.author} · <FileText className="w-3 h-3" /> {product.pageCount} pages
              </p>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">{product.description}</p>

            <div>
              <p className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> What's Inside
              </p>
              <ul className="space-y-1.5">
                {product.previewChapters.map((chapter) => (
                  <li key={chapter} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-emerald-400 shrink-0" />
                    {chapter}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3">
              <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-1">Sample Excerpt</p>
              <p className="text-xs italic text-slate-300 leading-relaxed">{product.previewExcerpt}</p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-800">
              <div>
                <span className="text-2xl font-extrabold text-white">
                  {priceLabel}
                  {!product.isFree && <span className="text-xs font-medium text-slate-400 ml-1">one-time</span>}
                </span>
                {!product.isFree && (
                  <span className="block text-[11px] text-amber-400 font-medium">Stripe Payment Required for Access</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {product.isFree ? (
                  <button
                    onClick={() => onOpenFree(product)}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm inline-flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" /> Read Now — Free
                  </button>
                ) : isPurchased ? (
                  <button
                    onClick={() => onOpenFree(product)}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm inline-flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" /> Open My Ebook & PDF
                  </button>
                ) : (
                  <button
                    onClick={() => onBuy(product)}
                    disabled={isCheckingOut}
                    className="w-full sm:w-auto bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 active:scale-95 text-slate-950 font-black px-6 py-2.5 rounded-xl text-sm inline-flex items-center justify-center gap-2 shadow-lg shadow-amber-400/25 transition-all disabled:opacity-60 cursor-pointer"
                  >
                    {isCheckingOut ? (
                      'Redirecting to Stripe…'
                    ) : (
                      <>
                        <Lock className="w-4 h-4" /> Buy Now with Stripe (${(product.priceCents / 100).toFixed(2)})
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
            {!product.isFree && !isPurchased && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-center gap-2">
                <ShoppingCart className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Viewing and PDF downloading are locked until Stripe payment of ${(product.priceCents / 100).toFixed(2)} is completed.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
