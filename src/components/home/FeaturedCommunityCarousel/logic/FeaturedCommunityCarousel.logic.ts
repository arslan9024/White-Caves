/**
 * FeaturedCommunityCarousel.logic.ts — Hook & Logic Layer
 */

import { useState, useCallback } from 'react';
import { FEATURED_COMMUNITIES } from '../data/FeaturedCommunityCarousel.data';

export function useFeaturedCommunityCarouselLogic() {
  const [selectedCommunity, setSelectedCommunity] = useState<string>('Palm Jumeirah');

  const handleSelect = useCallback((name: string) => {
    setSelectedCommunity(name);
  }, []);

  return {
    selectedCommunity,
    handleSelect,
    communities: FEATURED_COMMUNITIES,
  };
}
