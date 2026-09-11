import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Title = styled.h2`margin:0 0 20px;font-size:1.1rem;font-weight:800;color:#E2E8F0`;

const InputGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px`;
const Field = styled.div`display:flex;flex-direction:column;gap:6px`;
const Label = styled.label`font-size:.7rem;color:#94A3B8;font-weight:600`;
const Input = styled.input`padding:12px;border-radius:8px;border:1px solid rgba(100,116,139,0.3);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.9rem;outline:none`;

const ResCard = styled.div`background:linear-gradient(to right, rgba(59,130,246,0.1), rgba(139,92,246,0.1));border:1px solid rgba(59,130,246,0.3);border-radius:12px;padding:20px;text-align:center`;
const TotalLab = styled.div`font-size:.7rem;color:#94A3B8;font-weight:700;text-transform:uppercase;letter-spacing:1px`;
const TotalVal = styled.div`font-size:2rem;font-weight:900;color:#60A5FA;margin:8px 0`;

const Splits = styled.div`display:flex;justify-content:center;gap:24px;margin-top:16px;padding-top:16px;border-top:1px solid rgba(59,130,246,0.2)`;
const SCol = styled.div`text-align:center`;
const SVal = styled.div`font-size:1rem;font-weight:800;color:#E2E8F0`;
const SLab = styled.div`font-size:.6rem;color:#64748B;margin-top:4px`;

export const ServiceChargeCalculator: FC = () => {
  const [area, setArea] = useState(1200);
  const [rate, setRate] = useState(18.5);

  const annual = area * rate;

  return (
    <Wrap data-testid="service-charge-calculator">
      <Title>🏢 Service Charge Calculator</Title>
      
      <InputGrid>
        <Field><Label>Unit Area (sqft)</Label><Input type="number" value={area} onChange={e=>setArea(+e.target.value)} /></Field>
        <Field><Label>DLD Rate (AED/sqft)</Label><Input type="number" step="0.1" value={rate} onChange={e=>setRate(+e.target.value)} /></Field>
      </InputGrid>

      <ResCard>
        <TotalLab>Annual Service Charge</TotalLab>
        <TotalVal>AED {annual.toLocaleString()}</TotalVal>
        
        <Splits>
          <SCol><SVal>{(annual/2).toLocaleString()}</SVal><SLab>Bi-Annual (2 chqs)</SLab></SCol>
          <SCol><SVal>{(annual/4).toLocaleString()}</SVal><SLab>Quarterly (4 chqs)</SLab></SCol>
          <SCol><SVal>{(annual/12).toLocaleString(undefined,{maximumFractionDigits:0})}</SVal><SLab>Monthly</SLab></SCol>
        </Splits>
      </ResCard>
    </Wrap>
  );
};
export default ServiceChargeCalculator;
