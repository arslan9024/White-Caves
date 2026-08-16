import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const Wrapper = styled.div`width: 100%; background: linear-gradient(135deg, #0F172A, #1E293B); border: 2px solid rgba(16,185,129,0.25); border-radius: 18px; overflow: hidden; font-family: 'Inter', sans-serif; animation: ${fadeIn} 0.4s ease;`;
const Header = styled.div`padding: 14px 20px; background: rgba(16,185,129,0.05); border-bottom: 1px solid rgba(16,185,129,0.12); display: flex; align-items: center; justify-content: space-between;`;
const Title = styled.h3`margin: 0; color: #FFF; font-size: 0.9rem; font-weight: 700;`;
const Body = styled.div`padding: 20px; display: flex; flex-direction: column; gap: 14px;`;

const EjariForm = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 10px;`;
const Field = styled.div`display: flex; flex-direction: column; gap: 4px;`;
const Label = styled.label`font-size: 0.7rem; color: #94A3B8; font-weight: 600;`;
const Input = styled.input`padding: 8px 10px; border-radius: 7px; border: 1px solid rgba(100,116,139,0.3); background: rgba(15,23,42,0.8); color: #E2E8F0; font-size: 0.78rem; font-weight: 600; width: 100%; box-sizing: border-box; outline: none; &:focus { border-color: #10B981; }`;
const Select = styled.select`padding: 8px 10px; border-radius: 7px; border: 1px solid rgba(100,116,139,0.3); background: rgba(15,23,42,0.8); color: #E2E8F0; font-size: 0.78rem; font-weight: 600; width: 100%; outline: none; &:focus { border-color: #10B981; }`;

const StatusCard = styled.div<{ $registered: boolean }>`
  padding: 20px;
  border-radius: 14px;
  background: ${p => p.$registered ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.06)'};
  border: 2px solid ${p => p.$registered ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'};
  text-align: center;
`;
const StatusIcon = styled.div`font-size: 2.5rem;`;
const StatusLabel = styled.div<{ $registered: boolean }>`font-size: 0.95rem; font-weight: 900; color: ${p => p.$registered ? '#10B981' : '#F59E0B'}; margin-top: 8px;`;
const EjariRef = styled.div`font-size: 0.78rem; color: #64748B; margin-top: 4px;`;

const RegisterBtn = styled.button<{ $done: boolean }>`width: 100%; padding: 12px; border-radius: 10px; border: none; background: ${p => p.$done ? 'rgba(16,185,129,0.1)' : 'linear-gradient(90deg, #059669, #10B981)'}; color: ${p => p.$done ? '#10B981' : '#FFF'}; font-size: 0.85rem; font-weight: 800; cursor: ${p => p.$done ? 'default' : 'pointer'}; transition: all 0.2s ease; &:hover { filter: ${p => p.$done ? 'none' : 'brightness(1.1)'}; }`;

const FeeCard = styled.div`display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;`;
const FeeItem = styled.div`padding: 10px; border-radius: 9px; background: rgba(15,23,42,0.6); border: 1px solid rgba(16,185,129,0.12); text-align: center;`;
const FeeVal = styled.div`font-size: 0.85rem; font-weight: 900; color: #10B981;`;
const FeeLab = styled.div`font-size: 0.62rem; color: #64748B; margin-top: 2px;`;

export const EjariContractRegistrar: FC = () => {
  const [landlord, setLandlord] = useState('Khalid Al Mansouri');
  const [tenant, setTenant] = useState('John Smith');
  const [rent, setRent] = useState('120000');
  const [duration, setDuration] = useState('12');
  const [cheques, setCheques] = useState('4');
  const [registered, setRegistered] = useState(false);
  const [ref] = useState(`TN-2025-${Math.floor(Math.random() * 90000 + 10000)}`);

  const annualRent = parseFloat(rent) || 0;
  const ejariFee = 220;
  const knowledgeFee = 10;
  const innovationFee = 10;
  const total = ejariFee + knowledgeFee + innovationFee;

  return (
    <Wrapper data-testid="ejari-contract-registrar">
      <Header>
        <Title>🏠 Ejari Contract Registrar</Title>
        <div style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 700 }}>Reg. 26/2010</div>
      </Header>
      <Body>
        <EjariForm>
          <Field><Label>Landlord Name</Label><Input value={landlord} onChange={e => setLandlord(e.target.value)} /></Field>
          <Field><Label>Tenant Name</Label><Input value={tenant} onChange={e => setTenant(e.target.value)} /></Field>
          <Field><Label>Annual Rent (AED)</Label><Input type="number" value={rent} onChange={e => setRent(e.target.value)} /></Field>
          <Field><Label>Duration (months)</Label><Select value={duration} onChange={e => setDuration(e.target.value)}><option value="6">6 months</option><option value="12">12 months</option><option value="24">24 months</option></Select></Field>
          <Field><Label>No. of PDC Cheques</Label><Select value={cheques} onChange={e => setCheques(e.target.value)}><option value="1">1 (Annual)</option><option value="2">2 (Bi-Annual)</option><option value="4">4 (Quarterly)</option><option value="12">12 (Monthly)</option></Select></Field>
          <Field><Label>Monthly Rent</Label><Input readOnly value={`AED ${Math.round(annualRent / 12).toLocaleString()}`} style={{ color: '#10B981' }} /></Field>
        </EjariForm>

        <FeeCard>
          <FeeItem><FeeVal>AED {ejariFee}</FeeVal><FeeLab>Ejari Fee</FeeLab></FeeItem>
          <FeeItem><FeeVal>AED {knowledgeFee + innovationFee}</FeeVal><FeeLab>Gov. Fees</FeeLab></FeeItem>
          <FeeItem><FeeVal>AED {total}</FeeVal><FeeLab>Total</FeeLab></FeeItem>
        </FeeCard>

        {registered && (
          <StatusCard $registered={true}>
            <StatusIcon>📋</StatusIcon>
            <StatusLabel $registered={true}>✅ Ejari Registration Successful</StatusLabel>
            <EjariRef>Reference: {ref} — {landlord} / {tenant}</EjariRef>
            <EjariRef>AED {annualRent.toLocaleString()}/yr · {cheques} PDC cheques · {duration} months</EjariRef>
          </StatusCard>
        )}

        <RegisterBtn $done={registered} onClick={() => !registered && setRegistered(true)}>
          {registered ? `✅ Registered — ${ref}` : '📋 Register on Ejari (RERA System)'}
        </RegisterBtn>
      </Body>
    </Wrapper>
  );
};
export default EjariContractRegistrar;
