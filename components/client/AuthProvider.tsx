'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { watchAuth, signOutUser } from '@/lib/firebase-client';
import type { User } from '@/lib/types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  refresh: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null, loading: true, refresh: () => {}, logout: async () => {},
});

const ADMIN_EMAILS = ['jayisreallycool@gmail.com', 'buddhacmd02@gmail.com'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = watchAuth((fbUser) => {
      if (fbUser) {
        setUser({
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Member',
          email: fbUser.email || '',
          avatar: fbUser.photoURL || undefined,
          provider: fbUser.providerData[0]?.providerId?.includes('google') ? 'google' : 'email',
          createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
          role: ADMIN_EMAILS.includes((fbUser.email || '').toLowerCase()) ? 'admin' : 'user',
        } as User);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const refresh = useCallback(() => { /* onAuthStateChanged handles it */ }, []);
  const logout = useCallback(async () => { await signOutUser(); }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
