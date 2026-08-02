import React, { useState } from 'react';
import styled from 'styled-components';

const RED = '#EF4444';
const SLATE = '#1E293B';

export interface CavesInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  position: relative;
`;

const Label = styled.label<{ $isFocused: boolean; $hasValue: boolean }>`
  font-size: 0.8rem;
  font-weight: 800;
  color: ${props => (props.$isFocused ? RED : SLATE)};
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: color 0.2s ease;
`;

const InputWrapper = styled.div<{ $isFocused: boolean; $hasError: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #FFFFFF;
  border: 1.5px solid ${props => (props.$hasError ? '#EF4444' : props.$isFocused ? RED : '#E2E8F0')};
  border-radius: 12px;
  padding: 10px 14px;
  box-shadow: ${props => (props.$isFocused ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : 'none')};
  transition: all 0.2s ease;
`;

const StyledInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${SLATE};

  &::placeholder {
    color: #94A3B8;
    font-weight: 500;
  }
`;

const ErrorText = styled.span`
  font-size: 0.75rem;
  color: #EF4444;
  font-weight: 700;
`;

const HelperText = styled.span`
  font-size: 0.75rem;
  color: #64748B;
`;

export const CavesInput: React.FC<CavesInputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  id,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== '';
  const inputId = id || (label ? `caves-input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <Container>
      {label && (
        <Label htmlFor={inputId} $isFocused={isFocused} $hasValue={Boolean(hasValue)}>
          {label}
        </Label>
      )}
      <InputWrapper $isFocused={isFocused} $hasError={Boolean(error)}>
        {leftIcon}
        <StyledInput
          id={inputId}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={e => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={e => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
        {rightIcon}
      </InputWrapper>
      {error ? <ErrorText>{error}</ErrorText> : helperText ? <HelperText>{helperText}</HelperText> : null}
    </Container>
  );
};

export default CavesInput;
