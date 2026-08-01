import React, { FC, ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';

export interface CavesButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
}

const StyledButton = styled.button<{ $variant: string; $size: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease-in-out;
  outline: none;
  font-family: inherit;

  /* Size Variants */
  padding: ${props => {
    switch (props.$size) {
      case 'small':
        return '6px 12px; font-size: 12px;';
      case 'large':
        return '14px 28px; font-size: 16px;';
      case 'medium':
      default:
        return '10px 20px; font-size: 14px;';
    }
  }};

  /* Color Variants */
  background-color: ${props => {
    switch (props.$variant) {
      case 'secondary':
        return 'var(--wc-text-primary, #1E293B)';
      case 'outline':
        return 'transparent';
      case 'danger':
      case 'primary':
      default:
        return 'var(--wc-red-primary, #EF4444)';
    }
  }};

  color: ${props => {
    switch (props.$variant) {
      case 'outline':
        return 'var(--wc-red-primary, #EF4444)';
      default:
        return 'var(--wc-text-inverse, #FFFFFF)';
    }
  }};

  border: ${props => {
    switch (props.$variant) {
      case 'outline':
        return '1px solid var(--wc-red-primary, #EF4444)';
      default:
        return 'none';
    }
  }};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
    opacity: 0.95;
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.35);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const CavesButton: FC<CavesButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <span>Loading...</span> : children}
    </StyledButton>
  );
};

export default CavesButton;
