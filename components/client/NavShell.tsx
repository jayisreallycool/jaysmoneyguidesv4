'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Navbar } from '@/components/vite/Navbar';

/**
 * Wraps the real Vite Navbar and adapts its SPA callback props to Next.js
 * navigation. Category selection navigates to /category/<name>; search routes
 * to the homepage (extend with a /search route later). Auth/modal actions are
 * stubbed to no-ops for now (wire to real modals when those are fully ported).
 */
export function NavShell() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<'All' | string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const noop = () => {};

  return (
    <Navbar
      selectedCategory={selectedCategory as never}
      onSelectCategory={(c) => {
        setSelectedCategory(c as string);
        if (c === 'All') router.push('/');
        else router.push(`/category/${encodeURIComponent(c as string)}`);
      }}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      openModal={noop as never}
      bookmarkedCount={0}
      onToggleBookmarksOnly={noop}
      showBookmarksOnly={false}
      currentUser={null}
      onLogout={noop}
    />
  );
}
