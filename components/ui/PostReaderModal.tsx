'use client';
import React, { useState, useEffect, useRef } from 'react';
import { BlogPost, Comment } from '@/lib/types';
import { AffiliateCalculator } from './AffiliateCalculator';
import { sanitizeInput, sanitizeUrl, checkRateLimit, logSecurityEvent } from '@/utils/security';
import { 
  X, 
  Clock, 
  Eye, 
  Heart, 
  Bookmark, 
  Share2, 
  CheckCircle2, 
  MessageSquare, 
  Send, 
  Copy, 
  Check, 
  Tag, 
  Sparkles,
  ArrowLeft,
  Star,
  ShieldAlert
} from 'lucide-react';

/**
 * Renders a raw HTML block from the article editor, including live <style> and
 * <script> tags. Admin-authored article content is trusted (only editable via
 * the password-gated Admin Console), so this intentionally executes markup as
 * written rather than stripping it — this is what powers "HTML/CSS/JS enabled"
 * blog posts (embedded calculators, custom layouts, styled callouts, etc).
 */
const RawHtmlBlock: React.FC<{ html: string }> = ({ html }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = html;

    // <script> tags inserted via innerHTML do not execute automatically —
    // recreate each one so the browser actually runs it.
    const scripts = Array.from(container.querySelectorAll<HTMLScriptElement>('script'));
    scripts.forEach((oldScript: HTMLScriptElement) => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach((attr) => newScript.setAttribute(attr.name, attr.value));
      newScript.text = oldScript.textContent || '';
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });

    return () => {
      container.innerHTML = '';
    };
  }, [html]);

  return <div ref={containerRef} className="article-html-block my-4" />;
};

