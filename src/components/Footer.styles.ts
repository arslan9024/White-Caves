import styled from 'styled-components';
import { transitions } from '../styles/theme/transitions';
import { typography } from '../styles/theme/typography';
import { radius } from '../styles/theme/radius';

export const FooterContainer = styled.footer`
  background: linear-gradient(180deg, #111827 0%, #0a0f1e 100%);
  color: white;
  padding: 0;
  position: relative;

  /* Luxury top accent stripe */
  &::before {
    content: '';
    display: block;
    height: 3px;
    background: linear-gradient(90deg, #dc2626 0%, #d97706 50%, #dc2626 100%);
  }
`;

export const FooterContent = styled.div`
  max-width: 1360px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.6fr repeat(4, 1fr);
  gap: 3rem;
  padding: 4rem 2rem 3rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1.6fr repeat(2, 1fr);
    gap: 2.5rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
    padding: 3rem 1.5rem 2rem;
  }
`;

export const FooterBrand = styled.div`
  padding-right: 1.5rem;
  border-right: 1px solid rgba(255, 255, 255, 0.07);

  @media (max-width: 1200px) {
    grid-column: 1 / -1;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    padding-right: 0;
    padding-bottom: 2rem;
  }

  @media (max-width: 768px) {
    padding-right: 0;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    padding-bottom: 1.5rem;
  }
`;

export const FooterLogo = styled.img`
  height: 64px;
  width: auto;
  object-fit: contain;
  margin-bottom: 1rem;
  border-radius: ${radius.lg};
  border: 2px solid rgba(220, 38, 38, 0.25);
`;

export const FooterTagline = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 1.5rem;
  line-height: 1.7;
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
  border-radius: ${radius.md};
  font-size: 0.8rem;
  font-weight: ${typography.weights.semibold};
  text-decoration: none;
  color: white;
  transition: ${transitions.hover};
  background: ${props => {
    switch (props.$platform) {
      case 'whatsapp':
        return '#25D366';
      case 'botim':
        return '#00C853';
      case 'gochat':
        return '#FF6B00';
      default:
        return '#666';
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
    font-size: 0.95rem;
    font-weight: ${typography.weights.bold};
    margin-bottom: 1.25rem;
    position: relative;
    padding-bottom: 0.75rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 28px;
      height: 2px;
      background: linear-gradient(90deg, #dc2626, #d97706);
      border-radius: 2px;

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
    margin-bottom: 0.6rem;
  }

  a {
    color: rgba(255, 255, 255, 0.6);
    text-decoration: none;
    font-size: 0.875rem;
    transition: ${transitions.hover};
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;

    &::before {
      content: '›';
      color: #dc2626;
      opacity: 0;
      transform: translateX(-4px);
      transition: all 0.2s ease;
      font-size: 1rem;
      line-height: 1;
    }

    &:hover {
      color: white;
      padding-left: 4px;

      &::before {
        opacity: 1;
        transform: translateX(0);
      }

      @media (max-width: 768px) {
        padding-left: 0;
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
    color: #e31e24;
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
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.65rem;
  background: ${props =>
    props.type === 'dld' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(220, 38, 38, 0.15)'};
  border: 1px solid
    ${props => (props.type === 'dld' ? 'rgba(59, 130, 246, 0.35)' : 'rgba(220, 38, 38, 0.35)')};
  border-radius: ${radius.sm};
  font-size: 0.7rem;
  font-weight: ${typography.weights.semibold};
  color: ${props => (props.type === 'dld' ? '#93c5fd' : '#fca5a5')};
  margin-right: 0.4rem;
  margin-bottom: 0.4rem;
  letter-spacing: 0.03em;
`;

export const FooterBottom = styled.div`
  background: rgba(0, 0, 0, 0.4);
  padding: 1.25rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
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
