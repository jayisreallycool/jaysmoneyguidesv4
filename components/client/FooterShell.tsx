'use client';
import { useRouter } from 'next/navigation';
import { Footer } from '@/components/ui/Footer';
import { routeForModal } from '@/components/client/modalRouter';
import type { Category, ModalView } from '@/lib/types';

export function FooterShell() {
  const router = useRouter();

  const openModal = (view: ModalView) => {
    const route = routeForModal(view);
    if (route) router.push(route);
  };

  const selectCategory = (c: Category | 'All') =>
    router.push(c === 'All' ? '/' : `/category/${encodeURIComponent(c)}`);

  return (
    <Footer
      onSelectCategory={selectCategory}
      openModal={openModal}
      onSubscribeSuccess={() => {}}
    />
  );
}
