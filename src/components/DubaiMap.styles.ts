import styled, { keyframes } from 'styled-components';
import { typography } from '../styles/theme/typography';
import { transitions } from '../styles/theme/transitions';
import { radius } from '../styles/theme/radius';

// Keyframes
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-50%) translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }
`;

const markerPulse = keyframes`
  0% {
    opacity: 0.2;
    transform-origin: center;
    transform: scale(1);
  }
  50% {
    opacity: 0.1;
    transform: scale(1.3);
  }
  100% {
    opacity: 0.2;
    transform: scale(1);
  }
`;

// Container
export const DubaiMapContainer = styled.div`
  padding: 3rem 5%;
  background: linear-gradient(135deg, var(--bg-light, #f7fafc) 0%, var(--bg-primary, #ffffff) 100%);

  @media (max-width: 768px) {
    padding: 2rem 5%;
  }
`;

// Header
export const MapHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

export const MapTitle = styled.h2`
  font-family: ${typography.fontFamily.heading};
  font-size: 2rem;
  color: var(--primary-color, #1a365d);
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const MapSubtitle = styled.p`
  color: var(--text-muted, #718096);
  font-size: 1rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

// Filters
export const MapFilters = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

export const FilterButton = styled.button<{
  $isActive?: boolean;
  $variant?: 'residential' | 'commercial' | 'luxury';
}>`
  padding: 0.75rem 1.5rem;
  background: ${props =>
    props.$isActive ? 'var(--primary-color, #1a365d)' : 'var(--bg-primary, #ffffff)'};
  border: 2px solid
    ${props => (props.$isActive ? 'var(--primary-color, #1a365d)' : 'var(--border-color, #e2e8f0)')};
  border-radius: ${radius.full};
  font-family: ${typography.fontFamily.primary};
  font-size: 0.9rem;
  font-weight: ${typography.weights.medium};
  color: ${props =>
    props.$isActive ? 'var(--text-on-primary, #ffffff)' : 'var(--text-primary, #1a202c)'};
  cursor: pointer;
  transition: ${transitions.hover};

  &:hover {
    border-color: var(--primary-color, #1a365d);
  }

  ${props =>
    props.$isActive &&
    props.$variant === 'residential' &&
    `
    background: var(--success-color, #38a169);
    border-color: var(--success-color, #38a169);
  `}

  ${props =>
    props.$isActive &&
    props.$variant === 'commercial' &&
    `
    background: var(--primary-color, #1a365d);
    border-color: var(--primary-color, #1a365d);
  `}

  ${props =>
    props.$isActive &&
    props.$variant === 'luxury' &&
    `
    background: var(--secondary-color, #c53030);
    border-color: var(--secondary-color, #c53030);
  `}
`;

// Map Wrapper
export const MapWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
  background: var(--bg-tertiary, #edf2f7);
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    height: 350px;
  }
`;

export const MapBackground = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const DubaiBaseMap = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const InteractiveMapOverlay = styled.div`
  position: absolute;
  inset: 0;
`;

export const MapSVG = styled.svg`
  width: 100%;
  height: 100%;
`;

// Markers
export const MarkerGroup = styled.g`
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }

  &.active .marker-dot {
    stroke: var(--primary-color, #c9a84c);
    stroke-width: 3;
  }
`;

export const MarkerPulse = styled.circle`
  animation: ${markerPulse} 2s infinite;
`;

export const MarkerDot = styled.circle`
  transition: ${transitions.hover};
`;

export const MarkerLabel = styled.text`
  pointer-events: none;
  text-shadow:
    1px 1px 2px white,
    -1px -1px 2px white;
`;

// Info Window
export const MapInfoWindow = styled.div`
  position: absolute;
  top: 50%;
  right: 2rem;
  transform: translateY(-50%);
  width: 320px;
  background: var(--bg-primary, #ffffff);
  border-radius: 0.75rem;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  z-index: var(--z-popover, 110);
  animation: ${slideIn} 0.3s ease;

  @media (max-width: 768px) {
    width: 280px;
    right: 1rem;
  }
`;

export const InfoHeader = styled.div`
  padding: 1.25rem;
  background: var(--primary-color, #1a365d);
  color: var(--text-on-primary, #ffffff);
`;

export const InfoTitle = styled.h4`
  font-family: ${typography.fontFamily.heading};
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
  margin: 0;
`;

export const AreaType = styled.span<{ type?: 'luxury' | 'residential' | 'commercial' }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: ${radius.full};
  font-size: 0.7rem;
  font-weight: ${typography.weights.semibold};
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.2);
  margin-top: 0.5rem;

  ${props =>
    props.type === 'luxury' &&
    `
    background: var(--secondary-color, #c53030);
  `}

  ${props =>
    props.type === 'residential' &&
    `
    background: var(--success-color, #38a169);
  `}

  ${props =>
    props.type === 'commercial' &&
    `
    background: rgba(255, 255, 255, 0.3);
  `}
`;

export const InfoProperties = styled.div`
  max-height: 300px;
  overflow-y: auto;
  padding: 1rem;
`;

export const PropertyPreview = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--bg-light, #f7fafc);
  border-radius: 0.5rem;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: ${transitions.hover};

  &:hover {
    background: var(--bg-tertiary, #edf2f7);
    transform: translateX(4px);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const PropertyImage = styled.img`
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 0.375rem;
`;

export const PreviewInfo = styled.div`
  flex: 1;
`;

export const PreviewTitle = styled.h5`
  font-size: 0.9rem;
  font-weight: ${typography.weights.semibold};
  color: var(--text-primary, #1a202c);
  margin-bottom: 0.25rem;
  margin: 0;
`;

export const PreviewPrice = styled.div`
  font-size: 0.85rem;
  font-weight: ${typography.weights.bold};
  color: var(--secondary-color, #c53030);
  margin-bottom: 0.25rem;
`;

export const PreviewDetails = styled.span`
  font-size: 0.75rem;
  color: var(--text-muted, #718096);
`;

export const NoProperties = styled.div`
  text-align: center;
  color: var(--text-muted, #718096);
  padding: 1rem;
`;

export const ViewAllButton = styled.button`
  display: block;
  width: calc(100% - 2rem);
  margin: 1rem;
  padding: 0.875rem;
  background: var(--primary-color, #1a365d);
  border: none;
  border-radius: 0.75rem;
  color: var(--text-on-primary, #ffffff);
  font-family: ${typography.fontFamily.heading};
  font-weight: ${typography.weights.semibold};
  cursor: pointer;
  transition: ${transitions.hover};

  &:hover {
    background: var(--primary-hover, #234773);
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 28px;
  height: 28px;
  background: var(--bg-light, #f7fafc);
  border: none;
  border-radius: 50%;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-contentHover, 2);
`;

// Map Legend
export const MapLegend = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background: var(--bg-primary, #ffffff);
  border-radius: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
`;

export const LegendTitle = styled.h4`
  font-family: ${typography.fontFamily.heading};
  font-size: 0.9rem;
  color: var(--text-primary, #1a202c);
  margin-bottom: 0.75rem;
  margin: 0;
`;

export const LegendItems = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
`;

export const LegendDot = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.$color};
  flex-shrink: 0;
`;
