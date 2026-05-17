import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface DataCardGridProps {
  columns?: number;
  gap?: string;
  children?: ReactNode;
}

const GridContainer = styled.div<{ $columns?: number; $gap?: string }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$columns || 4}, 1fr);
  gap: ${(props) => props.$gap || '1.5rem'};
  width: 100%;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

/**
 * DataCardGrid Component
 * Responsive grid layout for DataCard components
 * Default 4 columns on desktop, responsive on smaller screens
 */
const DataCardGrid: React.FC<DataCardGridProps> = ({ columns = 4, gap = '1.5rem', children }) => {
  return (
    <GridContainer $columns={columns} $gap={gap}>
      {children}
    </GridContainer>
  );
};

export default DataCardGrid;
