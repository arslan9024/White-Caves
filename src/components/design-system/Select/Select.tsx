/**
 * Select Component
 * Dropdown selection component
 */

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  options: Array<{ value: string | number; label: string }>;
  size?: 'sm' | 'md' | 'lg';
};

const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  width: 100%;
`;

const Label = styled.label`
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
  color: ${theme.colors.text.primary};
`;

const SelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

const getSizeStyles = (size: 'sm' | 'md' | 'lg') => {
  const sizes = {
    sm: { padding: `${theme.spacing.xs} ${theme.spacing.sm}`, height: '28px', fontSize: theme.typography.sizes.sm },
    md: { padding: `${theme.spacing.sm} ${theme.spacing.md}`, height: '36px', fontSize: theme.typography.sizes.base },
    lg: { padding: `${theme.spacing.md} ${theme.spacing.lg}`, height: '44px', fontSize: theme.typography.sizes.md },
  };
  return sizes[size] || sizes.md;
};

const StyledSelect = styled.select<{ $size?: 'sm' | 'md' | 'lg'; $hasError?: boolean }>`
  width: 100%;
  padding: ${(props) => getSizeStyles(props.$size || 'md').padding};
  height: ${(props) => getSizeStyles(props.$size || 'md').height};
  font-size: ${(props) => getSizeStyles(props.$size || 'md').fontSize};
  font-family: ${theme.typography.fontFamily.primary};
  border: 1px solid ${(props) => (props.$hasError ? theme.colors.error : theme.colors.border)};
  border-radius: ${theme.spacing.xs};
  background-color: ${theme.colors.background.secondary};
  color: ${theme.colors.text.primary};
  cursor: pointer;
  transition: ${theme.transitions.all};
  appearance: none;
  padding-right: 32px;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;

  &:hover:not(:disabled) {
    border-color: ${(props) => (props.$hasError ? theme.colors.error : theme.colors.primary)};
  }

  &:focus {
    outline: none;
    border-color: ${(props) => (props.$hasError ? theme.colors.error : theme.colors.primary)};
    box-shadow: ${(props) => (props.$hasError ? '0 0 0 3px rgba(198, 40, 40, 0.1)' : '0 0 0 3px rgba(211, 47, 47, 0.1)')};
  }

  &:disabled {
    background-color: ${theme.colors.background.tertiary};
    color: ${theme.colors.text.disabled};
    cursor: not-allowed;
  }

  option {
    background-color: ${theme.colors.background.secondary};
    color: ${theme.colors.text.primary};
  }
`;

const ErrorText = styled.span`
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.error};
`;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, size = 'md', className = '', id, ...rest }, ref) => {
    const selectId = id || `select-${Math.random()}`;
    const hasError = Boolean(error);
    const selectSize = size as 'sm' | 'md' | 'lg' | undefined;

    return (
      <SelectWrapper className={className}>
        {label && <Label htmlFor={selectId}>{label}</Label>}
        <SelectContainer>
          <StyledSelect ref={ref} id={selectId} $size={selectSize} $hasError={hasError} aria-invalid={hasError} {...rest}>
            <option value="">Select an option...</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </StyledSelect>
        </SelectContainer>
        {error && <ErrorText>{error}</ErrorText>}
      </SelectWrapper>
    );
  }
);

Select.displayName = 'Select';

export default Select;
