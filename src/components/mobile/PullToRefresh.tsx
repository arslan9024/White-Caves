/**
 * PullToRefresh — Wave 23
 *
 * Pull-to-refresh wrapper for mobile lists (leads, viewings).
 * Triggers a NetworkFirst re-fetch when the user pulls down.
 * Only active on touch devices at ≤ 768px viewport.
 *
 * Usage:
 *   <PullToRefresh onRefresh={async () => fetchLeads()}>
 *     <LeadsList />
 *   </PullToRefresh>
 *
 * @agent @Una
 */

import React, { useRef, useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  /** Async function called when the user pulls down. Resolves when data is refreshed. */
  onRefresh: () => Promise<void>;
  /** Pull distance (px) needed to trigger refresh */
  threshold?: number;
  /** Content to render inside the scrollable area */
  children: React.ReactNode;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  threshold = 80,
  children,
}) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // isPullingState mirrors isPulling.current for render-time transitions (ref reads during render are disallowed)
  const [isPullingState, setIsPullingState] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const isPulling = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isRefreshing) return;

    const container = containerRef.current;
    if (!container || container.scrollTop > 0) return;

    startY.current = e.touches[0].clientY;
    isPulling.current = true;
    setIsPullingState(true);
  }, [isRefreshing]);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isPulling.current || isRefreshing) return;

      const container = containerRef.current;
      if (!container || container.scrollTop > 0) {
        isPulling.current = false;
        setIsPullingState(false);
        setPullDistance(0);
        return;
      }

      const deltaY = e.touches[0].clientY - startY.current;

      if (deltaY > 0) {
        // Apply resistance — diminishing pull beyond threshold
        const distance = Math.min(deltaY * 0.5, threshold * 1.5);
        setPullDistance(distance);
      }
    },
    [isRefreshing, threshold]
  );

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling.current || isRefreshing) return;
    isPulling.current = false;
    setIsPullingState(false);

    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      setPullDistance(threshold * 0.6); // Snap to spinner position

      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, threshold, onRefresh, isRefreshing]);

  const progress = Math.min(pullDistance / threshold, 1);
  const showIndicator = pullDistance > 10 || isRefreshing;

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        position: 'relative',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* Pull indicator */}
      {showIndicator && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: pullDistance,
            overflow: 'hidden',
            transition: isPullingState ? 'none' : 'height 0.3s ease',
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: progress,
              transform: `rotate(${progress * 360}deg)`,
              transition: isPullingState ? 'none' : 'transform 0.3s ease',
            }}
          >
            <RefreshCw
              size={20}
              color="#C9A84C"
              style={{
                animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
              }}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div
        style={{
          transform: `translateY(${showIndicator && !isRefreshing ? 0 : 0}px)`,
        }}
      >
        {children}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PullToRefresh;
