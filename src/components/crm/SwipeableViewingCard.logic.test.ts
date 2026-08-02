import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSwipeableViewingCardLogic, ViewingCardData } from './SwipeableViewingCard.logic';

describe('useSwipeableViewingCardLogic', () => {
  const mockViewing: ViewingCardData = {
    id: 'viewing-1',
    propertyTitle: 'DAMAC Hills 2 Luxury Villa',
    clientName: 'Sara Al Mansoori',
    scheduledAt: '2026-08-05 14:00',
    status: 'pending',
  };

  it('initializes with default offset 0', () => {
    const { result } = renderHook(() => useSwipeableViewingCardLogic(mockViewing));
    expect(result.current.dragOffset).toBe(0);
    expect(result.current.showRescheduleModal).toBe(false);
  });

  it('triggers onConfirm on right swipe touch end', () => {
    const onConfirmMock = vi.fn();
    const { result } = renderHook(() => useSwipeableViewingCardLogic(mockViewing, onConfirmMock));

    act(() => {
      result.current.handleTouchStart({ touches: [{ clientX: 50 }] } as any);
    });

    act(() => {
      result.current.handleTouchMove({ touches: [{ clientX: 200 }] } as any);
    });

    act(() => {
      result.current.handleTouchEnd();
    });

    expect(onConfirmMock).toHaveBeenCalledWith('viewing-1');
  });

  it('opens reschedule modal on left swipe touch end', () => {
    const { result } = renderHook(() => useSwipeableViewingCardLogic(mockViewing));

    act(() => {
      result.current.handleTouchStart({ touches: [{ clientX: 200 }] } as any);
    });

    act(() => {
      result.current.handleTouchMove({ touches: [{ clientX: 50 }] } as any);
    });

    act(() => {
      result.current.handleTouchEnd();
    });

    expect(result.current.showRescheduleModal).toBe(true);
  });
});
