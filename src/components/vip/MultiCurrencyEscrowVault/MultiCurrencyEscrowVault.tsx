import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); }`;
const pulse = keyframes`0%, 100% { opacity: 1; } 50% { opacity: 0.5; }`;

const Wrapper = styled.div`width: 100%; background: linear-gradient(135deg, #0F172A, #1E293B); border: 2px solid rgba(239,68,68,0.25); border-radius: 18px; overflow: hidden; font-family: 'Inter', sans-serif; animation: ${fadeIn} 0.4s ease;`;
const Header = styled.div`padding: 14px 20px; background: rgba(239,68,68,0.05); border-bottom: 1px solid rgba(239,68,68,0.12); display: flex; align-items: center; justify-content: space-between;`;
const Title = styled.h3`margin: 0; color: #FFF; font-size: 0.9rem; font-weight: 700; display: flex; align-items: center; gap: 8px;`;

const Body = styled.div`padding: 20px; display: flex; flex-direction: column; gap: 14px;`;
const CurrencyGrid = styled.div`display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;`;
const CurrencyCard = styled.div<{ $selected: boolean; $color: string }>`
  padding: 14px 12px;
  border-radius: 12px;
  background: ${p => p.$selected ? `${p.$color}15` : 'rgba(15,23,42,0.7)'};
  border: 2px solid ${p => p.$selected ? p.$color : 'rgba(100,116,139,0.15)'};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  &:hover { border-color: ${p => p.$color}; }
`;
const CurrencyEmoji = styled.div`font-size: 1.4rem;`;
const CurrencyCode = styled.div<{ $color: string; $selected: boolean }>`font-size: 0.72rem; font-weight: 800; color: ${p => p.$selected ? p.$color : '#64748B'}; margin-top: 4px;`;
const CurrencyRate = styled.div`font-size: 0.65rem; color: #475569;`;

const EscrowDisplay = styled.div`
  padding: 20px;
  border-radius: 14px;
  background: rgba(15,23,42,0.8);
  border: 1px solid rgba(239,68,68,0.2);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const EscrowTitle = styled.div`font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #64748B;`;
const EscrowAmount = styled.div`font-size: 2rem; font-weight: 900; color: #EF4444;`;
const EscrowSub = styled.div`font-size: 0.75rem; color: #64748B;`;
const LiveDot = styled.div`display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #10B981; animation: ${pulse} 1.5s ease-in-out infinite;`;

const RatesTable = styled.div`display: flex; flex-direction: column; gap: 6px;`;
const RateRow = styled.div`display: flex; justify-content: space-between; padding: 7px 10px; border-radius: 7px; background: rgba(15,23,42,0.5);`;
const RateCurr = styled.div`font-size: 0.75rem; color: #94A3B8; font-weight: 600;`;
const RateVal = styled.div`font-size: 0.75rem; font-weight: 800; color: #E2E8F0;`;

const CURRENCIES = [
  { code: 'AED', emoji: '🇦🇪', rate: 1, color: '#10B981' },
  { code: 'USD', emoji: '🇺🇸', rate: 0.2723, color: '#3B82F6' },
  { code: 'EUR', emoji: '🇪🇺', rate: 0.2512, color: '#8B5CF6' },
  { code: 'GBP', emoji: '🇬🇧', rate: 0.2156, color: '#F59E0B' },
  { code: 'BTC', emoji: '₿', rate: 0.0000044, color: '#F97316' },
  { code: 'ETH', emoji: '⟠', rate: 0.0000782, color: '#6366F1' },
];

export const MultiCurrencyEscrowVault: FC = () => {
  const [selected, setSelected] = useState('AED');
  const baseAed = 5_500_000;

  const selCurr = CURRENCIES.find(c => c.code === selected)!;
  const converted = (baseAed * selCurr.rate).toLocaleString('en-US', {
    maximumFractionDigits: selCurr.code === 'BTC' ? 4 : selCurr.code === 'ETH' ? 2 : 0
  });

  return (
    <Wrapper data-testid="multi-currency-escrow-vault">
      <Header>
        <Title>🏦 Multi-Currency Escrow Vault</Title>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><LiveDot /><span style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 700 }}>LIVE RATES</span></div>
      </Header>
      <Body>
        <CurrencyGrid>
          {CURRENCIES.map(c => (
            <CurrencyCard key={c.code} $selected={c.code === selected} $color={c.color} onClick={() => setSelected(c.code)}>
              <CurrencyEmoji>{c.emoji}</CurrencyEmoji>
              <CurrencyCode $color={c.color} $selected={c.code === selected}>{c.code}</CurrencyCode>
              <CurrencyRate>{c.code !== 'AED' ? `1 AED = ${c.rate.toFixed(c.code === 'BTC' ? 7 : c.code === 'ETH' ? 6 : 4)} ${c.code}` : 'Base'}</CurrencyRate>
            </CurrencyCard>
          ))}
        </CurrencyGrid>

        <EscrowDisplay>
          <EscrowTitle>Escrow Balance — {selected}</EscrowTitle>
          <EscrowAmount>{selCurr.code === 'AED' ? 'AED' : selCurr.code === 'BTC' ? '₿' : selCurr.code === 'ETH' ? 'Ξ' : selCurr.code} {converted}</EscrowAmount>
          <EscrowSub>≡ AED {baseAed.toLocaleString()} at live rates</EscrowSub>
        </EscrowDisplay>

        <RatesTable>
          {CURRENCIES.filter(c => c.code !== 'AED').map(c => (
            <RateRow key={c.code}>
              <RateCurr>{c.emoji} {c.code}</RateCurr>
              <RateVal>{(baseAed * c.rate).toLocaleString('en-US', { maximumFractionDigits: c.code === 'BTC' ? 4 : c.code === 'ETH' ? 2 : 0 })} {c.code}</RateVal>
            </RateRow>
          ))}
        </RatesTable>
      </Body>
    </Wrapper>
  );
};
export default MultiCurrencyEscrowVault;
