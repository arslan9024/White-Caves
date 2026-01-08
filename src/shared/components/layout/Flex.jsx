import React from 'react';
import './layout.css';

const Flex = React.memo(({
  children,
  direction = 'row',
  wrap = 'nowrap',
  justify = 'flex-start',
  align = 'stretch',
  gap = 'medium',
  className = '',
  style = {},
  as: Component = 'div',
  ...props
}) => {
  const baseClass = 'wc-flex';
  const classes = [
    baseClass,
    `${baseClass}--${direction}`,
    `${baseClass}--gap-${gap}`,
    className
  ].filter(Boolean).join(' ');

  const flexStyle = {
    flexWrap: wrap,
    justifyContent: justify,
    alignItems: align,
    ...style
  };

  return (
    <Component className={classes} style={flexStyle} {...props}>
      {children}
    </Component>
  );
});

Flex.displayName = 'Flex';

export default Flex;
