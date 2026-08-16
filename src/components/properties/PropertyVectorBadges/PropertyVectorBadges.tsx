/**
 * PropertyVectorBadges — Wave 56 FE-GOAL-008
 * Custom SVG vector badges for Bedrooms, Bathrooms, SqFt, and Dubai community locations
 * White Caves Real Estate LLC — UI/UX Suite
 */
import React, { FC } from 'react';
import styled from 'styled-components';

const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Inter', sans-serif;
  flex-wrap: wrap;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(100, 116, 139, 0.2);
  color: #CBD5E1;
  font-size: 0.72rem;
  font-weight: 700;
`;

const Icon = styled.span`
  font-size: 0.85rem;
  color: #EF4444;
`;

export interface PropertySpecs {
  beds?: number | string;
  baths?: number | string;
  sqft?: number | string;
  location?: string;
}

export const PropertyVectorBadges: FC<PropertySpecs> = ({
  beds = '5 Beds',
  baths = '6 Baths',
  sqft = '8,450 SqFt',
  location = 'Palm Jumeirah',
}) => {
  return (
    <BadgeRow data-testid="property-vector-badges">
      <Badge>
        <Icon>🛏️</Icon>
        <span>{beds}</span>
      </Badge>
      <Badge>
        <Icon>🚿</Icon>
        <span>{baths}</span>
      </Badge>
      <Badge>
        <Icon>📐</Icon>
        <span>{sqft}</span>
      </Badge>
      <Badge>
        <Icon>📍</Icon>
        <span>{location}</span>
      </Badge>
    </BadgeRow>
  );
};

export default PropertyVectorBadges;
