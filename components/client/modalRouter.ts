'use client';
/**
 * Maps the Vite app's openModal(view) calls to real Next.js page routes for
 * content pages. Interactive modals (auth, profile, admin) are left as-is
 * (handled elsewhere / stubbed). Returns a route string or null.
 */
export const MODAL_TO_ROUTE: Record<string, string> = {
  about: '/about',
  privacy: '/privacy',
  terms: '/terms',
  disclaimer: '/disclaimer',
  'cookie-policy': '/cookie-policy',
  contact: '/contact',
  ebooks: '/#ebooks',
  store: '/#ebooks',
};

export function routeForModal(view: string): string | null {
  return MODAL_TO_ROUTE[view] ?? null;
}
