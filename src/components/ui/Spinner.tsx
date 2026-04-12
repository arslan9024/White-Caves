/**
 * Spinner / Loading Component
 * ==========================
 * Professional loading spinner with multiple variants
 */

import React, { FC, memo } from 'react';
import styled from 'styled-components';
import { SpinnerProps, SpinnerVariant, SpinnerSize } from './advancedUI.types';
import { spacing } from '../../styles/theme/spacing';

// ============================================================================
// STYLES
// ============================================================================

const SpinnerContainer = styled.div<{
  $size: SpinnerSize;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  ${(props) => {
    switch (props.$size) {
      case 'small':
        return 'width: 24px; height: 24px;';
      case 'large':
        return 'width: 48px; height: 48px;';
      default:
        return 'width: 36px; height: 36px;';
    }
  }}
`;

// Default spinner animation
const DefaultSpinner = styled.div<{ $color?: string; $size: SpinnerSize }>`
  position: relative;
  width: 100%;
  height: 100%;

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border: 3px solid #f3f3f3;
    border-top: 3px solid ${(props) => props.$color || '#0066cc'};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Dots spinner animation
const DotsSpinner = styled.div<{ $color?: string; $size: SpinnerSize }>`
  display: flex;
  gap: ${spacing.xs};
  align-items: center;
  justify-content: center;
  height: 100%;

  span {
    width: ${(props) => {
      switch (props.$size) {
        case 'small':
          return '4px';
        case 'large':
          return '12px';
        default:
          return '8px';
      }
    }};
    height: ${(props) => {
      switch (props.$size) {
        case 'small':
          return '4px';
        case 'large':
          return '12px';
        default:
          return '8px';
      }
    }};
    background-color: ${(props) => props.$color || '#0066cc'};
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }

    &:nth-child(2) {
      animation-delay: -0.16s;
    }
  }

  @keyframes bounce {
    0%,
    80%,
    100% {
      transform: scale(0);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

// Bounce spinner animation
const BounceSpinner = styled.div<{ $color?: string; $size: SpinnerSize }>`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    position: absolute;
    width: ${(props) => {
      switch (props.$size) {
        case 'small':
          return '6px';
        case 'large':
          return '14px';
        default:
          return '10px';
      }
    }};
    height: ${(props) => {
      switch (props.$size) {
        case 'small':
          return '6px';
        case 'large':
          return '14px';
        default:
          return '10px';
      }
    }};
    background-color: ${(props) => props.$color || '#0066cc'};
    border-radius: 50%;
    opacity: 0.6;
    animation: bounce-scale 2s infinite ease-in-out;

    &:nth-child(1) {
      left: 0;
      animation-delay: 0s;
    }

    &:nth-child(2) {
      left: 50%;
      transform: translateX(-50%);
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      right: 0;
      animation-delay: 0.4s;
    }
  }

  @keyframes bounce-scale {
    0%,
    100% {
      transform: scale(0.8);
    }
    50% {
      transform: scale(1.2);
    }
  }
`;

// Pulse spinner animation
const PulseSpinner = styled.div<{ $color?: string; $size: SpinnerSize }>`
  position: relative;
  width: 100%;
  height: 100%;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: ${(props) => props.$color || '#0066cc'};
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.1);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const LoadingText = styled.div<{ $size: SpinnerSize }>`
  font-size: ${(props) => {
    switch (props.$size) {
      case 'small':
        return '11px';
      case 'large':
        return '14px';
      default:
        return '12px';
    }
  }};
  color: #666;
  text-align: center;
`;

// ============================================================================
// COMPONENT
// ============================================================================

const Spinner: FC<SpinnerProps> = memo(function Spinner({
  variant = 'default',
  size = 'medium',
  color,
  label,
  className = '',
}) {
  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <DotsSpinner $color={color} $size={size}>
            <span />
            <span />
            <span />
          </DotsSpinner>
        );
      case 'bounce':
        return (
          <BounceSpinner $color={color} $size={size}>
            <span />
            <span />
            <span />
          </BounceSpinner>
        );
      case 'pulse':
        return <PulseSpinner $color={color} $size={size} />;
      default:
        return <DefaultSpinner $color={color} $size={size} />;
    }
  };

  return (
    <SpinnerContainer $size={size} className={className} role="status" aria-live="polite">
      {renderSpinner()}
      {label && <LoadingText $size={size}>{label}</LoadingText>}
    </SpinnerContainer>
  );
});

export default Spinner;
