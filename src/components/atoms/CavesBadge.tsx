import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

export interface CavesBadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'dark';
  size?: 'small' | 'medium';
}

const StyledBadge = styled.span<{ $variant: string; $size: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: 6px;
  font-weight: 700;
  white-space: nowrap;
  letter-spacing: 0.02em;

  padding: ${props => (props.$size === 'small' ? '2px 6px; font-size: 10px;' : '4px 10px; font-size: 12px;')};

  background-color: ${props => {
    switch (props.$variant) {
      case 'secondary':
        return 'var(--wc-bg-subtle, #F1F5F9)';
      case 'dark':
        return 'var(--wc-text-primary, #1E293B)';
      case 'outline':
        return 'transparent';
      case 'primary':
      default:
        return 'rgba(239, 68, 68, 0.12)';
    }
  }};

  color: ${props => {
    switch (props.$variant) {
      case 'secondary':
        return 'var(--wc-text-secondary, #64748B)';
      case 'dark':
        return 'var(--wc-text-inverse, #FFFFFF)';
      case 'outline':
      case 'primary':
      default:
        return 'var(--wc-red-primary, #EF4444)';
    }
  }};

  border: ${props => (props.$variant === 'outline' ? '1px solid var(--wc-red-primary, #EF4444)' : 'none')};
`;

export const CavesBadge: FC<CavesBadgeProps> = ({ children, variant = 'primary', size = 'medium' }) => {
  return (
    <StyledBadge $variant={variant} $size={size}>
      {children}
    </StyledBadge>
  );
};

export default CavesBadge;
