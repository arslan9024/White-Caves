/**
 * FeaturedCommunityCarousel.style.ts — UI Style Layer & Styled-Components
 * Enforces White Caves Luxury Red / Crisp White / Slate color palette.
 */

import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const CarouselWrapper = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  border: 2px solid rgba(239, 68, 68, 0.25);
  border-radius: 18px;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  animation: ${fadeIn} 0.4s ease;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.2);
`;

export const CarouselHeader = styled.div`
  padding: 14px 20px;
  background: rgba(239, 68, 68, 0.05);
  border-bottom: 1px solid rgba(239, 68, 68, 0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CarouselTitle = styled.h3`
  margin: 0;
  color: #FFFFFF;
  font-size: 0.92rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const CarouselTag = styled.span`
  font-size: 0.68rem;
  font-weight: 800;
  color: #EF4444;
  background: rgba(239, 68, 68, 0.1);
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid rgba(239, 68, 68, 0.25);
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const CommunityGrid = styled.div`
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;

  @media (max-width: 860px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const CommunityCard = styled.div<{ $selected: boolean }>`
  padding: 16px;
  border-radius: 12px;
  background: ${p => (p.$selected ? 'rgba(239, 68, 68, 0.12)' : 'rgba(15, 23, 42, 0.7)')};
  border: 1.5px solid ${p => (p.$selected ? '#EF4444' : 'rgba(100, 116, 139, 0.2)')};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    border-color: #EF4444;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.2);
  }
`;

export const CommunityName = styled.div`
  font-size: 0.9rem;
  font-weight: 900;
  color: #FFFFFF;
`;

export const CommunityType = styled.div`
  font-size: 0.68rem;
  color: #94A3B8;
`;

export const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
`;
