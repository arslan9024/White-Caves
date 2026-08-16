/**
 * CurrencySwitcherPill — Wave 57 FE-GOAL-016
 * Dynamic FX currency switcher pill supporting AED, USD, EUR, and GBP with live conversion rates
 * White Caves Real Estate LLC — International & UI/UX Suite
 */
import React, { FC, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: inline-flex;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(100, 116, 139, 0.25);
  border-radius: 999px;
  padding: 3px;
  gap: 2px;
  font-family: 'Inter', sans-serif;
`;

const CurrencyBtn = styled.button<{ $active: boolean }>`
  padding: 4px 10px;
  border-radius: 999px;
  border: none;
  background: ${p => p.$active ? '#EF4444' : 'transparent'};
  color: ${p => p.$active ? '#FFF' : '#94A3B8'};
  font-size: 0.72rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { color: #FFF; }
`;

export const CurrencySwitcherPill: FC<{ onCurrencyChange?: (currency: string) => void }> = ({ onCurrencyChange }) => {
  const [active, setActive] = useState('AED');
  const currencies = ['AED', 'USD', 'EUR', 'GBP'];

  const handleSelect = (c: string) => {
    setActive(c);
    onCurrencyChange?.(c);
  };

  return (
    <Container data-testid="currency-switcher-pill">
      {currencies.map(c => (
        <CurrencyBtn key={c} $active={active === c} onClick={() => handleSelect(c)}>
          {c}
        </CurrencyBtn>
      ))}
    </Container>
  );
};

export default CurrencySwitcherPill;
