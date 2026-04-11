/**
 * useIntersectionObserver — Trigger callbacks when elements enter the viewport
 *
 * Powers lazy loading, infinite scroll, and analytics tracking.
 * Returns a ref to attach to the observed element and a boolean `isIntersecting`.
 *
 * Usage:
 *   const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });
 *
 *   return (
 *     <div ref={ref}>
 *       {isIntersecting && <ExpensiveComponent />}
 *     </div>
 *   );
 *
 * @module hooks/useIntersectionObserver
 */

import { useEffect, useRef, useState, useCallback } from 'react';

export interface UseIntersectionObserverOptions {
  /** Intersection threshold(s) (default: 0) */
  threshold?: number | number[];
  /** Root element (default: viewport) */
  root?: Element | null;
  /** Root margin (default: '0px') */
  rootMargin?: string;
  /** Stop observing after first intersection (default: true) */
  triggerOnce?: boolean;
  /** Whether the observer is enabled (default: true) */
  enabled?: boolean;
}

export interface UseIntersectionObserverReturn<T extends Element> {
  /** Ref to attach to the observed element */
  ref: React.RefCallback<T>;
  /** Whether the element is currently intersecting the viewport */
  isIntersecting: boolean;
  /** The full IntersectionObserverEntry (null until first observation) */
  entry: IntersectionObserverEntry | null;
}

export function useIntersectionObserver<T extends Element = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {},
): UseIntersectionObserverReturn<T> {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    triggerOnce = true,
    enabled = true,
  } = options;

  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<T | null>(null);
  const frozenRef = useRef(false);

  // Cleanup observer
  const disconnect = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  // Ref callback — called when the DOM element changes
  const ref = useCallback(
    (node: T | null) => {
      // Disconnect previous observer
      disconnect();
      elementRef.current = node;

      if (!node || !enabled || frozenRef.current) return;

      // Guard for SSR / test environments  
      if (typeof IntersectionObserver === 'undefined') {
        setIsIntersecting(true);
        return;
      }

      observerRef.current = new IntersectionObserver(
        ([observerEntry]) => {
          setEntry(observerEntry);
          setIsIntersecting(observerEntry.isIntersecting);

          if (observerEntry.isIntersecting && triggerOnce) {
            frozenRef.current = true;
            disconnect();
          }
        },
        { threshold, root, rootMargin },
      );

      observerRef.current.observe(node);
    },
    [disconnect, enabled, root, rootMargin, threshold, triggerOnce],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => disconnect();
  }, [disconnect]);

  return { ref, isIntersecting, entry };
}

export default useIntersectionObserver;
