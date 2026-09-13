'use client';
import React, { useEffect, useState } from 'react';
import { ExternalLink, Info, Sparkles } from 'lucide-react';
import { ModalView } from '@/lib/types';

interface GoogleAdSenseBannerProps {
  slot?: string;
  format?: 'auto' | 'horizontal' | 'rectangle' | 'banner';
  className?: string;
  adClient?: string;
  adSlotId?: string;
  onOpenPolicy?: (view: ModalView) => void;
  variant?: 'compact' | 'standard' | 'menu-top';
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export const GoogleAdSenseBanner: React.FC<GoogleAdSenseBannerProps> = ({
  slot = 'default-header-ad',
  format = 'auto',
  className = '',
  adClient = 'ca-pub-6427389182379124',
  adSlotId = '8923741029',
  onOpenPolicy,
  variant = 'standard'
}) => {
  const [adLoaded, setAdLoaded] = useState(false);
  const [showAdInfo, setShowAdInfo] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
        setAdLoaded(true);
      }
    } catch {
      // Fallback to compliant simulation placeholder if AdSense script is blocked by ad blocker
      setAdLoaded(false);
    }
  }, []);

  const isMenuTop = variant === 'menu-top';
  const isCompact = variant === 'compact';

  return (
    <aside 
      aria-label="Advertisement" 
      className={`w-full relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 shadow-inner ${className}`}
    >
      {/* Mandatory Google AdSense Publisher Label & AdChoices Bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-slate-950/80 border-b border-slate-800/80 text-[10px] text-slate-400 font-medium tracking-wide">
        <div className="flex items-center gap-1.5">
          <span className="uppercase tracking-widest text-[9px] font-bold text-slate-400">
            Advertisement
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400/80 flex items-center gap-1 font-semibold">
            Google AdSense
          </span>
        </div>

        {/* AdChoices & Policy Links */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdInfo(!showAdInfo)}
            className="flex items-center gap-1 text-slate-400 hover:text-emerald-300 transition-colors cursor-pointer"
            title="Why this ad? Google AdSense & AdChoices information"
          >
            <Info className="w-2.5 h-2.5" />
            <span className="text-[9px]">AdChoices</span>
          </button>
          {onOpenPolicy && (
            <>
              <span className="text-slate-600">•</span>
              <button
                onClick={() => onOpenPolicy('privacy')}
                className="text-slate-400 hover:text-emerald-300 transition-colors cursor-pointer text-[9px]"
              >
                Privacy
              </button>
            </>
          )}
        </div>
      </div>

      {/* AdChoices Disclosure Popup / Flyout */}
      {showAdInfo && (
        <div className="p-3 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-300 leading-relaxed space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" /> Google Advertising & Transparency
            </span>
            <button 
              onClick={() => setShowAdInfo(false)}
              className="text-slate-400 hover:text-white text-xs font-bold px-1"
            >
              ✕
            </button>
          </div>
          <p>
            Ads served on JaysMoneyGuides comply with the Google AdSense Publisher Policies. Google uses cookies to serve personalized ads based on your visits to this and other sites.
          </p>
          <div className="flex items-center gap-3 pt-1 text-[10px]">
            <a 
              href="https://www.google.com/settings/ads" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline flex items-center gap-0.5"
            >
              Google Ads Settings <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <a 
              href="https://www.aboutads.info/choices" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline flex items-center gap-0.5"
            >
              AboutAds.info Opt-Out <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      )}

      {/* Responsive Ad Unit Container */}
      <div className={`w-full flex items-center justify-center ${isMenuTop ? 'py-2.5 px-3 min-h-[64px]' : isCompact ? 'py-2 px-3 min-h-[50px]' : 'py-3.5 px-4 min-h-[80px]'}`}>
        
        {/* Real Google AdSense Tag (When active / deployed with live client ID) */}
        <ins
          className="adsbygoogle w-full block text-center"
          style={{ display: 'block' }}
          data-ad-client={adClient}
          data-ad-slot={adSlotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />

        {/* Compliant Fallback / Preview Unit (Shows high-relevance sponsored financial & business SaaS tools) */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-slate-900/90 via-slate-850 to-slate-900/90 rounded-xl p-2.5 sm:px-4 sm:py-2 border border-slate-800/80">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-white tracking-tight">
                  High-Yield Creator Tech & Affiliate Hosting
                </span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-500/30">
                  Featured Partner
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1">
                Fast Cloud NVMe servers optimized for affiliate funnels, programmatic SEO, and WordPress.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
            <a
              href="https://hostinger.com?REFERRAL_CODE=JAYSMONEYGUIDES"
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1 shadow-sm whitespace-nowrap cursor-pointer"
            >
              <span>Explore Deal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
};
