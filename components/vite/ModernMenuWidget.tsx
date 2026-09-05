'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  Search, 
  Sparkles, 
  BookOpen, 
  ShoppingBag, 
  Bookmark, 
  Database, 
  Mail, 
  Shield, 
  User as UserIcon, 
  Layers, 
  TrendingUp, 
  Compass, 
  ArrowRight, 
  Check, 
  Lock, 
  Flame, 
  SlidersHorizontal,
  LayoutGrid,
  FileText,
  Clock,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  LogOut,
  LogIn,
  Zap,
  Tag
} from 'lucide-react';
import { Category, ModalView, User, Product, BlogPost } from '@/lib/types';
import { PRODUCTS } from '@/lib/products';

interface ModernMenuWidgetProps {
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
  onOpenFreeEbookOrOwned?: (product: Product) => void;
  onPreviewProduct?: (product: Product) => void;
  totalPostsCount?: number;
  postCounts?: Record<string, number>;
}

export const ModernMenuWidget: React.FC<ModernMenuWidgetProps> = ({
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
  onOpenFreeEbookOrOwned,
  onPreviewProduct,
  totalPostsCount = 8,
  postCounts = {}
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [widgetSearch, setWidgetSearch] = useState('');
  const [activeSection, setActiveSection] = useState<'all' | 'destinations' | 'categories' | 'ebooks'>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = currentUser?.email?.toLowerCase() === 'jayisreallycool@gmail.com';

  const categories: Category[] = [
    'Affiliate Marketing',
    'SEO',
    'Blogging',
    'Tech',
    'Entrepreneurship',
    'SoFi Bank'
  ];

  // Hotkey listener (Cmd+K / Ctrl+K / M to toggle)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input/textarea
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === 'm' && !isInput && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus search when widget opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setWidgetSearch('');
    }
  }, [isOpen]);

  const scrollToSection = (sectionId: string) => {
    setIsOpen(false);
    onSelectCategory('All');
    if (showBookmarksOnly) onToggleBookmarksOnly();
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleSelectCategoryAndClose = (cat: Category | 'All') => {
    onSelectCategory(cat);
    if (showBookmarksOnly) onToggleBookmarksOnly();
    setIsOpen(false);
    setTimeout(() => {
      const el = document.getElementById('guides-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleExecuteSearch = (query: string) => {
    onSearchChange(query);
    setIsOpen(false);
    setTimeout(() => {
      const el = document.getElementById('guides-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const freeProduct = PRODUCTS.find((p) => p.isFree) || PRODUCTS[0];
  const paidProduct = PRODUCTS.find((p) => !p.isFree) || PRODUCTS[1];

  // Quick Action Items
  const quickActions = [
    {
      id: 'store',
      title: 'eBook Store & Handbooks',
      subtitle: 'Free Vol 1 + Master Edition ($9.99)',
      icon: ShoppingBag,
      color: 'emerald',
      action: () => scrollToSection('store'),
      badge: '2 eBooks'
    },
    {
      id: 'what-we-offer',
      title: 'What We Offer',
      subtitle: 'Free handbooks, blueprints & tools',
      icon: Sparkles,
      color: 'teal',
      action: () => scrollToSection('what-we-offer-section'),
      badge: 'Overview'
    },
    {
      id: 'bookmarks',
      title: 'Saved Reading List',
      subtitle: `${bookmarkedCount} guides saved for offline reading`,
      icon: Bookmark,
      color: 'amber',
      action: () => {
        onToggleBookmarksOnly();
        setIsOpen(false);
      },
      badge: `${bookmarkedCount} Saved`,
      active: showBookmarksOnly
    },
    {
      id: 'cloud-storage',
      title: 'Cloud Storage & Database',
      subtitle: 'Firebase Storage /images/, /videos/, /ebooks/',
      icon: Database,
      color: 'blue',
      action: () => {
        openModal('media-database');
        setIsOpen(false);
      },
      badge: 'Firebase'
    },
    {
      id: 'contact',
      title: 'Contact Us & Feedback',
      subtitle: 'Direct support & inquiries',
      icon: Mail,
      color: 'indigo',
      action: () => {
        openModal('contact');
        setIsOpen(false);
      },
      badge: 'Support'
    },
    ...(isAdmin ? [{
      id: 'admin',
      title: 'Admin Console',
      subtitle: 'Manage posts, orders & metrics',
      icon: Shield,
      color: 'rose',
      action: () => {
        openModal('admin');
        setIsOpen(false);
      },
      badge: 'Founder'
    }] : [])
  ];

  // Filter items based on widgetSearch
  const filteredQuickActions = quickActions.filter(item => 
    !widgetSearch || 
    item.title.toLowerCase().includes(widgetSearch.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(widgetSearch.toLowerCase())
  );

  const filteredCategories = categories.filter(cat =>
    !widgetSearch ||
    cat.toLowerCase().includes(widgetSearch.toLowerCase())
  );

  const quickSearchTags = [
    'Affiliate Funnels',
    'AI SEO',
    'SaaS Recurring',
    'Email List Growth',
    'Digital Handbooks'
  ];

  return (
    <>
      {/* FLOATING TRIGGER PILL / DOCK (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 group">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Quick Navigation Menu"
          className={`relative flex items-center gap-2.5 px-4 py-3 rounded-full shadow-2xl backdrop-blur-xl border transition-all duration-300 cursor-pointer ${
            isOpen 
              ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-emerald-500/20' 
              : 'bg-slate-900/90 text-slate-100 border-slate-700/80 hover:border-emerald-500/60 hover:shadow-emerald-500/10 shadow-slate-950/80'
          }`}
        >
          {/* Animated Icon */}
          <div className="relative w-5 h-5 flex items-center justify-center">
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center justify-center"
                >
                  <Menu className="w-5 h-5 text-emerald-400" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <span className="text-xs font-black tracking-wide hidden sm:inline-block">
            {isOpen ? 'Close' : 'Quick Menu'}
          </span>

          {/* Active Bookmarks Indicator Badge */}
          {bookmarkedCount > 0 && !isOpen && (
            <span className="flex items-center justify-center px-1.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-black text-[10px] min-w-[18px] h-4">
              {bookmarkedCount}
            </span>
          )}

          {/* Shortcut Key Badge */}
          <span className={`hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono rounded ${
            isOpen ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}>
            ⌘K
          </span>
        </motion.button>
      </div>

      {/* MODERN MENU WIDGET MODAL / COMMAND HUB */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md">
            {/* Backdrop Dismiss */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-transparent cursor-pointer"
            />

            {/* Widget Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] z-10"
            >
              {/* Widget Header & Instant Search */}
              <div className="p-4 sm:p-5 border-b border-slate-800/90 bg-slate-950/90">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                        JaysMoneyGuides <span className="text-emerald-400">Quick Navigation</span>
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Instant access to blueprints, handbooks, media database & tools
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer"
                    aria-label="Close widget"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Search Bar Input */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search guides, categories, handbooks, tools..."
                    value={widgetSearch}
                    onChange={(e) => setWidgetSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && widgetSearch.trim()) {
                        handleExecuteSearch(widgetSearch.trim());
                      }
                    }}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                  {widgetSearch && (
                    <button
                      onClick={() => setWidgetSearch('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Quick Search Tag Chips */}
                <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
                  <span className="text-slate-500 font-semibold flex items-center gap-1 shrink-0">
                    <Tag className="w-3 h-3" /> Quick:
                  </span>
                  {quickSearchTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleExecuteSearch(tag)}
                      className="px-2.5 py-0.5 rounded-lg bg-slate-800/80 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer border border-slate-700/60"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable Body Content */}
              <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1 divide-y divide-slate-800/60">
                
                {/* 1. Quick Navigation Hub Tiles */}
                <div className="space-y-2.5 pt-0">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-emerald-400" /> Primary Destinations
                    </span>
                    <span className="text-[10px] text-slate-500">Press item to jump</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {filteredQuickActions.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={item.action}
                          className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between group cursor-pointer ${
                            item.active
                              ? 'bg-emerald-500/10 border-emerald-500 text-white'
                              : 'bg-slate-950/60 border-slate-800 hover:border-emerald-500/40 hover:bg-slate-800/60'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 group-hover:scale-105 transition-transform">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                                {item.title}
                              </div>
                              <div className="text-[10px] text-slate-400 line-clamp-1">
                                {item.subtitle}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-slate-300 border border-slate-800">
                              {item.badge}
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Category Filter Rail */}
                <div className="space-y-2.5 pt-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-400" /> Guide Categories
                    </span>
                    <button
                      onClick={() => handleSelectCategoryAndClose('All')}
                      className="text-[11px] text-emerald-400 hover:underline font-semibold cursor-pointer"
                    >
                      View All ({totalPostsCount})
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <button
                      onClick={() => handleSelectCategoryAndClose('All')}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                        selectedCategory === 'All' && !showBookmarksOnly
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <span>All Blueprints</span>
                      <span className="text-[10px] opacity-80">{totalPostsCount}</span>
                    </button>

                    {filteredCategories.map((cat) => {
                      const isSelected = selectedCategory === cat && !showBookmarksOnly;
                      const count = postCounts[cat] || 0;
                      return (
                        <button
                          key={cat}
                          onClick={() => handleSelectCategoryAndClose(cat)}
                          className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                              : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                          }`}
                        >
                          <span className="truncate">{cat}</span>
                          <span className="text-[10px] opacity-80 ml-1">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Featured Handbook Spotlight Card */}
                <div className="space-y-2.5 pt-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-amber-400" /> Featured Handbooks
                    </span>
                    <button
                      onClick={() => scrollToSection('store')}
                      className="text-[11px] text-amber-400 hover:underline font-semibold cursor-pointer"
                    >
                      Browse Store
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Free Handbook Card */}
                    <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-2.5">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-16 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                          <img
                            src={freeProduct.coverImage}
                            alt={freeProduct.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              Free Handbook
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-white mt-1 line-clamp-1">{freeProduct.title}</h4>
                          <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{freeProduct.pageCount} pages · 100% Free</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setIsOpen(false);
                          if (onOpenFreeEbookOrOwned) {
                            onOpenFreeEbookOrOwned(freeProduct);
                          } else {
                            scrollToSection('store');
                          }
                        }}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-emerald-500/10"
                      >
                        <BookOpen className="w-3.5 h-3.5" /> Read Free Handbook
                      </button>
                    </div>

                    {/* Paid Handbook Card */}
                    <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-2.5">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-16 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                          <img
                            src={paidProduct.coverImage}
                            alt={paidProduct.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Master Edition · ${(paidProduct.priceCents / 100).toFixed(2)}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-white mt-1 line-clamp-1">{paidProduct.title}</h4>
                          <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">Includes full funnel templates & calculators</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setIsOpen(false);
                          if (onPreviewProduct) {
                            onPreviewProduct(paidProduct);
                          } else {
                            scrollToSection('store');
                          }
                        }}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-amber-400" /> Preview & Purchase
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. User Account & Preferences Card */}
                <div className="pt-4">
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {currentUser ? (
                        <>
                          <img
                            src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser.name)}`}
                            alt={currentUser.name}
                            className="w-8 h-8 rounded-xl object-cover border border-emerald-500/40"
                          />
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                              {currentUser.name}
                              {isAdmin && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[9px] font-bold border border-amber-500/30">
                                  Admin
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400">{currentUser.email}</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                            <UserIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">Guest Reader</div>
                            <div className="text-[10px] text-slate-400">Sign in to save bookmarks & unlock guides</div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {currentUser ? (
                        <>
                          <button
                            onClick={() => {
                              openModal('profile');
                              setIsOpen(false);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors cursor-pointer border border-slate-700"
                          >
                            My Profile
                          </button>
                          <button
                            onClick={() => {
                              onLogout();
                              setIsOpen(false);
                            }}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Sign Out"
                          >
                            <LogOut className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            openModal('auth');
                            setIsOpen(false);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <LogIn className="w-3.5 h-3.5" /> Sign In
                        </button>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* Widget Footer */}
              <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Storage & Firestore Synced
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">ESC</kbd> to exit</span>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
