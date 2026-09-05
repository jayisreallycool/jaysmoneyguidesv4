'use client';
import React, { useMemo, useState } from 'react';
import { ShoppingBag, BookOpen, Sparkles, Lock, Eye, Loader2, FileText, Bell, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Product } from '@/lib/types';
import { SafeImage } from './SafeImage';

interface StoreSectionProps {
  products: Product[];
  purchasedIds: string[];
  onPreview: (product: Product) => void;
  onOpenFree: (product: Product) => void;
  onBuy: (product: Product) => void;
  checkingOutId: string | null;
  onOpenNewsletter?: () => void;
  onRestorePurchases?: () => void;
}

const PAGE_SIZE = 6;

const StoreTabs = ['All', 'Ebooks'] as const;
type StoreTab = (typeof StoreTabs)[number];

const ProductCard: React.FC<{
  product: Product;
  isPurchased: boolean;
  onPreview: (product: Product) => void;
  onOpenFree: (product: Product) => void;
  onBuy: (product: Product) => void;
  isCheckingOut: boolean;
}> = ({ product, isPurchased, onPreview, onOpenFree, onBuy, isCheckingOut }) => {
  const priceLabel = product.isFree ? 'Free' : `$${(product.priceCents / 100).toFixed(2)}`;

  return (
    <div className="group relative bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-emerald-500/30 hover:border-emerald-400/80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 flex flex-col transform hover:-translate-y-1 animate-ebook-glow">
      {/* Animated Sheen Overlay on Hover */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-0">
        <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-emerald-400/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out" />
      </div>

      <button
        onClick={() => onPreview(product)}
        className="relative aspect-[3/2] w-full overflow-hidden bg-slate-950 block z-10 cursor-pointer"
        aria-label={`Preview ${product.title}`}
      >
        <SafeImage
          src={product.coverImage}
          alt={`${product.title} - ${product.subtitle}`}
          width={600}
          height={400}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
          {product.isFree ? (
            <span className="inline-flex items-center gap-1 bg-emerald-400 text-slate-950 text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide shadow-md shadow-emerald-500/30">
              <Sparkles className="w-3 h-3" /> Free Store Edition
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide shadow-md shadow-amber-400/30">
              <Lock className="w-3 h-3" /> Store Exclusive
            </span>
          )}
        </div>
        <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/40 flex items-center justify-center transition-all z-10">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1.5 bg-emerald-400 text-slate-950 text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg transform group-hover:scale-105 transition-transform">
            {isPurchased ? <BookOpen className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {isPurchased ? 'Open Ebook' : 'View Details'}
          </span>
        </div>
      </button>

      <div className="p-4 sm:p-5 flex flex-col gap-2.5 flex-1 z-10">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white leading-snug line-clamp-2 group-hover:text-emerald-300 transition-colors">
            {product.title}
          </h3>
          <p className="text-[11px] text-emerald-400/90 font-medium line-clamp-1 mt-0.5">{product.subtitle}</p>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 flex-1">{product.description}</p>

        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 mt-1">
          <div>
            <span className="text-xl font-black text-white">{priceLabel}</span>
            {!product.isFree && <span className="text-[10px] text-slate-400 block font-normal">Instant Access</span>}
          </div>

          {product.isFree ? (
            <button
              onClick={() => onOpenFree(product)}
              className="inline-flex items-center gap-1.5 bg-emerald-400 hover:bg-emerald-300 active:scale-95 text-slate-950 font-black px-4 py-2 rounded-xl text-xs transition-all shadow-md shadow-emerald-400/25 hover:shadow-emerald-400/40 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" /> Read Free
            </button>
          ) : isPurchased ? (
            <button
              onClick={() => onOpenFree(product)}
              className="inline-flex items-center gap-1.5 bg-emerald-400 hover:bg-emerald-300 active:scale-95 text-slate-950 font-black px-4 py-2 rounded-xl text-xs transition-all shadow-md shadow-emerald-400/25 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" /> Open Ebook
            </button>
          ) : (
            <button
              onClick={() => onBuy(product)}
              disabled={isCheckingOut}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 active:scale-95 text-slate-950 font-black px-4 py-2 rounded-xl text-xs transition-all shadow-md shadow-amber-400/25 hover:shadow-amber-400/40 cursor-pointer disabled:opacity-60"
            >
              {isCheckingOut ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShoppingBag className="w-3.5 h-3.5" />}
              {isCheckingOut ? 'Redirecting...' : `Buy Ebook (${priceLabel})`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const StoreSection: React.FC<StoreSectionProps> = ({
  products,
  purchasedIds,
  onPreview,
  onOpenFree,
  onBuy,
  checkingOutId,
  onOpenNewsletter,
  onRestorePurchases,
}) => {
  const [activeTab, setActiveTab] = useState<StoreTab>('All');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const filtered = useMemo(() => {
    if (activeTab === 'All') return products;
    return products.filter((p) => p.category === activeTab);
  }, [products, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visibleProducts = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filtered.length));
      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
      setIsLoadingMore(false);
    }, 350);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    setVisibleCount(page * PAGE_SIZE);
  };

  return (
    <section id="store" className="space-y-4 scroll-mt-24">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/25 border border-emerald-400/40">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                <span>eBook Store</span>
                <span className="text-slate-500 font-normal text-sm">/</span>
                <span className="text-emerald-400 text-base font-bold">Digital Library</span>
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                OFFICIAL STORE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Instant downloads, practical frameworks, and comprehensive digital handbooks</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {products.length > 0 && StoreTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setVisibleCount(PAGE_SIZE);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
          {onRestorePurchases && (
            <button
              onClick={onRestorePurchases}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-emerald-300 border border-slate-700/60 hover:border-emerald-500/40 transition-all cursor-pointer"
            >
              Restore purchases
            </button>
          )}
        </div>
      </div>

      {/* If products exist, show the product grid */}
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isPurchased={purchasedIds.includes(product.id)}
                onPreview={onPreview}
                onOpenFree={onOpenFree}
                onBuy={onBuy}
                isCheckingOut={checkingOutId === product.id}
              />
            ))}
          </div>

          {(hasMore || totalPages > 1) && (
            <div className="flex flex-col items-center gap-3 pt-2">
              {hasMore && (
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold px-5 py-2.5 rounded-xl text-xs inline-flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isLoadingMore ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
                  {isLoadingMore ? 'Loading…' : 'Load More Products'}
                </button>
              )}

              {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        currentPage === page
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        /* Store Showcase & Digital Library Roadmap Card with Strong Store Emphasis */
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-xl shadow-emerald-950/20">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-emerald-500/20">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Official Store
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Digital Library & Upcoming Releases</span>
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  JaysMoneyGuides Official eBook Store
                </h3>
                <p className="text-xs text-emerald-400 font-semibold mt-1 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Digital Library · Direct Author Edition Handbooks · 100% Actionable
                </p>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                The official digital store for JaysMoneyGuides. Built to deliver field-tested playbooks, actionable frameworks, and step-by-step blueprints directly to your devices with zero fluff and instant delivery.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Full PDF Handbooks</h4>
                    <p className="text-[11px] text-slate-400">Offline reading on iPad, Kindle & desktop</p>
                  </div>
                </div>

                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Instant Store Access</h4>
                    <p className="text-[11px] text-slate-400">Direct download links & reader modal</p>
                  </div>
                </div>

                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Secure Store Delivery</h4>
                    <p className="text-[11px] text-slate-400">Encrypted checkout & permanent storage</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-950/80 border border-slate-800 rounded-2xl p-5 text-center space-y-4 flex flex-col justify-center items-center shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
                <ShoppingBag className="w-6 h-6" />
              </div>

              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Store VIP List
                </span>
                <h4 className="text-sm font-extrabold text-white mt-1.5">Get Early Store Access</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Be notified the second new volume drops, store discounts, and free editions launch.
                </p>
              </div>

              {onOpenNewsletter && (
                <button
                  onClick={onOpenNewsletter}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Join Store Release Alerts</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};


