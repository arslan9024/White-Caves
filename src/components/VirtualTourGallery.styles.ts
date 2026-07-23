import styled, { keyframes } from 'styled-components';
import { typography } from '../styles/theme/typography';
import { transitions } from '../styles/theme/transitions';
import { radius } from '../styles/theme/radius';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const VirtualTourGalleryContainer = styled.section`
  padding: 3rem 5%;
  background: linear-gradient(180deg, #ffffff 0%, #fff5f5 100%);
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
    color: #111827;
    margin-bottom: 0.5rem;
  }

  p {
    color: #4b5563;
  }
`;

export const ViewControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const ViewBtn = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  background: ${props =>
    props.$active ? 'var(--color-primary, #C9A84C)' : 'var(--bg-primary, #ffffff)'};
  border: 1px solid ${props => (props.$active ? 'var(--color-primary, #C9A84C)' : '#e5e7eb')};
  border-radius: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: ${transitions.all};
  color: ${props =>
    props.$active ? 'var(--text-on-primary, #ffffff)' : 'var(--text-primary, #1a202c)'};

  &:hover {
    border-color: var(--color-primary, #c9a84c);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary, #c9a84c);
    outline-offset: 2px;
  }
`;

export const FeaturedToursSection = styled.div`
  margin-bottom: 3rem;

  h3 {
    font-family: ${typography.fontFamily.heading};
    font-size: 1.25rem;
    color: #111827;
    margin-bottom: 1.5rem;
  }
`;

export const AllToursSection = styled.div`
  h3 {
    font-family: ${typography.fontFamily.heading};
    font-size: 1.25rem;
    color: #111827;
    margin-bottom: 1.5rem;
  }
`;

export const FeaturedSlider = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FeaturedTourCard = styled.button`
  background: var(--bg-primary, #ffffff);
  border-radius: 0.75rem;
  border: 1px solid rgba(227, 30, 36, 0.14);
  overflow: hidden;
  box-shadow: var(--shadow-md, 0 4px 12px rgba(0, 0, 0, 0.08));
  cursor: pointer;
  transition: ${transitions.all};
  text-align: left;
  padding: 0;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(227, 30, 36, 0.15);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary, #c9a84c);
    outline-offset: 2px;
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
    font-weight: ${typography.weights.bold};
    color: var(--color-primary, #c9a84c);
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
  border-radius: ${radius.full};
  font-size: 0.7rem;
  font-weight: ${typography.weights.semibold};
  text-transform: uppercase;
  background: ${props => {
    switch (props.type) {
      case 'drone':
        return 'var(--color-primary, #C9A84C)';
      case 'video':
        return '#111827';
      default:
        return 'rgba(0, 0, 0, 0.6)';
    }
  }};
  color: var(--text-on-primary, #ffffff);
`;

export const TourInfo = styled.div`
  padding: 1.5rem;

  h4 {
    font-family: ${typography.fontFamily.heading};
    font-size: 1.1rem;
    color: #111827;
    margin-bottom: 0.5rem;
  }
`;

export const TourLocation = styled.div`
  color: #6b7280;
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
  color: #111827;

  strong {
    color: var(--color-primary, #c9a84c);
  }
`;

export const TourPrice = styled.div`
  font-size: 1.4rem;
  font-weight: ${typography.weights.bold};
  color: var(--color-primary, #c9a84c);
  margin: 1rem 0;
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

export const ToursList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
`;

export const TourCard = styled.button`
  background: var(--bg-primary, #ffffff);
  border-radius: 0.75rem;
  border: 1px solid rgba(227, 30, 36, 0.12);
  overflow: hidden;
  box-shadow: var(--shadow-md, 0 4px 12px rgba(0, 0, 0, 0.08));
  cursor: pointer;
  transition: ${transitions.all};
  text-align: left;
  padding: 0;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(227, 30, 36, 0.15);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary, #c9a84c);
    outline-offset: 2px;
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
    color: #111827;
    margin-bottom: 0.5rem;
  }
`;

export const TourMetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
`;

export const TourViews = styled.span`
  color: #6b7280;
  font-size: 0.85rem;
`;

export const TourType = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  background: rgba(17, 24, 39, 0.85);
  color: #fff;
  font-size: 0.75rem;
  border-radius: ${radius.full};
`;

export const TourModal = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.2s ease;
`;

export const ModalOverlay = styled.button`
  position: absolute;
  inset: 0;
  border: none;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(2px);
  cursor: pointer;
`;

export const ModalContent = styled.div`
  position: relative;
  width: min(980px, 94vw);
  max-height: 92vh;
  overflow: auto;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.32);
  padding: 1.25rem;
  z-index: 1;
  animation: ${slideUp} 0.24s ease;
`;

export const CloseModalButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 1rem;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 999px;
  background: #f3f4f6;
  color: #111827;
  font-size: 1.15rem;
  cursor: pointer;

  &:hover {
    background: #e5e7eb;
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary, #c9a84c);
    outline-offset: 2px;
  }
`;

export const ModalHeader = styled.div`
  padding-right: 2.75rem;

  h3 {
    font-size: 1.4rem;
    margin: 0 0 0.25rem;
    color: #111827;
  }

  p {
    margin: 0;
    color: #6b7280;
  }
`;

export const TourViewer = styled.div`
  margin-top: 1rem;
`;

export const ViewerPlaceholder = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 0.85rem;
  background: #111827;

  img {
    display: block;
    width: 100%;
    height: auto;
    max-height: 58vh;
    object-fit: cover;
    opacity: 0.82;
  }
`;

export const ViewerControls = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: #fff;

  p {
    margin: 0;
    font-weight: 600;
  }
`;

export const ControlIcon = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.92);
  color: var(--color-primary, #c9a84c);
  font-weight: 800;
`;

export const StartTourButton = styled.a`
  display: inline-block;
  padding: 0.65rem 1.1rem;
  border-radius: 0.6rem;
  background: var(--color-primary, #c9a84c);
  color: #fff;
  text-decoration: none;
  font-weight: 700;

  &:hover {
    background: #b71c1c;
  }

  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
`;

export const ModalInfo = styled.div`
  margin-top: 1rem;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const InfoItem = styled.div`
  background: #fff7f7;
  border: 1px solid rgba(227, 30, 36, 0.14);
  border-radius: 0.7rem;
  padding: 0.75rem;
`;

export const InfoLabel = styled.span`
  display: block;
  font-size: 0.74rem;
  color: #6b7280;
  margin-bottom: 0.2rem;
`;

export const InfoValue = styled.span<{ $price?: boolean }>`
  font-weight: 700;
  color: ${props => (props.$price ? 'var(--color-primary, #C9A84C)' : '#111827')};
`;

export const ModalActions = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 0.65rem;
  flex-wrap: wrap;
`;

export const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'outline' }>`
  border-radius: 0.6rem;
  border: 1px solid transparent;
  padding: 0.6rem 0.95rem;
  cursor: pointer;
  font-weight: 600;

  background: ${props => {
    if (props.$variant === 'secondary') return '#111827';
    if (props.$variant === 'outline') return 'transparent';
    return 'var(--color-primary, #C9A84C)';
  }};

  color: ${props => (props.$variant === 'outline' ? '#111827' : '#fff')};
  border-color: ${props => (props.$variant === 'outline' ? '#d1d5db' : 'transparent')};

  &:hover {
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary, #c9a84c);
    outline-offset: 2px;
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
  font-weight: ${typography.weights.semibold};
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
