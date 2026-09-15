'use client';

/**
 * Sticky animated scrolling red announcement bar, pinned to the very top.
 * The message scrolls right-to-left (marquee) and the bar stays fixed on scroll.
 */
const MESSAGE =
  '🔥 LIMITED TIME: Get up to $125 with SoFi when you refer a friend  •  New SoFi Bank guides just dropped — personal loans, student refinancing & more  •  Grab the free Affiliate Marketing for Beginners ebook today  •  ';

export function AnnouncementBar() {
  return (
    <div
      role="region"
      aria-label="Site announcements"
      className="w-full h-10 flex items-center overflow-hidden bg-gradient-to-r from-red-700 via-red-600 to-red-700 border-b border-red-900/50 shadow-lg"
    >
      <div className="relative flex whitespace-nowrap">
        {/* First copy: readable by screen readers once */}
        <div className="animate-marquee flex shrink-0 items-center">
          <span className="mx-4 text-sm font-bold tracking-wide text-white">{MESSAGE}</span>
          <span className="mx-4 text-sm font-bold tracking-wide text-white" aria-hidden="true">{MESSAGE}</span>
        </div>
        {/* Second copy: decorative only, for the seamless loop */}
        <div className="animate-marquee flex shrink-0 items-center" aria-hidden="true">
          <span className="mx-4 text-sm font-bold tracking-wide text-white">{MESSAGE}</span>
          <span className="mx-4 text-sm font-bold tracking-wide text-white">{MESSAGE}</span>
        </div>
      </div>
    </div>
  );
}
