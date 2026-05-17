import styled from 'styled-components';
import { transitions } from '../styles/theme/transitions';
import { typography } from '../styles/theme/typography';
import { radius } from '../styles/theme/radius';

export const InteractiveMapContainer = styled.div`
  padding: 3rem;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const MapHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
`;

export const MapTitle = styled.h2`
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const MapSubtitle = styled.p`
  color: var(--text-secondary);
  font-size: 1rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

export const MapVisualContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const DubaiMapVisual = styled.div`
  position: relative;
  background: var(--glass-bg);
  border-radius: ${radius.xxl};
  overflow: hidden;
  border: 1px solid var(--border-color);
  min-height: 400px;

  @media (max-width: 768px) {
    min-height: 300px;
  }
`;

export const MapBackground = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;

  @media (max-width: 768px) {
    min-height: 300px;
  }
`;

export const DubaiOutlineSVG = styled.svg`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;

  [data-theme='dark'] & rect {
    fill: #1a2a3a;
  }

  [data-theme='dark'] & path:nth-of-type(1) {
    fill: #2a3a4a;
  }
`;

export const LocationMarkers = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export const LocationMarker = styled.button<{ $isActive?: boolean; $left: string; $top: string }>`
  position: absolute;
  left: ${props => props.$left};
  top: ${props => props.$top};
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%);
  border: 2px solid #ffffff;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${transitions.all};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1;
  padding: 0;
  font-size: 1rem;
  color: white;

  &:
    hover,
    ${props =>
      props.$isActive &&
      `
    background: linear-gradient(135deg, var(--accent-gold) 0%, #b8943f 100%);
    transform: translate(-50%, -50%) scale(1.15);
    z-index: 10;
  `};
`;

export const MarkerCount = styled.span`
  font-size: ${typography.sizes.base};
  font-weight: ${typography.weights.bold};
  color: #ffffff;
  line-height: 1;
`;

export const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 1024px) {
    grid-column: 1;
    grid-row: 2;
  }
`;

export const SectionTitleSmall = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: ${typography.weights.semibold};
  color: var(--text-primary);
`;

export const ResultsSection = styled.div`
  margin-top: 2rem;
`;

export const ResultsHeader = styled.div`
  margin-bottom: 2rem;
`;

export const ResultsTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  font-weight: ${typography.weights.semibold};
  color: var(--text-primary);
`;

export const ResultsMeta = styled.span`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

export const PropertyLocation = styled.span`
  display: inline-block;
  font-size: 0.85rem;
  color: var(--text-secondary);
`;

export const LocationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 600px;
  overflow-y: auto;

  @media (max-width: 768px) {
    max-height: 400px;
  }
`;

export const LocationItem = styled.div<{ $isSelected?: boolean }>`
  padding: 1rem;
  background: var(--bg-primary);
  border: 2px solid ${props => (props.$isSelected ? 'var(--primary-color)' : 'var(--border-color)')};
  border-radius: ${radius.lg};
  cursor: pointer;
  transition: ${transitions.hover};

  &:hover {
    border-color: var(--primary-color);
    background: var(--bg-secondary);
  }
`;

export const LocationName = styled.h4`
  font-size: 0.95rem;
  font-weight: ${typography.weights.semibold};
  margin: 0 0 0.25rem 0;
  color: var(--text-primary);
`;

export const PropertyCount = styled.span`
  font-size: 0.85rem;
  color: var(--text-secondary);
`;

export const PropertiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
`;

export const PropertyCard = styled.div`
  border-radius: ${radius.lg};
  overflow: hidden;
  background: var(--bg-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: ${transitions.all};

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-4px);
  }
`;

export const PropertyImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
`;

export const PropertyInfo = styled.div`
  padding: 1rem;
`;

export const PropertyTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: ${typography.weights.semibold};
  color: var(--text-primary);
`;

export const PropertyPrice = styled.div`
  font-size: 1.1rem;
  font-weight: ${typography.weights.bold};
  color: var(--secondary-color);
  margin-bottom: 0.5rem;
`;

export const PropertyDetails = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
`;

export const DetailBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
`;
