import type { Metadata } from 'next';
import { LegalPage } from '@/components/server/LegalPage';
export const metadata: Metadata = { title: 'Terms of Service', description: 'The terms governing use of JaysMoneyGuides.', alternates: { canonical: 'https://www.jaysmoneyguides.com/terms' } };
export default function Page() {
  return (
    <LegalPage title="Terms of Service" updated="September 2026">
      <p>By accessing or using JaysMoneyGuides, you agree to these Terms of Service. If you do not agree, please do not use the site.</p>
      <h2>Use of content</h2>
      <p>Our articles and ebooks are for informational and educational purposes only. They do not constitute financial, legal, or professional advice. You are responsible for your own decisions.</p>
      <h2>Purchases &amp; downloads</h2>
      <ul>
        <li>Ebook purchases are processed securely via Stripe.</li>
        <li>Digital products are delivered as downloads/links to the email provided at checkout.</li>
        <li>Because products are digital and delivered immediately, all sales are generally final. Contact us if you experience a delivery problem.</li>
      </ul>
      <h2>Intellectual property</h2>
      <p>All content is owned by JaysMoneyGuides unless otherwise noted. You may not reproduce, resell, or redistribute our ebooks or articles without permission.</p>
      <h2>Affiliate links</h2>
      <p>Some links are affiliate or referral links. See our <a href="/disclaimer">Disclaimer &amp; FTC disclosure</a>.</p>
      <h2>Limitation of liability</h2>
      <p>The site is provided "as is." We are not liable for any losses arising from your use of the site or reliance on its content.</p>
      <h2>Contact</h2>
      <p>Questions? Email <a href="mailto:jayisreallycool@gmail.com">jayisreallycool@gmail.com</a>.</p>
    </LegalPage>
  );
}
