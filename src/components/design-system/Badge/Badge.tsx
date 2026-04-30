// @ts-nocheck
/**
 * Badge Component
 * Small labeled indicator for status, category, or count
 */

import React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../../styles/theme';
import { BadgeProps, BadgeVariant, BadgeSize } from './types';

const getVariantStyles = (variant: BadgeVariant) => {
  const variants = {
    primary: css`
      background-color: ${theme.colors.primary};
      color: ${theme.colors.text.inverse};
    `,
    secondary: css`
      background-color: ${theme.colors.secondary};
      color: ${theme.colors.text.inverse};
    `,
    success: css`
      background-color: ${theme.colors.success};
      color: ${theme.colors.text.inverse};
    `,
    warning: css`
      background-color: ${theme.colors.warning};
      color: ${theme.colors.text.inverse};
    `,
    error: css`
      background-color: ${theme.colors.error};
      color: ${theme.colors.text.inverse};
    `,
    info: css`
      background-color: ${theme.colors.info};
      color: ${theme.colors.text.inverse};
    `,
  };

  return variants[variant] || variants.primary;
};

const getSizeStyles = (size: BadgeSize) => {
  const sizes = {
    sm: css`
      padding: ${theme.spacing.xs} ${theme.spacing.sm};
      font-size: ${theme.typography.sizes.xs};
    `,
    md: css`
      padding: ${theme.spacing.xs} ${theme.spacing.md};
      font-size: ${theme.typography.sizes.sm};
    `,
    lg: css`
      padding: ${theme.spacing.sm} ${theme.spacing.lg};
      font-size: ${theme.typography.sizes.base};
    `,
  };

  return sizes[size] || sizes.md;
};

const StyledBadge = styled.span<{ $variant?: BadgeVariant; $size?: BadgeSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-weight: ${theme.typography.weights.semibold};
  white-space: nowrap;
  transition: ${theme.transitions.all};

  ${(props) => getVariantStyles(props.$variant || 'primary')}
  ${(props) => getSizeStyles(props.$size || 'md')}
`;

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'primary', size = 'md', children, className = '', ...rest }, ref) => {
    return (
      <StyledBadge ref={ref} $variant={variant} $size={size} className={className} {...rest}>
        {children}
      </StyledBadge>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;

