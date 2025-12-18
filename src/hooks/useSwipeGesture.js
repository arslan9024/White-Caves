import { useState, useRef, useCallback } from 'react';

export function useSwipeGesture(options = {}) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    preventScrollOnSwipe = false
  } = options;

  const [swiping, setSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const touchStart = useRef({ x: 0, y: 0 });
  const touchEnd = useRef({ x: 0, y: 0 });

  const onTouchStart = useCallback((e) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
    touchEnd.current = { ...touchStart.current };
    setSwiping(true);
    setSwipeDirection(null);
  }, []);

  const onTouchMove = useCallback((e) => {
    if (!swiping) return;
    
    touchEnd.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };

    const deltaX = touchEnd.current.x - touchStart.current.x;
    const deltaY = touchEnd.current.y - touchStart.current.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      setSwipeDirection(deltaX > 0 ? 'right' : 'left');
      if (preventScrollOnSwipe) {
        e.preventDefault();
      }
    } else {
      setSwipeDirection(deltaY > 0 ? 'down' : 'up');
    }
  }, [swiping, preventScrollOnSwipe]);

  const onTouchEnd = useCallback(() => {
    if (!swiping) return;

    const deltaX = touchEnd.current.x - touchStart.current.x;
    const deltaY = touchEnd.current.y - touchStart.current.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX > absY && absX > threshold) {
      if (deltaX > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    } else if (absY > absX && absY > threshold) {
      if (deltaY > 0) {
        onSwipeDown?.();
      } else {
        onSwipeUp?.();
      }
    }

    setSwiping(false);
    setSwipeDirection(null);
  }, [swiping, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  const swipeOffset = swiping ? {
    x: touchEnd.current.x - touchStart.current.x,
    y: touchEnd.current.y - touchStart.current.y
  } : { x: 0, y: 0 };

  return {
    handlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd
    },
    swiping,
    swipeDirection,
    swipeOffset
  };
}

export function useSwipeableCards(items, options = {}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToNext = useCallback(() => {
    if (isAnimating || currentIndex >= items.length - 1) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => prev + 1);
    setTimeout(() => setIsAnimating(false), 300);
  }, [currentIndex, items.length, isAnimating]);

  const goToPrev = useCallback(() => {
    if (isAnimating || currentIndex <= 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => prev - 1);
    setTimeout(() => setIsAnimating(false), 300);
  }, [currentIndex, isAnimating]);

  const { handlers, swiping, swipeOffset } = useSwipeGesture({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrev,
    threshold: options.threshold || 100,
    preventScrollOnSwipe: true
  });

  return {
    currentIndex,
    currentItem: items[currentIndex],
    goToNext,
    goToPrev,
    canGoNext: currentIndex < items.length - 1,
    canGoPrev: currentIndex > 0,
    handlers,
    swiping,
    swipeOffset,
    isAnimating
  };
}
