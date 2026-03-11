import styled from 'styled-components';

export const ImageGalleryOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    padding: 0;
  }
`;

export const ImageGalleryContainer = styled.div`
  background: var(--surface, #ffffff);
  border-radius: 16px;
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;

  [data-theme='dark'] & {
    background: var(--surface-dark, #1a1a2e);
  }

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    max-height: 100vh;
    border-radius: 0;
  }
`;

export const GalleryCloseBtn = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10000;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    top: 12px;
    right: 12px;
    width: 36px;
    height: 36px;
    font-size: 24px;
  }
`;

export const GalleryHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid var(--border, rgba(0, 0, 0, 0.1));
  display: flex;
  flex-direction: column;
  gap: 1rem;

  [data-theme='dark'] & {
    border-color: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    padding: 16px;
  }

  h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary, #1a1a2e);

    [data-theme='dark'] & {
      color: white;
    }

    @media (max-width: 768px) {
      font-size: 1.2rem;
      padding-right: 40px;
    }
  }
`;

export const GalleryTabs = styled.div`
  display: flex;
  gap: 0.5rem;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

export const GalleryTab = styled.button<{ isActive: boolean }>`
  padding: 10px 24px;
  border: none;
  background: var(--surface-alt, #f5f5f7);
  color: var(--text-secondary, #6b7280);
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  [data-theme='dark'] & {
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.7);
  }

  ${props =>
    props.isActive
      ? `
    background: var(--primary, #c9a962);
    color: white;
  `
      : `
    &:hover {
      background: var(--surface-hover, #e5e5e7);
    }

    [data-theme='dark'] &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  `}

  @media (max-width: 480px) {
    flex: 1;
    text-align: center;
    padding: 8px 12px;
    font-size: 0.85rem;
  }
`;

export const GalleryContent = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

export const GalleryMain = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  overflow: hidden;
  border-radius: 12px;
  background: #000;
  cursor: grab;
  user-select: none;

  &:active {
    cursor: grabbing;
  }

  @media (max-width: 768px) {
    min-height: 300px;
  }

  @media (max-width: 480px) {
    min-height: 250px;
  }
`;

export const GalleryImageWrapper = styled.div<{ dragOffset: number }>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.1s ease-out;
  transform: translateX(${props => props.dragOffset}px);
`;

export const GalleryMainImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  user-select: none;
  pointer-events: none;
`;

export const GalleryNav = styled.button<{ position: 'prev' | 'next' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  color: #1a1a2e;
  font-size: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;
  ${props => (props.position === 'prev' ? 'left: 16px;' : 'right: 16px;')}

  &:hover {
    background: white;
    transform: translateY(-50%) scale(1.1);
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 20px;
    ${props => (props.position === 'prev' ? 'left: 8px;' : 'right: 8px;')}
  }
`;

export const GalleryCounter = styled.div`
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
`;

export const GalleryThumbnails = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
  overflow-x: auto;
  padding: 8px 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const Thumbnail = styled.button<{ isActive: boolean }>`
  flex-shrink: 0;
  width: 80px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
  background: none;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  ${props =>
    props.isActive
      ? `
    border-color: var(--primary, #c9a962);
  `
      : `
    &:hover {
      border-color: rgba(201, 169, 98, 0.5);
    }
  `}
`;

export const GalleryDots = styled.div`
  display: none;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;

  @media (max-width: 768px) {
    display: flex;
  }
`;

export const GalleryDot = styled.button<{ isActive: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.2);
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;

  [data-theme='dark'] & {
    background: rgba(255, 255, 255, 0.2);
  }

  ${props =>
    props.isActive
      ? `
    background: var(--primary, #c9a962);
    transform: scale(1.2);
  `
      : ''}
`;

export const SwipeHint = styled.div`
  text-align: center;
  margin-top: 12px;
  color: var(--text-muted, #9ca3af);
  font-size: 0.85rem;
`;

export const NeighborhoodContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const NeighborhoodHeader = styled.div`
  margin-bottom: 24px;

  h3 {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--text-primary, #1a1a2e);
    margin: 0 0 8px 0;
  }

  [data-theme='dark'] & h3 {
    color: white;
  }

  p {
    color: var(--text-secondary, #6b7280);
    font-size: 1rem;
    line-height: 1.6;
    margin: 0;

    [data-theme='dark'] & {
      color: rgba(255, 255, 255, 0.7);
    }
  }
`;

export const NeighborhoodScores = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

export const ScoreCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  &.price-growth {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));
    padding: 16px 24px;
    border-radius: 12px;
    border: 1px solid rgba(16, 185, 129, 0.2);
  }
`;

export const ScoreCircle = styled.div<{ type: 'walk' | 'transit' }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  background: ${props =>
    props.type === 'walk'
      ? 'linear-gradient(135deg, #10b981, #059669)'
      : 'linear-gradient(135deg, #3b82f6, #2563eb)'};

  @media (max-width: 768px) {
    width: 70px;
    height: 70px;
  }
`;

export const ScoreValue = styled.span`
  font-size: 1.5rem;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

export const GrowthValue = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #10b981;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

export const ScoreLabel = styled.span`
  font-size: 0.85rem;
  color: var(--text-secondary, #6b7280);
  font-weight: 500;

  [data-theme='dark'] & {
    color: rgba(255, 255, 255, 0.6);
  }
`;

export const NeighborhoodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const NeighborhoodSection = styled.div`
  background: var(--surface-alt, #f5f5f7);
  padding: 20px;
  border-radius: 12px;

  [data-theme='dark'] & {
    background: rgba(255, 255, 255, 0.05);
  }

  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary, #1a1a2e);
    margin: 0 0 12px 0;

    [data-theme='dark'] & {
      color: white;
    }
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    padding: 6px 0;
    color: var(--text-secondary, #6b7280);
    font-size: 0.9rem;
    border-bottom: 1px solid var(--border, rgba(0, 0, 0, 0.05));

    [data-theme='dark'] & {
      color: rgba(255, 255, 255, 0.7);
      border-color: rgba(255, 255, 255, 0.05);
    }

    &:last-child {
      border-bottom: none;
    }
  }
`;

export const NeighborhoodFooter = styled.div`
  padding-top: 24px;
  border-top: 1px solid var(--border, rgba(0, 0, 0, 0.1));

  [data-theme='dark'] & {
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

export const RentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const RentLabel = styled.span`
  font-size: 0.85rem;
  color: var(--text-muted, #9ca3af);
`;

export const RentValue = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary, #c9a962);
`;
