import React, { FC, useState } from 'react';
import styled from 'styled-components';

const InputBox = styled.div`
  display: flex;
  align-items: center;
  background: #0F172A;
  border: 1.5px solid #EF4444;
  border-radius: 8px;
  padding: 8px 12px;
  color: #FFFFFF;

  .prefix {
    color: #EF4444;
    font-weight: 800;
    margin-right: 8px;
  }

  input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: #FFFFFF;
    font-size: 1rem;
    font-weight: 700;
  }
`;

export const FormattedCurrencyInput: FC = () => {
  const [val, setVal] = useState('1500000');

  const formatDisplay = (numStr: string) => {
    const clean = numStr.replace(/\D/g, '');
    return clean ? parseInt(clean, 10).toLocaleString() : '';
  };

  return (
    <InputBox data-testid="formatted-currency-input">
      <span className="prefix">AED</span>
      <input
        type="text"
        value={formatDisplay(val)}
        onChange={(e) => setVal(e.target.value)}
      />
    </InputBox>
  );
};

export default FormattedCurrencyInput;
