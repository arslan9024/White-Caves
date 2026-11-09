import { useState, useCallback, useRef } from 'react';

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

  const triggerHighlight = useCallback(
    (id: string, scrollIntoView: boolean = true) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setHighlightedId(id);

      if (scrollIntoView && typeof document !== 'undefined') {
        setTimeout(() => {
          const el = document.getElementById(`record-${id}`) || document.querySelector(`[data-record-id="${id}"]`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
    setHighlightedId(null);
  }, []);

  return {
    highlightedId,
    triggerHighlight,
    clearHighlight,
  };
}