/** Parses inline markdown formatting: **bold**, *italic*, `code`, [text](url). */
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const pattern = /(\*\*.+?\*\*|`.+?`|\[.+?\]\(.+?\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**')) {
      nodes.push(<strong key={`${keyPrefix}-b-${i++}`} className="text-emerald-300 font-bold">{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('`')) {
      nodes.push(<code key={`${keyPrefix}-c-${i++}`} className="bg-slate-800 text-emerald-300 px-1.5 py-0.5 rounded text-sm font-mono">{token.slice(1, -1)}</code>);
    } else if (token.startsWith('[')) {
      const linkMatch = token.match(/^\[(.+?)\]\((.+?)\)$/);
      if (linkMatch) {
        const href = sanitizeUrl(linkMatch[2]);
        // Internal links (relative or same-origin) stay followable; external
        // links get rel="nofollow sponsored" — safe default for a monetized
        // content site (FTC + SEO best practice) since outbound links here are
        // often affiliate or uncontrolled.
        const isInternal = href.startsWith('/') || href.startsWith('#');
        const rel = isInternal ? 'noopener' : 'noopener noreferrer nofollow sponsored';
        nodes.push(
          <a key={`${keyPrefix}-a-${i++}`} href={href} target={isInternal ? undefined : '_blank'} rel={rel} className="text-emerald-400 underline hover:text-emerald-300">
            {linkMatch[1]}
          </a>
        );
      }
    }
    lastIndex = match.index + token.length;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

/**
 * Full article body renderer. Supports true H1–H6 heading levels (the post
 * title itself is the page's single H1; in-body "#" through "#####" map to
 * H2–H6 so heading hierarchy stays semantically correct), bold/italic/inline
 * code/links, images, bullet + numbered lists, fenced code blocks, horizontal
 * rules, and raw HTML/CSS/JS blocks written directly in the Admin Console.
 */
function renderArticleContent(content: string): React.ReactNode[] {
  const blocks = content.split(/\r?\n\r?\n/);
  const out: React.ReactNode[] = [];
  const headingTags = ['h2', 'h3', 'h4', 'h5', 'h6'] as const;
  const headingClasses = [
    'text-2xl font-black text-white mt-8 mb-4 border-b border-slate-800 pb-2',
    'text-xl font-bold text-emerald-400 mt-6 mb-3',
    'text-lg font-bold text-white mt-4 mb-2',
    'text-base font-bold text-white mt-4 mb-2',
    'text-sm font-bold uppercase tracking-wide text-slate-300 mt-3 mb-1.5',
  ];

  blocks.forEach((rawBlock, index) => {
    if (typeof rawBlock !== 'string') return;
    const block = rawBlock.trim();
    if (!block) return;

    // Fenced code blocks: ```lang\n...\n```
    if (block.startsWith('```')) {
      const lines = block.split('\n');
      const lang = lines[0].replace(/```/, '').trim();
      const code = lines.slice(1, lines[lines.length - 1].startsWith('```') ? -1 : undefined).join('\n');
      out.push(
        <pre key={index} className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto my-4 text-sm">
          {lang && <div className="text-xs text-slate-500 mb-2 uppercase tracking-wide">{lang}</div>}
          <code className="text-emerald-300 font-mono whitespace-pre">{code}</code>
        </pre>
      );
      return;
    }

    // Raw HTML/CSS/JS block written directly in the editor
    if (block.startsWith('<') && /<\/?[a-z][\s\S]*>/i.test(block)) {
      out.push(<RawHtmlBlock key={index} html={block} />);
      return;
    }

    // Headings: # through ##### map to H2–H6 (post title is the page's H1)
    const headingMatch = block.match(/^(#{1,5})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length; // 1-5
      const Tag = headingTags[level - 1] as 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      return out.push(
        React.createElement(
          Tag,
          { key: index, className: headingClasses[level - 1] },
          renderInline(headingMatch[2], `h-${index}`)
        )
      );
    }

    // Horizontal rule
    if (/^-{3,}$/.test(block)) {
      out.push(<hr key={index} className="border-slate-800 my-6" />);
      return;
    }

    // Blockquote (disclosures, callouts):  > text
    if (block.startsWith('>')) {
      const inner = block.split('\n').map((l) => l.replace(/^>\s?/, '')).join(' ');
      out.push(
        <blockquote key={index} className="my-5 border-l-4 border-emerald-500/60 bg-emerald-500/5 px-4 py-3 rounded-r-lg text-sm text-slate-300 leading-relaxed">
          {renderInline(inner, `bq-${index}`)}
        </blockquote>
      );
      return;
    }

    // Clickable image / banner:  [![alt](imgSrc)](linkHref)
    // (an image wrapped in a link — used for affiliate banners). Must be checked
    // BEFORE the plain-image and link handling, since it starts with '[!'.
    if (block.startsWith('[![')) {
      const clickImg = block.match(/^\[!\[(.*?)\]\((.*?)\)\]\((.*?)\)/);
      if (clickImg) {
        const altText = clickImg[1];
        const imgSrc = clickImg[2];
        const linkHref = sanitizeUrl(clickImg[3]);
        const isInternal = linkHref.startsWith('/') || linkHref.startsWith('#');
        const rel = isInternal ? 'noopener' : 'noopener noreferrer nofollow sponsored';
        out.push(
          <a
            key={index}
            href={linkHref}
            target={isInternal ? undefined : '_blank'}
            rel={rel}
            className="block my-6 rounded-2xl overflow-hidden border border-emerald-500/30 shadow-2xl bg-slate-950 hover:border-emerald-400 transition-colors"
          >
            <img
              src={imgSrc}
              alt={altText}
              className="w-full h-auto object-contain max-h-[420px] bg-slate-950"
              loading="lazy"
              decoding="async"
            />
            {altText && (
              <p className="text-center text-xs text-emerald-300 py-2.5 bg-slate-950/80 border-t border-slate-800 font-semibold">
                {altText} →
              </p>
            )}
          </a>
        );
        return;
      }
    }

    // Images
    if (block.startsWith('![')) {
      const imgMatch = block.match(/^!\[(.*?)\]\((.*?)\)/);
      if (imgMatch) {
        const altText = imgMatch[1];
        const imgSrc = imgMatch[2];
        out.push(
          <div key={index} className="my-6 rounded-2xl overflow-hidden border border-emerald-500/30 shadow-2xl bg-slate-950">
            <img
              src={imgSrc}
              alt={altText}
              className="w-full h-auto object-cover max-h-[500px]"
              loading="lazy"
              decoding="async"
            />
            {altText && (
              <p className="text-center text-xs text-slate-400 py-2 bg-slate-950/80 border-t border-slate-800 font-medium italic">
                {altText}
              </p>
            )}
          </div>
        );
        return;
      }
    }

    // Bulleted lists
    if (block.startsWith('* ') || block.startsWith('- ')) {
      const items = block.split('\n').filter((l) => l.trim().startsWith('* ') || l.trim().startsWith('- '));
      out.push(
        <ul key={index} className="list-disc pl-5 space-y-1 text-slate-300 my-3">
          {items.map((li, lidx) => (
            <li key={lidx}>{renderInline(li.trim().replace(/^[*-]\s+/, ''), `li-${index}-${lidx}`)}</li>
          ))}
        </ul>
      );
      return;
    }

    // Numbered lists
    if (/^\d+\.\s/.test(block)) {
      const items = block.split('\n').filter((l) => /^\s*\d+\.\s/.test(l));
      out.push(
        <ol key={index} className="list-decimal pl-5 space-y-1 text-slate-300 my-3">
          {items.map((li, lidx) => (
            <li key={lidx}>{renderInline(li.trim().replace(/^\d+\.\s+/, ''), `ol-${index}-${lidx}`)}</li>
          ))}
        </ol>
      );
      return;
    }

    out.push(<p key={index} className="text-slate-300 leading-relaxed">{renderInline(block, `p-${index}`)}</p>);
  });

  return out;
}

interface PostReaderModalProps {
  post: BlogPost;
  allPosts?: BlogPost[];
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (postId: string) => void;
  isLiked: boolean;
  onLikePost: (postId: string) => void;
  comments: Comment[];
  onAddComment: (postId: string, name: string, text: string) => void;
  onRatePost?: (postId: string, rating: number) => void;
  onSelectPost?: (post: BlogPost) => void;
  onOpenNewsletter?: () => void;
}

export const PostReaderModal: React.FC<PostReaderModalProps> = ({
  post,
  allPosts = [],
  onClose,
  isBookmarked,
  onToggleBookmark,
  isLiked,
  onLikePost,
  comments,
  onAddComment,
  onRatePost,
  onSelectPost,
  onOpenNewsletter,
}) => {
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [hasRated, setHasRated] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);

  // Related articles: same category first, then shared tags, capped at 4.
  const relatedPosts = React.useMemo(() => {
    const tagsA = new Set((post.tags || []).map((t) => t.toLowerCase()));
    return allPosts
      .filter((p) => p.id !== post.id && !p.isDraft)
      .map((p) => {
        let score = 0;
        if (p.category === post.category) score += 3;
        for (const t of p.tags || []) if (tagsA.has(t.toLowerCase())) score += 1;
        return { p, score };
      })
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((s) => s.p);
  }, [post, allPosts]);

  const handleRatePost = (stars: number) => {
    setUserRating(stars);
    setHasRated(true);
    if (onRatePost) {
      onRatePost(post.id, stars);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRateLimitError(null);

    // Rate Limit Check (max 3 comments per minute)
    const rl = checkRateLimit('post_comment', 3, 60000);
    if (!rl.allowed) {
      const msg = `Rate limit exceeded. Please wait ${rl.retryAfterSec}s before posting another comment.`;
      setRateLimitError(msg);
      logSecurityEvent('RATE_LIMIT_BLOCKED', 'Comment submission throttled', msg);
      return;
    }

    const cleanName = sanitizeInput(commentName.trim());
    const cleanText = sanitizeInput(commentText.trim());

    if (!cleanName || !cleanText) return;

    // Detect if potential XSS attempt was cleaned
    if (commentName !== cleanName || commentText !== cleanText) {
      logSecurityEvent('XSS_PREVENTED', 'HTML/Script tags stripped from user comment', `Author: ${cleanName}`);
    }

    onAddComment(post.id, cleanName, cleanText);
    setCommentName('');
    setCommentText('');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const postComments = comments.filter((c) => c.postId === post.id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto text-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Sticky Header Controls */}
        <div className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs sm:text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Guides
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleBookmark(post.id)}
              className={`p-2 rounded-xl border transition-all ${
                isBookmarked
                  ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title="Bookmark Post"
            >
              <Bookmark className="w-4 h-4" />
            </button>

            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 hover:text-white transition-colors"
              title="Copy link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              aria-label="Close article"
              className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-8 space-y-8">
          
          {/* Article Header */}
          <header className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="bg-emerald-500/20 text-emerald-300 font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                {post.category}
              </span>
              <span className="bg-slate-800 text-slate-300 font-medium px-3 py-1 rounded-full border border-slate-700">
                {post.difficulty} Level
              </span>
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> {post.readTimeMinutes} min read
              </span>
              <div className="bg-amber-950/60 text-amber-300 font-bold px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5 ml-auto">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{typeof post.rating === 'number' && post.rating > 0 ? post.rating.toFixed(1) : '0.0'} / 5.0</span>
                <span className="text-[10px] text-amber-400/80">({post.ratingCount || 0} votes)</span>
              </div>
            </div>

            <nav aria-label="Breadcrumb" className="text-xs text-slate-400">
              <ol className="flex items-center gap-1.5 flex-wrap">
                <li><a href="/" className="hover:text-emerald-400">Home</a></li>
                <li aria-hidden="true">/</li>
                <li className="text-slate-300">{post.category}</li>
                <li aria-hidden="true">/</li>
                <li className="text-slate-500 truncate max-w-[200px]" aria-current="page">{post.title}</li>
              </ol>
            </nav>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {post.title}
            </h1>

            {/* Author Information */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <img
                  src={post.author.avatar || '/images/jaysmoneyguides-logo.webp'}
                  alt={post.author.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/jaysmoneyguides-logo.webp';
                  }}
                  className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/40"
                />
                <div>
                  <p className="font-bold text-white text-sm">{post.author.name}</p>
                  <p className="text-xs text-slate-400">{post.author.role} • Published {post.publishedAt}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4 text-slate-400" /> {post.views}
                </span>
                <button
                  onClick={() => onLikePost(post.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
                    isLiked
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-rose-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-400' : ''}`} />
                  {post.likes}
                </button>
              </div>
            </div>
          </header>

          {/* Hero Cover Image */}
          <div className="rounded-2xl overflow-hidden border border-slate-800 aspect-[21/9] bg-slate-950">
            <img
              src={post.coverImage || '/images/affiliate-marketing-guide-cover.webp'}
              alt={post.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/affiliate-marketing-guide-cover.webp';
              }}
              className="w-full h-full object-cover"
            />
          </div>

          {/* FTC affiliate disclosure — placed before article content */}
          <p className="text-xs text-slate-500 italic">
            Disclosure: Some links in this article may be affiliate links. If you buy through
            them, we may earn a commission at no extra cost to you. We only recommend tools we
            believe are genuinely useful.
          </p>

          {/* Key Takeaways Box */}
          {post.keyTakeaways && post.keyTakeaways.length > 0 && (
            <div className="bg-slate-800/80 border border-emerald-500/30 rounded-2xl p-5 sm:p-6 shadow-xl">
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Actionable Key Takeaways
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-200">
                {post.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Embedded Affiliate Calculator Tool for Affiliate/SEO/Tech Guides */}
          {(post.category === 'Affiliate Marketing' || post.category === 'SEO' || post.category === 'Blogging') && (
            <AffiliateCalculator />
          )}

          {/* Article Main Text */}
          <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-slate-300 prose-p:leading-relaxed prose-strong:text-emerald-300 prose-ul:text-slate-300 text-base space-y-4">
            {post?.content && typeof post.content === 'string' ? renderArticleContent(post.content) : null}
          </div>

          {/* Contextual email CTA — free ebook lead magnet (end of article) */}
          {onOpenNewsletter && (
            <div className="mt-8 rounded-2xl border border-emerald-700/50 bg-gradient-to-br from-emerald-900/40 to-slate-900/40 p-5 sm:p-6">
              <h3 className="text-lg font-bold text-white">Get the free money-making guide</h3>
              <p className="mt-1 text-sm text-slate-300">
                Join the newsletter and get the free ebook plus new practical guides on
                affiliate marketing, SEO, and building online income.
              </p>
              <button
                type="button"
                onClick={onOpenNewsletter}
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-emerald-500 px-5 py-2.5 font-semibold text-slate-900 transition-colors hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Get the free ebook
              </button>
            </div>
          )}

          {/* Related Articles — internal linking for discovery & SEO */}
          {relatedPosts.length > 0 && onSelectPost && (
            <nav aria-label="Related articles" className="mt-8 pt-6 border-t border-slate-800">
              <h3 className="text-lg font-bold text-white mb-3">Related Articles</h3>
              <ul className="grid gap-2 sm:grid-cols-2">
                {relatedPosts.map((rp) => (
                  <li key={rp.id}>
                    <a
                      href={`/guide/${rp.slug}`}
                      onClick={(e) => { e.preventDefault(); onSelectPost(rp); }}
                      className="block rounded-lg border border-slate-800 bg-slate-800/40 px-4 py-3 text-sm font-medium text-slate-200 transition-colors hover:border-emerald-600/60 hover:text-white"
                    >
                      {rp.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Post Tags & Rating Widget */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-slate-400" />
                {post.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Interactive Rating Component */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  Rate this Guide & Strategy
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Did this blueprint help your online business? Leave a rating for Jay.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatePost(star)}
                    className="p-1.5 hover:scale-125 transition-transform focus:outline-none"
                    title={`Rate ${star} Stars`}
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        star <= (userRating || (post.rating ? Math.round(post.rating) : 5))
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
                {hasRated && (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                    Thank you!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <section className="pt-8 border-t border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                Discussion & Questions ({postComments.length})
              </h3>
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleCommentSubmit} className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 space-y-3">
              {rateLimitError && (
                <div className="bg-rose-500/20 border border-rose-500/40 p-3 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{rateLimitError}</span>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="comment-author-name" className="sr-only">Your Name or Handle</label>
                  <input
                    id="comment-author-name"
                    name="commentName"
                    type="text"
                    required
                    placeholder="Your Name / Handle"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="comment-content-text" className="sr-only">Comment message</label>
                <textarea
                  id="comment-content-text"
                  name="commentText"
                  required
                  rows={3}
                  placeholder="Ask Jay a question or share your experience with this strategy..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all ml-auto"
              >
                <Send className="w-4 h-4" />
                Post Comment
              </button>
            </form>

            {/* Existing Comments List */}
            <div className="space-y-3">
              {postComments.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4 italic">
                  No comments yet. Be the first entrepreneur to join the conversation!
                </p>
              ) : (
                postComments.map((comment) => (
                  <div key={comment.id} className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-300">{comment.authorName}</span>
                      <span className="text-slate-400">{comment.createdAt}</span>
                    </div>
                    <p className="text-sm text-slate-200">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
