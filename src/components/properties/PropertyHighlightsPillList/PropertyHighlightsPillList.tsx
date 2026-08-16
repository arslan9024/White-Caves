/**
 * PropertyHighlightsPillList — Wave 62 FE-GOAL-063
 * Property key feature badges and luxury amenities pill list
 * White Caves Real Estate LLC — Property Detail Suite
 */
import React, { FC } from 'react';
import styled from 'styled-components';

const PillGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-family: 'Inter', sans-serif;
`;

const Pill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(100, 116, 139, 0.25);
  color: #E2E8F0;
  font-size: 0.75rem;
  font-weight: 700;
  transition: all 0.2s ease;
  &:hover {
    border-color: #EF4444;
    background: rgba(239, 68, 68, 0.1);
    color: #FFF;
  }
`;

const Icon = styled.span`
  font-size: 0.9rem;
`;

export interface AmenityItem {
  icon: string;
  label: string;
}

export const PropertyHighlightsPillList: FC<{ amenities?: AmenityItem[] }> = ({
  amenities = [
    { icon: '🏊', label: 'Private Infinity Pool' },
    { icon: '🌊', label: 'Full Arabian Gulf Sea View' },
    { icon: '🏝️', label: 'Direct Private Beach Access' },
    { icon: '🚗', label: '4-Car Basement Garage' },
    { icon: '🛎️', label: 'Maid & Driver Quarters' },
    { icon: '⚡', label: 'Smart Home Automation' },
    { icon: '🍷', label: 'Temperature-Controlled Wine Cellar' },
  ],
}) => {
  return (
    <PillGrid data-testid="property-highlights-pill-list">
      {amenities.map((a, idx) => (
        <Pill key={idx}>
          <Icon>{a.icon}</Icon>
          <span>{a.label}</span>
        </Pill>
      ))}
    </PillGrid>
  );
};

export default PropertyHighlightsPillList;
