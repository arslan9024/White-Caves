import React from 'react';
import './Badge.css';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Badge content */
  children?: React.ReactNode;
  /** Visual variant */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | string;
  /** Badge size */
  size?: 'small' | 'medium' | 'large';
  /** Render as a small dot with no content */
  dot?: boolean;
  /** Use fully rounded (pill) shape */
  rounded?: boolean;
}

const Badge = React.memo<BadgeProps>(({
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
