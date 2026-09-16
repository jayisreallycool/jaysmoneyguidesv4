'use client';
import { useState } from 'react';

export function CheckoutButton({
  productId, isFree, className,
}: { productId: string; isFree: boolean; className?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);
    
    // Free book: hit the download route directly, no email needed.
    if (isFree) {
      window.open(`/api/download-ebook?productId=${encodeURIComponent(productId)}&redirect=1`, '_blank');
      return;
    }
    
    // Paid book: Go straight to Stripe checkout without email prompt.
    // Stripe will collect email at checkout instead (better UX).
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, origin: window.location.origin }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError(data.error || 'Checkout failed.');
    } catch {
      setError('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={handleClick} disabled={loading} className={className}>
        {loading ? 'Redirecting…' : isFree ? 'Download free' : 'Buy now'}
      </button>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}
