/**
 * TrusteeOfficeScheduler — Wave 48 GOAL-027
 * Dubai Trustee Office appointment booking queue scheduler & transfer slot allocator
 * White Caves Real Estate LLC — Compliance & Conveyancing Suite
 */
import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  border: 2px solid rgba(239, 68, 68, 0.25);
  border-radius: 18px;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  animation: ${fadeIn} 0.4s ease;
`;

const Head = styled.div`
  padding: 14px 20px;
  background: rgba(239, 68, 68, 0.05);
  border-bottom: 1px solid rgba(239, 68, 68, 0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  margin: 0;
  color: #FFF;
  font-size: 0.92rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Tag = styled.span`
  font-size: 0.68rem;
  font-weight: 800;
  color: #EF4444;
  background: rgba(239, 68, 68, 0.1);
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid rgba(239, 68, 68, 0.25);
`;

const Body = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FLabel = styled.label`
  font-size: 0.68rem;
  font-weight: 700;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Input = styled.input`
  padding: 8px 10px;
  border-radius: 7px;
  border: 1px solid rgba(100, 116, 139, 0.25);
  background: rgba(15, 23, 42, 0.8);
  color: #E2E8F0;
  font-size: 0.8rem;
  font-weight: 600;
  width: 100%;
  box-sizing: border-box;
  outline: none;
  &:focus { border-color: #EF4444; }
`;

const Select = styled.select`
  padding: 8px 10px;
  border-radius: 7px;
  border: 1px solid rgba(100, 116, 139, 0.25);
  background: rgba(15, 23, 42, 0.8);
  color: #E2E8F0;
  font-size: 0.8rem;
  font-weight: 600;
  width: 100%;
  outline: none;
  &:focus { border-color: #EF4444; }
`;

const SlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`;

const SlotCard = styled.button<{ $selected: boolean; $available: boolean }>`
  padding: 8px;
  border-radius: 8px;
  border: 1px solid ${p => p.$selected ? '#EF4444' : 'rgba(100, 116, 139, 0.2)'};
  background: ${p => p.$selected ? 'rgba(239, 68, 68, 0.15)' : p.$available ? 'rgba(15, 23, 42, 0.7)' : 'rgba(100, 116, 139, 0.08)'};
  color: ${p => p.$selected ? '#FFF' : p.$available ? '#E2E8F0' : '#64748B'};
  font-size: 0.75rem;
  font-weight: 700;
  cursor: ${p => p.$available ? 'pointer' : 'not-allowed'};
  text-align: center;
  transition: all 0.2s ease;
  &:hover { ${p => p.$available && 'border-color: #EF4444;'} }
`;

const BookBtn = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(90deg, #DC2626, #EF4444);
  color: #FFF;
  font-size: 0.85rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { filter: brightness(1.1); transform: translateY(-1px); }
`;

const TRUSTEE_OFFICES = [
  'Tamleek Real Estate Registration Trustee (Al Barsha)',
  'Al Tabu Real Estate Trustee (Business Bay)',
  'Trust Real Estate Registration Trustee (Deira)',
  'Fixit Registration Trustee (Downtown Dubai)',
];

const TIME_SLOTS = [
  { time: '09:30 AM', available: true },
  { time: '11:00 AM', available: true },
  { time: '01:30 PM', available: false },
  { time: '03:00 PM', available: true },
  { time: '04:30 PM', available: true },
  { time: '05:30 PM', available: false },
  { time: '06:30 PM', available: true },
  { time: '07:30 PM', available: true },
];

export const TrusteeOfficeScheduler: FC = () => {
  const [selectedOffice, setSelectedOffice] = useState(TRUSTEE_OFFICES[0]);
  const [propertyTitle, setPropertyTitle] = useState('Villa 14B, Palm Jumeirah');
  const [transferDate, setTransferDate] = useState('2026-08-20');
  const [selectedSlot, setSelectedSlot] = useState('11:00 AM');
  const [booked, setBooked] = useState(false);

  return (
    <Wrap data-testid="trustee-office-scheduler">
      <Head>
        <Title>🏛️ Dubai DLD Trustee Office Transfer Scheduler</Title>
        <Tag>DLD TRUSTEE PORTAL</Tag>
      </Head>
      <Body>
        <FormGrid>
          <Field>
            <FLabel>Trustee Registration Office</FLabel>
            <Select value={selectedOffice} onChange={e => setSelectedOffice(e.target.value)}>
              {TRUSTEE_OFFICES.map((o, idx) => (
                <option key={idx} value={o}>{o}</option>
              ))}
            </Select>
          </Field>
          <Field>
            <FLabel>Property / Title Deed Reference</FLabel>
            <Input value={propertyTitle} onChange={e => setPropertyTitle(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Preferred Transfer Date</FLabel>
            <Input type="date" value={transferDate} onChange={e => setTransferDate(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Mandatory DLD Fees</FLabel>
            <Input value="DLD 4% + Trustee Fee AED 4,200 (Manager Cheque)" readOnly style={{ color: 'var(--accent-green, #10B981)', fontWeight: 700 }} />
          </Field>
        </FormGrid>

        <div>
          <FLabel style={{ marginBottom: '8px', display: 'block' }}>Available Registration Trustee Appointment Slots</FLabel>
          <SlotGrid>
            {TIME_SLOTS.map((s, idx) => (
              <SlotCard
                key={idx}
                $selected={selectedSlot === s.time}
                $available={s.available}
                onClick={() => s.available && setSelectedSlot(s.time)}
              >
                <div>{s.time}</div>
                <div style={{ fontSize: '0.62rem', color: s.available ? 'var(--accent-green, #10B981)' : 'var(--accent-red, #EF4444)', marginTop: '2px' }}>
                  {s.available ? 'AVAILABLE' : 'BOOKED'}
                </div>
              </SlotCard>
            ))}
          </SlotGrid>
        </div>

        {booked ? (
          <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', textAlign: 'center', color: 'var(--accent-green, #10B981)', fontWeight: 800, fontSize: '0.82rem' }}>
            ✓ Trustee Appointment Confirmed for {transferDate} at {selectedSlot} ({selectedOffice})!
          </div>
        ) : (
          <BookBtn onClick={() => setBooked(true)}>
            📅 Confirm DLD Trustee Office Booking Slot ({selectedSlot})
          </BookBtn>
        )}
      </Body>
    </Wrap>
  );
};

export default TrusteeOfficeScheduler;
