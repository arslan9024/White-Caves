import styled from 'styled-components';

export const ContentSliderContainer = styled.div`
  position: relative;
  width: 100%;
  padding: 2rem 0;
`;

export const SliderHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

export const SliderTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary, #1f2937);
  margin: 0 0 0.5rem;
`;

export const SliderSubtitle = styled.p`
  font-size: 1rem;
  color: var(--text-secondary, #6b7280);
  margin: 0;
`;

export const SliderWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const SliderContainerElement = styled.div`
  flex: 1;
  overflow: hidden;
  cursor: grab;
  user-select: none;

  &:active {
    cursor: grabbing;
  }
`;

export const SliderTrack = styled.div`
  display: flex;
  will-change: transform;
`;

export const SliderSlide = styled.div`
  flex-shrink: 0;
`;

export const SliderControl = styled.button<{ $position: 'prev' | 'next' }>`
  position: absolute;
  z-index: 10;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  ${(props) => (props.$position === 'prev' ? 'left: -24px;' : 'right: -24px;')}

  &:hover {
    background: #D4AF37;
    transform: scale(1.1);
  }

  &:hover span {
    color: white;
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    ${(props) =>
      props.$position === 'prev' ? 'left: -16px;' : 'right: -16px;'}
  }
`;

export const ControlIcon = styled.span`
  font-size: 2rem;
  font-weight: 300;
  color: #1f2937;
  line-height: 1;
  transition: color 0.3s ease;
`;

export const SliderDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 1.5rem;
`;

export const SliderDot = styled.button<{ $isActive: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: ${(props) => (props.$isActive ? '#D4AF37' : '#d1d5db')};
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  transform: ${(props) => (props.$isActive ? 'scale(1.2)' : 'scale(1)')};

  &:hover {
    background: #9ca3af;
  }
`;

export const SliderPlayPause = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: #D4AF37;
    transform: scale(1.1);
  }
`;

export const DefaultSlideCard = styled.div`
  background: var(--card-bg, #ffffff);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }

  [data-theme='dark'] & {
    background: var(--card-bg, #252542);
  }
`;

export const SlideImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 66.67%;
  overflow: hidden;
`;

export const SlideImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;

  ${DefaultSlideCard}:hover & {
    transform: scale(1.05);
  }
`;

export const SlideBadge = styled.span<{ $type?: 'sale' | 'rent' }>`
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${(props) =>
    props.$type === 'sale'
      ? '#D4AF37'
      : props.$type === 'rent'
        ? '#10b981'
        : '#6366f1'};
  color: white;
`;

export const SlideContent = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const SlideTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary, #1f2937);
  margin: 0 0 0.5rem 0;

  [data-theme='dark'] & {
    color: var(--text-primary, #ffffff);
  }
`;

export const SlideLocation = styled.p`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary, #6b7280);
  margin: 0 0 0.75rem 0;

  [data-theme='dark'] & {
    color: var(--text-secondary, #a0a0a0);
  }
`;

export const LocationIcon = styled.span`
  font-size: 1rem;
`;

export const SlideDescription = styled.p`
  font-size: 0.9rem;
  color: var(--text-secondary, #6b7280);
  line-height: 1.5;
  margin: 0 0 1rem 0;
  flex: 1;

  [data-theme='dark'] & {
    color: var(--text-secondary, #a0a0a0);
  }
`;

export const SlideFeatures = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color, #e5e7eb);

  [data-theme='dark'] & {
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }
`;

export const Feature = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary, #6b7280);

  [data-theme='dark'] & {
    color: var(--text-secondary, #a0a0a0);
  }
`;

export const FeatureIcon = styled.span`
  font-size: 1rem;
`;

export const SlidePrice = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color, #dc2626);
  margin: 0;
`;
