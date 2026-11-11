import { useState, useCallback, useRef, useEffect } from 'react';

export interface UseRecordHighlightReturn {
  highlightedId: string | null;
  triggerHighlight: (id: string, scrollIntoView?: boolean) => void;
  clearHighlight: () => void;
}

/**
 * useRecordHighlight
 * Provides temporary visual feedback (pulsing outline / luxury glow) on a newly saved or updated record,
 * and automatically scrolls the target element into the user's viewport.
 */
export function useRecordHighlight(durationMs: number = 3500): UseRecordHighlightReturn {
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up all timers when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  const triggerHighlight = useCallback(
    (id: string, scrollIntoView: boolean = true) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }

      setHighlightedId(id);

      if (scrollIntoView && typeof window !== 'undefined' && typeof window.document !== 'undefined') {
        scrollTimerRef.current = setTimeout(() => {
          if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
            const el =
              window.document.getElementById(`record-${id}`) ||
              window.document.querySelector(`[data-record-id="${id}"]`);
            if (el && typeof el.scrollIntoView === 'function') {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        }, 50);
      }

      timerRef.current = setTimeout(() => {
        setHighlightedId(null);
        timerRef.current = null;
      }, durationMs);
    },
    [durationMs]
  );

  const clearHighlight = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = null;
    }
    setHighlightedId(null);
  }, []);

  return {
    highlightedId,
    triggerHighlight,
    clearHighlight,
  };
}
