'use client';

import React, { useState } from 'react';
import { 
  Globe, 
  Mail, 
  ShoppingCart, 
  BarChart3, 
  Zap, 
  Palette, 
  CreditCard, 
  Brain, 
  Users, 
  BookOpen, 
  Hammer,
  ExternalLink,
  Check,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Heart
} from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  description: string;
  commission: string;
  payout: string;
  category: string;
  link: string;
  features: string[];
  badge?: string;
  badgeColor?: string;
}

const TOOLS_DATA: Tool[] = [
  // Web Hosting & Domains
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'All-in-one e-commerce platform for dropshipping and online stores',
    commission: '$200-500+ per signup',
    payout: 'Recurring commission',
    category: 'Web Hosting & E-Commerce',
    link: 'https://www.shopify.com/?ref=jaysmoneyguides',
    features: ['Easy setup', 'Dropshipping ready', 'Payment processing', 'Marketing tools'],
    badge: 'HIGH TICKET',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
  },
  {
    id: 'bluehost',
    name: 'Bluehost',
    description: 'Beginner-friendly WordPress hosting platform',
    commission: '$65-75 per sale',
    payout: 'First purchase only',
    category: 'Web Hosting & E-Commerce',
    link: 'https://www.bluehost.com/wordpress/hosting/?ref=jaysmoneyguides',
    features: ['WordPress optimized', 'SSL included', 'Free domain', '24/7 support'],
    badge: 'POPULAR',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  },
  {
    id: 'siteground',
    name: 'SiteGround',
    description: 'Premium WordPress and cloud hosting with excellent support',
    commission: '$40-80 per signup',
    payout: 'Recurring monthly',
    category: 'Web Hosting & E-Commerce',
    link: 'https://www.siteground.com/?ref=jaysmoneyguides',
    features: ['Fast performance', 'Expert support', 'Free SSL', 'Auto backups'],
  },
  {
    id: 'kinsta',
    name: 'Kinsta',
    description: 'Premium managed WordPress hosting for professional sites',
    commission: '$100-150 per referral',
    payout: 'Recurring annually',
    category: 'Web Hosting & E-Commerce',
    link: 'https://kinsta.com/?ref=jaysmoneyguides',
    features: ['Premium performance', 'Enterprise support', 'Staging sites', 'Advanced security'],
  },
  {
    id: 'namecheap',
    name: 'Namecheap',
    description: 'Affordable domain registration and web hosting',
    commission: '$0.95-$1.35 per domain',
    payout: 'Per sale',
    category: 'Web Hosting & E-Commerce',
    link: 'https://www.namecheap.com/?ref=jaysmoneyguides',
    features: ['Cheap domains', 'Whois privacy', 'Free email', 'SSL certificates'],
  },

  // Email Marketing
  {
    id: 'convertkit',
    name: 'ConvertKit',
    description: 'Email marketing platform built for creators and writers',
    commission: '$0.30 per day per referral',
    payout: 'Recurring daily',
    category: 'Email Marketing',
    link: 'https://convertkit.com?ref=jaysmoneyguides',
    features: ['Creator-friendly', 'Beautiful templates', 'Automation', 'Subscriber growth'],
    badge: 'RECURRING',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
  },
  {
    id: 'getresponse',
    name: 'GetResponse',
    description: 'All-in-one email marketing and automation platform',
    commission: '$0.30-$1/day per referral',
    payout: 'Recurring daily',
    category: 'Email Marketing',
    link: 'https://www.getresponse.com/?ref=jaysmoneyguides',
    features: ['Email campaigns', 'Webinar hosting', 'Automation', 'CRM integration'],
  },
  {
    id: 'activecampaign',
    name: 'ActiveCampaign',
    description: 'Advanced CRM with email marketing and automation',
    commission: '30% commission or flat rate',
    payout: 'Recurring commission',
    category: 'Email Marketing',
    link: 'https://www.activecampaign.com/?ref=jaysmoneyguides',
    features: ['CRM + email', 'Advanced automation', 'Sales pipeline', 'Deal tracking'],
  },

  // SEO Tools
  {
    id: 'semrush',
    name: 'SEMrush',
    description: 'Complete SEO toolkit for keyword research and competitor analysis',
    commission: '$200-400 per signup',
    payout: 'Recurring monthly',
    category: 'Analytics & SEO Tools',
    link: 'https://www.semrush.com/?ref=jaysmoneyguides',
    features: ['Keyword research', 'Competitor analysis', 'Rank tracking', 'SEO audit'],
    badge: 'HIGH TICKET',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
  },
  {
    id: 'ahrefs',
    name: 'Ahrefs',
    description: 'Backlink analysis and SEO research tool',
    commission: '$7-12 per $100/month plan',
    payout: 'Recurring monthly',
    category: 'Analytics & SEO Tools',
    link: 'https://ahrefs.com/?ref=jaysmoneyguides',
    features: ['Backlink analysis', 'Site explorer', 'Keyword planner', 'Content ideas'],
  },
  {
    id: 'moz',
    name: 'Moz Pro',
    description: 'SEO software for keyword research and rank tracking',
    commission: '$100-200 per signup',
    payout: 'Recurring monthly',
    category: 'Analytics & SEO Tools',
    link: 'https://moz.com/products/pro?ref=jaysmoneyguides',
    features: ['Rank tracking', 'Keyword research', 'Site audits', 'Link research'],
  },
  {
    id: 'surferseo',
    name: 'SurferSEO',
    description: 'Content optimization tool for better rankings',
    commission: '$200+ per annual signup',
    payout: 'Recurring annually',
    category: 'Analytics & SEO Tools',
    link: 'https://surferseo.com/?ref=jaysmoneyguides',
    features: ['Content editor', 'SERP analysis', 'Rank tracking', 'Audit tool'],
  },

  // E-Commerce Platforms
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    description: 'Open-source e-commerce plugin for WordPress',
    commission: '$100-300 per sale',
    payout: 'One-time commission',
    category: 'Web Hosting & E-Commerce',
    link: 'https://woocommerce.com/?ref=jaysmoneyguides',
    features: ['WordPress integration', 'Free + premium', 'Flexible products', 'Payment gateways'],
  },
  {
    id: 'bigcommerce',
    name: 'BigCommerce',
    description: 'Enterprise-grade e-commerce platform',
    commission: '$150-250 per signup',
    payout: 'Recurring commission',
    category: 'Web Hosting & E-Commerce',
    link: 'https://www.bigcommerce.com/?ref=jaysmoneyguides',
    features: ['Scalable', 'Multi-channel', 'Advanced analytics', 'API access'],
  },

  // AI Tools
  {
    id: 'copy-ai',
    name: 'Copy.ai',
    description: 'AI-powered copywriting tool for content creation',
    commission: '30% lifetime value',
    payout: 'Recurring subscription',
    category: 'AI & Automation Tools',
    link: 'https://www.copy.ai/?ref=jaysmoneyguides',
    features: ['AI copywriting', '100+ templates', 'Bulk content', 'SEO optimization'],
    badge: 'AI POWERED',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  },
  {
    id: 'jasper',
    name: 'Jasper',
    description: 'Advanced AI content writer for long-form and short-form content',
    commission: '30% lifetime value',
    payout: 'Recurring subscription',
    category: 'AI & Automation Tools',
    link: 'https://www.jasper.ai/?ref=jaysmoneyguides',
    features: ['AI writing', 'Brand voice', 'Content templates', 'Plagiarism checker'],
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Automation platform connecting 1000+ apps',
    commission: '30% revenue share',
    payout: 'Recurring commission',
    category: 'AI & Automation Tools',
    link: 'https://zapier.com/?ref=jaysmoneyguides',
    features: ['App integration', 'Automation', 'No-code', 'Workflows'],
  },

  // Web Design Tools
  {
    id: 'elementor',
    name: 'Elementor',
    description: 'WordPress page builder for professional websites',
    commission: '$150+ per signup',
    payout: 'Recurring annual',
    category: 'Web Design & No-Code',
    link: 'https://elementor.com/?ref=jaysmoneyguides',
    features: ['Drag & drop', 'Responsive', '100+ widgets', 'Template library'],
  },
  {
    id: 'webflow',
    name: 'Webflow',
    description: 'Visual web development platform without code',
    commission: '30% lifetime value',
    payout: 'Recurring subscription',
    category: 'Web Design & No-Code',
    link: 'https://webflow.com/?ref=jaysmoneyguides',
    features: ['Visual builder', 'Hosting included', 'CMS', 'E-commerce'],
  },
  {
    id: 'figma',
    name: 'Figma',
    description: 'Collaborative design tool for UI/UX designers',
    commission: '$25-100 per signup',
    payout: 'Recurring monthly',
    category: 'Web Design & No-Code',
    link: 'https://figma.com/?ref=jaysmoneyguides',
    features: ['Design collaboration', 'Prototyping', 'Component library', 'Version history'],
  },

  // Project Management
  {
    id: 'monday',
    name: 'Monday.com',
    description: 'Work OS for project and team management',
    commission: '30% lifetime value',
    payout: 'Recurring subscription',
    category: 'Productivity & Management',
    link: 'https://monday.com/?ref=jaysmoneyguides',
    features: ['Project tracking', 'Team collaboration', 'Automation', 'Integrations'],
  },
  {
    id: 'asana',
    name: 'Asana',
    description: 'Project management tool for teams and organizations',
    commission: '20-30% commission',
    payout: 'Recurring subscription',
    category: 'Productivity & Management',
    link: 'https://asana.com/?ref=jaysmoneyguides',
    features: ['Task management', 'Timeline view', 'Portfolio tracking', 'Automation'],
  },

  // Affiliate Networks
  {
    id: 'cjaffiliate',
    name: 'CJ Affiliate',
    description: 'Global affiliate network with 3000+ brands',
    commission: 'Varies by brand',
    payout: 'Monthly',
    category: 'Affiliate Networks',
    link: 'https://www.cj.com/brands?ref=jaysmoneyguides',
    features: ['1000s of brands', 'Real-time tracking', 'Competitive commissions', 'Support'],
    badge: 'GATEWAY',
    badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
  },
  {
    id: 'impact',
    name: 'Impact',
    description: 'Performance marketing network for SaaS and tech',
    commission: 'Varies by brand',
    payout: 'Monthly',
    category: 'Affiliate Networks',
    link: 'https://www.impact.com/?ref=jaysmoneyguides',
    features: ['500+ SaaS brands', 'High commissions', 'Real-time dashboard', 'Support'],
  },
  {
    id: 'partnerstack',
    name: 'PartnerStack',
    description: 'Modern affiliate platform for SaaS partnerships',
    commission: 'Varies by partner',
    payout: 'Weekly/Monthly',
    category: 'Affiliate Networks',
    link: 'https://www.partnerstack.com/?ref=jaysmoneyguides',
    features: ['Curated partners', 'Higher commissions', 'Easy tracking', 'Support'],
  },
];

