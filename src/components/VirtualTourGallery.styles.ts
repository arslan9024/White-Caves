import styled from 'styled-components';
import { typography } from '../styles/theme/typography';
import { keyframes } from 'styled-components';
import { transitions } from '../styles/theme/transitions';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

export const VirtualTourGalleryContainer = styled.div`
  padding: 3rem 5%;
  background: var(--bg-light, #f7fafc);
`;

export const GalleryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const HeaderContent = styled.div`
  flex: 1;

  h2 {
    font-family: ${typography.fontFamily.heading};
    font-size: 2rem;
    color: var(--primary-color, #1a365d);
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--text-muted, #718096);
  }
`;

export const ViewControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const ViewBtn = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  background: ${props => props.$active 
    ? 'var(--primary-color, #1a365d)' 
    : 'var(--bg-primary, #ffffff)'};
  border: 1px solid var(--border-color, #e2e8f0);
  border-radius: 0.5rem;
  font-size: 0.85rem;
  cursor: pointer;
  transition: ${transitions.hover};
  color: ${props => props.$active 
    ? 'var(--text-on-primary, #ffffff)' 
    : 'var(--text-primary, #1a202c)'};

  &:hover {
    border-color: var(--primary-color, #1a365d);
  }
`;

export const FeaturedToursSection = styled.div`
  margin-bottom: 3rem;

  h3 {
    font-family: ${typography.fontFamily.heading};
    font-size: 1.25rem;
    color: var(--text-primary, #1a202c);
    margin-bottom: 1.5rem;
  }
`;

export const AllToursSection = styled.div`
  h3 {
    font-family: ${typography.fontFamily.heading};
    font-size: 1.25rem;
    color: var(--text-primary, #1a202c);
    margin-bottom: 1.5rem;
  }
`;

export const FeaturedSlider = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FeaturedTourCard = styled.div`
  background: var(--bg-primary, #ffffff);
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: var(--shadow-md, 0 4px 12px rgba(0, 0, 0, 0.08));
  cursor: pointer;
  transition: ${transitions.all};

  &:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-xl, 0 16px 40px rgba(0, 0, 0, 0.12));
  }
`;

export const TourThumbnail = styled.div`
  position: relative;
  height: 220px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  ${FeaturedTourCard}:hover & img {
    transform: scale(1.05);
  }
`;

export const TourOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${FeaturedTourCard}:hover & {
    opacity: 1;
  }
`;

export const PlayButton = styled.div`
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  animation: ${pulse} 2s infinite;

  span {
    font-family: ${typography.fontFamily.heading};
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--primary-color, #1a365d);
  }
`;

export const TourBadges = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Badge = styled.span<{ type?: 'drone' | 'video' }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
    switch(props.type) {
      case 'drone':
        return 'var(--primary-color, #1a365d)';
      case 'video':
        return 'var(--secondary-color, #c53030)';
      default:
        return 'rgba(0, 0, 0, 0.6)';
    }
  }};
  color: var(--text-on-primary, #ffffff);
`;

export const TourType = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  background: rgba(0, 0, 0, 0.6);
  color: var(--text-on-primary, #ffffff);
  font-size: 0.75rem;
  border-radius: 9999px;
`;

export const TourInfo = styled.div`
  padding: 1.5rem;

  h4 {
    font-family: ${typography.fontFamily.heading};
    font-size: 1.1rem;
    color: var(--text-primary, #1a202c);
    margin-bottom: 0.5rem;
  }
`;

export const TourLocation = styled.div`
  color: var(--text-muted, #718096);
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    width: 16px;
    height: 16px;
    color: #d97706;
  }
`;

export const TourSpecs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

export const SpecItem = styled.span`
  font-size: 0.9rem;
  color: var(--text-primary, #1a202c);

  strong {
    color: var(--primary-color, #1a365d);
  }
`;

export const TourPrice = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--primary-color, #1a365d);
  margin: 1rem 0;
`;

export const ViewTourBtn = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: var(--primary-color, #1a365d);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: ${transitions.all};

  &:hover {
    background: #0d1b2a;
    transform: translateY(-2px);
  }
`;

export const ToursGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const TourCard = styled.div`
  background: var(--bg-primary, #ffffff);
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: var(--shadow-md, 0 4px 12px rgba(0, 0, 0, 0.08));
  cursor: pointer;
  transition: ${transitions.all};

  &:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-xl, 0 16px 40px rgba(0, 0, 0, 0.12));
  }

  ${TourThumbnail} img {
    transition: transform 0.3s ease;
  }

  &:hover ${TourThumbnail} img {
    transform: scale(1.05);
  }

  &:hover ${TourOverlay} {
    opacity: 1;
  }
`;

export const TourContent = styled.div`
  padding: 1.5rem;

  h4 {
    font-family: ${typography.fontFamily.heading};
    font-size: 1.1rem;
    color: var(--text-primary, #1a202c);
    margin-bottom: 0.5rem;
  }
`;

export const LoadMoreBtn = styled.button`
  display: block;
  margin: 2rem auto 0;
  padding: 0.75rem 2rem;
  background: var(--primary-color, #1a365d);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: ${transitions.all};

  &:hover {
    background: #0d1b2a;
    transform: translateY(-2px);
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--text-muted, #718096);

  p {
    font-size: 1.1rem;
  }
`;
