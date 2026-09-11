import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:350px;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:#0F172A;border:1px solid rgba(255,255,255,0.1);border-radius:18px;overflow:hidden;padding:24px;color:#FFF`;
const Title = styled.h2`margin:0 0 16px;font-size:1.1rem;font-weight:900;color:#38BDF8`;

const ValBox = styled.div`background:linear-gradient(135deg,rgba(56,189,248,0.1),rgba(15,23,42,0.9));border:1px solid rgba(56,189,248,0.3);padding:20px;border-radius:12px;text-align:center;margin-bottom:20px`;
const VMain = styled.div`font-size:2rem;font-weight:900;color:#FFF;margin-bottom:4px`;
const VRange = styled.div`font-size:.85rem;color:#94A3B8`;

const DataList = styled.div`display:flex;flex-direction:column;gap:8px`;
const DRow = styled.div`display:flex;justify-content:space-between;font-size:.8rem;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05)`;

export const PropertyValuationModel: FC = () => {
  return (
    <Wrap data-testid="property-valuation-model">
      <Title>🤖 AI Automated Valuation</Title>
      
      <ValBox>
        <VMain>AED 3,450,000</VMain>
        <VRange>Est. Range: AED 3.2M - 3.6M</VRange>
      </ValBox>

      <DataList>
        <DRow>
          <span style={{color:'#94A3B8'}}>Based On</span>
          <span style={{fontWeight:800}}>14 Recent DLD Transactions</span>
        </DRow>
        <DRow>
          <span style={{color:'#94A3B8'}}>Confidence Score</span>
          <span style={{fontWeight:800,color:'#10B981'}}>High (92%)</span>
        </DRow>
        <DRow style={{border:0}}>
          <span style={{color:'#94A3B8'}}>Last Updated</span>
          <span style={{fontWeight:800}}>Today, 08:00 AM</span>
        </DRow>
      </DataList>
    </Wrap>
  );
};
export default PropertyValuationModel;
