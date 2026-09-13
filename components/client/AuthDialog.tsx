'use client';
import { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import { signInWithGoogle, signInWithEmail, registerWithEmail, sendReset } from '@/lib/firebase-client';

type Mode = 'login' | 'register' | 'forgot';

/** Working auth dialog backed by real Firebase Auth (Google + email/password). */
export function AuthDialog({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const google = async () => {
    setError(null); setLoading(true);
    const r = await signInWithGoogle();
    setLoading(false);
    if (r.ok) { onSuccess(); onClose(); } else setError(r.error);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setNotice(null); setLoading(true);
    if (mode === 'forgot') {
      const r = await sendReset(email);
      setLoading(false);
      if (r.ok) setNotice('Password reset email sent. Check your inbox.');
      else setError(r.error || 'Could not send reset email.');
      return;
    }
    const r = mode === 'login'
      ? await signInWithEmail(email, password)
      : await registerWithEmail(name, email, password);
    setLoading(false);
    if (r.ok) { onSuccess(); onClose(); } else setError(r.error);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-extrabold text-white">
            {mode === 'login' ? 'Welcome back' : mode === 'register' ? 'Create your account' : 'Reset password'}
          </h2>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800"><X className="h-5 w-5" /></button>
        </div>

        {mode !== 'forgot' && (
          <>
            <button onClick={google} disabled={loading}
              className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-700 bg-white px-4 py-2.5 font-bold text-slate-800 hover:bg-slate-100 transition disabled:opacity-60">
              <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>
            <div className="my-4 flex items-center gap-3 text-xs text-slate-500">
              <span className="h-px flex-1 bg-slate-800" /> or <span className="h-px flex-1 bg-slate-800" />
            </div>
          </>
        )}

        <form onSubmit={submit} className="space-y-3">
          {mode === 'register' && (
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 pl-10 pr-3 py-2.5 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none" />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required
              className="w-full rounded-xl border border-slate-700 bg-slate-800 pl-10 pr-3 py-2.5 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none" />
          </div>
          {mode !== 'forgot' && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required minLength={6}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 pl-10 pr-3 py-2.5 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none" />
            </div>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}
          {notice && <p className="text-sm text-emerald-400">{notice}</p>}

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 font-bold text-slate-950 hover:bg-emerald-400 transition disabled:opacity-60">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === 'login' ? 'Sign in' : mode === 'register' ? 'Create account' : 'Send reset email'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-slate-400 space-y-1">
          {mode === 'login' && <>
            <button onClick={() => { setMode('forgot'); setError(null); }} className="hover:text-emerald-400">Forgot password?</button>
            <p>New here? <button onClick={() => { setMode('register'); setError(null); }} className="font-semibold text-emerald-400 hover:underline">Create an account</button></p>
          </>}
          {mode === 'register' && <p>Already have an account? <button onClick={() => { setMode('login'); setError(null); }} className="font-semibold text-emerald-400 hover:underline">Sign in</button></p>}
          {mode === 'forgot' && <button onClick={() => { setMode('login'); setError(null); }} className="hover:text-emerald-400">Back to sign in</button>}
        </div>
      </div>
    </div>
  );
}
