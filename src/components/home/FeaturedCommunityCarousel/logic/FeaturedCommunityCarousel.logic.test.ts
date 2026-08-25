import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFeaturedCommunityCarouselLogic } from './FeaturedCommunityCarousel.logic';

describe('FeaturedCommunityCarousel.logic', () => {
  it('handles selecting different communities', () => {
    const { result } = renderHook(() => useFeaturedCommunityCarouselLogic());

    expect(result.current.selectedCommunity).toBe('Palm Jumeirah');

    act(() => {
      result.current.handleSelect('Downtown Dubai');
    });

    expect(result.current.selectedCommunity).toBe('Downtown Dubai');
  });
});
