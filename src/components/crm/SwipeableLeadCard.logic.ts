/**
 * SwipeableLeadCard.logic.ts — Touch/Swipe Gesture Logic (W23-010 / REQ-MOB-011)
 *
 * Handles touch events for swiping left (Snooze 7 days) and right (Call `tel:` intent).
 */

import { useState, useRef, useCallback } from 'react';

export interface LeadCardData {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  status?: string;
  budget?: number;
  community?: string;
}

export function useSwipeableLeadCardLogic(
  lead: LeadCardData,
  onSnooze?: (leadId: string) => void,
  onCall?: (phone: string) => void
) {
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isSwiping, setIsSwiping]   = useState<boolean>(false);
  const [showSnoozeModal, setShowSnoozeModal] = useState<boolean>(false);

  const startXRef = useRef<number>(0);
  const SWIPE_THRESHOLD = 100;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    setIsSwiping(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isSwiping) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startXRef.current;
    // Bound drag offset between -150px (left snooze) and +150px (right call)
    const boundedDiff = Math.max(-150, Math.min(150, diff));
    setDragOffset(boundedDiff);
  }, [isSwiping]);

  const handleTouchEnd = useCallback(() => {
    setIsSwiping(false);

    if (dragOffset > SWIPE_THRESHOLD) {
      // Right swipe: Call intent
      if (lead.phone) {
        if (onCall) onCall(lead.phone);
        else window.location.href = `tel:${lead.phone}`;
      }
    } else if (dragOffset < -SWIPE_THRESHOLD) {
      // Left swipe: Snooze confirmation
      setShowSnoozeModal(true);
    }

    // Reset drag offset smoothly
    setDragOffset(0);
  }, [dragOffset, lead.phone, onCall]);

  const confirmSnooze = useCallback(() => {
    if (onSnooze) onSnooze(lead.id);
    setShowSnoozeModal(false);
  }, [lead.id, onSnooze]);

  const cancelSnooze = useCallback(() => {
    setShowSnoozeModal(false);
  }, []);

  return {
    dragOffset,
    isSwiping,
    showSnoozeModal,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    confirmSnooze,
    cancelSnooze,
  };
}
