'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { routeForModal } from '@/components/client/modalRouter';
import { useAuth } from '@/components/client/AuthProvider';
import { useAuthModals } from '@/components/client/AuthModals';
import type { Category, ModalView } from '@/lib/types';

export function NavShell() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { open } = useAuthModals();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const openModal = (view: ModalView) => {
    if (view === 'auth') return open('auth');
    if (view === 'delete-account') return open('delete-account');
    const route = routeForModal(view);
    if (route) router.push(route);
  };

  const selectCategory = (c: Category | 'All') => {
    setSelectedCategory(c);
    router.push(c === 'All' ? '/' : `/category/${encodeURIComponent(c)}`);
  };

  return (
    <Navbar
      selectedCategory={selectedCategory}
      onSelectCategory={selectCategory}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      openModal={openModal}
      bookmarkedCount={0}
      onToggleBookmarksOnly={() => {}}
      showBookmarksOnly={false}
      currentUser={user}
      onLogout={logout}
    />
  );
}
