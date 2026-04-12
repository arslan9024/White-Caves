import styled from 'styled-components';
import { colors } from '../styles/theme/colors';
import { typography } from '../styles/theme/typography';

export const StyledOnboardingGateway = styled.section`
  padding: var(--spacing-3xl, 6rem) 5%;
  background: var(--bg-secondary, #f5f5f5);

  [data-theme='dark'] & {
    background: #1a1a2e;
  }
`;

export const StyledGatewayContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const StyledGatewayHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-xl, 3rem);
`;

export const StyledGatewayTitle = styled.h2`
  font-family: ${typography.fontFamily.heading};
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary, #212121);
  margin-bottom: 0.75rem;

  [data-theme='dark'] & {
    color: #f7fafc;
  }
`;

export const StyledGatewaySubtitle = styled.p`
  font-family: ${typography.fontFamily.primary};
  font-size: 1.125rem;
  color: var(--text-muted, #757575);
  max-width: 500px;
  margin: 0 auto;

  [data-theme='dark'] & {
    color: #cbd5e0;
  }
`;

export const StyledGatewayDivider = styled.div`
  width: 80px;
  height: 4px;
  background: var(--primary-color, ${colors.primary});
  border-radius: var(--radius-full, 9999px);
  margin: 1.5rem auto 0;
`;

export const StyledRoleTilesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg, 2rem);

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const StyledOnboardingRoleTile = styled.div<{ $roleColor: string; $isSelected: boolean; $isFadingOut: boolean; $animationDelay?: string }>`
  background: var(--bg-primary, #ffffff);
  border: 2px solid var(--border-color, #e0e0e0);
  border-radius: var(--radius-xl, 1rem);
  padding: var(--tile-padding-lg, 2.5rem) var(--tile-padding, 2rem);
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.6s ease forwards;
  opacity: ${props => props.$isFadingOut ? 0.4 : 1};
  transform: ${props => props.$isFadingOut ? 'scale(0.95)' : 'scale(1)'};
  animation-delay: ${props => props.$animationDelay || '0ms'};
  border-color: ${props => props.$isSelected ? props.$roleColor : 'var(--border-color, #e0e0e0)'};
  box-shadow: ${props => props.$isSelected ? `0 0 0 3px rgba(${parseInt(props.$roleColor.slice(1, 3), 16)}, ${parseInt(props.$roleColor.slice(3, 5), 16)}, ${parseInt(props.$roleColor.slice(5, 7), 16)}, 0.2)` : 'none'};

  [data-theme='dark'] & {
    background: #2d3748;
    border-color: ${props => props.$isSelected ? props.$roleColor : '#4a5568'};
  }

  &:hover {
    border-color: ${props => props.$roleColor};
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const StyledTileAccentBar = styled.div<{ $roleColor: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: ${props => props.$roleColor};
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;

  ${StyledOnboardingRoleTile}:hover & {
    transform: scaleX(1);
  }
`;

export const StyledTileIconWrapper = styled.div<{ $backgroundColor: string }>`
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
  background-color: ${props => props.$backgroundColor};

  ${StyledOnboardingRoleTile}:hover & {
    transform: scale(1.1);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }
`;

export const StyledTileTextContent = styled.div`
  margin-bottom: 1.5rem;
`;

export const StyledTileTitle = styled.h3`
  font-family: ${typography.fontFamily.heading};
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary, #212121);
  margin-bottom: 0.5rem;

  [data-theme='dark'] & {
    color: #e2e8f0;
  }
`;

export const StyledTileSubtitle = styled.p<{ $roleColor: string }>`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.$roleColor};
  margin-bottom: 0.75rem;
`;

export const StyledTileDescription = styled.p`
  font-size: 0.875rem;
  color: var(--text-muted, #757575);
  line-height: 1.5;

  [data-theme='dark'] & {
    color: #cbd5e0;
  }
`;

export const StyledTileArrow = styled.div<{ $roleColor: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin: 0 auto;
  background: var(--bg-secondary, #f5f5f5);
  border-radius: 50%;
  color: var(--text-muted, #757575);
  transition: all 0.3s ease;

  [data-theme='dark'] & {
    background: #4a5568;
    color: #e2e8f0;
  }

  ${StyledOnboardingRoleTile}:hover & {
    background: ${props => props.$roleColor};
    color: #ffffff;
    transform: translateX(4px);
  }
`;

export const StyledGatewayFooter = styled.div`
  text-align: center;
  margin-top: var(--spacing-xl, 3rem);
  padding-top: var(--spacing-lg, 2rem);
  border-top: 1px solid var(--border-color, #e0e0e0);

  [data-theme='dark'] & {
    border-top-color: #4a5568;
  }
`;

export const StyledFooterText = styled.p`
  font-size: 0.95rem;
  color: var(--text-muted, #757575);

  [data-theme='dark'] & {
    color: #cbd5e0;
  }
`;

export const StyledFooterLink = styled.a`
  color: var(--primary-color, ${colors.primary});
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: var(--primary-dark, ${colors.primaryDark});
    text-decoration: underline;
  }
`;
