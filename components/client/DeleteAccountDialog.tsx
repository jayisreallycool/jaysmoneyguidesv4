'use client';
import { useState } from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';
import { deleteAccount } from '@/lib/firebase-client';

/** Working delete-account dialog with confirmation + Firebase re-auth. */
export function DeleteAccountDialog({ onClose, onDeleted }: { onClose: () => void; onDeleted: () => void }) {
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const doDelete = async () => {
    setError(null); setLoading(true);
    const r = await deleteAccount();
    setLoading(false);
    if (r.ok) { onDeleted(); onClose(); }
    else setError(r.error || 'Could not delete account.');
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border border-red-500/40 bg-slate-900 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-400" />
            <h2 className="text-xl font-extrabold text-white">Delete account</h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800"><X className="h-5 w-5" /></button>
        </div>
        <p className="text-slate-300 text-sm">
          This permanently deletes your account and cannot be undone. Your purchases and download
          history may be affected. To confirm, type <strong className="text-white">DELETE</strong> below.
        </p>
        <input value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Type DELETE"
          className="mt-4 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-white placeholder-slate-500 focus:border-red-500 focus:outline-none" />
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        <div className="mt-5 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-slate-700 bg-slate-800 py-2.5 font-bold text-slate-200 hover:bg-slate-700 transition">Cancel</button>
          <button onClick={doDelete} disabled={confirm !== 'DELETE' || loading}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 font-bold text-white hover:bg-red-500 transition disabled:opacity-40 disabled:cursor-not-allowed">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Delete forever
          </button>
        </div>
      </div>
    </div>
  );
}
