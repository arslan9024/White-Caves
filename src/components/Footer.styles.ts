import styled from 'styled-components';
import { transitions } from '../styles/theme/transitions';

export const FooterContainer = styled.footer`
  background: linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%);
  color: white;
  padding: 4rem 0 0;
`;

export const FooterContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.5fr repeat(4, 1fr);
  gap: 2.5rem;
  padding: 0 2rem 3rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1.5fr repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
    padding: 0 1.5rem 2rem;
  }
`;

export const FooterBrand = styled.div`
  padding-right: 2rem;

  @media (max-width: 768px) {
    padding-right: 0;
  }
`;

export const FooterLogo = styled.img`
  height: 70px;
  width: auto;
  object-fit: contain;
  margin-bottom: 1rem;
  border-radius: 8px;
`;

export const FooterTagline = styled.p`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

export const FooterContact = styled.div`
  margin-bottom: 1.5rem;

  p {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.5;

    @media (max-width: 768px) {
      justify-content: center;
    }
  }
`;

export const ContactIcon = styled.span`
  font-size: 1rem;
  flex-shrink: 0;
`;

export const FooterApps = styled.div`
  margin-top: 1.5rem;
`;

export const AppsTitle = styled.p`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.75rem;
`;

export const AppButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

export const AppBtn = styled.a<{ $platform?: 'whatsapp' | 'botim' | 'gochat' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  color: white;
  transition: ${transitions.hover};
  background: ${props => {
    switch (props.$platform) {
      case 'whatsapp': return '#25D366';
      case 'botim': return '#00C853';
      case 'gochat': return '#FF6B00';
      default: return '#666';
    }
  }};

  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }
`;

export const FooterSection = styled.div`
  h3 {
    color: white;
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 1.25rem;
    position: relative;
    padding-bottom: 0.75rem;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 30px;
      height: 2px;
      background: var(--color-primary, #D4AF37);

      @media (max-width: 768px) {
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  ul li {
    margin-bottom: 0.75rem;
  }

  a {
    color: rgba(255, 255, 255, 0.75);
    text-decoration: none;
    font-size: 0.9rem;
    transition: ${transitions.hover};
    display: inline-block;

    &:hover {
      color: white;
      transform: translateX(3px);

      @media (max-width: 768px) {
        transform: none;
      }
    }
  }
`;

export const FooterRating = styled.div`
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  p {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 0.5rem;
  }
`;

export const StarRatingFooter = styled.div`
  a {
    color: #FFB300;
    font-size: 1.5rem;
    text-decoration: none;
    letter-spacing: 2px;
    transition: transform 0.2s;
    display: inline-block;

    &:hover {
      transform: scale(1.1);
    }
  }
`;

export const FooterRERA = styled.div`
  margin-top: 1rem;
`;

export const Badge = styled.span<{ type?: 'rera' | 'dld' }>`
  display: inline-block;
  padding: 0.375rem 0.75rem;
  background: ${props => props.type === 'dld' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(220, 38, 38, 0.2)'};
  border: 1px solid ${props => props.type === 'dld' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(220, 38, 38, 0.4)'};
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.type === 'dld' ? '#60A5FA' : '#FF6B6B'};
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
`;

export const FooterBottom = styled.div`
  background: rgba(0, 0, 0, 0.3);
  padding: 1.5rem 2rem;
`;

export const FooterBottomContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }

  p {
    margin: 0;
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.6);
  }
`;

export const FooterLegal = styled.div`
  display: flex;
  gap: 1.5rem;

  @media (max-width: 768px) {
    justify-content: center;
  }

  a {
    color: rgba(255, 255, 255, 0.6);
    text-decoration: none;
    font-size: 0.85rem;
    transition: color 0.2s;

    &:hover {
      color: white;
    }
  }
`;
