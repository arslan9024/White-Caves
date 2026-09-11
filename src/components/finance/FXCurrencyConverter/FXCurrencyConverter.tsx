import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Title = styled.h2`margin:0 0 20px;font-size:1.1rem;font-weight:800;color:#E2E8F0;display:flex;align-items:center;gap:8px`;

const ConverterBox = styled.div`display:flex;align-items:center;gap:12px;margin-bottom:24px`;
const InputGroup = styled.div`flex:1;position:relative`;
const Input = styled.input`width:100%;padding:14px;padding-right:60px;border-radius:12px;border:1px solid rgba(100,116,139,0.3);background:rgba(30,41,59,0.8);color:#E2E8F0;font-size:1.1rem;font-weight:800;outline:none;box-sizing:border-box`;
const Currency = styled.div`position:absolute;right:14px;top:50%;transform:translateY(-50%);font-size:.8rem;font-weight:700;color:#94A3B8`;

const SwapBtn = styled.button`width:40px;height:40px;border-radius:50%;background:#3B82F6;color:#FFF;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1.1rem;transition:all .15s;&:hover{transform:rotate(180deg)}`;

const RatesGrid = styled.div`display:grid;grid-template-columns:repeat(4,1fr);gap:10px`;
const RateCard = styled.div<{$active:boolean}>`padding:12px;border-radius:10px;border:1px solid ${p=>p.$active?'#3B82F6':'rgba(100,116,139,0.2)'};background:${p=>p.$active?'rgba(59,130,246,0.1)':'rgba(30,41,59,0.4)'};text-align:center;cursor:pointer`;
const RName = styled.div`font-size:.65rem;color:#94A3B8;font-weight:700`;
const RVal = styled.div`font-size:.85rem;font-weight:800;color:#E2E8F0;margin-top:4px`;

const RATES: Record<string,number> = { USD: 0.27, EUR: 0.25, GBP: 0.21, INR: 22.8 };

export const FXCurrencyConverter: FC = () => {
  const [aed, setAed] = useState(1000000);
  const [target, setTarget] = useState('USD');

  return (
    <Wrap data-testid="fx-currency-converter">
      <Title>💱 Live FX Converter</Title>
      
      <ConverterBox>
        <InputGroup>
          <Input type="number" value={aed} onChange={e=>setAed(+e.target.value)} />
          <Currency>AED</Currency>
        </InputGroup>
        <SwapBtn>⇄</SwapBtn>
        <InputGroup>
          <Input type="text" readOnly value={(aed * RATES[target]).toLocaleString()} />
          <Currency>{target}</Currency>
        </InputGroup>
      </ConverterBox>

      <RatesGrid>
        {Object.entries(RATES).map(([curr, rate]) => (
          <RateCard key={curr} $active={target===curr} onClick={()=>setTarget(curr)}>
            <RName>{curr} / AED</RName>
            <RVal>{rate.toFixed(3)}</RVal>
          </RateCard>
        ))}
      </RatesGrid>
    </Wrap>
  );
};
export default FXCurrencyConverter;
