// @ts-nocheck
/**
 * Button Component Styles
 * Styled-components styling for all button variants and states
 */

import styled, { css } from 'styled-components';
import { theme } from '../../../styles/theme';
import { ButtonSize, ButtonVariant } from './types';

/**
 * Variant style generator
 * Creates CSS for each button variant (primary, secondary, etc.)
 */
const getVariantStyles = (variant: ButtonVariant) => {
  const variants = {
    primary: css`
      background-color: ${theme.colors.primary};
      color: ${theme.colors.text.inverse};
      border: 1px solid ${theme.colors.primary};

      &:hover:not(:disabled) {
        background-color: ${theme.colors.primaryDark};
        border-color: ${theme.colors.primaryDark};
        box-shadow: ${theme.shadows.md};
      }

      &:active:not(:disabled) {
        background-color: ${theme.colors.primaryDark};
        box-shadow: ${theme.shadows.sm};
      }

      &:focus-visible {
        outline: 2px solid ${theme.colors.primary};
        outline-offset: 2px;
      }

      &:disabled {
        background-color: ${theme.colors.border};
        border-color: ${theme.colors.border};
        color: ${theme.colors.text.disabled};
        cursor: not-allowed;
      }
    `,

    secondary: css`
      background-color: ${theme.colors.secondary};
      color: ${theme.colors.text.inverse};
      border: 1px solid ${theme.colors.secondary};

      &:hover:not(:disabled) {
        background-color: ${theme.colors.secondaryDark};
        border-color: ${theme.colors.secondaryDark};
        box-shadow: ${theme.shadows.md};
      }

      &:active:not(:disabled) {
        background-color: ${theme.colors.secondaryDark};
        box-shadow: ${theme.shadows.sm};
      }

      &:focus-visible {
        outline: 2px solid ${theme.colors.secondary};
        outline-offset: 2px;
      }

      &:disabled {
        background-color: ${theme.colors.border};
        border-color: ${theme.colors.border};
        color: ${theme.colors.text.disabled};
      }
    `,

    danger: css`
      background-color: ${theme.colors.error};
      color: ${theme.colors.text.inverse};
      border: 1px solid ${theme.colors.error};

      &:hover:not(:disabled) {
        background-color: ${theme.colors.errorLight};
        border-color: ${theme.colors.errorLight};
        box-shadow: ${theme.shadows.md};
      }

      &:active:not(:disabled) {
        background-color: ${theme.colors.error};
        box-shadow: ${theme.shadows.sm};
      }

      &:focus-visible {
        outline: 2px solid ${theme.colors.error};
        outline-offset: 2px;
      }

      &:disabled {
        background-color: ${theme.colors.border};
        border-color: ${theme.colors.border};
        color: ${theme.colors.text.disabled};
      }
    `,

    success: css`
      background-color: ${theme.colors.success};
      color: ${theme.colors.text.inverse};
      border: 1px solid ${theme.colors.success};

      &:hover:not(:disabled) {
        background-color: ${theme.colors.successLight};
        border-color: ${theme.colors.successLight};
        box-shadow: ${theme.shadows.md};
      }

      &:active:not(:disabled) {
        background-color: ${theme.colors.success};
        box-shadow: ${theme.shadows.sm};
      }

      &:focus-visible {
        outline: 2px solid ${theme.colors.success};
        outline-offset: 2px;
      }

      &:disabled {
        background-color: ${theme.colors.border};
        border-color: ${theme.colors.border};
        color: ${theme.colors.text.disabled};
      }
    `,

    outline: css`
      background-color: transparent;
      color: ${theme.colors.primary};
      border: 1px solid ${theme.colors.border};

      &:hover:not(:disabled) {
        background-color: ${theme.colors.primaryVeryLight};
        border-color: ${theme.colors.primary};
        box-shadow: ${theme.shadows.sm};
      }

      &:active:not(:disabled) {
        background-color: ${theme.colors.primaryVeryLight};
      }

      &:focus-visible {
        outline: 2px solid ${theme.colors.primary};
        outline-offset: 2px;
        border-color: ${theme.colors.primary};
      }

      &:disabled {
        border-color: ${theme.colors.border};
        color: ${theme.colors.text.disabled};
        cursor: not-allowed;
      }
    `,

    ghost: css`
      background-color: transparent;
      color: ${theme.colors.primary};
      border: 1px solid transparent;

      &:hover:not(:disabled) {
        background-color: ${theme.colors.primaryVeryLight};
        box-shadow: ${theme.shadows.sm};
      }

      &:active:not(:disabled) {
        background-color: ${theme.colors.background.tertiary};
      }

      &:focus-visible {
        outline: 2px solid ${theme.colors.primary};
        outline-offset: 2px;
      }

      &:disabled {
        color: ${theme.colors.text.disabled};
        cursor: not-allowed;
      }
    `,
  };

  return variants[variant] || variants.primary;
};

/**
 * Size style generator
 * Creates CSS for each button size (sm, md, lg)
 */
const getSizeStyles = (size: ButtonSize) => {
  const sizes = {
    sm: css`
      padding: ${theme.spacing.xs} ${theme.spacing.md};
      font-size: ${theme.typography.sizes.sm};
      min-height: 28px;
      gap: ${theme.spacing.xs};
    `,
    md: css`
      padding: ${theme.spacing.sm} ${theme.spacing.lg};
      font-size: ${theme.typography.sizes.base};
      min-height: 36px;
      gap: ${theme.spacing.sm};
    `,
    lg: css`
      padding: ${theme.spacing.md} ${theme.spacing.xl};
      font-size: ${theme.typography.sizes.md};
      min-height: 44px;
      gap: ${theme.spacing.md};
    `,
  };

  return sizes[size] || sizes.md;
};

/**
 * Base Button Styled Component
 * Main button element with all variant and size styling
 */
export const StyledButton = styled.button<{
  $variant?: ButtonVariant;
  $size?: ButtonSize;
  $fullWidth?: boolean;
}>`
  /* Base styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${theme.typography.fontFamily.primary};
  font-weight: ${theme.typography.weights.semibold};
  border-radius: ${theme.spacing.xs};
  cursor: pointer;
  transition: ${theme.transitions.all};
  white-space: nowrap;
  user-select: none;

  /* Variant and size styles */
  ${(props) => getVariantStyles(props.$variant || 'primary')}
  ${(props) => getSizeStyles(props.$size || 'md')}

  /* Full width */
  ${(props) =>
    props.$fullWidth &&
    css`
      width: 100%;
    `}

  /* Loading state */
  &:disabled[aria-busy='true'] {
    opacity: 0.8;
  }

  /* Responsive */
  @media ${theme.mediaQueries.mobile} {
    font-size: ${theme.typography.sizes.sm};
    
    &:${(props) => props.$size === 'lg' && 'not(:disabled)'} {
      padding: ${theme.spacing.sm} ${theme.spacing.md};
      min-height: 36px;
    }
  }
`;

/**
 * Icon Wrapper
 * Handles icon positioning and spacing within button
 */
export const IconWrapper = styled.span<{ $position?: 'left' | 'right' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  ${(props) =>
    props.$position === 'right' &&
    css`
      order: 1;
    `}
`;

/**
 * Spinner styles for loading state
 * Animates to show loading indicator
 */
export const LoadingSpinner = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  animation: spin 1s linear infinite;

  &::after {
    content: '';
    width: 100%;
    height: 100%;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

