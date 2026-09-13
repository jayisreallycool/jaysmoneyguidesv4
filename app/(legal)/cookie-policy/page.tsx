import type { Metadata } from 'next';
import { LegalPage } from '@/components/server/LegalPage';
export const metadata: Metadata = { title: 'Cookie Policy & AdChoices', description: 'How JaysMoneyGuides uses cookies and advertising.', alternates: { canonical: 'https://www.jaysmoneyguides.com/cookie-policy' } };
export default function Page() {
  return (
    <LegalPage title="Cookie Policy & AdChoices" updated="September 2026">
      <p>This page explains how JaysMoneyGuides uses cookies and similar technologies.</p>
      <h2>What are cookies?</h2>
      <p>Cookies are small text files stored on your device that help websites remember your preferences and understand how the site is used.</p>
      <h2>How we use cookies</h2>
      <ul>
        <li><strong>Essential:</strong> to make the site work (e.g. remembering your session).</li>
        <li><strong>Analytics:</strong> to understand traffic and improve content.</li>
        <li><strong>Advertising:</strong> where enabled, partners like Google AdSense may set cookies to show relevant ads.</li>
      </ul>
      <h2>AdChoices &amp; opting out</h2>
      <p>Third-party vendors, including Google, use cookies to serve ads based on prior visits to this and other sites. You can opt out of personalized advertising through <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a> or <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer">aboutads.info</a>.</p>
      <h2>Managing cookies</h2>
      <p>You can control or delete cookies through your browser settings. Disabling some cookies may affect site functionality.</p>
      <h2>Contact</h2>
      <p>Questions? Email <a href="mailto:jayisreallycool@gmail.com">jayisreallycool@gmail.com</a>.</p>
    </LegalPage>
  );
}
