import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); }`;
const Wrapper = styled.div`width: 100%; background: linear-gradient(135deg, #0F172A, #1E293B); border: 2px solid rgba(16,185,129,0.25); border-radius: 18px; overflow: hidden; font-family: 'Inter', sans-serif; animation: ${fadeIn} 0.4s ease;`;
const Header = styled.div`padding: 14px 20px; background: rgba(16,185,129,0.05); border-bottom: 1px solid rgba(16,185,129,0.12); display: flex; align-items: center; justify-content: space-between;`;
const Title = styled.h3`margin: 0; color: #FFF; font-size: 0.9rem; font-weight: 700; display: flex; align-items: center; gap: 8px;`;
const Body = styled.div`padding: 20px; display: flex; flex-direction: column; gap: 14px;`;

const Grid2 = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 12px;`;
const Field = styled.div`display: flex; flex-direction: column; gap: 4px;`;
const Label = styled.label`font-size: 0.72rem; color: #94A3B8; font-weight: 600;`;
const Input = styled.input`padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(100,116,139,0.3); background: rgba(15,23,42,0.8); color: #E2E8F0; font-size: 0.82rem; font-weight: 600; width: 100%; box-sizing: border-box; outline: none; &:focus { border-color: #10B981; }`;
const Select = styled.select`padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(100,116,139,0.3); background: rgba(15,23,42,0.8); color: #E2E8F0; font-size: 0.82rem; font-weight: 600; width: 100%; outline: none; &:focus { border-color: #10B981; }`;

const SummaryCard = styled.div`padding: 16px; border-radius: 12px; background: rgba(15,23,42,0.8); border: 1px solid rgba(16,185,129,0.2);`;
const STitle = styled.div`font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #64748B; margin-bottom: 12px;`;
const FeeLine = styled.div`display: flex; justify-content: space-between; padding: 7px 0; border-bottom: 1px solid rgba(100,116,139,0.1);`;
const FeeLabel = styled.div`font-size: 0.75rem; color: #94A3B8;`;
const FeeVal = styled.div`font-size: 0.75rem; font-weight: 800; color: #CBD5E1;`;
const TotalLine = styled.div`display: flex; justify-content: space-between; padding: 10px; border-radius: 8px; background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.2); margin-top: 8px;`;
const TotalLabel = styled.div`font-size: 0.8rem; font-weight: 700; color: #94A3B8;`;
const TotalVal = styled.div`font-size: 0.95rem; font-weight: 900; color: #10B981;`;

const CalcBtn = styled.button`width: 100%; padding: 12px; border-radius: 10px; border: none; background: linear-gradient(90deg, #059669, #10B981); color: #FFF; font-size: 0.85rem; font-weight: 800; cursor: pointer; transition: all 0.2s ease; &:hover { filter: brightness(1.1); transform: translateY(-1px); }`;

export const DldFeeSimulator: FC = () => {
  const [propertyValue, setPropertyValue] = useState('3500000');
  const [transactionType, setTransactionType] = useState<'sale' | 'resale'>('resale');
  const [calculated, setCalculated] = useState(true);

  const val = parseFloat(propertyValue) || 0;
  const dldFee = val * 0.04;
  const agentFee = val * 0.02;
  const trusteeOffice = transactionType === 'sale' ? 4200 : 2100;
  const mortgageFee = 0;
  const knowledgeFee = 10;
  const innovationFee = 10;
  const total = dldFee + agentFee + trusteeOffice + knowledgeFee + innovationFee;

  return (
    <Wrapper data-testid="dld-fee-simulator">
      <Header>
        <Title>🏛️ DLD Fee Simulator</Title>
        <div style={{ fontSize: '0.7rem', color: 'var(--accent-green, #10B981)', fontWeight: 700 }}>Law 85 of 2006</div>
      </Header>
      <Body>
        <Grid2>
          <Field><Label>Property Value (AED)</Label><Input type="number" value={propertyValue} onChange={e => setPropertyValue(e.target.value)} /></Field>
          <Field>
            <Label>Transaction Type</Label>
            <Select value={transactionType} onChange={e => setTransactionType(e.target.value as 'sale' | 'resale')}>
              <option value="resale">Resale / Secondary Market</option>
              <option value="sale">Off-Plan / Primary Market</option>
            </Select>
          </Field>
        </Grid2>
        <CalcBtn onClick={() => setCalculated(true)}>🧮 Calculate DLD Fees</CalcBtn>

        {calculated && (
          <SummaryCard>
            <STitle>📋 DLD Fee Breakdown — AED {val.toLocaleString()}</STitle>
            <FeeLine><FeeLabel>DLD Transfer Fee (4%)</FeeLabel><FeeVal>AED {dldFee.toLocaleString()}</FeeVal></FeeLine>
            <FeeLine><FeeLabel>Real Estate Agent Commission (2%)</FeeLabel><FeeVal>AED {agentFee.toLocaleString()}</FeeVal></FeeLine>
            <FeeLine><FeeLabel>Trustee Office Fee</FeeLabel><FeeVal>AED {trusteeOffice.toLocaleString()}</FeeVal></FeeLine>
            <FeeLine><FeeLabel>Knowledge Fee</FeeLabel><FeeVal>AED {knowledgeFee}</FeeVal></FeeLine>
            <FeeLine><FeeLabel>Innovation Fee</FeeLabel><FeeVal>AED {innovationFee}</FeeVal></FeeLine>
            <FeeLine><FeeLabel>Mortgage Registration Fee</FeeLabel><FeeVal>AED {mortgageFee} (excl.)</FeeVal></FeeLine>
            <TotalLine>
              <TotalLabel>TOTAL TRANSFER COSTS</TotalLabel>
              <TotalVal>AED {total.toLocaleString()}</TotalVal>
            </TotalLine>
          </SummaryCard>
        )}
      </Body>
    </Wrapper>
  );
};
export default DldFeeSimulator;
