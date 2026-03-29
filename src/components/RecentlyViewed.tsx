import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  RecentlyViewedSection,
  RecentlyViewedHeader,
  HeaderLeft,
  SectionTitle,
  ItemCount,
  ClearButton,
  RecentlyViewedScroll,
  RecentlyViewedTrack,
  RecentPropertyCard,
  RecentPropertyImage,
  PropertyTypeBadge,
  RecentPropertyInfo,
  PropertyTitle,
  PropertyLocationText,
  PropertySpecs,
  SpecDot,
  PropertyPrice,
  ScrollIndicators,
  ScrollButton
} from './RecentlyViewed.styles';

const STORAGE_KEY = 'whitecaves_recently_viewed';
const MAX_ITEMS = 6;

interface RecentlyViewedProperty {
  id: string;
  title: string;
  type: string;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  price: number;
  images?: string[];
}

interface RootState {
  properties: {
    properties: RecentlyViewedProperty[];
  };
}

import { safeStorage } from '../utils/safeStorage';
import { formatPrice } from '../utils';

export function useRecentlyViewed() {
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = safeStorage.getJSON<string[]>(STORAGE_KEY, []);
    if (stored && stored.length > 0) {
      setRecentIds(stored);
    }
  }, []);

  const addToRecent = (propertyId: string) => {
    setRecentIds(prev => {
      const filtered = prev.filter(id => id !== propertyId);
      const updated = [propertyId, ...filtered].slice(0, MAX_ITEMS);
      safeStorage.setJSON(STORAGE_KEY, updated);
      return updated;
    });
  };

  const clearRecent = () => {
    safeStorage.remove(STORAGE_KEY);
    setRecentIds([]);
  };

  return { recentIds, addToRecent, clearRecent };
}

interface RecentlyViewedProps {
  recentIds?: string[];
  onClear?: () => void;
  onPropertyClick?: (propertyId: string) => void;
}

export default function RecentlyViewed({
  recentIds = [],
  onClear,
  onPropertyClick
}: RecentlyViewedProps) {
  const properties = useSelector((state: RootState) => state.properties.properties);

  const recentProperties = recentIds
    .map(id => properties.find(p => p.id === id))
    .filter(Boolean) as RecentlyViewedProperty[];

  if (recentProperties.length === 0) {
    return null;
  }

  // formatPrice imported from ../utils

  return (
    <RecentlyViewedSection>
      <RecentlyViewedHeader>
        <HeaderLeft>
          <SectionTitle>Recently Viewed</SectionTitle>
          <ItemCount>{recentProperties.length} properties</ItemCount>
        </HeaderLeft>
        <ClearButton onClick={onClear} type="button">
          Clear All
        </ClearButton>
      </RecentlyViewedHeader>

      <RecentlyViewedScroll>
        <RecentlyViewedTrack>
          {recentProperties.map((property, index) => (
            <RecentPropertyCard
              key={property.id}
              $animationDelay={`${index * 0.05}s`}
              onClick={() => onPropertyClick && onPropertyClick(property.id)}
              role="button"
              tabIndex={0}
            >
              <RecentPropertyImage>
                <img
                  src={
                    property.images?.[0] ||
                    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'
                  }
                  alt={property.title}
                  loading="lazy"
                  width={400}
                  height={300}
                />
                <PropertyTypeBadge>{property.type}</PropertyTypeBadge>
              </RecentPropertyImage>
              <RecentPropertyInfo>
                <PropertyTitle>{property.title}</PropertyTitle>
                <PropertyLocationText>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {property.location}
                </PropertyLocationText>
                <PropertySpecs>
                  <span>{property.beds} beds</span>
                  <SpecDot />
                  <span>{property.baths} baths</span>
                  <SpecDot />
                  <span>{property.sqft.toLocaleString()} sqft</span>
                </PropertySpecs>
                <PropertyPrice>{formatPrice(property.price)}</PropertyPrice>
              </RecentPropertyInfo>
            </RecentPropertyCard>
          ))}
        </RecentlyViewedTrack>
      </RecentlyViewedScroll>

      <ScrollIndicators>
        <ScrollButton aria-label="Scroll left" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </ScrollButton>
        <ScrollButton aria-label="Scroll right" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </ScrollButton>
      </ScrollIndicators>
    </RecentlyViewedSection>
  );
}
