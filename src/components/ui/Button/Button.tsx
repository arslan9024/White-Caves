import React, { useState, type ReactNode } from 'react';
import {
  StyledButton,
  ButtonContent,
  ButtonIcon,
  ButtonSpinner,
  ButtonRipple
} from './Button.styles';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  gradient?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
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

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setRipple({ show: true, x, y });
    setTimeout(() => setRipple({ show: false, x: 0, y: 0 }), 500);
    
    onClick?.(e);
  };

  return (
    <StyledButton
      type={type}
      $variant={variant}
      $size={size}
      $gradient={gradient}
      $fullWidth={fullWidth}
      $loading={loading}
      $disabled={disabled || loading}
      disabled={disabled || loading}
      onClick={handleClick}
      className={className}
      {...props}
    >
      {ripple.show && (
        <ButtonRipple
          style={{ left: ripple.x, top: ripple.y }}
        />
      )}
      
      {loading && (
        <ButtonSpinner>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="10" />
          </svg>
        </ButtonSpinner>
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <ButtonIcon>{icon}</ButtonIcon>
      )}
      
      {children && <ButtonContent>{children}</ButtonContent>}
      
      {!loading && icon && iconPosition === 'right' && (
        <ButtonIcon>{icon}</ButtonIcon>
      )}
    </StyledButton>
  );
};

export default Button;
