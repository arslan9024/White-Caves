import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const SkeletonWrapper = styled.div<{
  $width?: string;
  $height?: string;
  $borderRadius?: string;
  $margin?: string;
}>`
  width: ${props => props.$width || '100%'};
  height: ${props => props.$height || '20px'};
  margin: ${props => props.$margin || '0'};
  border-radius: ${props => props.$borderRadius || '8px'};
  background: rgba(241, 245, 249, 0.8);
  background-image: linear-gradient(
    90deg,
    rgba(241, 245, 249, 0.6) 0%,
    rgba(226, 232, 240, 0.9) 50%,
    rgba(241, 245, 249, 0.6) 100%
  );
  background-repeat: no-repeat;
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s infinite cubic-bezier(0.4, 0, 0.2, 1) forwards;
`;

export interface SkeletonLoaderProps {
  variant?: 'text' | 'circular' | 'card' | 'tableRow' | 'custom';
  width?: string;
  height?: string;
  borderRadius?: string;
  margin?: string;
  className?: string;
  rows?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'custom',
  width,
  height,
  borderRadius,
  margin,
  className,
  rows = 1,
}) => {
  let resolvedWidth = width;
  let resolvedHeight = height;
  let resolvedRadius = borderRadius;

  switch (variant) {
    case 'circular':
      resolvedWidth = width || '44px';
      resolvedHeight = height || '44px';
      resolvedRadius = '50%';
      break;
    case 'text':
      resolvedHeight = height || '16px';
      resolvedRadius = '4px';
      break;
    case 'card':
      resolvedHeight = height || '220px';
      resolvedRadius = '16px';
      break;
    case 'tableRow':
      resolvedHeight = height || '48px';
      resolvedRadius = '6px';
      break;
    default:
      break;
  }

  if (rows > 1) {
    return (
      <div
        className={className}
        data-testid="skeleton-group"
        style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
      >
        {Array.from({ length: rows }).map((_, index) => (
          <SkeletonWrapper
            key={index}
            data-testid="skeleton-item"
            $width={resolvedWidth}
            $height={resolvedHeight}
            $borderRadius={resolvedRadius}
            $margin={margin}
          />
        ))}
      </div>
    );
  }

  return (
    <SkeletonWrapper
      data-testid="skeleton-item"
      $width={resolvedWidth}
      $height={resolvedHeight}
      $borderRadius={resolvedRadius}
      $margin={margin}
      className={className}
    />
  );
};

export default SkeletonLoader;
