import styled, { keyframes } from 'styled-components';
import { radius } from '../../styles/theme/radius';

// Keyframes
const trendUp = keyframes`
  0% {
    transform: translateY(4px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

const trendDown = keyframes`
  0% {
    transform: translateY(-4px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

// Enhanced Stat Card
export const StatCardWrapper = styled.div<{ $backgroundColor: string; $borderColor: string; $isClickable?: boolean }>`
  background: ${props => props.$backgroundColor};
  border-radius: ${radius.xl};
  border-left: 4px solid ${props => props.$borderColor};
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  overflow: hidden;
  cursor: ${props => props.$isClickable ? 'pointer' : 'default'};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.5) 0%,
      rgba(255, 255, 255, 0) 100%
    );
    pointer-events: none;
    border-radius: ${radius.xl};
  }

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }

  ${props => props.$isClickable && `
    &:hover {
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
      transform: translateY(-4px);
    }
  `}

  @media (prefers-color-scheme: dark) {
    background: rgba(30, 30, 30, 0.9);
    color: rgba(255, 255, 255, 0.9);

    &::before {
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.1) 0%,
        rgba(255, 255, 255, 0) 100%
      );
    }
  }

  @media (max-width: 768px) {
    padding: 16px;
    gap: 10px;
  }
`;

// Header
export const StatCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

export const StatCardLabel = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;

  svg {
    margin-right: 8px;
    flex-shrink: 0;
  }

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.7);
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

// Trend Icon
export const TrendIcon = styled.svg<{ $trendType?: 'up' | 'down' | 'stable' }>`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: ${props => {
    switch (props.$trendType) {
      case 'up': return '#10B981';
      case 'down': return '#EF4444';
      default: return '#6B7280';
    }
  }};
  animation: ${props => props.$trendType === 'up' ? trendUp : props.$trendType === 'down' ? trendDown : 'none'} 0.6s ease-out;
`;

// Value Section
export const StatCardValue = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

export const StatValue = styled.div<{ $color?: string }>`
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: ${props => props.$color || 'inherit'};

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

export const StatUnit = styled.span`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.5);
  font-weight: 500;

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.5);
  }
`;

// Footer Section
export const StatCardFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 4px;
`;

// Sparkline
export const Sparkline = styled.svg`
  width: 100%;
  height: 30px;
  max-width: 100%;
`;

export const SparklinePath = styled.polyline`
  stroke: rgba(59, 130, 246, 0.8);
  stroke-width: 2;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

export const SparklineFill = styled.polyline`
  stroke: rgba(59, 130, 246, 0);
  stroke-width: 0;
  fill: rgba(59, 130, 246, 0.15);
`;

// Comparison
export const StatCardComparison = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
`;

export const ChangeValue = styled.span<{ $color?: string }>`
  font-weight: 600;
  font-size: 13px;
  color: ${props => props.$color || 'inherit'};
`;

export const ComparisonText = styled.span`
  color: rgba(0, 0, 0, 0.5);
  font-size: 12px;

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.5);
  }
`;
