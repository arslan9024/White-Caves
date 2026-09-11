import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:280px;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:linear-gradient(135deg,#0F172A,#1E293B);border:1px solid rgba(56,189,248,0.3);border-radius:16px;overflow:hidden;padding:20px;color:#FFF;box-shadow:0 10px 20px rgba(0,0,0,0.5)`;
const Title = styled.div`font-size:.8rem;color:#38BDF8;font-weight:800;text-transform:uppercase;letter-spacing:1px;margin-bottom:16px`;

const MainVal = styled.div`font-size:2rem;font-weight:900;margin-bottom:4px`;
const SubVal = styled.div`font-size:.9rem;color:#94A3B8;margin-bottom:20px`;

const Grid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:12px`;
const FXBox = styled.div`background:rgba(0,0,0,0.3);padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.05)`;
const FLabel = styled.div`font-size:.7rem;color:#94A3B8;margin-bottom:2px`;
const FVal = styled.div`font-size:1rem;font-weight:800;color:#E2E8F0`;

export const CurrencyConverterWidget: FC = () => {
  return (
    <Wrap data-testid="currency-converter-widget">
      <Title>Live FX Rates</Title>
      
      <MainVal>AED 2,500,000</MainVal>
      <SubVal>Property Listed Price</SubVal>

      <Grid>
        <FXBox>
          <FLabel>USD ($)</FLabel>
          <FVal>$ 680,630</FVal>
        </FXBox>
        <FXBox>
          <FLabel>GBP (£)</FLabel>
          <FVal>£ 535,400</FVal>
        </FXBox>
        <FXBox>
          <FLabel>EUR (€)</FLabel>
          <FVal>€ 610,200</FVal>
        </FXBox>
        <FXBox>
          <FLabel>BTC (₿)</FLabel>
          <FVal>₿ 10.45</FVal>
        </FXBox>
      </Grid>
    </Wrap>
  );
};
export default CurrencyConverterWidget;
