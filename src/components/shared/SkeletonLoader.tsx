/**
 * Skeleton Loader Component
 * Shows placeholder while content is loading
 */

import React from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const SkeletonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
`;

const SkeletonLine = styled.div<{ width?: string; height?: string }>`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '16px'};
  background-color: #e0e0e0;
  border-radius: 4px;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const SkeletonCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  animation: ${pulse} 2s ease-in-out infinite;
`;

interface SkeletonLoaderProps {
  count?: number;
  type?: 'line' | 'card' | 'grid';
  lines?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  count = 1,
  type = 'line',
  lines = 3,
}) => {
  if (type === 'card') {
    return (
      <SkeletonWrapper>
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i}>
            <SkeletonLine width="80%" height="20px" />
            <SkeletonLine width="100%" height="16px" style={{ marginTop: '0.5rem' }} />
            <SkeletonLine width="60%" height="16px" style={{ marginTop: '0.5rem' }} />
          </SkeletonCard>
        ))}
      </SkeletonWrapper>
    );
  }

  if (type === 'grid') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i}>
            <SkeletonLine width="100%" height="24px" />
            <SkeletonLine width="100%" height="16px" style={{ marginTop: '0.5rem' }} />
            <SkeletonLine width="80%" height="16px" style={{ marginTop: '0.5rem' }} />
          </SkeletonCard>
        ))}
      </div>
    );
  }

  return (
    <SkeletonWrapper>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          {Array.from({ length: lines }).map((_, j) => (
            <SkeletonLine
              key={j}
              width={j === lines - 1 ? '80%' : '100%'}
              style={{ marginBottom: j < lines - 1 ? '0.5rem' : 0 }}
            />
          ))}
        </div>
      ))}
    </SkeletonWrapper>
  );
};
