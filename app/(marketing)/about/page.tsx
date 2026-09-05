import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'About', description: 'About JaysMoneyGuides.' };
export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-4">About JaysMoneyGuides</h1>
      <p className="text-slate-400">Practical, honest guides to building income online.</p>
    </div>
  );
}
