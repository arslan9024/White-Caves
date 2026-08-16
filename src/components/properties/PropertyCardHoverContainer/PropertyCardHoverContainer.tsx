/**
 * PropertyCardHoverContainer — Wave 56 FE-GOAL-005
 * Micro-hover elevation container for property listing cards with glowing red luxury drop-shadows
 * White Caves Real Estate LLC — UI/UX Suite
 */
import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

const CardWrapper = styled.div`
  background: rgba(15, 23, 42, 0.85);
  border: 1.5px solid rgba(100, 116, 139, 0.2);
  border-radius: 16px;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  &:hover {
    transform: translateY(-6px);
    border-color: rgba(239, 68, 68, 0.5);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(239, 68, 68, 0.25);
  }
`;

export const PropertyCardHoverContainer: FC<{ children: ReactNode; onClick?: () => void }> = ({
  children,
  onClick,
}) => {
  return (
    <CardWrapper onClick={onClick} data-testid="property-card-hover-container">
      {children}
    </CardWrapper>
  );
};

export default PropertyCardHoverContainer;
