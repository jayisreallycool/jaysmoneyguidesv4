'use client';
import React, { useState } from 'react';
import { 
  BookOpen, 
  TrendingUp, 
  Calculator, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Search, 
  Layers, 
  Award,
  Download,
  Users,
  Target
} from 'lucide-react';
import { Product } from '@/lib/types';
import { AffiliateCalculator } from './AffiliateCalculator';

interface WhatWeOfferSectionProps {
  freeProduct?: Product | null;
  onOpenFreeEbook?: (product: Product) => void;
  onBrowseStore?: () => void;
  onExploreGuides?: (category?: string) => void;
}

export const WhatWeOfferSection: React.FC<WhatWeOfferSectionProps> = ({
  freeProduct,
  onOpenFreeEbook,
  onBrowseStore,
  onExploreGuides,
}) => {
  const [showInteractiveCalculator, setShowInteractiveCalculator] = useState(false);

  const offerings = [
    {
      id: 'guides',
      icon: Layers,
      accent: 'from-emerald-500 to-teal-500',
      badge: 'Actionable Blueprints',
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      title: 'Practical Step-by-Step Guides',
      subtitle: 'Zero-fluff masterclasses on Affiliate Marketing, SEO, Traffic & Monetization',
      description:
        'Battle-tested strategies built for beginners and scaling creators. Each guide breaks down exact frameworks, traffic funnels, conversion formulas, and key takeaways.',
      features: [
        'Curated pathways for Beginners, Intermediate & Advanced',
        'Transparent case studies with real mistakes disclosed',
        'Personal bookmarking & interactive key takeaways'
      ],
      actionLabel: 'Explore Guides',
      action: () => onExploreGuides?.(),
    },
    {
      id: 'ebooks',
      icon: BookOpen,
      accent: 'from-cyan-500 to-blue-500',
      badge: 'Digital Library',
      badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      title: 'Complete Ebooks & In-Browser Reader',
      subtitle: 'Comprehensive handbook series with instant reading and downloadable PDFs',
      description:
        'Access in-depth digital books with our sleek web reader featuring light/dark themes, instant chapter navigation, bookmarks, and high-resolution downloadable PDF files.',
      features: [
        'Free Volume 1 Beginner Edition available instantly',
        'Browser-based reading with page persistence',
        'Downloadable print-ready PDF editions included'
      ],
      actionLabel: freeProduct ? 'Read Free Ebook' : 'Browse Ebook Store',
      action: () => {
        if (freeProduct && onOpenFreeEbook) {
          onOpenFreeEbook(freeProduct);
        } else if (onBrowseStore) {
          onBrowseStore();
        }
      },
    },
    {
      id: 'affiliate-systems',
      icon: Target,
      accent: 'from-amber-500 to-orange-500',
      badge: 'Monetization Engine',
      badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      title: 'High-Ticket & Recurring Programs',
      subtitle: 'Vetted partner programs and conversion frameworks tested in the wild',
      description:
        'Skip low-paying networks. Learn how to identify reputable SaaS partner programs, master ethical disclosures, and build high-converting traffic funnels that compound.',
      features: [
        'Vetted high-paying affiliate program criteria',
        'Conversion-optimized disclosure & link placements',
        'Traffic channels ranked by real return on effort'
      ],
      actionLabel: 'View Affiliate Guides',
      action: () => onExploreGuides?.('Affiliate Marketing'),
    },
    {
      id: 'tools',
      icon: Calculator,
      accent: 'from-purple-500 to-indigo-500',
      badge: 'Interactive Tools',
      badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      title: 'Revenue Estimators & Calculators',
      subtitle: 'Model your income potential based on traffic, CTR, and conversion rates',
      description:
        'Test realistic earning scenarios before spending time or money. Calculate estimated monthly & annual earnings with customizable traffic, click-through rate, and payout sliders.',
      features: [
        'Real-time dynamic affiliate earning projections',
        'Realistic benchmark CTR and conversion presets',
        'Free to use instantly right inside the platform'
      ],
      actionLabel: showInteractiveCalculator ? 'Hide Calculator' : 'Try Calculator',
      action: () => setShowInteractiveCalculator(!showInteractiveCalculator),
    },
  ];

  return (
    <section 
      id="what-we-offer-section"
      className="relative bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl overflow-hidden"
      aria-label="What JaysMoneyGuides Offers"
    >
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Section Header */}
      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4 mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-400 uppercase tracking-wider shadow-sm">
          <Sparkles className="w-3.5 h-3.5" /> What You’ll Get On This Platform
        </div>
        
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
          Everything You Need to Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Real Online Income</span>
        </h2>
        
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          No vague promises or get-rich-quick gimmicks. JaysMoneyGuides provides clear, battle-tested 
          roadmaps, downloadable books, and interactive tools to help you go from total beginner to consistent earnings.
        </p>
      </div>

      {/* 4 Modern Feature Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-10">
        {offerings.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-xl hover:shadow-emerald-500/10"
            >
              {/* Header inside Card */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.accent} p-0.5 shadow-md`}>
                    <div className="w-full h-full bg-slate-950/90 rounded-[10px] flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-emerald-400" />
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs font-medium text-emerald-400/90 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                {/* Feature Bullet Points */}
                <ul className="space-y-2 pt-2 border-t border-slate-800/80">
                  {item.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t border-slate-800/80">
                <button
                  onClick={item.action}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-emerald-500 text-slate-200 hover:text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all duration-200 shadow-md group/btn cursor-pointer"
                >
                  <span>{item.actionLabel}</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400 group-hover/btn:text-slate-950 group-hover/btn:translate-x-1 transition-all" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Calculator Drawer (Collapsible) */}
      {showInteractiveCalculator && (
        <div className="relative z-10 mb-10 transition-all duration-300 animate-fadeIn">
          <AffiliateCalculator />
        </div>
      )}

      {/* Trust & Transparency Feature Strip */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 sm:p-6 bg-slate-950/70 border border-slate-800/80 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">100% Battle-Tested</div>
            <div className="text-[11px] text-slate-400">Real trials, no theory</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg shrink-0">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Free Starter Edition</div>
            <div className="text-[11px] text-slate-400">Instant PDF & web reader</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Updated for 2026</div>
            <div className="text-[11px] text-slate-400">Current search & AI tactics</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">No Gatekeeping</div>
            <div className="text-[11px] text-slate-400">Complete transparency</div>
          </div>
        </div>
      </div>
    </section>
  );
};
