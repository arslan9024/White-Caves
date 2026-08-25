import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAnimatedHeadlineGradientLogic } from './AnimatedHeadlineGradient.logic';

describe('AnimatedHeadlineGradient.logic', () => {
  it('returns default title when no props provided', () => {
    const { result } = renderHook(() => useAnimatedHeadlineGradientLogic());
    expect(result.current.displayTitle).toBe('Dubai Luxury Real Estate. Sovereign Precision.');
  });

  it('returns custom title and font size when provided', () => {
    const { result } = renderHook(() => useAnimatedHeadlineGradientLogic({ title: 'Exclusive Penthouses', fontSize: '3rem' }));
    expect(result.current.displayTitle).toBe('Exclusive Penthouses');
    expect(result.current.fontSize).toBe('3rem');
  });
});
