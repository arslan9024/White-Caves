/**
 * Spinner Component
 * Loading indicator with smooth rotation animation
 */

import React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../../styles/theme';
import { SpinnerProps, SpinnerSize, SpinnerVariant } from './types';

const getSizeStyles = (size: SpinnerSize) => {
  const sizes = {
    sm: css`
      width: 24px;
      height: 24px;
      border-width: 2px;
    `,
    md: css`
      width: 40px;
      height: 40px;
      border-width: 3px;
    `,
    lg: css`
      width: 56px;
      height: 56px;
      border-width: 4px;
    `,
  };

  return sizes[size] || sizes.md;
};

const getVariantStyles = (variant: SpinnerVariant) => {
  const variants = {
    primary: css`
      border-color: ${theme.colors.border};
      border-top-color: ${theme.colors.primary};
    `,
    secondary: css`
      border-color: ${theme.colors.border};
      border-top-color: ${theme.colors.secondary};
    `,
    light: css`
      border-color: rgba(255, 255, 255, 0.2);
      border-top-color: ${theme.colors.text.inverse};
    `,
  };

  return variants[variant] || variants.primary;
};

const StyledSpinner = styled.div<{ $size?: SpinnerSize; $variant?: SpinnerVariant }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border-style: solid;
  animation: spin 1s linear infinite;

  ${(props) => getSizeStyles(props.$size || 'md')}
  ${(props) => getVariantStyles(props.$variant || 'primary')}

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  (
    { size = 'md', variant = 'primary', label = 'Loading...', className = '', ...rest },
    ref
  ) => {
    return (
      <StyledSpinner
        ref={ref}
        $size={size}
        $variant={variant}
        role="status"
        aria-label={label}
        className={className}
        {...rest}
      />
    );
  }
);

Spinner.displayName = 'Spinner';

export default Spinner;
