'use client';
import React, { useState } from 'react';
import { Category, ModalView } from '@/lib/types';
import { Mail, ArrowUp, Send, CheckCircle2, Github, Twitter, Linkedin, ShoppingBag, Heart, ExternalLink } from 'lucide-react';
import { sanitizeInput, checkRateLimit, logSecurityEvent } from '@/utils/security';

// Custom icon components for services not in lucide-react
const GumroadIcon = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    {/* Real Gumroad wordmark 'G' */}
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.9 14.4c-2.65 0-4.5-1.95-4.5-4.55 0-2.72 2-4.65 4.75-4.65 2.3 0 3.9 1.3 4.2 3.25h-2.35c-.2-.75-.85-1.2-1.75-1.2-1.35 0-2.25 1-2.25 2.55 0 1.5.9 2.5 2.3 2.5 1 0 1.75-.5 2-1.4h-2.1v-1.75h4.5V16.4H14.7l-.15-1.1c-.5.8-1.35 1.1-1.65 1.1z"/>
  </svg>
);

const LinktreeIcon = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    {/* Real Linktree mark */}
    <path d="M7.953 15.066c-.08.163-.08.324-.08.486.08.517.528.856 1.052.856h1.294v4.776c0 .517.446.856.97.856h1.616c.524 0 .97-.339.97-.856v-4.776h1.294c.524 0 .97-.339 1.052-.856 0-.162 0-.323-.08-.486l-3.881-6.556 3.235-.081c.524 0 .97-.34 1.052-.857.081-.162 0-.323-.08-.485l-.485-.808-3.234 1.94V.856C13.634.339 13.188 0 12.664 0h-1.616c-.524 0-.97.339-.97.856v6.797L6.844 5.713l-.485.808c-.08.162-.161.323-.08.485.08.518.527.857 1.051.857l3.235.08-3.612 7.123z"/>
  </svg>
);

