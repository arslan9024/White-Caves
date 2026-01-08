import React from 'react';
import './layout.css';

const Container = React.memo(({
  children,
  size = 'default',
  fluid = false,
  className = '',
  ...props
}) => {
  const baseClass = 'wc-container';
  const classes = [
    baseClass,
    fluid ? `${baseClass}--fluid` : `${baseClass}--${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
});

Container.displayName = 'Container';

export default Container;
