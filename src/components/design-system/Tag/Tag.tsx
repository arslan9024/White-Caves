/**
 * Tag Component
 * Removable label for categorization
 */

import React from 'react';
import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export type TagProps = {
  label: string;
  removable?: boolean;
  onRemove?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  className?: string;
};

const getVariantColor = (variant: string) => {
  const colors: Record<string, string> = {
    primary: `background: ${theme.colors.primary}; color: white;`,
    secondary: `background: ${theme.colors.secondary}; color: white;`,
    success: `background: ${theme.colors.success}; color: white;`,
    warning: `background: ${theme.colors.warning}; color: white;`,
    error: `background: ${theme.colors.error}; color: white;`,
  };
  return colors[variant] || colors.primary;
};

const TagContainer = styled.span<{ $variant?: string; $size?: 'sm' | 'md' }>`
  display: inline-flex;
  align-items: center;
  gap: ${(props) => (props.$size === 'sm' ? theme.spacing.xs : theme.spacing.sm)};
  padding: ${(props) => (props.$size === 'sm' ? `${theme.spacing.xs} ${theme.spacing.md}` : `${theme.spacing.sm} ${theme.spacing.lg}`)};
  border-radius: 12px;
  font-size: ${(props) => (props.$size === 'sm' ? theme.typography.sizes.xs : theme.typography.sizes.sm)};
  font-weight: ${theme.typography.weights.medium};
  ${(props) => getVariantColor(props.$variant || 'primary')}
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: inherit;
  padding: 0;
  display: flex;
  align-items: center;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

export const Tag: React.FC<TagProps> = ({
  label,
  removable = false,
  onRemove,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  return (
    <TagContainer $variant={variant} $size={size} className={className}>
      {label}
      {removable && (
        <RemoveButton onClick={onRemove} aria-label={`Remove ${label}`}>
          ✕
        </RemoveButton>
      )}
    </TagContainer>
  );
};

Tag.displayName = 'Tag';

export default Tag;
