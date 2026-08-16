import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const pulseShimmer = keyframes`
  0% { opacity: 0.4; }
  50% { opacity: 0.8; }
  100% { opacity: 0.4; }
`;

const SkeletonCard = styled.div`
  width: 100%;
  height: 240px;
  background: #1E293B;
  border-radius: 12px;
  animation: ${pulseShimmer} 1.5s infinite ease-in-out;
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

export const SkeletonUiLoader: FC = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }} data-testid="skeleton-ui-loader">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
};

export default SkeletonUiLoader;
