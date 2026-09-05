import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Privacy Policy', description: 'Privacy policy.' };
export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-4">Privacy Policy</h1>
      <p className="text-slate-400">This site uses affiliate links and may display ads.</p>
    </div>
  );
}
