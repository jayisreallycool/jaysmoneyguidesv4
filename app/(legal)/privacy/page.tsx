import type { Metadata } from 'next';
import { LegalPage } from '@/components/server/LegalPage';
export const metadata: Metadata = { title: 'Privacy Policy', description: 'How JaysMoneyGuides collects, uses, and protects your information.', alternates: { canonical: 'https://www.jaysmoneyguides.com/privacy' } };
export default function Page() {
  return (
    <LegalPage title="Privacy Policy" updated="September 2026">
      <p>This Privacy Policy explains how JaysMoneyGuides ("we", "us") collects, uses, and protects information when you use our website.</p>
      <h2>Information we collect</h2>
      <ul>
        <li><strong>Information you provide:</strong> your email address when you subscribe, contact us, or purchase an ebook.</li>
        <li><strong>Automatically collected:</strong> standard analytics data such as pages visited, device and browser type, and referring site.</li>
        <li><strong>Cookies:</strong> we use cookies for analytics and, where enabled, advertising. See our <a href="/cookie-policy">Cookie &amp; AdChoices policy</a>.</li>
      </ul>
      <h2>How we use it</h2>
      <ul>
        <li>To deliver purchases and send download links.</li>
        <li>To send updates you opt into, and respond to inquiries.</li>
        <li>To understand and improve site performance.</li>
      </ul>
      <h2>Advertising &amp; third parties</h2>
      <p>We may display ads through Google AdSense and similar networks. These partners may use cookies to serve ads based on your prior visits. You can opt out of personalized advertising via <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>. Payments are processed by Stripe; we do not store your card details.</p>
      <h2>Your rights</h2>
      <p>You may request access to, correction of, or deletion of your personal data by emailing us via our <a href="/contact">contact page</a>.</p>
      <h2>Contact</h2>
      <p>Questions about this policy? Reach us at <a href="mailto:jayisreallycool@gmail.com">jayisreallycool@gmail.com</a>.</p>
    </LegalPage>
  );
}