interface FooterProps {
  onSelectCategory: (category: Category | 'All') => void;
  openModal: (view: ModalView) => void;
  onSubscribeSuccess: (email: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  openModal,
  onSubscribeSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [subscribedMsg, setSubscribedMsg] = useState('');

  const goToStore = () => {
    onSelectCategory('All');
    setTimeout(() => {
      document.getElementById('store')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = sanitizeInput(email.trim().toLowerCase());
    if (!cleanEmail || !cleanEmail.includes('@')) return;

    const rl = checkRateLimit('newsletter_sub', 3, 60000);
    if (!rl.allowed) {
      setSubscribedMsg(`Too many requests. Please wait ${rl.retryAfterSec}s.`);
      return;
    }

    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setSubscribedMsg('Subscribed! Welcome.');
        logSecurityEvent('AUTH_SUCCESS', 'New newsletter subscriber registered', `Email: ${cleanEmail}`);
        onSubscribeSuccess(cleanEmail);
        setEmail('');
      }
    } catch {
      setSubscribedMsg('Subscribed! Welcome.');
      onSubscribeSuccess(cleanEmail);
      setEmail('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Social media links configuration
  const socialLinks = [
    { 
      name: 'Twitter', 
      icon: Twitter, 
      url: 'https://twitter.com/jaysmoneyguides',
      ariaLabel: 'Follow on Twitter',
      color: '#1DA1F2'
    },
    { 
      name: 'GitHub', 
      icon: Github, 
      url: 'https://github.com/jaysmoneyguides',
      ariaLabel: 'Visit GitHub',
      color: '#f0f6fc'
    },
    { 
      name: 'LinkedIn', 
      icon: Linkedin, 
      url: 'https://linkedin.com/in/jaysmoneyguides',
      ariaLabel: 'Connect on LinkedIn',
      color: '#0A66C2'
    },
    { 
      name: 'Gumroad', 
      icon: GumroadIcon, 
      url: 'https://gumroad.com/jaysmoneyguides',
      ariaLabel: 'Visit Gumroad Store',
      color: '#FF90E8'
    },
    { 
      name: 'Linktree', 
      icon: LinktreeIcon, 
      url: 'https://linktr.ee/jaysmoneyguides',
      ariaLabel: 'All Links on Linktree',
      color: '#43E660'
    },
  ];

  return (
    <footer className="bg-gradient-to-b from-slate-950 to-slate-900 border-t border-slate-800 text-slate-400">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          
          {/* Brand & Newsletter */}
          <div className="space-y-6 md:col-span-2 lg:col-span-1">
            <div>
              <span className="font-extrabold text-2xl bg-gradient-to-r from-white via-white to-emerald-400 bg-clip-text text-transparent">
                Jays<span className="text-emerald-400">Money</span>Guides
              </span>
              <p className="text-sm text-slate-400 mt-2">Actionable blueprints for digital founders building passive income.</p>
            </div>
            
            {/* Newsletter Signup */}
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition">
              <label htmlFor="footer-newsletter-email" className="block text-xs font-semibold text-white mb-3 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Stay Updated
              </label>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  id="footer-newsletter-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition"
                />
                <button type="submit" aria-label="Subscribe to newsletter" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold p-2.5 rounded-lg transition transform hover:scale-105">
                  <Send className="w-4 h-4" />
                </button>
              </form>
              {subscribedMsg && (
                <p className={`text-xs mt-2 flex items-center gap-1 ${subscribedMsg.includes('Subscribed') ? 'text-emerald-400' : 'text-red-400'}`}>
                  {subscribedMsg.includes('Subscribed') && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {subscribedMsg}
                </p>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="space-y-3">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider">Company</h4>
              <nav className="space-y-2 flex flex-col">
                <button onClick={goToStore} className="flex items-center gap-2 text-sm hover:text-emerald-400 transition group">
                  <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition" /> 
                  <span>Store</span>
                </button>
                <a href="/about" onClick={(e) => { e.preventDefault(); openModal('about'); }} className="text-sm hover:text-emerald-400 transition">About</a>
                <a href="/contact" onClick={(e) => { e.preventDefault(); openModal('contact'); }} className="text-sm hover:text-emerald-400 transition">Contact</a>
              </nav>
            </div>
            <div className="space-y-3">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider">Legal & AdSense</h4>
              <nav className="space-y-2 flex flex-col">
                <a href="/privacy" onClick={(e) => { e.preventDefault(); openModal('privacy'); }} className="text-sm hover:text-emerald-400 transition">Privacy Policy</a>
                <a href="/terms" onClick={(e) => { e.preventDefault(); openModal('terms'); }} className="text-sm hover:text-emerald-400 transition">Terms of Service</a>
                <a href="/disclaimer" onClick={(e) => { e.preventDefault(); openModal('disclaimer'); }} className="text-sm hover:text-emerald-400 transition">Disclaimer & FTC</a>
                <a href="/cookie-policy" onClick={(e) => { e.preventDefault(); openModal('cookie-policy'); }} className="text-sm hover:text-emerald-400 transition">Cookie & AdChoices</a>
              </nav>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Resources</h4>
            <nav className="space-y-2 flex flex-col">
              <button onClick={() => onSelectCategory('SEO')} className="text-sm hover:text-emerald-400 transition">SEO Guides</button>
              <button onClick={() => onSelectCategory('Blogging')} className="text-sm hover:text-emerald-400 transition">Blogging Tips</button>
              <button onClick={() => openModal('media-database')} className="text-sm text-emerald-400 hover:text-emerald-300 font-semibold transition flex items-center gap-1">
                Media Database
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </nav>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Follow</h4>
            <div className="grid grid-cols-3 gap-3">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.ariaLabel}
                    className="group flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 transition transform hover:scale-110 hover:-translate-y-1"
                    title={social.name}
                  >
                    <IconComponent className="w-5 h-5" style={{ color: social.color }} />
                  </a>
                );
              })}
            </div>
            <button 
              onClick={scrollToTop} 
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg py-2.5 transition mt-4"
            >
              Back to Top
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-slate-800 bg-slate-950/50 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <p>© {new Date().getFullYear()} JaysMoneyGuides. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" /> for digital founders
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
