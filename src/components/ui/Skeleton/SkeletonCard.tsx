import React from 'react';
import { Skeleton } from './Skeleton';
import styled from 'styled-components';

const CardWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--background);
`;

const SpacedLine = styled.div`
  margin-top: 8px;
`;

const CardContent = styled.div`
  padding: 0.75rem;
`;

export const SkeletonCard: React.FC<{ imageHeight?: number }> = ({ imageHeight = 220 }) => (
  <CardWrapper data-testid="skeleton-card">
    <Skeleton variant="rect" width="100%" height={imageHeight} animated />
    <CardContent>
      <Skeleton width="60%" height={16} animated />
      <SpacedLine>
        <Skeleton width="80%" height={14} animated />
      </SpacedLine>
      <SpacedLine>
        <Skeleton width="40%" height={14} animated />
      </SpacedLine>
    </CardContent>
  </CardWrapper>
);

export default SkeletonCard;
