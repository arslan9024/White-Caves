import React from 'react';
import './layout.css';

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
  const baseClass = 'wc-grid';
  const classes = [
    baseClass,
    `${baseClass}--gap-${gap}`,
    className
  ].filter(Boolean).join(' ');

  const gridStyle = {
    '--grid-cols-mobile': columns.mobile || 1,
    '--grid-cols-tablet': columns.tablet || 2,
    '--grid-cols-desktop': columns.desktop || columns.tablet || 3,
    alignItems,
    justifyItems,
    ...style
  };

  return (
    <div className={classes} style={gridStyle} {...props}>
      {children}
    </div>
  );
});

Grid.displayName = 'Grid';

export default Grid;
