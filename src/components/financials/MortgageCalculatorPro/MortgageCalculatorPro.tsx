import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;max-width:500px;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.95);border:1px solid rgba(100,116,139,0.3);border-radius:24px;overflow:hidden;padding:32px;color:#FFF`;
const Title = styled.h2`margin:0 0 24px;font-size:1.3rem;font-weight:900`;

const InputRow = styled.div`display:flex;align-items:center;justify-content:space-between;margin-bottom:16px`;
const Label = styled.label`font-size:.9rem;font-weight:700;color:#CBD5E1`;
const Input = styled.input`width:140px;padding:10px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.2);border-radius:8px;color:#FFF;font-size:1rem;font-weight:800;text-align:right`;

const BreakWrap = styled.div`background:rgba(255,255,255,0.03);border-radius:12px;padding:20px;margin-top:24px`;
const BRow = styled.div`display:flex;justify-content:space-between;padding:8px 0;font-size:.85rem;color:#94A3B8;border-bottom:1px solid rgba(255,255,255,0.05)`;
const BVal = styled.div`font-weight:800;color:#E2E8F0`;

export const MortgageCalculatorPro: FC = () => {
  return (
    <Wrap data-testid="mortgage-calculator-pro">
      <Title>🧮 Dubai Mortgage Calculator Pro</Title>
      
      <InputRow>
        <Label>Property Price (AED)</Label>
        <Input defaultValue="2,000,000" />
      </InputRow>
      <InputRow>
        <Label>Down Payment (20%)</Label>
        <Input defaultValue="400,000" />
      </InputRow>
      <InputRow>
        <Label>Interest Rate (%)</Label>
        <Input defaultValue="4.5" />
      </InputRow>

      <BreakWrap>
        <div style={{fontSize:'1rem',fontWeight:800,color:'#FFF',marginBottom:12}}>Upfront Closing Costs</div>
        <BRow><span>DLD Fee (4%) + AED 580</span> <BVal>AED 80,580</BVal></BRow>
        <BRow><span>Agency Fee (2% + VAT)</span> <BVal>AED 42,000</BVal></BRow>
        <BRow><span>Mortgage Reg. (0.25%)</span> <BVal>AED 4,290</BVal></BRow>
        <BRow><span>Trustee / NOC Fees</span> <BVal>AED 5,250</BVal></BRow>
        <BRow style={{marginTop:12,borderTop:'1px solid rgba(255,255,255,0.2)',paddingTop:12,color:'#FFF',fontSize:'1.1rem',fontWeight:900}}>
          <span>Total Upfront Needed</span> <span>AED 532,120</span>
        </BRow>
      </BreakWrap>
    </Wrap>
  );
};
export default MortgageCalculatorPro;
