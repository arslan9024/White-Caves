import React from 'react';
import './Button.css';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  /** Button content */
  children?: React.ReactNode;
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link' | string;
  /** Button size */
  size?: 'small' | 'medium' | 'large';
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether the button shows a loading spinner */
  loading?: boolean;
  /** Whether the button takes full width */
  fullWidth?: boolean;
  /** Icon element to render alongside text */
  icon?: React.ReactNode;
  /** Icon position relative to text */
  iconPosition?: 'left' | 'right';
  /** HTML button type */
  type?: 'button' | 'submit' | 'reset';
  /** Click handler */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button = React.memo<ButtonProps>(({
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
