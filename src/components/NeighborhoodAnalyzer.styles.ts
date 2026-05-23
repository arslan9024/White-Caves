import styled from 'styled-components';
import { typography } from '../styles/theme/typography';
import { transitions } from '../styles/theme/transitions';
import { radius } from '../styles/theme/radius';

export const NeighborhoodAnalyzerContainer = styled.div`
  padding: 3rem 5%;
  background: var(--bg-primary, #ffffff);

  @media (max-width: 768px) {
    padding: 1.5rem 5%;
  }
`;

export const AnalyzerHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

export const AnalyzerTitle = styled.h2`
  font-family: ${typography.fontFamily.heading};
  font-size: 2rem;
  color: var(--primary-color, #1a365d);
  margin-bottom: 0.5rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const AnalyzerSubtitle = styled.p`
  color: var(--text-muted, #718096);
  margin: 0;
`;

export const AreaSelector = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

export const AreaButton = styled.button<{ $isActive?: boolean }>`
  padding: 0.75rem 1.5rem;
  background: ${props =>
    props.$isActive ? 'var(--primary-color, #1a365d)' : 'var(--bg-light, #f7fafc)'};
  border: 2px solid ${props => (props.$isActive ? 'var(--primary-color, #1a365d)' : 'transparent')};
  border-radius: ${radius.full};
  font-family: ${typography.fontFamily.primary};
  font-size: 0.9rem;
  font-weight: ${typography.weights.medium};
  color: ${props =>
    props.$isActive ? 'var(--text-on-primary, #ffffff)' : 'var(--text-primary, #1a202c)'};
  cursor: pointer;
  transition: ${transitions.hover};

  &:hover {
    border-color: var(--primary-color, #1a365d);
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.85rem;
  }
`;

export const AnalyzerContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const AreaHero = styled.div<{ $backgroundImage: string }>`
  height: 300px;
  border-radius: 0.75rem;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-image: url(${props => props.$backgroundImage});
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    height: 200px;
  }
`;

export const HeroOverlay = styled.div`
  height: 100%;
  background: linear-gradient(
    to right,
    rgba(26, 54, 93, 0.9) 0%,
    rgba(26, 54, 93, 0.6) 50%,
    transparent 100%
  );
  display: flex;
  align-items: center;
  padding: 0 3rem;

  @media (max-width: 768px) {
    padding: 0 1.5rem;
  }
`;

export const HeroContent = styled.div`
  max-width: 500px;
  color: var(--text-on-primary, #ffffff);
`;

export const HeroTitle = styled.h3`
  font-family: ${typography.fontFamily.heading};
  font-size: 2.5rem;
  margin-bottom: 1rem;
  margin: 0 0 1rem 0;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

export const HeroDescription = styled.p`
  font-size: 1rem;
  opacity: 0.95;
  margin-bottom: 1.5rem;
  margin: 0 0 1.5rem 0;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

export const HeroBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

export const Badge = styled.span<{
  $variant?: 'score' | 'grade' | 'trend';
  $score?: string;
  $trend?: 'rising' | 'stable' | 'declining';
}>`
  padding: 0.5rem 1rem;
  border-radius: ${radius.full};
  font-size: 0.85rem;
  font-weight: ${typography.weights.semibold};
  color: white;

  ${props => {
    if (props.$variant === 'score') {
      switch (props.$score) {
        case 'excellent':
          return 'background: var(--success-color, #38a169);';
        case 'good':
          return 'background: #4299e1;';
        case 'fair':
          return 'background: var(--warning-color, #dd6b20);';
        default:
          return 'background: var(--success-color, #38a169);';
      }
    }
    if (props.$variant === 'grade') {
      return 'background: var(--accent-gold, #E31E24); color: #1a1a1a;';
    }
    if (props.$variant === 'trend') {
      if (props.$trend === 'rising') return 'background: var(--success-color, #38a169);';
      if (props.$trend === 'declining') return 'background: #EF4444;';
      return 'background: rgba(255,255,255,0.2);';
    }
  }}
`;

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const MetricCard = styled.div<{ $isPrimary?: boolean }>`
  background: ${props =>
    props.$isPrimary ? 'var(--primary-color, #1a365d)' : 'var(--bg-light, #f7fafc)'};
  color: ${props => (props.$isPrimary ? 'white' : 'inherit')};
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid ${props => (props.$isPrimary ? 'transparent' : 'var(--border-light, #edf2f7)')};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const MetricLabel = styled.span`
  font-size: 0.85rem;
  font-weight: ${typography.weights.medium};
  opacity: 0.7;
`;

export const MetricValue = styled.span`
  font-size: 1.75rem;
  font-weight: ${typography.weights.bold};
`;

export const InsightsSection = styled.div`
  background: var(--bg-light, #f7fafc);
  padding: 2rem;
  border-radius: 0.75rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const InsightsTitle = styled.h4`
  font-family: ${typography.fontFamily.heading};
  font-size: 1.1rem;
  margin-bottom: 1rem;
  margin: 0 0 1rem 0;
`;

export const InsightsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const InsightItem = styled.li`
  display: flex;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: var(--text-primary);

  &::before {
    content: '✓';
    color: var(--success-color, #38a169);
    font-weight: ${typography.weights.bold};
    flex-shrink: 0;
  }
`;

export const RisksSection = styled.div`
  background: #fff5f5;
  padding: 2rem;
  border-radius: 0.75rem;
  border-left: 4px solid #ef4444;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const RisksTitle = styled.h4`
  font-family: ${typography.fontFamily.heading};
  font-size: 1.1rem;
  margin-bottom: 1rem;
  margin: 0 0 1rem 0;
  color: #c53030;
`;

export const RisksList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const RiskItem = styled.li`
  display: flex;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: var(--text-primary);

  &::before {
    content: '⚠';
    font-weight: ${typography.weights.bold};
    flex-shrink: 0;
  }
`;

export const SectionDivider = styled.hr`
  border: none;
  border-top: 1px solid var(--border-color, #e2e8f0);
  margin: 2rem 0;
`;

// Responsive wrapper for full-width sections
export const ResponsiveSection = styled.div`
  margin: 0 -5%;
  padding: 2rem 5%;
  background: var(--bg-secondary);
`;
