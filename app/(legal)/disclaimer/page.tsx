import type { Metadata } from 'next';
import { LegalPage } from '@/components/server/LegalPage';
export const metadata: Metadata = { title: 'Disclaimer & FTC Disclosure', description: 'Affiliate and FTC disclosure for JaysMoneyGuides.', alternates: { canonical: 'https://www.jaysmoneyguides.com/disclaimer' } };
export default function Page() {
  return (
    <LegalPage title="Disclaimer & FTC Disclosure" updated="September 2026">
      <h2>Affiliate disclosure</h2>
      <p>JaysMoneyGuides contains affiliate and referral links, including links to SoFi products. If you click one and open an eligible product or make a purchase, we may earn a commission or referral bonus at no additional cost to you — and in some cases you may receive a welcome bonus too. We only share products we believe are worth considering.</p>
      <h2>Not financial advice</h2>
      <p>All content is for general informational and educational purposes only and is not financial, investment, tax, or legal advice. We are not financial advisors. Always do your own research and consult a qualified professional before making financial decisions.</p>
      <h2>No guarantees</h2>
      <p>Results vary. Nothing on this site guarantees income, savings, approval for any product, or any specific outcome. Rates, fees, and terms for third-party products (such as loans) are set by those providers and change over time — always confirm current details on the provider's official pages before applying.</p>
      <h2>Accuracy</h2>
      <p>We strive for accuracy but make no warranty that content is complete or current. Use the information at your own risk.</p>
      <h2>Contact</h2>
      <p>Questions? Email <a href="mailto:jayisreallycool@gmail.com">jayisreallycool@gmail.com</a>.</p>
    </LegalPage>
  );
}
