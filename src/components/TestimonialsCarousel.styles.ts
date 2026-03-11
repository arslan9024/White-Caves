import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const TestimonialsSection = styled.section`
  padding: 80px 0;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 60px 0;
  }
`;

export const TestimonialsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
`;

export const TestimonialsHeader = styled.div`
  text-align: center;
  margin-bottom: 48px;
`;

export const HeaderTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin: 0 0 12px 0;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const HeaderSubtitle = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
`;

export const CarouselWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 0;

  @media (max-width: 768px) {
    gap: 0;
  }
`;

export const CarouselBtn = styled.button`
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: transparent;
  color: white;
  font-size: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    background: var(--primary, #c9a962);
    border-color: var(--primary, #c9a962);
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const CarouselTrack = styled.div`
  flex: 1;
  position: relative;
  height: 420px;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 480px;
  }
`;

export const TestimonialCard = styled.div<{ $active?: boolean; $index?: number; $currentIndex?: number }>`
  position: absolute;
  width: 100%;
  max-width: 700px;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  background: white;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  transition: all 0.5s ease;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  pointer-events: ${(props) => (props.$active ? 'auto' : 'none')};

  @media (max-width: 768px) {
    padding: 30px 20px;
    max-width: 100%;
  }

  &[data-theme='dark'] {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
  }
`;

export const QuoteIcon = styled.div`
  font-size: 5rem;
  line-height: 1;
  color: var(--primary, #c9a962);
  opacity: 0.3;
  font-family: Georgia, serif;
  margin-bottom: -20px;

  @media (max-width: 768px) {
    font-size: 3rem;
    margin-bottom: -10px;
  }
`;

export const TestimonialText = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  color: var(--text-primary, #1a1a2e);
  margin: 0 0 16px 0;
  font-style: italic;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  [data-theme='dark'] & {
    color: white;
  }
`;

export const PropertyPurchased = styled.p`
  font-size: 0.9rem;
  color: var(--primary, #c9a962);
  font-weight: 600;
  margin: 0 0 16px 0;
`;

export const TestimonialRating = styled.div`
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
  gap: 4px;
`;

export const Star = styled.span<{ $filled?: boolean }>`
  font-size: 1.2rem;
  color: ${(props) => (props.$filled ? '#ffc107' : '#ddd')};
  margin: 0 2px;
`;

export const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

export const AuthorImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--primary, #c9a962);
`;

export const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const AuthorName = styled.h4`
  margin: 0 0 4px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary, #1a1a2e);

  [data-theme='dark'] & {
    color: white;
  }
`;

export const AuthorRole = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary, #6b7280);

  [data-theme='dark'] & {
    color: rgba(255, 255, 255, 0.7);
  }
`;

export const CarouselDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 32px;
`;

export const Dot = styled.button<{ $active?: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: ${(props) =>
    props.$active ? 'var(--primary, #c9a962)' : 'rgba(255, 255, 255, 0.3)'};
  cursor: pointer;
  padding: 0;
  transition: all 0.3s ease;
  transform: ${(props) => (props.$active ? 'scale(1.3)' : 'scale(1)')};

  &:hover {
    background: rgba(255, 255, 255, 0.5);
  }
`;

export const TrustIndicators = styled.div`
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-top: 60px;
  padding-top: 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 24px;
  }
`;

export const TrustItem = styled.div`
  text-align: center;
`;

export const TrustNumber = styled.span`
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary, #c9a962);
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const TrustLabel = styled.span`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
`;
