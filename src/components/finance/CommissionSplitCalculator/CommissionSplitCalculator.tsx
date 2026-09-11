import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;

const Title = styled.h2`margin:0 0 20px;font-size:1.1rem;font-weight:800;color:#E2E8F0`;

const InputGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px`;
const Field = styled.div`display:flex;flex-direction:column;gap:4px`;
const Label = styled.label`font-size:.7rem;color:#94A3B8;font-weight:600`;
const Input = styled.input`padding:10px 12px;border-radius:8px;border:1px solid rgba(100,116,139,0.3);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.9rem;font-weight:700;outline:none`;

const Divider = styled.div`height:1px;background:rgba(100,116,139,0.2);margin:20px 0`;

const ResGrid = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:12px`;
const ResCard = styled.div<{$color:string}>`background:${p=>p.$color}10;border:1px solid ${p=>p.$color}30;border-radius:12px;padding:16px;text-align:center`;
const ResVal = styled.div<{$color:string}>`font-size:1.3rem;font-weight:900;color:${p=>p.$color}`;
const ResLab = styled.div`font-size:.65rem;color:#94A3B8;margin-top:4px;font-weight:600`;

export const CommissionSplitCalculator: FC = () => {
  const [price, setPrice] = useState(5000000);
  const [commPct, setCommPct] = useState(2);
  const [splitPct, setSplitPct] = useState(60);

  const totalComm = price * (commPct/100);
  const agentCut = totalComm * (splitPct/100);
  const companyCut = totalComm - agentCut;

  return (
    <Wrap data-testid="commission-split-calculator">
      <Title>💰 Commission Split Calculator</Title>
      
      <InputGrid>
        <Field><Label>Property Price (AED)</Label><Input type="number" value={price} onChange={e=>setPrice(+e.target.value)}/></Field>
        <Field><Label>Commission Rate (%)</Label><Input type="number" value={commPct} onChange={e=>setCommPct(+e.target.value)}/></Field>
        <Field style={{gridColumn:'1/-1'}}><Label>Agent Split Percentage (%)</Label><Input type="number" value={splitPct} onChange={e=>setSplitPct(+e.target.value)}/></Field>
      </InputGrid>

      <Divider />

      <ResGrid>
        <ResCard $color="#F59E0B">
          <ResVal $color="#F59E0B">{totalComm.toLocaleString()}</ResVal>
          <ResLab>Total Commission (AED)</ResLab>
        </ResCard>
        <ResCard $color="#10B981">
          <ResVal $color="#10B981">{agentCut.toLocaleString()}</ResVal>
          <ResLab>Agent Net Pay ({splitPct}%)</ResLab>
        </ResCard>
        <ResCard $color="#3B82F6">
          <ResVal $color="#3B82F6">{companyCut.toLocaleString()}</ResVal>
          <ResLab>Company Retained ({(100-splitPct)}%)</ResLab>
        </ResCard>
      </ResGrid>
    </Wrap>
  );
};
export default CommissionSplitCalculator;
