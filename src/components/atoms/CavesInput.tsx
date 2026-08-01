import React, { FC, InputHTMLAttributes } from 'react';
import styled from 'styled-components';

export interface CavesInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: var(--wc-text-primary, #1E293B);
`;

const StyledInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid ${props => (props.$hasError ? 'var(--wc-red-primary, #EF4444)' : 'var(--wc-border-light, #CBD5E1)')};
  background-color: var(--wc-bg-card, #FFFFFF);
  color: var(--wc-text-primary, #1E293B);
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease-in-out;

  &:focus {
    border-color: var(--wc-red-primary, #EF4444);
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
  }

  &::placeholder {
    color: var(--wc-text-muted, #94A3B8);
  }
`;

const ErrorText = styled.span`
  font-size: 12px;
  color: var(--wc-red-primary, #EF4444);
  font-weight: 500;
`;

export const CavesInput: FC<CavesInputProps> = ({ label, error, id, ...props }) => {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
  return (
    <InputContainer>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <StyledInput id={inputId} $hasError={!!error} {...props} />
      {error && <ErrorText>{error}</ErrorText>}
    </InputContainer>
  );
};

export default CavesInput;
