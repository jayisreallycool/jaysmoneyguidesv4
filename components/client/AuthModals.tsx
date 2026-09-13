'use client';
import { createContext, useContext, useState, useCallback } from 'react';
import { AuthDialog } from '@/components/client/AuthDialog';
import { DeleteAccountDialog } from '@/components/client/DeleteAccountDialog';

type ModalKind = 'auth' | 'delete-account' | null;

const ModalCtx = createContext<{ open: (k: ModalKind) => void }>({ open: () => {} });

/** Provides a global way to open the auth / delete-account dialogs, and renders
 *  them. Wrap the app once (inside AuthProvider). */
export function AuthModals({ children }: { children: React.ReactNode }) {
  const [kind, setKind] = useState<ModalKind>(null);
  const open = useCallback((k: ModalKind) => setKind(k), []);
  const close = useCallback(() => setKind(null), []);

  return (
    <ModalCtx.Provider value={{ open }}>
      {children}
      {kind === 'auth' && <AuthDialog onClose={close} onSuccess={close} />}
      {kind === 'delete-account' && <DeleteAccountDialog onClose={close} onDeleted={close} />}
    </ModalCtx.Provider>
  );
}

export const useAuthModals = () => useContext(ModalCtx);
