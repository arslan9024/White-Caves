/**
 * FeaturedCommunityCarousel.tsx — View Layer (4-Way Component Architecture)
 * Sits at folder root: Pure presentational markup drawing data variables and logic hooks.
 */

import React, { FC } from 'react';
import { useFeaturedCommunityCarouselLogic } from './logic/FeaturedCommunityCarousel.logic';
import { CAROUSEL_TEXT } from './data/FeaturedCommunityCarousel.data';
import {
  CarouselWrapper,
  CarouselHeader,
  CarouselTitle,
  CarouselTag,
  CommunityGrid,
  CommunityCard,
  CommunityName,
  CommunityType,
  StatRow,
} from './styles/FeaturedCommunityCarousel.style';

export const FeaturedCommunityCarousel: FC = () => {
  const { selectedCommunity, handleSelect, communities } = useFeaturedCommunityCarouselLogic();

  return (
    <CarouselWrapper data-testid="featured-community-carousel">
      <CarouselHeader>
        <CarouselTitle>
          <span>{CAROUSEL_TEXT.headerTitle}</span>
        </CarouselTitle>
        <CarouselTag>{CAROUSEL_TEXT.badge}</CarouselTag>
      </CarouselHeader>

      <CommunityGrid>
        {communities.map(c => {
          const isSelected = selectedCommunity === c.name;
          return (
            <CommunityCard
              key={c.name}
              $selected={isSelected}
              onClick={() => handleSelect(c.name)}
              data-testid={`community-card-${c.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.4rem' }}>{c.icon}</span>
                <div>
                  <CommunityName>{c.name}</CommunityName>
                  <CommunityType>{c.type}</CommunityType>
                </div>
              </div>

              <div>
                <StatRow>
                  <span style={{ color: '#94A3B8' }}>{CAROUSEL_TEXT.activeListingsLabel}:</span>
                  <span style={{ color: '#EF4444', fontWeight: 800 }}>{c.listings}</span>
                </StatRow>
                <StatRow style={{ marginTop: '4px' }}>
                  <span style={{ color: '#94A3B8' }}>{CAROUSEL_TEXT.avgPriceLabel}:</span>
                  <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{c.avgSqft}</span>
                </StatRow>
              </div>
            </CommunityCard>
          );
        })}
      </CommunityGrid>
    </CarouselWrapper>
  );
};

export default FeaturedCommunityCarousel;
