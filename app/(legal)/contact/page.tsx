import type { Metadata } from 'next';
import { LegalPage } from '@/components/server/LegalPage';
export const metadata: Metadata = { title: 'Contact', description: 'Contact JaysMoneyGuides.', alternates: { canonical: 'https://www.jaysmoneyguides.com/contact' } };
export default function Page() {
  return (
    <LegalPage title="Contact Us">
      <p>We'd love to hear from you. For questions, feedback, corrections, or partnership inquiries, email us and we'll get back to you as soon as we can.</p>
      <h2>Email</h2>
      <p><a href="mailto:jayisreallycool@gmail.com">jayisreallycool@gmail.com</a></p>
      <h2>Response time</h2>
      <p>We typically respond within 2–3 business days. For questions about a specific ebook purchase, please include the email address you used at checkout.</p>
    </LegalPage>
  );
}
