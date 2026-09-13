import type { Metadata } from 'next';
import { LegalPage } from '@/components/server/LegalPage';
export const metadata: Metadata = { title: 'About', description: 'About JaysMoneyGuides — practical, honest guides to building income online.', alternates: { canonical: 'https://www.jaysmoneyguides.com/about' } };
export default function Page() {
  return (
    <LegalPage title="About JaysMoneyGuides">
      <p>JaysMoneyGuides is a personal finance and digital-business publication focused on one thing: practical, honest guidance you can actually use. We cover affiliate marketing, SEO, blogging, e-commerce, and smart money moves — written to be applied, not just read.</p>
      <h2>What we do</h2>
      <p>We publish in-depth guides and downloadable ebooks that break down how to build online income step by step. Our goal is to cut through hype and give you frameworks that work in the real world.</p>
      <h2>Our approach</h2>
      <p>We write from experience, cite sources where it matters, and are transparent about how we make money. Some links on this site are affiliate or referral links — see our <a href="/disclaimer">Disclaimer &amp; FTC disclosure</a> for details. We only recommend products we believe are worth your attention.</p>
      <h2>Get in touch</h2>
      <p>Questions, feedback, or partnership ideas? Reach us on our <a href="/contact">contact page</a>.</p>
    </LegalPage>
  );
}
