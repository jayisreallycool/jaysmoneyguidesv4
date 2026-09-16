'use client';
import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { TrendingUp, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Mail, DollarSign } from 'lucide-react';
import { SafeImage } from './SafeImage';

interface HeroHeaderProps {
  onSubscribeSuccess: (email: string) => void;
  onSelectPost?: (postId: string) => void;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({ 
  onSubscribeSuccess, 
  onSelectPost, 
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribedMsg, setSubscribedMsg] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Optimized GPU Parallax Scroll Hooks
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Smooth, GPU-friendly parallax transformations (disabled if reduced motion requested)
  const bannerY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? ['0%', '0%'] : ['0%', '22%']);
  const bannerScale = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [1, 1] : [1, 1.08]);
  const bannerOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.75]);
  const contentY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? ['0%', '0%'] : ['0%', '12%']);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSubscribedMsg('🎉 You\'re subscribed! Check your inbox.');
        onSubscribeSuccess(email);
        setEmail('');
      } else {
        setSubscribedMsg(data.error || 'Subscription failed');
      }
    } catch {
      setSubscribedMsg('Subscribed locally! Welcome.');
      onSubscribeSuccess(email);
      setEmail('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-[82vh] lg:min-h-[88vh] flex flex-col justify-center text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-emerald-500/25 overflow-hidden bg-slate-950 transform-gpu"
    >
      {/* Brightened Radiant Ambient Glow Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        
        {/* Dynamic Parallax Background Image (High-vibrancy, optimized for LCP) */}
        <motion.div 
          style={{ 
            y: bannerY, 
            scale: bannerScale, 
            opacity: bannerOpacity,
            willChange: 'transform, opacity' 
          }}
          className="absolute inset-0 w-full h-full pointer-events-none z-0 transform-gpu"
        >
          <SafeImage 
            src="/images/jaysmoneyguides-hero-banner.webp" 
            alt="JaysMoneyGuides Hero Cover Background" 
            className="w-full h-full object-cover object-center filter brightness-125 contrast-105 saturate-110 opacity-100 transition-opacity duration-700"
            referrerPolicy="no-referrer"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            width="1440"
            height="900"
          />
        </motion.div>

        {/* Radiant Mesh Lighting & High-Luminance Vignette (Brightens hero with vivid emerald & cyan highlights) */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/10 to-slate-950/45 z-[1]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/15 via-teal-900/5 to-transparent z-[1]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-slate-950/40 z-[1]" />

        {/* Precision Modern Tech Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98120_1px,transparent_1px),linear-gradient(to_bottom,#10b98120_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black_90%)] z-[2]" />

        {/* GPU-Accelerated Hardware Ambient Orbs (Offloaded from JS thread) */}
        <div 
          className="absolute top-1/6 left-1/2 -translate-x-1/2 w-[650px] h-[340px] bg-emerald-400/20 rounded-full blur-[110px] animate-hero-glow-emerald z-[2]" 
          aria-hidden="true" 
        />
        <div 
          className="absolute bottom-12 right-6 w-[480px] h-[480px] bg-teal-400/25 rounded-full blur-[130px] animate-hero-glow-teal z-[2]" 
          aria-hidden="true" 
        />
        <div 
          className="absolute top-8 left-8 w-[420px] h-[420px] bg-emerald-500/15 rounded-full blur-[120px] animate-hero-glow-emerald z-[2]" 
          aria-hidden="true" 
        />

        {/* Floating Ambient Sparkles (CSS Keyframe accelerated) */}
        <div className="absolute top-14 left-[10%] text-emerald-300/40 hidden sm:block animate-hero-float z-[3]" aria-hidden="true">
          <Sparkles className="w-8 h-8 drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]" />
        </div>
        <div className="absolute top-1/4 right-[12%] text-emerald-300/35 hidden md:block animate-hero-float z-[3]" style={{ animationDelay: '2s' }} aria-hidden="true">
          <DollarSign className="w-9 h-9 drop-shadow-[0_0_12px_rgba(52,211,153,0.4)]" />
        </div>
      </div>

      {/* Main Hero Content (Smoothly responsive & GPU-tracked) */}
      <motion.div 
        style={{ 
          y: contentY,
          willChange: 'transform' 
        }}
        className="max-w-5xl mx-auto text-center relative z-10 my-auto w-full transform-gpu"
      >
        
        {/* Founder Pill Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-2.5 bg-slate-900/90 hover:bg-slate-900 border border-emerald-400/40 hover:border-emerald-400 rounded-full px-4 py-1.5 text-xs text-slate-100 mb-6 shadow-xl shadow-emerald-950/60 backdrop-blur-xl group transition-all duration-200"
        >
          <SafeImage 
            src="/images/jaysmoneyguides-logo.webp" 
            alt="Jay Lopez - JaysMoneyGuides" 
            className="w-5 h-5 rounded-full border border-emerald-400 object-cover object-top shrink-0 group-hover:scale-110 transition-transform duration-200"
            referrerPolicy="no-referrer"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            width="20"
            height="20"
          />
          <span className="font-black text-emerald-400 tracking-wider uppercase text-[11px]">Jaysmoneyguides</span>
          <span className="text-slate-500 font-light">|</span>
          <span className="text-slate-200 font-medium">By Jay Lopez • Online Business Strategist</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12] max-w-4xl mx-auto drop-shadow-2xl"
        >
          Actionable Blueprints for <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_2px_24px_rgba(52,211,153,0.5)] inline-block">
            Profitable Online Businesses
          </span>
        </motion.h1>

        {/* Subtitle / Value Proposition */}
        <motion.p 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mt-5 text-base sm:text-lg lg:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed font-normal drop-shadow-md"
        >
          Master high-ticket affiliate marketing, organic search intent, high-ROI blogging strategies, and modern online revenue engines.
        </motion.p>

        {/* Newsletter Inline Form (Instant interactive feedback) */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="mt-7 max-w-xl mx-auto"
        >
          {subscribedMsg ? (
            <div className="bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 rounded-xl p-4 text-sm font-semibold flex items-center justify-center gap-2.5 backdrop-blur-xl shadow-xl shadow-emerald-950/50 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{subscribedMsg}</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5" noValidate={false}>
              <div className="relative flex-1">
                <label htmlFor="hero-email-input" className="sr-only">Email address</label>
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  id="hero-email-input"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Enter your email for Jay's weekly blueprint..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/90 hover:bg-slate-900 focus:bg-slate-900 border border-slate-700/90 focus:border-emerald-400 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 backdrop-blur-xl shadow-xl transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500 text-slate-950 font-black px-6 py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-xl shadow-emerald-500/25 active:scale-98 disabled:opacity-50 cursor-pointer shrink-0 hover:shadow-emerald-400/40"
              >
                {isSubmitting ? 'Joining...' : 'Get Free Guides'}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </form>
          )}
          <p className="text-[11px] text-slate-300/80 mt-2.5 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            <span>No spam ever. Unsubscribe anytime with 1 click.</span>
          </p>
        </motion.div>

        {/* Stat Highlights (High Contrast, Lightweight Layout) */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="mt-10 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 text-center max-w-4xl mx-auto"
        >
          <div className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 rounded-xl p-3.5 sm:p-4 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5">
            <p className="text-xl sm:text-2xl font-black text-white">$100k+</p>
            <p className="text-xs text-slate-300 font-medium mt-0.5">Affiliate Sales Generated</p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 rounded-xl p-3.5 sm:p-4 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5">
            <p className="text-xl sm:text-2xl font-black text-emerald-400">100% Free</p>
            <p className="text-xs text-slate-300 font-medium mt-0.5">In-Depth Guides</p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 rounded-xl p-3.5 sm:p-4 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5">
            <p className="text-xl sm:text-2xl font-black text-white">5 Categories</p>
            <p className="text-xs text-slate-300 font-medium mt-0.5">Affiliate, SEO, Tech, More</p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 rounded-xl p-3.5 sm:p-4 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5">
            <p className="text-xl sm:text-2xl font-black text-emerald-400">Weekly</p>
            <p className="text-xs text-slate-300 font-medium mt-0.5">Actionable Blueprints</p>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};


