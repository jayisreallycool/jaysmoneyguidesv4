'use client';
import React, { useState } from 'react';
import { ModalView, ContactMessage } from '@/lib/types';
import { 
  X, 
  Shield, 
  FileText, 
  Mail, 
  CheckCircle2, 
  Send, 
  AlertCircle, 
  MapPin, 
  UserRound, 
  Award, 
  Target,
  Cookie,
  AlertTriangle,
  ExternalLink,
  DollarSign,
  Sparkles,
  Lock,
  Globe
} from 'lucide-react';
import { sanitizeInput, checkRateLimit, logSecurityEvent } from '@/utils/security';

interface MandatoryPagesModalProps {
  view: ModalView;
  onClose: () => void;
  onSelectTab: (tab: ModalView) => void;
  onNewContactMessage: (msg: ContactMessage) => void;
}

export const MandatoryPagesModal: React.FC<MandatoryPagesModalProps> = ({
  view,
  onClose,
  onSelectTab,
  onNewContactMessage,
}) => {
  // Contact Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (view === 'none' || view === 'admin' || view === 'post-reader' || view === 'auth' || view === 'profile' || view === 'media-database' || view === 'ebook-viewer' || view === 'ebook-preview') {
    return null;
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Rate limiting check (max 3 contact submissions per minute)
    const rl = checkRateLimit('contact_submit', 3, 60000);
    if (!rl.allowed) {
      const msg = `Rate limit reached. Please wait ${rl.retryAfterSec} seconds before sending another message.`;
      setErrorMsg(msg);
      logSecurityEvent('RATE_LIMIT_BLOCKED', 'Contact form submission throttled', `Email: ${email}`);
      return;
    }

    const cleanName = sanitizeInput(name.trim());
    const cleanEmail = sanitizeInput(email.trim().toLowerCase());
    const cleanSubject = sanitizeInput(subject.trim());
    const cleanMessage = sanitizeInput(message.trim());

    if (!cleanName || !cleanEmail || !cleanMessage) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (name !== cleanName || message !== cleanMessage) {
      logSecurityEvent('XSS_PREVENTED', 'HTML/Script tags stripped from contact message', `Author: ${cleanName}`);
    }

    setIsSubmitting(true);

    const newMsg: ContactMessage = {
      id: 'msg-' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject,
      message: cleanMessage,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      read: false,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cleanName, email: cleanEmail, subject: cleanSubject, message: cleanMessage }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmittedSuccess(true);
        onNewContactMessage(newMsg);
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setErrorMsg(data.error || 'Failed to send message');
      }
    } catch {
      // Offline / fallback save
      setSubmittedSuccess(true);
      onNewContactMessage(newMsg);
      setName('');
      setEmail('');
      setMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs: { id: ModalView; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'about', label: 'About Us', icon: UserRound },
    { id: 'contact', label: 'Contact Us', icon: Mail },
    { id: 'privacy', label: 'Privacy Policy', icon: Shield },
    { id: 'terms', label: 'Terms of Service', icon: FileText },
    { id: 'disclaimer', label: 'Disclaimer', icon: AlertTriangle },
    { id: 'cookie-policy', label: 'Cookie Policy', icon: Cookie },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex justify-center items-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Navigation Tabs Header */}
        <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = view === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition-colors ml-2 shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-6 text-slate-300">
          
          {/* TAB 1: ABOUT US */}
          {view === 'about' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Editorial Integrity & Mission</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">About JaysMoneyGuides.com</h2>
                <p className="text-sm text-slate-300 mt-1">
                  Practical, proven blueprints on affiliate marketing, programmatic SEO, newsletter funnels, and creator technology.
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/80 rounded-2xl p-5 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
                    <UserRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">Who Runs This Site</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      JaysMoneyGuides is founded and operated by Jay Lopez, an online entrepreneur, affiliate marketer, and developer. Every article and handbook on this platform is crafted from direct testing, analytics data, and real-world experiments across modern search algorithms and recurring SaaS affiliate programs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 shrink-0">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">Our Core Focus</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      We break down high-ticket affiliate programs, programmatic SEO architectures, content scaling frameworks, conversion rate optimization, and digital leverage. We prioritize actionable data, concrete step-by-step implementation, and realistic ROI projections over hype.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">Monetization & Transparency</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      To keep all core guides 100% free to read, JaysMoneyGuides is monetized through ethical affiliate partnerships, Google AdSense display advertising, and original digital training handbooks. All sponsorships and affiliate links are clearly marked according to FTC guidelines.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-800/30 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-center justify-between">
                <span>Have inquiries or partnership proposals?</span>
                <button 
                  onClick={() => onSelectTab('contact')} 
                  className="text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Contact Jay Directly &rarr;
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CONTACT US */}
          {view === 'contact' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Direct Communication</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">Contact Us</h2>
                <p className="text-sm text-slate-300 mt-1">
                  Have questions about our guides, ebook orders, advertising opportunities, or technical inquiries? We respond within 24 hours.
                </p>
              </div>

              {submittedSuccess ? (
                <div className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 rounded-2xl p-6 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Message Dispatched Successfully!</h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto">
                    Thank you for reaching out. Jay reviews all correspondence personally and will get in touch promptly.
                  </p>
                  <button
                    onClick={() => setSubmittedSuccess(false)}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="bg-rose-500/20 border border-rose-500/40 text-rose-300 p-3 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name-input" className="block text-xs font-semibold text-slate-300 mb-1">Your Name *</label>
                      <input
                        id="contact-name-input"
                        name="name"
                        type="text"
                        required
                        placeholder="Jay Lopez"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email-input" className="block text-xs font-semibold text-slate-300 mb-1">Your Email Address *</label>
                      <input
                        id="contact-email-input"
                        name="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject-select" className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                    <select
                      id="contact-subject-select"
                      name="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="General Inquiry">General Business Inquiry</option>
                      <option value="Advertising & Sponsorship">Advertising & Google AdSense Partnerships</option>
                      <option value="Affiliate Marketing Strategy">Affiliate Strategy & SEO Consulting</option>
                      <option value="Ebook Order / Download Support">Ebook Order & Download Support</option>
                      <option value="Privacy / Data Request">Privacy Policy & Data Rights Request</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-message-textarea" className="block text-xs font-semibold text-slate-300 mb-1">Message *</label>
                    <textarea
                      id="contact-message-textarea"
                      name="message"
                      required
                      rows={4}
                      placeholder="How can we help you today? Please share your question or proposal..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-98 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? 'Transmitting Message...' : 'Send Message'}
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Direct Info */}
              <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-2 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Email: <strong>jay@jaysmoneyguides.com</strong></span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Location: <strong>Austin, TX • Worldwide Digital</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRIVACY POLICY (WITH MANDATORY GOOGLE ADSENSE DISCLOSURE) */}
          {view === 'privacy' && (
            <div className="space-y-4 text-sm leading-relaxed">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Mandatory Compliance</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">Privacy Policy</h2>
                <p className="text-xs text-slate-400">Effective Date: January 1, 2026 • Last Updated: August 2026</p>
              </div>

              {/* Mandatory Google AdSense Notice Box */}
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-xs space-y-2 text-slate-200">
                <p className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Mandatory Google AdSense & Third-Party Advertising Disclosure:
                </p>
                <p>
                  Third party vendors, including Google, use cookies to serve ads based on a user's prior visits to JaysMoneyGuides.com or other websites. Google's use of advertising cookies (such as DoubleClick DART cookies) enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.
                </p>
                <p>
                  Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline font-semibold">Google Ads Settings</a> or by visiting <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline font-semibold">www.aboutads.info/choices</a>.
                </p>
              </div>

              <h3 className="text-base font-bold text-white mt-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" /> 1. Information We Collect
              </h3>
              <p>
                We collect personal information that you provide to us directly, including your name, email address, contact form submissions, and newsletter signups. When you browse the site, web servers automatically log standard details such as IP address, browser type, device identifiers, and referring pages.
              </p>

              <h3 className="text-base font-bold text-white mt-4 flex items-center gap-2">
                <Cookie className="w-4 h-4 text-emerald-400" /> 2. Cookies & Tracking Technologies
              </h3>
              <p>
                JaysMoneyGuides uses first-party and third-party cookies:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-300">
                <li><strong>Strictly Necessary Cookies:</strong> Required to authenticate sessions, remember reading lists, and process digital handbook purchases.</li>
                <li><strong>Analytics Cookies:</strong> To analyze guide readership, scroll depth, and site engagement (Google Analytics).</li>
                <li><strong>Advertising & Targeting Cookies:</strong> Used by Google AdSense and affiliate networks to deliver relevant advertisements and track referral commissions.</li>
              </ul>

              <h3 className="text-base font-bold text-white mt-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" /> 3. GDPR & CCPA/CPRA Privacy Rights
              </h3>
              <p>
                Depending on your location, you possess rights under the European General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA):
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-300">
                <li><strong>Right to Access:</strong> You can request a copy of the personal data we store about you.</li>
                <li><strong>Right to Erasure (Forget Me):</strong> You can request permanent deletion of your email and subscriber records.</li>
                <li><strong>Do Not Sell My Personal Information:</strong> We do not sell personal data to data brokers.</li>
              </ul>
              <p className="text-xs">
                To exercise any of these rights, contact our Data Privacy Officer at <span className="text-emerald-400 font-semibold">privacy@jaysmoneyguides.com</span>.
              </p>
            </div>
          )}

          {/* TAB 4: TERMS OF SERVICE */}
          {view === 'terms' && (
            <div className="space-y-4 text-sm leading-relaxed">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Legal Terms</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">Terms of Service</h2>
                <p className="text-xs text-slate-400">Effective Date: January 1, 2026 • Last Updated: August 2026</p>
              </div>

              <h3 className="text-base font-bold text-white mt-3">1. Agreement to Terms</h3>
              <p>
                By visiting or accessing JaysMoneyGuides.com, you agree to be bound by these Terms of Service and all applicable laws. If you disagree with any portion of these terms, you must discontinue use of the website immediately.
              </p>

              <h3 className="text-base font-bold text-white mt-3">2. Intellectual Property Rights</h3>
              <p>
                All original guides, editorial blueprints, ebooks, downloadable PDF files, custom calculators, algorithms, graphics, and code on JaysMoneyGuides are the exclusive intellectual property of Jay Lopez and JaysMoneyGuides. You are granted a personal, non-commercial, revocable license to read and apply the concepts for your own business. Republishing, scraping, or mass redistribution without express written consent is strictly prohibited.
              </p>

              <h3 className="text-base font-bold text-white mt-3">3. Digital Products & Handbooks</h3>
              <p>
                Digital handbooks purchased via Stripe are delivered electronically with individual download entitlements. Digital goods are non-transferable.
              </p>

              <h3 className="text-base font-bold text-white mt-3">4. Limitation of Liability</h3>
              <p>
                In no event shall JaysMoneyGuides, Jay Lopez, or its contributors be liable for any indirect, special, incidental, or consequential damages resulting from the use or inability to use the information, strategies, software recommendations, or links provided on this site.
              </p>
            </div>
          )}

          {/* TAB 5: DISCLAIMER & FTC AFFILIATE DISCLOSURE */}
          {view === 'disclaimer' && (
            <div className="space-y-4 text-sm leading-relaxed">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">FTC & Earnings Compliance</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">Disclaimer & Affiliate Disclosure</h2>
                <p className="text-xs text-slate-400">Effective Date: January 1, 2026 • Last Updated: August 2026</p>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-200 space-y-2">
                <p className="font-bold text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  FTC 16 CFR Part 255 Affiliate Disclosure:
                </p>
                <p>
                  JaysMoneyGuides participates in various affiliate marketing programs. Some of the links on this website are affiliate links. If you click on an affiliate link and make a purchase, we may receive a commission from the merchant at zero additional cost to you. We only recommend platforms, tools, hosting providers, and software that we have evaluated, tested, or use in production.
                </p>
              </div>

              <h3 className="text-base font-bold text-white mt-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" /> Earnings & Income Disclaimer
              </h3>
              <p>
                Any revenue figures, monthly earnings screenshots, case studies, or traffic metrics mentioned on JaysMoneyGuides are illustrative examples of what is possible. They do not represent a guarantee or promise that you will achieve similar results.
              </p>
              <p>
                Success in online business, affiliate marketing, and SEO requires persistent execution, skill, risk tolerance, and time. Your individual results will depend on your skills, work ethic, budget, market conditions, and numerous external factors.
              </p>

              <h3 className="text-base font-bold text-white mt-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-emerald-400" /> Not Financial, Legal, or Tax Advice
              </h3>
              <p>
                The content provided on this website is for educational and informational purposes only. Nothing on this website constitutes financial, legal, tax, or professional accounting advice. Always consult a certified professional before making significant business investments.
              </p>
            </div>
          )}

          {/* TAB 6: COOKIE POLICY & AD CHOICES */}
          {view === 'cookie-policy' && (
            <div className="space-y-4 text-sm leading-relaxed">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Cookie Governance & AdChoices</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">Cookie Policy & Advertising Choices</h2>
                <p className="text-xs text-slate-400">Effective Date: January 1, 2026 • Last Updated: August 2026</p>
              </div>

              <p>
                This Cookie Policy explains how JaysMoneyGuides ("we", "us") uses cookies and similar browser storage technologies to recognize you when you visit our website.
              </p>

              <div className="space-y-3">
                <div className="p-4 bg-slate-800/50 border border-slate-700/80 rounded-xl space-y-1">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase">1. Strictly Necessary Cookies</h4>
                  <p className="text-xs text-slate-300">
                    Essential for website operation, user authentication via Google Identity / Firebase, and security firewalls. These cannot be switched off in our systems.
                  </p>
                </div>

                <div className="p-4 bg-slate-800/50 border border-slate-700/80 rounded-xl space-y-1">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase">2. Analytics & Performance Cookies</h4>
                  <p className="text-xs text-slate-300">
                    Allow us to count visits and traffic sources so we can measure and improve the performance of our SEO and affiliate guides.
                  </p>
                </div>

                <div className="p-4 bg-slate-800/50 border border-slate-700/80 rounded-xl space-y-1">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase">3. Google AdSense & Targeting Cookies</h4>
                  <p className="text-xs text-slate-300">
                    May be set through our site by Google AdSense and advertising partners to build a profile of your interests and show you relevant ads on other sites.
                  </p>
                </div>
              </div>

              <h3 className="text-base font-bold text-white mt-4">How to Manage & Opt Out of Cookies</h3>
              <p className="text-xs text-slate-300">
                You can configure your browser to block or alert you about cookies. To opt out of Google's personalized advertising across the web:
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2 text-xs">
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center justify-between gap-2 text-emerald-400 font-semibold"
                >
                  <span>Google Ads Settings</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://www.aboutads.info/choices"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center justify-between gap-2 text-emerald-400 font-semibold"
                >
                  <span>AboutAds.info Choices</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://www.youronlinechoices.eu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center justify-between gap-2 text-emerald-400 font-semibold"
                >
                  <span>Your Online Choices (EU)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
