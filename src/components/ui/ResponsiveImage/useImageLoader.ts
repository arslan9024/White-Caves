import { useCallback, useEffect, useRef, useState } from 'react';

interface UseImageLoaderOptions {
  /** Whether to lazy load via IntersectionObserver */
  lazy: boolean;
  /** IntersectionObserver root margin */
  rootMargin: string;
  /** Fallback src on error */
  fallbackSrc?: string;
  /** Load callback */
  onLoad?: () => void;
  /** Error callback */
  onError?: (error: Event) => void;
}

interface UseImageLoaderReturn {
  /** Whether the image has loaded */
  loaded: boolean;
  /** Whether the image errored */
  errored: boolean;
  /** Whether the image should start loading (in viewport or priority) */
  shouldLoad: boolean;
  /** Ref to attach to the container element for IntersectionObserver */
  containerRef: React.RefObject<HTMLDivElement>;
  /** Handler for img onLoad */
  handleLoad: () => void;
  /** Handler for img onError */
  handleError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

/**
 * Custom hook for managing image loading state with lazy loading support.
 * Uses IntersectionObserver for viewport-based lazy loading.
 */
export function useImageLoader({
  lazy,
  rootMargin,
  fallbackSrc,
  onLoad,
  onError,
}: UseImageLoaderOptions): UseImageLoaderReturn {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(!lazy);
  const containerRef = useRef<HTMLDivElement>(null!) as React.RefObject<HTMLDivElement>;
  const isMounted = useRef(true);

  // Track mount state to avoid state updates on unmounted component
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // IntersectionObserver for lazy loading
  useEffect(() => {
    if (!lazy || shouldLoad) return;

    const node = containerRef.current;
    if (!node) return;

    // Fallback for browsers without IntersectionObserver
    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (isMounted.current) {
            setShouldLoad(true);
          }
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [lazy, shouldLoad, rootMargin]);

  const handleLoad = useCallback(() => {
    if (isMounted.current) {
      setLoaded(true);
      onLoad?.();
    }
  }, [onLoad]);

  const handleError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      if (!isMounted.current) return;

      // Try fallback src before giving up
      const target = e.target as HTMLImageElement;
      if (fallbackSrc && target.src !== fallbackSrc) {
        target.src = fallbackSrc;
        return;
      }

      setErrored(true);
      onError?.(e.nativeEvent);
    },
    [fallbackSrc, onError]
  );

  return {
    loaded,
    errored,
    shouldLoad,
    containerRef,
    handleLoad,
    handleError,
  };
}
