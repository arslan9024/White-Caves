import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const Wrapper = styled.div`width: 100%; background: linear-gradient(135deg, #0F172A, #1E293B); border: 2px solid rgba(239,68,68,0.25); border-radius: 18px; overflow: hidden; font-family: 'Inter', sans-serif; animation: ${fadeIn} 0.4s ease;`;
const Header = styled.div`padding: 14px 20px; background: rgba(239,68,68,0.05); border-bottom: 1px solid rgba(239,68,68,0.12); display: flex; align-items: center; justify-content: space-between;`;
const Title = styled.h3`margin: 0; color: #FFF; font-size: 0.9rem; font-weight: 700; display: flex; align-items: center; gap: 8px;`;
const Body = styled.div`padding: 20px; display: flex; flex-direction: column; gap: 14px;`;

const TrusteeGrid = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 10px;`;
const TrusteeCard = styled.div<{ $selected: boolean }>`
  padding: 14px;
  border-radius: 12px;
  background: ${p => p.$selected ? 'rgba(239,68,68,0.08)' : 'rgba(15,23,42,0.7)'};
  border: 2px solid ${p => p.$selected ? '#EF4444' : 'rgba(100,116,139,0.2)'};
  cursor: pointer; transition: all 0.2s ease;
  &:hover { border-color: rgba(239,68,68,0.4); }
`;
const TrusteeName = styled.div`font-size: 0.8rem; font-weight: 700; color: #CBD5E1;`;
const TrusteeAddr = styled.div`font-size: 0.68rem; color: #64748B; margin-top: 3px;`;
const TrusteeHours = styled.div`font-size: 0.68rem; color: #475569; margin-top: 2px;`;
const TrusteeFee = styled.div<{ $selected: boolean }>`font-size: 0.75rem; font-weight: 800; color: ${p => p.$selected ? '#EF4444' : '#64748B'}; margin-top: 6px;`;

const BookingForm = styled.div`display: flex; flex-direction: column; gap: 10px;`;
const Field = styled.div`display: flex; flex-direction: column; gap: 4px;`;
const Label = styled.label`font-size: 0.72rem; color: #94A3B8; font-weight: 600;`;
const Input = styled.input`padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(100,116,139,0.3); background: rgba(15,23,42,0.8); color: #E2E8F0; font-size: 0.82rem; font-weight: 600; width: 100%; box-sizing: border-box; outline: none; &:focus { border-color: #EF4444; }`;

const CostCard = styled.div`padding: 14px; border-radius: 12px; background: rgba(15,23,42,0.7); border: 1px solid rgba(239,68,68,0.18);`;
const CostRow = styled.div`display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid rgba(100,116,139,0.1);`;
const CostLabel = styled.div`font-size: 0.73rem; color: #94A3B8;`;
const CostVal = styled.div`font-size: 0.73rem; font-weight: 800; color: #CBD5E1;`;
const TotalRow = styled.div`display: flex; justify-content: space-between; padding: 8px 10px; border-radius: 7px; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); margin-top: 8px;`;
const BookBtn = styled.button`width: 100%; padding: 12px; border-radius: 10px; border: none; background: linear-gradient(90deg, #EF4444, #F97316); color: #FFF; font-size: 0.85rem; font-weight: 800; cursor: pointer; transition: all 0.2s ease; margin-top: 10px; &:hover { filter: brightness(1.1); transform: translateY(-1px); }`;

const TRUSTEES = [
  { id: 'dnrd', name: 'DNRD Trustee Office', addr: 'Bur Dubai — RERA HQ', hours: 'Sun–Thu 7:30–14:30', fee: 4200 },
  { id: 'emaar', name: 'Emaar Properties Office', addr: 'Downtown Dubai, Tower 1', hours: 'Sun–Thu 9:00–17:00', fee: 4200 },
  { id: 'dip', name: 'DIP Trustee Office', addr: 'Dubai Investment Park', hours: 'Sun–Thu 8:00–15:00', fee: 4200 },
  { id: 'jlt', name: 'JLT Trustee Centre', addr: 'Cluster N, JLT', hours: 'Sun–Thu 8:30–15:30', fee: 4200 },
];

export const TrusteeOfficeBooker: FC = () => {
  const [selected, setSelected] = useState('dnrd');
  const [booked, setBooked] = useState(false);
  const [txDate, setTxDate] = useState('2026-03-05');
  const [txAmt, setTxAmt] = useState('3500000');

  const trustee = TRUSTEES.find(t => t.id === selected)!;
  const dldFee = parseFloat(txAmt) * 0.04;

  return (
    <Wrapper data-testid="trustee-office-booker">
      <Header>
        <Title>🏛️ DLD Trustee Office Appointment</Title>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary, #64748B)' }}>Title Transfer</div>
      </Header>
      <Body>
        <TrusteeGrid>
          {TRUSTEES.map(t => (
            <TrusteeCard key={t.id} $selected={t.id === selected} onClick={() => setSelected(t.id)}>
              <TrusteeName>{t.name}</TrusteeName>
              <TrusteeAddr>📍 {t.addr}</TrusteeAddr>
              <TrusteeHours>🕐 {t.hours}</TrusteeHours>
              <TrusteeFee $selected={t.id === selected}>AED {t.fee.toLocaleString()}</TrusteeFee>
            </TrusteeCard>
          ))}
        </TrusteeGrid>
        <BookingForm>
          <Field><Label>Transaction Date</Label><Input type="date" value={txDate} onChange={e => setTxDate(e.target.value)} /></Field>
          <Field><Label>Property Sale Price (AED)</Label><Input type="number" value={txAmt} onChange={e => setTxAmt(e.target.value)} /></Field>
        </BookingForm>
        <CostCard>
          <CostRow><CostLabel>DLD Transfer Fee (4%)</CostLabel><CostVal>AED {dldFee.toLocaleString()}</CostVal></CostRow>
          <CostRow><CostLabel>Trustee Office Fee</CostLabel><CostVal>AED {trustee.fee.toLocaleString()}</CostVal></CostRow>
          <CostRow><CostLabel>Knowledge & Innovation Fees</CostLabel><CostVal>AED 20</CostVal></CostRow>
          <TotalRow>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-94a3b8, #94A3B8)' }}>Total Payable at Trustee</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--accent-red, #EF4444)' }}>AED {(dldFee + trustee.fee + 20).toLocaleString()}</div>
          </TotalRow>
        </CostCard>
        {!booked ? (
          <BookBtn onClick={() => setBooked(true)}>📅 Book Appointment — {new Date(txDate).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' })}</BookBtn>
        ) : (
          <div style={{ textAlign: 'center', padding: '14px', color: 'var(--accent-green, #10B981)', fontWeight: 700, background: 'rgba(16,185,129,0.08)', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.2)' }}>
            ✅ Appointment Confirmed at {trustee.name}!<br />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary, #64748B)', fontWeight: 400 }}>Reference: WC-TRUST-{Date.now().toString().slice(-6)}</span>
          </div>
        )}
      </Body>
    </Wrapper>
  );
};
export default TrusteeOfficeBooker;
