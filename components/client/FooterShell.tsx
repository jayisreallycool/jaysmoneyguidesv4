'use client';
import { Footer } from '@/components/vite/Footer';
export function FooterShell() {
  const noop = () => {};
  return (
    <Footer
      onSelectCategory={noop as never}
      openModal={noop as never}
      onSubscribeSuccess={noop}
    />
  );
}
