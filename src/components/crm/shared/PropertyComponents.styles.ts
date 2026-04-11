import styled from 'styled-components';
import { theme } from '../../../styles/theme';

const { colors } = theme;

/* ============================================================================
 * Property Components Styled Components
 * Used by: PropertyMediaGallery.jsx, PropertyDetail Modal
 * ============================================================================ */

// ============================================================================
// Gallery Styles
// ============================================================================

export const PropertyGallery = styled.div<{ $isEmpty?: boolean }>`
  border-radius: 12px;
  overflow: hidden;
  background: rgba(15, 23, 42, 0.6);

  ${(props) =>
    props.$isEmpty &&
    `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: #64748b;
    gap: 0.5rem;
  `}

  @media (max-width: 768px) {
    border-radius: 8px;
  }
`;

export const GalleryMain = styled.div`
  position: relative;
  aspect-ratio: 16/9;
  background: #1e293b;
  overflow: hidden;

  @media (max-width: 768px) {
    aspect-ratio: 4/3;
  }
`;

export const GalleryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  display: block;
`;

export const GalleryNav = styled.button<{ $position?: 'prev' | 'next' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;

  ${(props) => (props.$position === 'prev' ? `left: 1rem;` : `right: 1rem;`)}

  &:hover {
    background: rgba(0, 0, 0, 0.7);
    transform: translateY(-50%) scale(1.1);
  }

  svg {
    width: 24px;
    height: 24px;
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

export const FullscreenBtn = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const ImageCounter = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  padding: 0.375rem 0.75rem;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 500;
  z-index: 10;
`;

export const GalleryThumbnails = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem;
  overflow-x: auto;
  background: rgba(15, 23, 42, 0.4);

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
    gap: 0.375rem;
  }
`;

export const Thumbnail = styled.button<{ $active?: boolean; $isMore?: boolean }>`
  flex-shrink: 0;
  width: 64px;
  height: 48px;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid ${(props) => (props.$active ? colors.primary : 'transparent')};
  cursor: pointer;
  background: #1e293b;
  padding: 0;
  transition: all 0.2s ease;

  ${(props) =>
    props.$isMore &&
    `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    gap: 0.125rem;
    font-size: 0.625rem;
  `}

  &:hover {
    border-color: ${colors.primary};
    opacity: 0.8;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    width: 56px;
    height: 42px;
  }
`;

// ============================================================================
// Fullscreen Modal Styles
// ============================================================================

export const FullscreenOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: var(--z-overlay, 600);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;

  img {
    max-width: 90vw;
    max-height: 90vh;
    object-fit: contain;
  }
`;

export const CloseFullscreenBtn = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: var(--z-overlay, 600);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

export const FullscreenNav = styled.button<{ $position?: 'prev' | 'next' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: var(--z-overlay, 600);

  ${(props) => (props.$position === 'prev' ? `left: 2rem;` : `right: 2rem;`)}

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  svg {
    width: 28px;
    height: 28px;
  }

  @media (max-width: 768px) {
    width: 44px;
    height: 44px;

    svg {
      width: 22px;
      height: 22px;
    }

    ${(props) => (props.$position === 'prev' ? `left: 1rem;` : `right: 1rem;`)}
  }
`;

// ============================================================================
// Property Specs Grid
// ============================================================================

export const PropertySpecsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 10px;
  margin-top: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 0.75rem;
    padding: 0.75rem;
  }
`;

export const SpecItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #64748b;
  padding: 0.5rem;

  svg {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
  }

  @media (max-width: 768px) {
    gap: 0.5rem;
    padding: 0.375rem;

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

export const SpecContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const SpecValue = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #fff;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

export const SpecLabel = styled.span`
  font-size: 0.75rem;
  color: #64748b;

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

// ============================================================================
// Property Detail Container
// ============================================================================

export const PropertyDetailContainer = styled.div`
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 8px;
  }
`;

export const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

export const HeaderInfo = styled.div`
  flex: 1;

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #fff;
    margin: 0 0 0.5rem 0;
  }

  @media (max-width: 768px) {
    h2 {
      font-size: 1.125rem;
    }
  }
`;

export const PropertyAddress = styled.p`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`;

export const HeaderPrice = styled.div`
  text-align: right;

  @media (max-width: 768px) {
    text-align: left;
  }
`;

export const PriceLabel = styled.span`
  display: block;
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
`;

export const PriceValue = styled.span`
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
  color: #10b981;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

export const CloseBtn = styled.button`
  background: transparent;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;

  &:hover {
    color: #fff;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

// ============================================================================
// Detail Sections
// ============================================================================

export const DetailSection = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  h4 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #94a3b8;
    margin: 0 0 1rem 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  @media (max-width: 768px) {
    margin-top: 1.25rem;
    padding-top: 1.25rem;

    h4 {
      font-size: 0.8125rem;
    }
  }
`;

export const OwnerCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 10px;

  @media (max-width: 768px) {
    padding: 0.75rem;
    gap: 0.75rem;
  }
`;

export const OwnerAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${colors.luxury.goldDark};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.25rem;
  font-weight: 600;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
`;

export const OwnerDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
`;

export const OwnerName = styled.span`
  font-weight: 600;
  color: #fff;
  font-size: 0.9375rem;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

export const OwnerContact = styled.span`
  font-size: 0.8125rem;
  color: #64748b;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

// ============================================================================
// Financial Grid
// ============================================================================

export const FinancialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 0.75rem;
  }
`;

export const FinancialItem = styled.div`
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;

  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`;

export const FinLabel = styled.span`
  display: block;
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const FinValue = styled.span`
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;

  @media (max-width: 768px) {
    font-size: 0.9375rem;
  }
`;

// ============================================================================
// Description Section
// ============================================================================

export const DescriptionSection = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  h4 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #94a3b8;
    margin: 0 0 1rem 0;
    text-transform: uppercase;
  }

  p {
    color: #94a3b8;
    font-size: 0.875rem;
    line-height: 1.6;
    margin: 0;
    white-space: pre-wrap;
  }

  @media (max-width: 768px) {
    margin-top: 1.25rem;
    padding-top: 1.25rem;

    h4 {
      font-size: 0.8125rem;
    }

    p {
      font-size: 0.8125rem;
    }
  }
`;
