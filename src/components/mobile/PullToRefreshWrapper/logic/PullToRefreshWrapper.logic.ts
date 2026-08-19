/**
 * PullToRefreshWrapper.logic.ts — Hook Layer
 */

import { useState, useRef, useCallback, TouchEvent } from 'react';

export interface UsePullToRefreshReturn {
  isPulling: boolean;
  isRefreshing: boolean;
  pullDistance: number;
  threshold: number;
  onTouchStart: (e: TouchEvent) => void;
  onTouchMove: (e: TouchEvent) => void;
  onTouchEnd: () => void;
}

const THRESHOLD = 70;
const MAX_PULL = 110;

export function usePullToRefreshLogic(onRefresh: () => Promise<void>): UsePullToRefreshReturn {
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startYRef = useRef(0);

  const onTouchStart = useCallback((e: TouchEvent) => {
    if (window.scrollY > 0) return;
    startYRef.current = e.touches[0].clientY;
    setIsPulling(true);
  }, []);

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isPulling || isRefreshing) return;
      const delta = Math.max(0, Math.min(e.touches[0].clientY - startYRef.current, MAX_PULL));
      setPullDistance(delta);
    },
    [isPulling, isRefreshing]
  );

  const onTouchEnd = useCallback(async () => {
    if (!isPulling) return;
    setIsPulling(false);
    if (pullDistance >= THRESHOLD) {
      setIsRefreshing(true);
      setPullDistance(0);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    } else {
      setPullDistance(0);
    }
  }, [isPulling, pullDistance, onRefresh]);

  return {
    isPulling,
    isRefreshing,
    pullDistance,
    threshold: THRESHOLD,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
}
