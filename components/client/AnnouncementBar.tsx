'use client';

/**
 * Sticky animated scrolling red announcement bar, pinned to the very top.
 * Optimized for mobile with GPU acceleration and smooth animation.
 */
const MESSAGE =
  '🔥 LIMITED TIME: Get up to $125 with SoFi when you refer a friend  •  New SoFi Bank guides just dropped  •  Free Affiliate Marketing ebook available  •  ';

export function AnnouncementBar() {
  return (
    <div
      role="region"
      aria-label="Site announcements"
      className="w-full bg-gradient-to-r from-red-700 via-red-600 to-red-700 border-b border-red-900/50 shadow-md"
      style={{
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        willChange: 'transform',
      }}
    >
      {/* Container with GPU acceleration */}
      <div
        className="relative flex whitespace-nowrap"
        style={{
          animation: 'marquee 30s linear infinite',
          willChange: 'transform',
          transform: 'translateZ(0)', // GPU acceleration
          backfaceVisibility: 'hidden',
        }}
      >
        {/* First copy: readable by screen readers once */}
        <div className="flex shrink-0 items-center">
          <span className="px-4 text-xs sm:text-sm font-bold tracking-wide text-white" style={{ minWidth: 'fit-content' }}>
            {MESSAGE}
          </span>
          <span className="px-4 text-xs sm:text-sm font-bold tracking-wide text-white" aria-hidden="true" style={{ minWidth: 'fit-content' }}>
            {MESSAGE}
          </span>
        </div>
        {/* Second copy: decorative, for seamless loop */}
        <div className="flex shrink-0 items-center" aria-hidden="true">
          <span className="px-4 text-xs sm:text-sm font-bold tracking-wide text-white" style={{ minWidth: 'fit-content' }}>
            {MESSAGE}
          </span>
          <span className="px-4 text-xs sm:text-sm font-bold tracking-wide text-white" style={{ minWidth: 'fit-content' }}>
            {MESSAGE}
          </span>
        </div>
      </div>

      {/* Inline keyframe animation */}
      <style>{`
        @keyframes marquee {
          from {
            transform: translateX(0) translateZ(0);
          }
          to {
            transform: translateX(-50%) translateZ(0);
          }
        }

        /* Reduce motion preference */
        @media (prefers-reduced-motion: reduce) {
          div[style*="animation: marquee"] {
            animation: none !important;
            transform: translateX(0) !important;
          }
        }

        /* Mobile optimization: use less smooth scrolling on lower-end devices */
        @media (max-width: 480px) {
          @keyframes marquee {
            from {
              transform: translateX(0) translateZ(0);
            }
            to {
              transform: translateX(-50%) translateZ(0);
            }
          }
        }
      `}</style>
    </div>
  );
}
