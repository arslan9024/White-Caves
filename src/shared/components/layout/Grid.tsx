import React from 'react';
import { StyledGrid } from './Grid.styles';

export interface GridColumns {
  mobile?: number;
  tablet?: number;
  desktop?: number;
}

/** Allowed gap sizes (matches Grid.styles.ts GapSize) */
export type GridGapSize = 'none' | 'small' | 'medium' | 'large';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Child elements to render in the grid */
  children?: React.ReactNode;
  /** Responsive column counts */
  columns?: GridColumns;
  /** Gap size token */
  gap?: GridGapSize;
  /** CSS align-items value */
  alignItems?: string;
  /** CSS justify-items value */
  justifyItems?: string;
}

const Grid = React.memo<GridProps>(({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'medium',
  alignItems = 'stretch',
  justifyItems = 'stretch',
  className = '',
  style = {},
  ...props
}) => {
  return (
    <StyledGrid
      $gap={gap}
      $alignItems={alignItems}
      $justifyItems={justifyItems}
      $colsMobile={columns.mobile}
      $colsTablet={columns.tablet}
      $colsDesktop={columns.desktop}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </StyledGrid>
  );
});

Grid.displayName = 'Grid';

export default Grid;
