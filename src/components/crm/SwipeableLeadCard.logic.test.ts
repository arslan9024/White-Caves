import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSwipeableLeadCardLogic, LeadCardData } from './SwipeableLeadCard.logic';

describe('useSwipeableLeadCardLogic', () => {
  const mockLead: LeadCardData = {
    id: 'lead-1',
    name: 'Ahmed Malik',
    phone: '+971501234567',
    status: 'NEW',
    budget: 2500000,
    community: 'DAMAC Hills 2',
  };

  it('initializes with default drag offset 0 and modals closed', () => {
    const { result } = renderHook(() => useSwipeableLeadCardLogic(mockLead));
    expect(result.current.dragOffset).toBe(0);
    expect(result.current.isSwiping).toBe(false);
    expect(result.current.showSnoozeModal).toBe(false);
  });

  it('handles touch drag move correctly', () => {
    const { result } = renderHook(() => useSwipeableLeadCardLogic(mockLead));

    act(() => {
      result.current.handleTouchStart({ touches: [{ clientX: 100 }] } as any);
    });

    act(() => {
      result.current.handleTouchMove({ touches: [{ clientX: 180 }] } as any);
    });

    expect(result.current.dragOffset).toBe(80);
  });

  it('triggers right swipe call callback on touch end exceeding threshold', () => {
    const onCallMock = vi.fn();
    const { result } = renderHook(() => useSwipeableLeadCardLogic(mockLead, undefined, onCallMock));

    act(() => {
      result.current.handleTouchStart({ touches: [{ clientX: 100 }] } as any);
    });

    act(() => {
      result.current.handleTouchMove({ touches: [{ clientX: 250 }] } as any);
    });

    act(() => {
      result.current.handleTouchEnd();
    });

    expect(onCallMock).toHaveBeenCalledWith('+971501234567');
  });

  it('triggers left swipe snooze modal on touch end exceeding negative threshold', () => {
    const { result } = renderHook(() => useSwipeableLeadCardLogic(mockLead));

    act(() => {
      result.current.handleTouchStart({ touches: [{ clientX: 200 }] } as any);
    });

    act(() => {
      result.current.handleTouchMove({ touches: [{ clientX: 50 }] } as any);
    });

    act(() => {
      result.current.handleTouchEnd();
    });

    expect(result.current.showSnoozeModal).toBe(true);
  });
});
