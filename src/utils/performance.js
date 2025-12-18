import React from 'react';

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function prefetchImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function prefetchImages(sources) {
  return Promise.allSettled(sources.map(prefetchImage));
}

export async function measurePerformance(name, fn) {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
  return result;
}

export function reportWebVitals(onPerfEntry) {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    }).catch(() => {
      console.log('Web vitals not available');
    });
  }
}

export function lazyLoadComponent(importFn, fallback = null) {
  const LazyComponent = React.lazy(importFn);
  return function LazyWrapper(props) {
    return (
      <React.Suspense fallback={fallback || <div className="loading-placeholder" />}>
        <LazyComponent {...props} />
      </React.Suspense>
    );
  };
}

export function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const [hasIntersected, setHasIntersected] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      if (entry.isIntersecting) {
        setHasIntersected(true);
        if (options.once) {
          observer.disconnect();
        }
      }
    }, {
      rootMargin: options.rootMargin || '50px',
      threshold: options.threshold || 0.1
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [options.rootMargin, options.threshold, options.once]);

  return { ref, isIntersecting, hasIntersected };
}

export function useMediaQuery(query) {
  const [matches, setMatches] = React.useState(
    () => window.matchMedia(query).matches
  );

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
