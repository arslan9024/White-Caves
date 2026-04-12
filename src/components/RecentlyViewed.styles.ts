import styled from 'styled-components';
import { colors } from '../styles/theme/colors';

export const RecentlyViewedSection = styled.section`
  position: relative;
  padding: 2rem 0;
  margin: 2rem 0;
`;

export const RecentlyViewedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  [data-theme='dark'] & {
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  [data-theme='dark'] & {
  }
`;

export const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;

  [data-theme='dark'] & {
    color: white;
  }
`;

export const ItemCount = styled.span`
  font-size: 0.875rem;
  color: var(--text-muted);
  padding: 0.25rem 0.75rem;
  background: var(--bg-tertiary);
  border-radius: 9999px;

  [data-theme='dark'] & {
    color: var(--text-muted, #808080);
    background: var(--bg-tertiary, #3a3a5a);
  }
`;

export const ClearButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: var(--text-muted);
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: var(--error);
    border-color: var(--error);
    background: rgba(239, 68, 68, 0.1);
  }

  [data-theme='dark'] & {
    color: var(--text-muted, #808080);
    border-color: var(--border-color, #3a3a5a);

    &:hover {
      color: #ef4444;
      border-color: #ef4444;
      background: rgba(239, 68, 68, 0.15);
    }
  }
`;

export const RecentlyViewedScroll = styled.div`
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 0.5rem 1rem;
  margin: 0 -1rem;

  &::-webkit-scrollbar {
    display: none;
  }

  [data-theme='dark'] & {
  }
`;

export const RecentlyViewedTrack = styled.div`
  display: flex;
  gap: 1.25rem;
  padding: 0.5rem 0;

  [data-theme='dark'] & {
  }
`;

export const RecentPropertyCard = styled.div<{ $animationDelay?: string }>`
  flex: 0 0 280px;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: fadeSlideIn 0.4s ease-out forwards;
  opacity: 0;
  transform: translateY(10px);
  animation-delay: ${props => props.$animationDelay || '0s'};
  background: var(--bg-card);
  border: 1px solid var(--border-color);

  @keyframes fadeSlideIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  [data-theme='dark'] & {
    background: var(--bg-card, #2a2a3e);
    border-color: var(--border-color, #3a3a5a);
  }
`;

export const RecentPropertyImage = styled.div`
  position: relative;
  height: 160px;
  overflow: hidden;
  background: var(--bg-secondary);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  ${RecentPropertyCard}:hover & img {
    transform: scale(1.05);
  }

  [data-theme='dark'] & {
    background: var(--bg-secondary, #1e1e2e);
  }
`;

export const PropertyTypeBadge = styled.span`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  background: var(--primary);
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const RecentPropertyInfo = styled.div`
  padding: 1rem;

  [data-theme='dark'] & {
  }
`;

export const PropertyTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  [data-theme='dark'] & {
    color: white;
  }
`;

export const PropertyLocationText = styled.p`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.813rem;
  color: var(--text-muted);
  margin: 0 0 0.75rem 0;

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }

  [data-theme='dark'] & {
    color: var(--text-muted, #808080);
  }
`;

export const PropertySpecs = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.813rem;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;

  [data-theme='dark'] & {
    color: var(--text-secondary, #a0a0a0);
  }
`;

export const SpecDot = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--text-muted);

  [data-theme='dark'] & {
    background: var(--text-muted, #808080);
  }
`;

export const PropertyPrice = styled.p`
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--primary);
  margin: 0;

  [data-theme='dark'] & {
    color: var(--primary, ${colors.primary});
  }
`;

export const ScrollIndicators = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
  padding: 0 0.5rem;
  transform: translateY(20px);

  @media (max-width: 768px) {
    display: none;
  }

  [data-theme='dark'] & {
  }
`;

export const ScrollButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: all;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-md);
  color: var(--text-primary);

  &:hover {
    background: var(--primary);
    border-color: var(--primary);
    color: white;
  }

  svg {
    width: 20px;
    height: 20px;
  }

  [data-theme='dark'] & {
    background: var(--bg-primary, #1a1a2e);
    border-color: var(--border-color, #3a3a5a);
    color: var(--text-primary, white);

    &:hover {
      background: var(--primary, ${colors.primary});
      border-color: var(--primary, ${colors.primary});
      color: white;
    }
  }
`;
