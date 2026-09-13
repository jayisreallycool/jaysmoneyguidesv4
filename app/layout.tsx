import type { Metadata } from 'next';
import './globals.css';
import { SITE, SITE_NAME } from '@/lib/seo';
import { FixedHeader } from '@/components/client/FixedHeader';
import { MenuWidgetShell } from '@/components/client/MenuWidgetShell';
import { FooterShell } from '@/components/client/FooterShell';
import { AuthProvider } from '@/components/client/AuthProvider';
import { AuthModals } from '@/components/client/AuthModals';
import { JsonLd } from '@/components/server/JsonLd';
import { organizationSchema, websiteSchema } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: `${SITE_NAME} — Practical Guides to Making Money Online`, template: `%s | ${SITE_NAME}` },
  description: 'Actionable guides on affiliate marketing, SEO, blogging, e-commerce, and smart money moves.',
  alternates: { canonical: '/' },
  openGraph: { type: 'website', siteName: SITE_NAME, url: SITE },
  robots: { index: true, follow: true },
};

export const viewport = { width: 'device-width', initialScale: 1, maximumScale: 5, themeColor: '#0b1220' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
        <AuthModals>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <FixedHeader />
        {/* Spacer clears the fixed header (announcement ~40px + nav ~64px) */}
        <main id="main-content" className="min-h-[70vh] pt-[104px]">{children}</main>
        <FooterShell />
        <MenuWidgetShell />
        </AuthModals>
        </AuthProvider>
      </body>
    </html>
  );
}