const CATEGORIES = [
  'All Programs',
  'Web Hosting & E-Commerce',
  'Email Marketing',
  'Analytics & SEO Tools',
  'AI & Automation Tools',
  'Web Design & No-Code',
  'Productivity & Management',
  'Affiliate Networks',
];

export function ToolsContent() {
  const [selectedCategory, setSelectedCategory] = useState('All Programs');

  const filteredTools = selectedCategory === 'All Programs'
    ? TOOLS_DATA
    : TOOLS_DATA.filter(tool => tool.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Hero Section */}
      <section className="pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-sm font-semibold text-emerald-400">
            <Heart className="w-4 h-4" />
            Tools I Actually Use & Recommend
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Recommended Tools &{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
              Affiliate Programs
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Curated collection of platforms, tools, and affiliate programs I personally use and recommend to build your online business. Every link supports JaysMoneyGuides at no extra cost to you.
          </p>
        </div>

        {/* FTC Disclosure */}
        <div className="mb-12 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <p className="text-sm text-amber-200 flex items-start gap-2">
            <Check className="w-5 h-5 shrink-0 mt-0.5" />
            <span><strong>FTC Disclosure:</strong> Some links are affiliate links. If you purchase through these links, I earn a small commission at no extra cost to you. This helps support JaysMoneyGuides. Thank you for your support!</span>
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                selectedCategory === category
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/50'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Tools Grid */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="group relative bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/50 transition-all hover:shadow-xl hover:shadow-emerald-500/10"
            >
              {/* Badge */}
              {tool.badge && (
                <div className={`absolute -top-3 -right-3 px-3 py-1 rounded-full text-xs font-black border ${tool.badgeColor}`}>
                  {tool.badge}
                </div>
              )}

              {/* Header */}
              <div className="mb-4">
                <h3 className="text-xl font-black text-white mb-2 group-hover:text-emerald-400 transition">
                  {tool.name}
                </h3>
                <p className="text-sm text-slate-400">{tool.description}</p>
              </div>

              {/* Commission Info */}
              <div className="space-y-2 mb-5 pb-5 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="text-xs text-slate-500">Commission</p>
                    <p className="text-sm font-semibold text-emerald-400">{tool.commission}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-teal-400" />
                  <div>
                    <p className="text-xs text-slate-500">Payout</p>
                    <p className="text-sm font-semibold text-teal-400">{tool.payout}</p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-slate-400 uppercase mb-3 tracking-wider">Key Features</p>
                <ul className="space-y-2">
                  {tool.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <a
                href={tool.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-lg transition-all transform hover:scale-105 active:scale-95"
              >
                <span>Get Started</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">No tools found in this category.</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
        <div className="bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 border border-emerald-500/30 rounded-2xl p-8 sm:p-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black">Still Looking for More?</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Check out the detailed guides on each of these tools in our blog. I've written in-depth reviews and tutorials to help you get started.
            </p>
            <a
              href="/blog"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-lg transition-all transform hover:scale-105"
            >
              <span>Read Our Guides</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
