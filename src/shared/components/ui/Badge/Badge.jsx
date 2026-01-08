import React from 'react';
import './Badge.css';

const Badge = React.memo(({
  children,
  variant = 'default',
  size = 'medium',
  dot = false,
  rounded = false,
  className = '',
  ...props
}) => {
  const baseClass = 'wc-badge';
  const classes = [
    baseClass,
    `${baseClass}--${variant}`,
    `${baseClass}--${size}`,
    dot && `${baseClass}--dot`,
    rounded && `${baseClass}--rounded`,
    className
  ].filter(Boolean).join(' ');

  if (dot) {
    return <span className={classes} {...props} />;
  }

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;
