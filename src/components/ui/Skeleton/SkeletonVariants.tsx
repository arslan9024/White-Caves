import React from 'react';
import styled from 'styled-components';
import { Skeleton } from './Skeleton';

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
  gap: 0.5rem;
  width: 100%;
`;

interface SkeletonTextProps {
  lines?: number;
  lineHeight?: number;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({ lines = 3, lineHeight = 14 }) => (
  <Skeleton variant="text" lines={lines} height={lineHeight} />
);

interface SkeletonKPIProps {
  height?: number;
}

export const SkeletonKPI: React.FC<SkeletonKPIProps> = ({ height = 100 }) => (
  <Skeleton variant="card" height={height} borderRadius="12px" />
);

interface SkeletonCardProps {
  imageHeight?: number;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ imageHeight = 220 }) => (
  <>
    <Skeleton variant="rect" height={imageHeight} borderRadius="0" />
    <div style={{ padding: '0.9rem' }}>
      <Skeleton variant="text" width="70%" height={16} />
      <Skeleton variant="text" width="50%" height={14} />
      <Skeleton variant="text" width="40%" height={14} />
    </div>
  </>
);

interface SkeletonTableProps {
  rows?: number;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({ rows = 5 }) => (
  <TableWrapper
    role="status"
    aria-label="Loading table rows"
    aria-busy="true"
    data-testid="skeleton-table"
  >
    {Array.from({ length: rows }, (_, row) => (
      <TableRow key={row}>
        <Skeleton variant="rect" height={44} borderRadius="8px" />
        <Skeleton variant="rect" height={44} borderRadius="8px" />
        <Skeleton variant="rect" height={44} borderRadius="8px" />
        <Skeleton variant="rect" height={44} borderRadius="8px" />
        <Skeleton variant="rect" height={44} borderRadius="8px" />
        <Skeleton variant="rect" height={44} borderRadius="8px" />
      </TableRow>
    ))}
  </TableWrapper>
);
