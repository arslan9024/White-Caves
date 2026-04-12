import styled, { css } from 'styled-components';
import { typography } from '../../../styles/theme/typography';

interface BadgeProps {
  $variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  $size?: 'xs' | 'sm' | 'md' | 'lg';
  $rounded?: boolean;
  $pulse?: boolean;
}

const sizeStyles = {
  xs: css`
    height: 18px;
    padding: 0 6px;
    font-size: 10px;
  `,
  sm: css`
    height: 22px;
    padding: 0 8px;
    font-size: 11px;
  `,
  md: css`
    height: 26px;
    padding: 0 10px;
    font-size: ${typography.sizes.xs};
  `,
  lg: css`
    height: 32px;
    padding: 0 14px;
    font-size: ${typography.sizes.base};
  `,
};

const variantStyles = {
  default: css`
    background: var(--color-surface, #f9fafb);
    color: var(--color-text-secondary, #6b7280);
    border-color: var(--color-border, #e5e7eb);

    [data-theme='dark'] & {
      background: var(--color-surface, #1e293b);
      color: var(--color-text-secondary, #94a3b8);
      border-color: var(--color-border, #334155);
    }
  `,
  primary: css`
    background: #dc2626;
    color: white;
  `,
  secondary: css`
    background: var(--color-surface, #f9fafb);
    color: var(--color-text-primary, #111827);
    border-color: var(--color-border, #e5e7eb);

    [data-theme='dark'] & {
      background: var(--color-surface, #1e293b);
      color: var(--color-text-primary, #f1f5f9);
      border-color: var(--color-border, #334155);
    }
  `,
  success: css`
    background: rgba(16, 185, 129, 0.1);
    color: #059669;
    border-color: rgba(16, 185, 129, 0.3);
  `,
  warning: css`
    background: rgba(245, 158, 11, 0.1);
    color: #d97706;
    border-color: rgba(245, 158, 11, 0.3);
  `,
  error: css`
    background: rgba(239, 68, 68, 0.1);
    color: #dc2626;
    border-color: rgba(239, 68, 68, 0.3);
  `,
  info: css`
    background: rgba(59, 130, 246, 0.1);
    color: #2563eb;
    border-color: rgba(59, 130, 246, 0.3);
  `,
};

export const StyledBadge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${typography.fontFamily.heading};
  font-weight: ${typography.weights.semibold};
  white-space: nowrap;
  border: 1px solid transparent;
  transition: all 0.15s ease;
  border-radius: ${(props) => (props.$rounded ? '9999px' : '6px')};

  /* Size */
  ${(props) => sizeStyles[props.$size || 'md']}

  /* Variant */
  ${(props) => variantStyles[props.$variant || 'default']}
`;

export const BadgeDot = styled.span<{ $pulse?: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
  ${(props) =>
    props.$pulse
      ? css`
          animation: badgePulse 2s ease-in-out infinite;

          @keyframes badgePulse {
            0%,
            100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.5;
              transform: scale(1.2);
            }
          }
        `
      : ''}
`;

export const BadgeIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 1em;
    height: 1em;
  }
`;

export const BadgeContent = styled.span`
  line-height: 1;
`;
