import React, { lazy, Suspense } from 'react';

/**
 * LazyFullScreenDetailModal
 * Lazy-loaded wrapper for FullScreenDetailModal
 * Reduces main bundle size by deferring modal loading
 */
const LazyFullScreenDetailModalComponent = lazy(() =>
  import('./FullScreenDetailModal')
);

/**
 * Modal Loading Fallback
 * Displayed while modal component is loading
 */
function ModalLoadingFallback() {
  return (
    <div className="modal-loading-fallback">
      <div className="modal-spinner">
        <div className="spinner-circle"></div>
      </div>
    </div>
  );
}

/**
 * Wrapper Component
 * Provides Suspense boundary for lazy-loaded modal
 */
export default function LazyFullScreenDetailModal(props: React.ComponentProps<typeof LazyFullScreenDetailModalComponent>) {
  return (
    <Suspense fallback={<ModalLoadingFallback />}>
      <LazyFullScreenDetailModalComponent {...props} />
    </Suspense>
  );
}
