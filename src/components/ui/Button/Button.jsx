import React, { useState } from 'react';
import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon = null,
  iconPosition = 'left',
  gradient = false,
  onClick,
  className = '',
  ...props
}) => {
  const [ripple, setRipple] = useState({ show: false, x: 0, y: 0 });

  const handleClick = (e) => {
    if (disabled || loading) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setRipple({ show: true, x, y });
    setTimeout(() => setRipple({ show: false, x: 0, y: 0 }), 500);
    
    onClick?.(e);
  };

  const buttonClasses = [
    'wc-button',
    `wc-button--${variant}`,
    `wc-button--${size}`,
    gradient && 'wc-button--gradient',
    fullWidth && 'wc-button--full-width',
    loading && 'wc-button--loading',
    disabled && 'wc-button--disabled',
    icon && !children && 'wc-button--icon-only',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {ripple.show && (
        <span 
          className="wc-button__ripple"
          style={{ left: ripple.x, top: ripple.y }}
        />
      )}
      
      {loading && (
        <span className="wc-button__spinner">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="10" />
          </svg>
        </span>
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className="wc-button__icon wc-button__icon--left">{icon}</span>
      )}
      
      {children && <span className="wc-button__content">{children}</span>}
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="wc-button__icon wc-button__icon--right">{icon}</span>
      )}
    </button>
  );
};

export default Button;
