'use client';
import { ErrorState } from '@/components/ui/ErrorState';
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return <ErrorState reset={reset} />;
}
