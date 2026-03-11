import styled, { css } from 'styled-components';

interface ButtonProps {
  $variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  $size?: 'xs' | 'sm' | 'md' | 'lg';
  $fullWidth?: boolean;
  $gradient?: boolean;
  $disabled?: boolean;
  $loading?: boolean;
}

const sizeStyles = {
  xs: css`
    height: 28px;
    padding: 0 10px;
    font-size: 12px;
    min-width: 64px;
  `,
  sm: css`
    height: 32px;
    padding: 0 14px;
    font-size: 13px;
    min-width: 80px;
  `,
  md: css`
    height: 40px;
    padding: 0 18px;
    font-size: 14px;
    min-width: 96px;
  `,
  lg: css`
    height: 48px;
    padding: 0 24px;
    font-size: 16px;
    min-width: 120px;
  `,
};

const variantStyles = {
  primary: css`
    background: #dc2626;
    color: white;

    &:hover:not(:disabled) {
      background: #b91c1c;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
    }
  `,
  secondary: css`
    background: #6b7280;
    color: white;

    &:hover:not(:disabled) {
      background: #4b5563;
      transform: translateY(-1px);
    }
  `,
  outline: css`
    background: transparent;
    color: #dc2626;
    border: 2px solid #dc2626;

    &:hover:not(:disabled) {
      background: rgba(220, 38, 38, 0.1);
    }
  `,
  ghost: css`
    background: transparent;
    color: #6b7280;

    &:hover:not(:disabled) {
      background: rgba(107, 114, 128, 0.1);
      color: #374151;
    }
  `,
  danger: css`
    background: #ef4444;
    color: white;

    &:hover:not(:disabled) {
      background: #dc2626;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }
  `,
  success: css`
    background: #10b981;
    color: white;

    &:hover:not(:disabled) {
      background: #059669;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
  `,
};

export const StyledButton = styled.button<ButtonProps>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: var(--font-family-sans, 'Montserrat', sans-serif);
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.2s ease;
  white-space: nowrap;
  user-select: none;
  min-width: 96px;

  /* Size */
  ${(props) => sizeStyles[props.$size || 'md']}

  /* Variant */
  ${(props) => variantStyles[props.$variant || 'primary']}

  /* Gradient */
  ${(props) =>
    props.$gradient
      ? css`
          background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);

          &:hover:not(:disabled) {
            background: linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%);
          }
        `
      : ''}

  /* Full width */
  ${(props) => (props.$fullWidth ? 'width: 100%;' : '')}

  /* Icon only */
  ${(props) =>
    props.$loading || (!props.children && props.children === undefined)
      ? css`
          min-width: auto;
          padding: 0;

          &.wc-button__icon-only {
            &.wc-button--xs {
              width: 28px;
            }
            &.wc-button--sm {
              width: 32px;
            }
            &.wc-button--md {
              width: 40px;
            }
            &.wc-button--lg {
              width: 48px;
            }
          }
        `
      : ''}

  /* Disabled */
  ${(props) =>
    props.$disabled || props.disabled
      ? css`
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        `
      : ''}

  /* Loading */
  ${(props) =>
    props.$loading
      ? css`
          pointer-events: none;
        `
      : ''}
`;

export const ButtonContent = styled.span`
  position: relative;
  z-index: 1;
`;

export const ButtonIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;

  svg {
    width: 1em;
    height: 1em;
  }
`;

export const ButtonSpinner = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 18px;
    height: 18px;
    animation: spin 1s linear infinite;

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }
`;

export const ButtonRipple = styled.span`
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  pointer-events: none;
  animation: ripple 0.5s ease-out forwards;

  @keyframes ripple {
    from {
      width: 0;
      height: 0;
      opacity: 0.5;
    }
    to {
      width: 200px;
      height: 200px;
      opacity: 0;
    }
  }
`;
