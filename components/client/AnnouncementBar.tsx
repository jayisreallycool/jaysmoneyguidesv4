'use client';

/**
 * Sticky animated scrolling red announcement bar, pinned to the very top.
 * The message scrolls right-to-left (marquee) and the bar stays fixed on scroll.
 */
const MESSAGE =
  '🔥 LIMITED TIME: Get up to $125 with SoFi when you refer a friend  •  New SoFi Bank guides just dropped — personal loans, student refinancing & more  •  Grab the free Affiliate Marketing for Beginners ebook today  •  ';

export function AnnouncementBar() {
  return (
    <div className="sticky top-0 z-[60] w-full overflow-hidden bg-gradient-to-r from-red-700 via-red-600 to-red-700 border-b border-red-900/50 shadow-lg">
      <div className="relative flex whitespace-nowrap py-2">
        {/* Two copies for a seamless infinite loop */}
        <div className="animate-marquee flex shrink-0 items-center">
          <span className="mx-4 text-sm font-bold tracking-wide text-white">{MESSAGE}</span>
          <span className="mx-4 text-sm font-bold tracking-wide text-white">{MESSAGE}</span>
        </div>
        <div className="animate-marquee flex shrink-0 items-center" aria-hidden="true">
          <span className="mx-4 text-sm font-bold tracking-wide text-white">{MESSAGE}</span>
          <span className="mx-4 text-sm font-bold tracking-wide text-white">{MESSAGE}</span>
        </div>
      </div>
    </div>
  );
}
