'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  Search, 
  Bookmark, 
  Shield, 
  FileText, 
  Mail, 
  Lock, 
  X, 
  Sparkles,
  ChevronDown,
  ChevronRight,
  BookOpen,
  ShoppingBag,
  Layers,
  Calculator,
  Database,
  ExternalLink,
  Tag,
  LogIn,
  LogOut,
  User as UserIcon,
  Check,
  Flame,
  Zap,
  Award,
  Share2,
  Compass,
  ArrowRight,
  CheckCircle2,
  Cookie,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';
import { Category, ModalView, User, Product } from '@/lib/types';
import { PRODUCTS } from '@/lib/products';
import { GoogleAdSenseBanner } from './GoogleAdSenseBanner';

// Only this account is allowed to see or open the Admin Console
const ADMIN_EMAIL = 'jayisreallycool@gmail.com';

interface NavbarProps {
  selectedCategory: Category | 'All';
  onSelectCategory: (category: Category | 'All') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  openModal: (view: ModalView) => void;
  bookmarkedCount: number;
  onToggleBookmarksOnly: () => void;
  showBookmarksOnly: boolean;
  currentUser: User | null;
  onLogout: () => void;
  postCounts?: Record<string, number>;
  totalPostsCount?: number;
  onOpenFreeEbookOrOwned?: (product: Product) => void;
  onPreviewProduct?: (product: Product) => void;
  onSubscribeSuccess?: (email: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  openModal,
  bookmarkedCount,
  onToggleBookmarksOnly,
  showBookmarksOnly,
  currentUser,
  onLogout,
  postCounts = {},
  totalPostsCount = 8,
  onOpenFreeEbookOrOwned,
  onPreviewProduct,
  onSubscribeSuccess,
}) => {
  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [menuSearch, setMenuSearch] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const menuSearchRef = useRef<HTMLInputElement>(null);

  const categories: { name: Category; description: string; icon: React.FC<{ className?: string }>; color: string }[] = [
    { 
      name: 'Affiliate Marketing', 
      description: 'High-ticket programs, SaaS recurring & funnels',
      icon: TrendingUp, 
      color: 'emerald' 
    },
    { 
      name: 'SEO', 
      description: 'Topical authority, programmatic SEO & rankings',
      icon: Zap, 
      color: 'teal' 
    },
    { 
      name: 'Blogging', 
      description: 'Editorial calendars, writing frameworks & traffic',
      icon: BookOpen, 
      color: 'indigo' 
    },
    { 
      name: 'Tech', 
      description: 'No-code automation, dev tools & analytics',
      icon: Database, 
      color: 'blue' 
    },
    { 
      name: 'Entrepreneurship', 
      description: 'Solopreneur OS, pricing & leverage assets',
      icon: Award, 
      color: 'amber' 
    },
    { 
      name: 'SoFi Bank', 
      description: 'Loans, refinancing & smart money moves',
      icon: Award, 
      color: 'emerald' 
    },
  ];

  const isAdmin = currentUser?.email?.toLowerCase() === ADMIN_EMAIL;
  const freeProduct = PRODUCTS.find((p) => p.isFree) || PRODUCTS[0];
  const paidProduct = PRODUCTS.find((p) => !p.isFree) || PRODUCTS[1];

  // Close dropdown menu on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDropdownMenuOpen) {
        setIsDropdownMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDropdownMenuOpen]);

  // Focus search input when menu opens
  useEffect(() => {
    if (isDropdownMenuOpen) {
      setTimeout(() => {
        menuSearchRef.current?.focus();
      }, 100);
    } else {
      setMenuSearch('');
    }
  }, [isDropdownMenuOpen]);

  const goToStore = () => {
    onSelectCategory('All');
    onSearchChange('');
    if (showBookmarksOnly) onToggleBookmarksOnly();
    setIsDropdownMenuOpen(false);
    setTimeout(() => {
      document.getElementById('store')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const goToOfferings = () => {
    onSelectCategory('All');
    onSearchChange('');
    if (showBookmarksOnly) onToggleBookmarksOnly();
    setIsDropdownMenuOpen(false);
    setTimeout(() => {
      document.getElementById('what-we-offer-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const goToCalculator = () => {
    onSelectCategory('All');
    if (showBookmarksOnly) onToggleBookmarksOnly();
    setIsDropdownMenuOpen(false);
    setTimeout(() => {
      document.getElementById('affiliate-calculator-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const handleSelectCategoryAndClose = (cat: Category | 'All') => {
    onSelectCategory(cat);
    if (showBookmarksOnly) onToggleBookmarksOnly();
    setIsDropdownMenuOpen(false);
    setTimeout(() => {
      document.getElementById('guides-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const handleExecuteSearch = (query: string) => {
    onSearchChange(query);
    setIsDropdownMenuOpen(false);
    setTimeout(() => {
      document.getElementById('guides-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const quickSearchTags = [
    'Affiliate Marketing',
    'Programmatic SEO',
    'Free eBook',
    'Newsletter Funnels',
    'Tech Stack',
    'Cash Flow'
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => {
                onSelectCategory('All');
                if (showBookmarksOnly) onToggleBookmarksOnly();
              }}
              className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 border border-emerald-500/30 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
                <img 
                  src="/images/jaysmoneyguides-logo.webp" 
                  alt="JaysMoneyGuides Mascot" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/jaysmoneyguides-logo.webp';
                  }}
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1">
                  Jays<span className="text-emerald-400">Money</span>Guides
                </span>
                <span className="block text-[9px] sm:text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-0.5 sm:-mt-1">
                  Actionable Business Blueprints
                </span>
              </div>
            </button>
          </div>

          {/* Reduced Size Desktop Search Bar */}
          <div className="hidden md:flex items-center w-full max-w-[210px] lg:max-w-[240px] transition-all">
            <div className="relative w-full">
              <label htmlFor="desktop-search-input" className="sr-only">Search guides</label>
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="desktop-search-input"
                name="searchQuery"
                type="text"
                placeholder="Search blueprints..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner"
              />
              {searchQuery && (
                <button 
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-[10px] font-bold cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => {
                onSelectCategory('All');
                if (showBookmarksOnly) onToggleBookmarksOnly();
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedCategory === 'All' && !showBookmarksOnly
                  ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              All Guides
            </button>

            {/* Category Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  selectedCategory !== 'All' && !showBookmarksOnly
                    ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                Categories
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {isCategoryDropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-2 z-50 animate-fadeIn"
                  onMouseLeave={() => setIsCategoryDropdownOpen(false)}
                >
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => {
                        onSelectCategory(cat.name);
                        if (showBookmarksOnly) onToggleBookmarksOnly();
                        setIsCategoryDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between cursor-pointer ${
                        selectedCategory === cat.name && !showBookmarksOnly
                          ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                          : 'text-slate-300 hover:bg-slate-700/60 hover:text-white'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {postCounts[cat.name] !== undefined && (
                        <span className="text-[11px] text-slate-400">({postCounts[cat.name]})</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* What We Offer Trigger */}
            <a
              href="/#what-we-offer-section"
              onClick={(e) => { e.preventDefault(); goToOfferings(); }}
              className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Offerings</span>
            </a>

            {/* eBook Store Section Trigger */}
            <a
              href="/#store"
              onClick={(e) => { e.preventDefault(); goToStore(); }}
              className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>eBooks</span>
            </a>

            {/* Contact Us Trigger */}
            <a
              href="/contact"
              onClick={(e) => { e.preventDefault(); openModal('contact'); }}
              className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-emerald-400" />
              Contact
            </a>

            {/* Media Database Trigger */}
            <button
              onClick={() => openModal('media-database')}
              className="px-2.5 py-1.5 rounded-lg text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-950 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title="Open Firebase Storage & Media Assets"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Media</span>
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Bookmarks Toggle Button */}
            <button
              onClick={onToggleBookmarksOnly}
              className={`relative p-2 rounded-xl border transition-all cursor-pointer ${
                showBookmarksOnly
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:border-slate-600'
              }`}
              title="Saved Reading List"
              aria-label="Saved Reading List"
            >
              <Bookmark className="w-4 h-4" />
              {bookmarkedCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-400 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {bookmarkedCount}
                </span>
              )}
            </button>

            {/* Auth / Account Controls */}
            {!currentUser ? (
              <button
                onClick={() => openModal('auth')}
                className="hidden sm:flex bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs sm:text-sm items-center gap-2 transition-all border border-slate-700/80 shadow-sm hover:border-emerald-500/50 group cursor-pointer"
              >
                <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center p-0.5 shrink-0 shadow-sm">
                  <svg className="w-3 h-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
                <span>Sign In</span>
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="bg-slate-800 hover:bg-slate-700/90 text-white font-bold p-1 pr-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 border border-slate-700 transition-all cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline-block max-w-[80px] truncate">{currentUser.name || 'User'}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>

                {isUserDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-2 z-50 animate-fadeIn"
                    onMouseLeave={() => setIsUserDropdownOpen(false)}
                  >
                    <div className="px-3 py-1.5 border-b border-slate-700/60 mb-1">
                      <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        openModal('profile');
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2 cursor-pointer"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
                      My Purchases & Profile
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          openModal('admin');
                          setIsUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2 cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5 text-emerald-400" />
                        Admin Console
                      </button>
                    )}

                    <div className="border-t border-slate-700/80 my-1" />

                    <button
                      onClick={() => {
                        onLogout();
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 font-semibold cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Admin Console Direct Button */}
            {isAdmin && (
              <button
                onClick={() => openModal('admin')}
                className="hidden sm:flex bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs sm:text-sm items-center gap-1.5 transition-all shadow-md shadow-emerald-500/10 active:scale-95 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                Admin
              </button>
            )}

            {/* SLIDE DROP DOWN MENU TOGGLE BUTTON (Smooth animated hamburger/X toggle) */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => setIsDropdownMenuOpen(!isDropdownMenuOpen)}
              className={`relative group px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl border transition-all duration-300 flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                isDropdownMenuOpen
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-900/90 text-slate-100 border-slate-700/80 hover:text-white hover:border-emerald-500/70 hover:bg-slate-800/90'
              }`}
              aria-label={isDropdownMenuOpen ? "Close slide drop down menu" : "Open slide drop down menu"}
              aria-expanded={isDropdownMenuOpen}
              title={isDropdownMenuOpen ? "Close Menu" : "Open Slide Down Menu Bar"}
            >
              {/* Morphing Hamburger / X Icon */}
              <div className="relative w-4 h-4 sm:w-4.5 sm:h-4.5 flex flex-col justify-center items-center">
                <span 
                  className={`block h-0.5 w-4 rounded-full transition-all duration-300 ease-out ${
                    isDropdownMenuOpen 
                      ? 'bg-slate-950 rotate-45 translate-y-1' 
                      : 'bg-emerald-400 group-hover:bg-emerald-300 -translate-y-1'
                  }`} 
                />
                <span 
                  className={`block h-0.5 w-4 rounded-full transition-all duration-200 ease-out ${
                    isDropdownMenuOpen 
                      ? 'opacity-0 scale-x-0' 
                      : 'bg-emerald-300 w-3 self-start group-hover:w-4 group-hover:bg-emerald-200'
                  }`} 
                />
                <span 
                  className={`block h-0.5 w-4 rounded-full transition-all duration-300 ease-out ${
                    isDropdownMenuOpen 
                      ? 'bg-slate-950 -rotate-45 -translate-y-1' 
                      : 'bg-emerald-400 group-hover:bg-emerald-300 translate-y-1'
                  }`} 
                />
              </div>

              <span className="text-xs font-extrabold tracking-wide hidden sm:inline-block">
                {isDropdownMenuOpen ? 'Close' : 'Menu'}
              </span>

              {/* Pulsing Emerald Dot */}
              {!isDropdownMenuOpen && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-sm shadow-emerald-400" />
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* FULL SLIDE DROP DOWN MENU BAR (Drops smoothly down from the top navbar) */}
      <AnimatePresence>
        {isDropdownMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full bg-slate-950/98 border-b border-emerald-500/25 shadow-2xl backdrop-blur-2xl overflow-hidden z-50 text-slate-100"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-5">
              
              {/* 1. MANDATORY GOOGLE ADSENSE BANNER ON TOP OF MENU */}
              <div className="w-full">
                <GoogleAdSenseBanner 
                  slot="top-slide-menu-ad" 
                  variant="menu-top" 
                  onOpenPolicy={(view) => {
                    openModal(view);
                    setIsDropdownMenuOpen(false);
                  }}
                />
              </div>

              {/* 2. COMPACT SEARCH BAR & QUICK TOPIC TAGS */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:px-4">
                <div className="relative w-full md:w-80">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    ref={menuSearchRef}
                    type="text"
                    placeholder="Search guides, strategies, handbooks..."
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && menuSearch.trim()) {
                        handleExecuteSearch(menuSearch.trim());
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-8 pr-10 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                  {menuSearch && (
                    <button
                      onClick={() => setMenuSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-[10px] font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto text-[11px]">
                  <span className="text-slate-500 font-bold flex items-center gap-1 shrink-0 text-[10px] uppercase tracking-wider">
                    <Tag className="w-3 h-3 text-emerald-400" /> Quick Topics:
                  </span>
                  {quickSearchTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleExecuteSearch(tag)}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 text-[11px] font-medium transition-colors whitespace-nowrap border border-slate-800 hover:border-emerald-500/30 cursor-pointer shrink-0"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. MEGA DROPDOWN SECTIONS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                
                {/* Column 1: Core Navigation & Destinations */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" /> Destinations
                  </span>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => handleSelectCategoryAndClose('All')}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 hover:text-white flex items-center justify-between group transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-emerald-400" />
                        <span className="font-semibold">All Blueprints</span>
                      </div>
                      <span className="text-[10px] text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                        {totalPostsCount}
                      </span>
                    </button>

                    <button
                      onClick={goToStore}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 hover:text-white flex items-center justify-between group transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-amber-400" />
                        <span className="font-semibold">Digital eBook Store</span>
                      </div>
                      <span className="text-[9px] text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 font-bold">
                        2 Handbooks
                      </span>
                    </button>

                    <button
                      onClick={goToOfferings}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 hover:text-white flex items-center justify-between group transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-teal-400" />
                        <span className="font-semibold">What We Offer</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-white" />
                    </button>

                    <button
                      onClick={goToCalculator}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 hover:text-white flex items-center justify-between group transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Calculator className="w-4 h-4 text-emerald-400" />
                        <span className="font-semibold">ROI Revenue Calculator</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-white" />
                    </button>

                    <button
                      onClick={() => {
                        openModal('media-database');
                        setIsDropdownMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 hover:text-white flex items-center justify-between group transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-blue-400" />
                        <span className="font-semibold">Media Assets Database</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-white" />
                    </button>
                  </div>
                </div>

                {/* Column 2: Topic Categories */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Topic Categories
                  </span>
                  <div className="space-y-1.5">
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = selectedCategory === cat.name && !showBookmarksOnly;
                      return (
                        <button
                          key={cat.name}
                          onClick={() => handleSelectCategoryAndClose(cat.name)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between group transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{cat.name}</span>
                          </div>
                          {postCounts[cat.name] !== undefined && (
                            <span className="text-[10px] text-slate-400">
                              {postCounts[cat.name]}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Column 3: Featured Handbooks */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> Digital Handbooks
                  </span>
                  <div className="space-y-2.5">
                    {/* Free Handbook */}
                    <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                          100% Free
                        </span>
                        <span className="text-[10px] text-slate-400">{freeProduct.pageCount} Pages</span>
                      </div>
                      <p className="text-xs font-bold text-white line-clamp-1">{freeProduct.title}</p>
                      <button
                        onClick={() => {
                          if (onOpenFreeEbookOrOwned) onOpenFreeEbookOrOwned(freeProduct);
                          setIsDropdownMenuOpen(false);
                        }}
                        className="w-full py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-[11px] transition-colors cursor-pointer"
                      >
                        Read Free Handbook
                      </button>
                    </div>

                    {/* Paid Master Handbook */}
                    <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase text-amber-300 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                          Master Edition
                        </span>
                        <span className="text-[11px] text-emerald-400 font-bold">$29.99</span>
                      </div>
                      <p className="text-xs font-bold text-white line-clamp-1">{paidProduct.title}</p>
                      <button
                        onClick={() => {
                          if (onPreviewProduct) onPreviewProduct(paidProduct);
                          setIsDropdownMenuOpen(false);
                        }}
                        className="w-full py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold rounded-lg text-[11px] transition-colors border border-slate-700 cursor-pointer"
                      >
                        Preview Handbook
                      </button>
                    </div>
                  </div>
                </div>

                {/* Column 4: MANDATORY ADSENSE POLICY PAGES & COMPLIANCE */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" /> AdSense & Legal Pages
                  </span>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => {
                        openModal('privacy');
                        setIsDropdownMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-emerald-300 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Privacy Policy (DART & Ads)</span>
                    </button>

                    <button
                      onClick={() => {
                        openModal('terms');
                        setIsDropdownMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-emerald-300 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Terms of Service</span>
                    </button>

                    <button
                      onClick={() => {
                        openModal('disclaimer');
                        setIsDropdownMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-emerald-300 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      <span>Disclaimer & FTC Disclosure</span>
                    </button>

                    <button
                      onClick={() => {
                        openModal('about');
                        setIsDropdownMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-emerald-300 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
                      <span>About JaysMoneyGuides</span>
                    </button>

                    <button
                      onClick={() => {
                        openModal('contact');
                        setIsDropdownMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-emerald-300 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Contact Us Form</span>
                    </button>

                    <button
                      onClick={() => {
                        openModal('cookie-policy');
                        setIsDropdownMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-emerald-300 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Cookie className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Cookie Policy & AdChoices</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* 4. FOOTER STATUS BAR OF DROPDOWN */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 text-slate-300 hover:text-white bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 cursor-pointer transition-colors"
                  >
                    {copiedLink ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300 font-bold">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share Website</span>
                      </>
                    )}
                  </button>
                  <span className="text-slate-500">•</span>
                  <span>Google AdSense & FTC Compliant Publisher</span>
                </div>

                <div className="flex items-center gap-2">
                  {!currentUser ? (
                    <button
                      onClick={() => {
                        openModal('auth');
                        setIsDropdownMenuOpen(false);
                      }}
                      className="text-emerald-400 hover:text-emerald-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <LogIn className="w-3.5 h-3.5" /> Sign In with Google
                    </button>
                  ) : (
                    <span className="text-slate-400">
                      Logged in as <strong className="text-white">{currentUser.name}</strong>
                    </span>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
