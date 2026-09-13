'use client';
import { AnnouncementBar } from '@/components/client/AnnouncementBar';
import { NavShell } from '@/components/client/NavShell';

/**
 * Fixed header = announcement bar + navbar as one unit, pinned to the top.
 * overflow-visible so the navbar's dropdowns/mobile menu are never clipped.
 */
export function FixedHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-[70] overflow-visible">
      <AnnouncementBar />
      <NavShell />
    </header>
  );
}
