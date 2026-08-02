import React from 'react';
import styled, { css } from 'styled-components';

const RED = '#EF4444';
const SLATE = '#1E293B';

export type CavesButtonVariant = 'primary' | 'secondary' | 'text';
export type CavesButtonSize = 'sm' | 'md' | 'lg';

export interface CavesButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: CavesButtonVariant;
  size?: CavesButtonSize;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const sizeStyles = {
  sm: css`
    padding: 6px 14px;
    font-size: 0.8rem;
    border-radius: 8px;
  `,
  md: css`
    padding: 10px 20px;
    font-size: 0.9rem;
    border-radius: 12px;
  `,
  lg: css`
    padding: 14px 28px;
    font-size: 1rem;
    border-radius: 14px;
  `,
};

const variantStyles = {
  primary: css`
    background: linear-gradient(135deg, ${RED} 0%, #EF4444 100%);
    color: #FFFFFF;
    border: none;
    box-shadow: 0 4px 14px rgba(239, 68, 68, 0.3);

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #EF4444 0%, #B91C1C 100%);
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
      transform: translateY(-1px);
    }
  `,
  secondary: css`
    background: #FFFFFF;
    color: ${RED};
    border: 1.5px solid ${RED};
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);

    &:hover:not(:disabled) {
      background: rgba(239, 68, 68, 0.05);
      border-color: #EF4444;
      transform: translateY(-1px);
    }
  `,
  text: css`
    background: transparent;
    color: ${SLATE};
    border: none;

    &:hover:not(:disabled) {
      background: rgba(239, 68, 68, 0.08);
      color: ${RED};
    }
  `,
};

const StyledButton = styled.button<{
  $variant: CavesButtonVariant;
  $size: CavesButtonSize;
  $fullWidth: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;

  width: ${props => (props.$fullWidth ? '100%' : 'auto')};

  ${props => sizeStyles[props.$size]}
  ${props => variantStyles[props.$variant]}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

export const CavesButton: React.FC<CavesButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  ...props
}) => {
  return (
    <StyledButton $variant={variant} $size={size} $fullWidth={fullWidth} {...props}>
      {leftIcon && <span className="caves-btn-icon">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="caves-btn-icon">{rightIcon}</span>}
    </StyledButton>
  );
};

export default CavesButton;
