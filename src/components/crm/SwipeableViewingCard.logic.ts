/**
 * SwipeableViewingCard.logic.ts — Viewing Card Gesture Logic (W23-011 / REQ-MOB-011)
 *
 * Handles touch gestures for viewing cards:
 * - Right swipe: Confirm viewing (PATCH status -> confirmed)
 * - Left swipe: Reschedule modal open
 */

import { useState, useRef, useCallback } from 'react';

export interface ViewingCardData {
  id: string;
  propertyTitle: string;
  clientName: string;
  clientPhone?: string;
  scheduledAt: string;
  status: 'pending' | 'confirmed' | 'rescheduled' | 'cancelled';
}

export function useSwipeableViewingCardLogic(
  viewing: ViewingCardData,
  onConfirm?: (viewingId: string) => void,
  onReschedule?: (viewingId: string, newDate: string) => void
) {
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isSwiping, setIsSwiping]   = useState<boolean>(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState<boolean>(false);
  const [newScheduledDate, setNewScheduledDate]       = useState<string>('');

  const startXRef = useRef<number>(0);
  const SWIPE_THRESHOLD = 100;

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    setIsSwiping(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isSwiping) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startXRef.current;
    const boundedDiff = Math.max(-150, Math.min(150, diff));
    setDragOffset(boundedDiff);
  }, [isSwiping]);

  const handleTouchEnd = useCallback(() => {
    setIsSwiping(false);

    if (dragOffset > SWIPE_THRESHOLD) {
      // Right swipe: Confirm viewing
      triggerHaptic();
      if (onConfirm) onConfirm(viewing.id);
    } else if (dragOffset < -SWIPE_THRESHOLD) {
      // Left swipe: Reschedule modal
      triggerHaptic();
      setShowRescheduleModal(true);
    }

    setDragOffset(0);
  }, [dragOffset, viewing.id, onConfirm]);

  const confirmReschedule = useCallback(() => {
    if (onReschedule && newScheduledDate) {
      onReschedule(viewing.id, newScheduledDate);
    }
    setShowRescheduleModal(false);
  }, [viewing.id, newScheduledDate, onReschedule]);

  const cancelReschedule = useCallback(() => {
    setShowRescheduleModal(false);
  }, []);

  return {
    dragOffset,
    isSwiping,
    showRescheduleModal,
    newScheduledDate,
    setNewScheduledDate,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    confirmReschedule,
    cancelReschedule,
  };
}
