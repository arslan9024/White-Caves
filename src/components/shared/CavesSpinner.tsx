import React from 'react';
import styled, { keyframes } from 'styled-components';

const RED = '#EF4444';

export interface CavesSpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const SpinnerWrapper = styled.div<{ $size: number; $color: string }>`
  display: inline-block;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  border: 3px solid rgba(239, 68, 68, 0.15);
  border-top-color: ${props => props.$color};
  border-radius: 50%;
  animation: ${rotate} 0.8s linear infinite;
`;

export const CavesSpinner: React.FC<CavesSpinnerProps> = ({
  size = 28,
  color = RED,
  className = '',
}) => {
  return <SpinnerWrapper $size={size} $color={color} className={className} aria-label="Loading" />;
};

export default CavesSpinner;
