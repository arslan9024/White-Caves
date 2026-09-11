import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(16,185,129,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(16,185,129,0.05);border-bottom:1px solid rgba(16,185,129,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const FormGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:10px`;
const Field = styled.div`display:flex;flex-direction:column;gap:4px`;
const Label = styled.label`font-size:.7rem;color:#94A3B8;font-weight:600`;
const Input = styled.input`padding:8px 10px;border-radius:7px;border:1px solid rgba(100,116,139,0.3);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.78rem;font-weight:600;width:100%;box-sizing:border-box;outline:none;&:focus{border-color:#10B981}`;
const Select = styled.select`padding:8px 10px;border-radius:7px;border:1px solid rgba(100,116,139,0.3);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.78rem;font-weight:600;width:100%;outline:none;&:focus{border-color:#10B981}`;

const MandateCard = styled.div`padding:18px;border-radius:14px;background:rgba(15,23,42,0.8);border:1px solid rgba(16,185,129,0.2)`;
const MandateTitle = styled.div`font-size:.75rem;font-weight:700;color:#10B981;margin-bottom:12px;display:flex;align-items:center;gap:6px`;
const MandateRow = styled.div`display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(100,116,139,0.08)`;
const ML = styled.div`font-size:.72rem;color:#64748B`;
const MV = styled.div`font-size:.72rem;font-weight:700;color:#CBD5E1`;

const SetupBtn = styled.button<{$done:boolean}>`
  width:100%;padding:12px;border-radius:10px;border:none;
  background:${p=>p.$done?'rgba(16,185,129,0.1)':'linear-gradient(90deg,#059669,#10B981)'};
  color:${p=>p.$done?'#10B981':'#FFF'};font-size:.85rem;font-weight:800;cursor:pointer;transition:all .2s;
  &:hover{filter:brightness(1.1)}
`;

export const UaeddsRentMandate: FC = () => {
  const [tenant, setTenant] = useState('Ahmed Al Farsi');
  const [iban, setIban] = useState('AE07 0331 2345 6789 0123 456');
  const [rent, setRent] = useState('12000');
  const [day, setDay] = useState('1');
  const [duration, setDuration] = useState('12');
  const [active, setActive] = useState(false);

  const monthly = parseFloat(rent)||0;
  const ref = `UAEDDS-${Date.now().toString().slice(-8)}`;

  return (
    <Wrap data-testid="uaedds-rent-mandate">
      <Head>
        <Title>🏦 UAEDDS Rent Direct Debit Mandate</Title>
        <div style={{fontSize:'.7rem',color:'#10B981',fontWeight:700}}>CBUAE Direct Debit</div>
      </Head>
      <Body>
        <FormGrid>
          <Field><Label>Tenant Name</Label><Input value={tenant} onChange={e=>setTenant(e.target.value)} /></Field>
          <Field><Label>Debit Day of Month</Label>
            <Select value={day} onChange={e=>setDay(e.target.value)}>
              {[1,5,10,15,20,25,28].map(d=><option key={d} value={d}>Day {d}</option>)}
            </Select>
          </Field>
          <Field style={{gridColumn:'1/-1'}}><Label>Tenant IBAN (UAE)</Label><Input value={iban} onChange={e=>setIban(e.target.value)} /></Field>
          <Field><Label>Monthly Rent (AED)</Label><Input type="number" value={rent} onChange={e=>setRent(e.target.value)} /></Field>
          <Field><Label>Duration (months)</Label><Select value={duration} onChange={e=>setDuration(e.target.value)}><option value="6">6 months</option><option value="12">12 months</option><option value="24">24 months</option></Select></Field>
        </FormGrid>

        {active && (
          <MandateCard>
            <MandateTitle>✅ UAEDDS Mandate Active</MandateTitle>
            <MandateRow><ML>Mandate Ref</ML><MV>{ref}</MV></MandateRow>
            <MandateRow><ML>Tenant</ML><MV>{tenant}</MV></MandateRow>
            <MandateRow><ML>IBAN</ML><MV>{iban.slice(0,10)}...{iban.slice(-4)}</MV></MandateRow>
            <MandateRow><ML>Monthly Debit</ML><MV style={{color:'#10B981'}}>AED {monthly.toLocaleString()}</MV></MandateRow>
            <MandateRow><ML>Debit Day</ML><MV>Day {day} each month</MV></MandateRow>
            <MandateRow><ML>Duration</ML><MV>{duration} months</MV></MandateRow>
            <MandateRow><ML>Total Collected</ML><MV style={{color:'#10B981'}}>AED {(monthly*parseInt(duration)).toLocaleString()}</MV></MandateRow>
          </MandateCard>
        )}

        <SetupBtn $done={active} onClick={()=>setActive(true)}>
          {active?`✅ Mandate Active — ${ref}`:'🏦 Set Up UAEDDS Direct Debit Mandate'}
        </SetupBtn>
      </Body>
    </Wrap>
  );
};
export default UaeddsRentMandate;
