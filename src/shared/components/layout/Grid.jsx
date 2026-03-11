import React from 'react';
import { StyledGrid } from './Grid.styles';

const Grid = React.memo(({
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
