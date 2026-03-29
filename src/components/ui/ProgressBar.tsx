/**
 * Progress Bar Component
 * ======================
 * Visual progress indicator with support for determinate and indeterminate states.
 */

import React from 'react';
import styled from 'styled-components';

export type ProgressVariant =
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

export interface ProgressBarProps {
  value?: number; // 0-100, if not provided = indeterminate
  variant?: ProgressVariant;
  showLabel?: boolean;
  animated?: boolean;
  striped?: boolean;
  size?: 'small' | 'medium' | 'large';
  ariaLabel?: string;
}

const ProgressContainer = styled.div<{ $size: string }>`
  width: 100%;
  height: ${props => {
    switch (props.$size) {
      case 'small':
        return '4px';
      case 'large':
        return '12px';
      case 'medium':
      default:
        return '8px';
    }
  }};
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

const ProgressBarFill = styled.div<{
  $value: number;
  $variant: ProgressVariant;
  $isIndeterminate: boolean;
  $animated: boolean;
  $striped: boolean;
}>`
  height: 100%;
  width: ${props => (props.$isIndeterminate ? '30%' : `${props.$value}%`)};
  transition: ${props => (props.$animated ? 'width 0.6s ease' : 'none')};
  border-radius: 4px;
  position: relative;

  ${props => {
    switch (props.$variant) {
      case 'success':
        return 'background-color: #10b981;';
      case 'warning':
        return 'background-color: #f59e0b;';
      case 'error':
        return 'background-color: #ef4444;';
      case 'info':
        return 'background-color: #06b6d4;';
      case 'primary':
      default:
        return 'background-color: #3b82f6;';
    }
  }}

  ${props =>
    props.$striped &&
    `
    background-image: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.15) 75%,
      transparent 75%,
      transparent
    );
    background-size: 16px 16px;
  `}

  ${props =>
    props.$animated &&
    `
    animation: progress-animation 2s linear infinite;

    @keyframes progress-animation {
      0% {
        background-position: 0 0;
      }
      100% {
        background-position: 16px 16px;
      }
    }
  `}

  ${props =>
    props.$isIndeterminate &&
    `
    animation: indeterminate 1.5s ease-in-out infinite;

    @keyframes indeterminate {
      0% {
        left: -30%;
      }
      50% {
        left: 100%;
      }
      100% {
        left: 100%;
      }
    }
  `}
`;

const ProgressLabel = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
`;

const ProgressWrapper = styled.div`
  width: 100%;
`;

/**
 * Progress Bar Component
 * Visual indicator of progress with multiple styles
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  variant = 'primary',
  showLabel = true,
  animated = true,
  striped = false,
  size = 'medium',
  ariaLabel,
}) => {
  const isIndeterminate = value === undefined;
  const normalizedValue = Math.min(Math.max(value || 0, 0), 100);

  return (
    <ProgressWrapper
      role="progressbar"
      aria-valuenow={isIndeterminate ? undefined : normalizedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel || 'Progress'}
    >
      <ProgressContainer $size={size}>
        <ProgressBarFill
          $value={normalizedValue}
          $variant={variant}
          $isIndeterminate={isIndeterminate}
          $animated={animated || isIndeterminate}
          $striped={striped}
        >
          {showLabel && !isIndeterminate && (
            <ProgressLabel>{normalizedValue}%</ProgressLabel>
          )}
        </ProgressBarFill>
      </ProgressContainer>
    </ProgressWrapper>
  );
};

export default ProgressBar;
