/**
 * Input Component Styles
 */

import styled, { css } from 'styled-components';
import { theme } from '../../../styles/theme';
import { InputSize } from './types';

const getSizeStyles = (size: InputSize) => {
  const sizes = {
    sm: css`
      padding: ${theme.spacing.xs} ${theme.spacing.sm};
      font-size: ${theme.typography.sizes.sm};
      height: 28px;
    `,
    md: css`
      padding: ${theme.spacing.sm} ${theme.spacing.md};
      font-size: ${theme.typography.sizes.base};
      height: 36px;
    `,
    lg: css`
      padding: ${theme.spacing.md} ${theme.spacing.lg};
      font-size: ${theme.typography.sizes.md};
      height: 44px;
    `,
  };

  return sizes[size] || sizes.md;
};

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  width: 100%;
`;

export const Label = styled.label<{ $required?: boolean }>`
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
  color: ${theme.colors.text.primary};

  ${(props) =>
    props.$required &&
    css`
      &::after {
        content: ' *';
        color: ${theme.colors.error};
      }
    `}
`;

export const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const StyledInput = styled.input<{
  $size?: InputSize;
  $hasError?: boolean;
  $hasLeftIcon?: boolean;
  $hasRightIcon?: boolean;
}>`
  width: 100%;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.spacing.xs};
  background-color: ${theme.colors.background.secondary};
  color: ${theme.colors.text.primary};
  transition: ${theme.transitions.all};
  font-family: ${theme.typography.fontFamily.primary};

  ${(props) => getSizeStyles(props.$size || 'md')}

  ${(props) =>
    props.$hasLeftIcon &&
    css`
      padding-left: 32px;
    `}

  ${(props) =>
    props.$hasRightIcon &&
    css`
      padding-right: 32px;
    `}

  &::placeholder {
    color: ${theme.colors.text.tertiary};
  }

  &:hover:not(:disabled) {
    border-color: ${(props) =>
      props.$hasError ? theme.colors.error : theme.colors.primary};
  }

  &:focus {
    outline: none;
    border-color: ${(props) =>
      props.$hasError ? theme.colors.error : theme.colors.primary};
    box-shadow: ${(props) =>
      props.$hasError
        ? `0 0 0 3px rgba(198, 40, 40, 0.1)`
        : `0 0 0 3px rgba(212, 175, 55, 0.15)`};
  }

  &:disabled {
    background-color: ${theme.colors.background.tertiary};
    color: ${theme.colors.text.disabled};
    border-color: ${theme.colors.border};
    cursor: not-allowed;
  }

  ${(props) =>
    props.$hasError &&
    css`
      border-color: ${theme.colors.error};
      color: ${theme.colors.error};

      &::placeholder {
        color: ${theme.colors.errorLight};
      }
    `}

  @media ${theme.mediaQueries.mobile} {
    font-size: ${theme.typography.sizes.sm};
  }
`;

export const IconWrapper = styled.span`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 100%;
  pointer-events: none;
  color: ${theme.colors.text.tertiary};

  &:first-child {
    left: 0;
  }

  &:last-child {
    right: 0;
  }
`;

export const HelperText = styled.span<{ $error?: boolean }>`
  font-size: ${theme.typography.sizes.xs};
  color: ${(props) =>
    props.$error ? theme.colors.error : theme.colors.text.tertiary};
  margin-top: ${theme.spacing.xs};
`;
