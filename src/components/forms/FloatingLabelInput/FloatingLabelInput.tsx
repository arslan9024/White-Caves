/**
 * FloatingLabelInput — Wave 63 FE-GOAL-071
 * Luxury floating label input field with smooth CSS translateY float transitions on focus
 * White Caves Real Estate LLC — Forms Suite
 */
import React, { FC, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  width: 100%;
  font-family: 'Inter', sans-serif;
`;

const StyledInput = styled.input<{ $hasValue: boolean }>`
  width: 100%;
  padding: 18px 12px 6px;
  border-radius: 10px;
  border: 1px solid rgba(100, 116, 139, 0.25);
  background: rgba(15, 23, 42, 0.8);
  color: #FFF;
  font-size: 0.85rem;
  font-weight: 600;
  outline: none;
  box-sizing: border-box;
  transition: all 0.2s ease;
  &:focus {
    border-color: #EF4444;
    background: rgba(15, 23, 42, 0.95);
  }
`;

const FloatingLabel = styled.label<{ $isFloating: boolean }>`
  position: absolute;
  left: 12px;
  top: ${p => p.$isFloating ? '6px' : '14px'};
  font-size: ${p => p.$isFloating ? '0.62rem' : '0.8rem'};
  font-weight: 700;
  color: ${p => p.$isFloating ? '#EF4444' : '#64748B'};
  pointer-events: none;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  text-transform: ${p => p.$isFloating ? 'uppercase' : 'none'};
  letter-spacing: ${p => p.$isFloating ? '0.05em' : 'normal'};
`;

export const FloatingLabelInput: FC<{
  label: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({
  label,
  type = 'text',
  value = '',
  onChange,
}) => {
  const [val, setVal] = useState(value);
  const [focused, setFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value);
    onChange?.(e);
  };

  const isFloating = focused || val.length > 0;

  return (
    <Container data-testid="floating-label-input">
      <StyledInput
        type={type}
        value={val}
        $hasValue={val.length > 0}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={handleChange}
      />
      <FloatingLabel $isFloating={isFloating}>{label}</FloatingLabel>
    </Container>
  );
};

export default FloatingLabelInput;
