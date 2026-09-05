import type { Metadata } from 'next';
import './globals.css';
import { SITE, SITE_NAME } from '@/lib/seo';
import { AnnouncementBar } from '@/components/client/AnnouncementBar';
import { NavShell } from '@/components/client/NavShell';
import { FooterShell } from '@/components/client/FooterShell';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: `${SITE_NAME} — Practical Guides to Making Money Online`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Actionable guides on affiliate marketing, SEO, blogging, e-commerce, and smart money moves.',
  alternates: { canonical: '/' },
  openGraph: { type: 'website', siteName: SITE_NAME, url: SITE },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AnnouncementBar />
        <NavShell />
        <main className="min-h-[70vh]">{children}</main>
        <FooterShell />
      </body>
    </html>
  );
}
