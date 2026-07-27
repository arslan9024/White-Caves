/**
 * useSwipeGesture — Wave 23 Reusable Touch Gesture Hook
 *
 * Detects left/right swipe gestures with configurable thresholds.
 * Supports velocity detection for natural-feeling swipes.
 *
 * Usage:
 *   const { handlers, swipeProgress, direction } = useSwipeGesture({
 *     onSwipeLeft: () => snooze(),
 *     onSwipeRight: () => call(),
 *     threshold: 80,
 *   });
 *   <div {...handlers}>...</div>
 */

import { useRef, useCallback, useState } from 'react';

export type SwipeDirection = 'left' | 'right' | null;

export interface UseSwipeGestureOptions {
  /** Minimum distance (px) for a successful swipe */
  threshold?: number;
  /** Minimum velocity (px/ms) — swipes faster than this always trigger */
  velocityThreshold?: number;
  /** Called when swipe-left completes */
  onSwipeLeft?: () => void;
  /** Called when swipe-right completes */
  onSwipeRight?: () => void;
  /** Called during swipe with progress (0-1) */
  onProgress?: (progress: number, direction: SwipeDirection) => void;
  /** Prevent vertical scroll while swiping */
  lockAxis?: boolean;
}

export interface UseSwipeGestureReturn {
  /** Attach to the target element as spread props */
  handlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
  };
  /** Current swipe progress (0-1, negative for left) */
  swipeProgress: number;
  /** Current swipe direction */
  direction: SwipeDirection;
  /** Whether a swipe is in progress */
  isSwiping: boolean;
}

export function useSwipeGesture(options: UseSwipeGestureOptions = {}): UseSwipeGestureReturn {
  const {
    threshold = 80,
    velocityThreshold = 0.5,
    onSwipeLeft,
    onSwipeRight,
    onProgress,
    lockAxis = true,
  } = options;

  const [swipeProgress, setSwipeProgress] = useState(0);
  const [direction, setDirection] = useState<SwipeDirection>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  const startX = useRef(0);
  const startY = useRef(0);
  const startTime = useRef(0);
  const isTracking = useRef(false);
  const isHorizontal = useRef<boolean | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    startX.current = touch.clientX;
    startY.current = touch.clientY;
    startTime.current = Date.now();
    isTracking.current = true;
    isHorizontal.current = null;
    setIsSwiping(false);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isTracking.current) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - startX.current;
      const deltaY = touch.clientY - startY.current;

      // Determine axis lock on first significant movement
      if (isHorizontal.current === null) {
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        if (absDeltaX < 5 && absDeltaY < 5) return; // Too small to determine

        isHorizontal.current = absDeltaX > absDeltaY;

        if (!isHorizontal.current) {
          // Vertical scroll — stop tracking
          isTracking.current = false;
          return;
        }
      }

      if (!isHorizontal.current) return;

      // Prevent vertical scroll during horizontal swipe
      if (lockAxis) {
        e.preventDefault();
      }

      setIsSwiping(true);

      const progress = Math.min(Math.abs(deltaX) / threshold, 1);
      const dir: SwipeDirection = deltaX > 0 ? 'right' : 'left';

      setSwipeProgress(deltaX > 0 ? progress : -progress);
      setDirection(dir);
      onProgress?.(progress, dir);
    },
    [threshold, lockAxis, onProgress]
  );

  const handleTouchEnd = useCallback(() => {
    if (!isTracking.current || !isHorizontal.current) {
      isTracking.current = false;
      return;
    }

    const elapsed = Date.now() - startTime.current;
    const velocity = Math.abs(swipeProgress * threshold) / elapsed;
    const completedSwipe =
      Math.abs(swipeProgress) >= 1 || velocity >= velocityThreshold;

    if (completedSwipe) {
      if (direction === 'right') {
        onSwipeRight?.();
      } else if (direction === 'left') {
        onSwipeLeft?.();
      }
    }

    // Reset
    isTracking.current = false;
    isHorizontal.current = null;
    setSwipeProgress(0);
    setDirection(null);
    setIsSwiping(false);
  }, [swipeProgress, direction, threshold, velocityThreshold, onSwipeLeft, onSwipeRight]);

  return {
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    swipeProgress,
    direction,
    isSwiping,
  };
}
