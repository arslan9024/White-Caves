/**
 * CurrencyFormattedInput — Wave 63 FE-GOAL-076
 * Automated thousand-separator formatted currency input field (e.g. AED 1,500,000)
 * White Caves Real Estate LLC — Forms & Data Entry Suite
 */
import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components';

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  font-family: 'Inter', sans-serif;
`;

const Prefix = styled.span`
  position: absolute;
  left: 12px;
  color: #EF4444;
  font-size: 0.82rem;
  font-weight: 800;
  pointer-events: none;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px 12px 10px 48px;
  border-radius: 8px;
  border: 1px solid rgba(100, 116, 139, 0.25);
  background: rgba(15, 23, 42, 0.85);
  color: #FFF;
  font-size: 0.88rem;
  font-weight: 700;
  outline: none;
  box-sizing: border-box;
  font-variant-numeric: tabular-nums;
  &:focus { border-color: #EF4444; }
`;

export const CurrencyFormattedInput: FC<{
  value?: number;
  currencyPrefix?: string;
  onChange?: (val: number) => void;
  placeholder?: string;
}> = ({
  value = 0,
  currencyPrefix = 'AED',
  onChange,
  placeholder = '0',
}) => {
  const [displayVal, setDisplayVal] = useState(value ? value.toLocaleString() : '');

  useEffect(() => {
    if (value) setDisplayVal(value.toLocaleString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const num = Number(raw) || 0;
    setDisplayVal(num ? num.toLocaleString() : '');
    onChange?.(num);
  };

  return (
    <InputWrapper data-testid="currency-formatted-input">
      <Prefix>{currencyPrefix}</Prefix>
      <StyledInput
        type="text"
        value={displayVal}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </InputWrapper>
  );
};

export default CurrencyFormattedInput;
