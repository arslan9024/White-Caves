import React from 'react';
import './Button.css';

const Button = React.memo(({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  type = 'button',
  className = '',
  onClick,
  ...props
}) => {
  const baseClass = 'wc-btn';
  const classes = [
    baseClass,
    `${baseClass}--${variant}`,
    `${baseClass}--${size}`,
    fullWidth && `${baseClass}--full-width`,
    loading && `${baseClass}--loading`,
    disabled && `${baseClass}--disabled`,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <span className={`${baseClass}__spinner`} />}
      {icon && iconPosition === 'left' && <span className={`${baseClass}__icon`}>{icon}</span>}
      <span className={`${baseClass}__text`}>{children}</span>
      {icon && iconPosition === 'right' && <span className={`${baseClass}__icon`}>{icon}</span>}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
