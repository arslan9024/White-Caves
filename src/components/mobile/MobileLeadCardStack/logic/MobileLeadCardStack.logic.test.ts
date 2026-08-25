import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMobileLeadCardStackLogic } from './MobileLeadCardStack.logic';

describe('MobileLeadCardStack.logic', () => {
  it('initializes with default demo cards and stage color helper', () => {
    const { result } = renderHook(() => useMobileLeadCardStackLogic());

    expect(result.current.cards.length).toBe(5);
    expect(result.current.activeIndex).toBe(0);
    expect(result.current.stageColor('Hot')).toBe('#ef4444');
    expect(result.current.stageColor('Investor')).toBe('#8b5cf6');
  });

  it('removes card on swipe left', () => {
    const { result } = renderHook(() => useMobileLeadCardStackLogic());

    act(() => {
      result.current.handleSwipeLeft('L001');
    });

    expect(result.current.cards.some((c) => c.id === 'L001')).toBe(false);
    expect(result.current.cards.length).toBe(4);
  });

  it('moves card to back of stack on swipe right', () => {
    const { result } = renderHook(() => useMobileLeadCardStackLogic());

    act(() => {
      result.current.handleSwipeRight('L001');
    });

    expect(result.current.cards[result.current.cards.length - 1].id).toBe('L001');
  });
});
