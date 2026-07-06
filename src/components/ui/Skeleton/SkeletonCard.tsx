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

export const SkeletonCard: React.FC<{ imageHeight?: number }> = ({ imageHeight = 220 }) => (
  <CardWrapper data-testid="skeleton-card">
    <Skeleton variant="rect" width="100%" height={imageHeight} animated />
    <div style={{ padding: '0.75rem' }}>
      <Skeleton width="60%" height={16} animated />
      <Skeleton width="80%" height={14} style={{ marginTop: 8 }} animated />
      <Skeleton width="40%" height={14} style={{ marginTop: 8 }} animated />
    </div>
  </CardWrapper>
);

export default SkeletonCard;
