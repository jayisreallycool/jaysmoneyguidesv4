'use client';
import { useRef, useCallback } from 'react';

/**
 * Drag-to-scroll for a horizontal container, working with mouse (desktop) and
 * native touch (tablet/mobile — the browser handles touch scroll on an
 * overflow-x-auto element automatically). Returns a ref + handlers to spread
 * onto the scroll container.
 */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const state = useRef({ down: false, startX: 0, scrollLeft: 0, moved: false });

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    // Only left mouse button / touch / pen
    state.current.down = true;
    state.current.moved = false;
    state.current.startX = e.clientX;
    state.current.scrollLeft = el.scrollLeft;
    el.setPointerCapture?.(e.pointerId);
    el.style.cursor = 'grabbing';
    el.style.userSelect = 'none';
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || !state.current.down) return;
    const dx = e.clientX - state.current.startX;
    if (Math.abs(dx) > 4) state.current.moved = true;
    el.scrollLeft = state.current.scrollLeft - dx;
  }, []);

  const endDrag = useCallback((e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    state.current.down = false;
    el.releasePointerCapture?.(e.pointerId);
    el.style.cursor = '';
    el.style.userSelect = '';
  }, []);

  /** Call in a tab's onClick to suppress the click that ends a drag. */
  const didDrag = useCallback(() => state.current.moved, []);

  return {
    ref,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerLeave: endDrag,
      onPointerCancel: endDrag,
    },
    didDrag,
  };
}
