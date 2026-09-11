import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(139,92,246,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(139,92,246,0.05);border-bottom:1px solid rgba(139,92,246,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const CalendarGrid = styled.div`display:grid;grid-template-columns:repeat(6,1fr);gap:4px`;
const TimeSlot = styled.div<{$booked:boolean;$selected:boolean;$available:boolean}>`
  padding:8px 4px;border-radius:7px;text-align:center;cursor:${p=>p.$available&&!p.$booked?'pointer':'default'};
  background:${p=>p.$selected?'rgba(139,92,246,0.2)':p.$booked?'rgba(239,68,68,0.08)':'rgba(16,185,129,0.06)'};
  border:1px solid ${p=>p.$selected?'rgba(139,92,246,0.5)':p.$booked?'rgba(239,68,68,0.2)':'rgba(16,185,129,0.2)'};
  transition:all .15s;
  &:hover{border-color:${p=>!p.$booked&&p.$available?'rgba(139,92,246,0.4)':'inherit'}};
`;
const SlotTime = styled.div`font-size:.65rem;font-weight:700;color:#94A3B8`;
const SlotStatus = styled.div<{$booked:boolean;$selected:boolean}>`font-size:.6rem;color:${p=>p.$selected?'#A78BFA':p.$booked?'#EF4444':'#10B981'}`;

const FormGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:10px`;
const Field = styled.div`display:flex;flex-direction:column;gap:4px`;
const Label = styled.label`font-size:.7rem;color:#94A3B8;font-weight:600`;
const Input = styled.input`padding:8px 10px;border-radius:7px;border:1px solid rgba(100,116,139,0.3);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.78rem;font-weight:600;width:100%;box-sizing:border-box;outline:none;&:focus{border-color:#8B5CF6}`;
const Select = styled.select`padding:8px 10px;border-radius:7px;border:1px solid rgba(100,116,139,0.3);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.78rem;font-weight:600;width:100%;outline:none;&:focus{border-color:#8B5CF6}`;

const BookBtn = styled.button`width:100%;padding:12px;border-radius:10px;border:none;background:linear-gradient(90deg,#7C3AED,#8B5CF6);color:#FFF;font-size:.85rem;font-weight:800;cursor:pointer;transition:all .2s;&:hover{filter:brightness(1.1)}`;

const TIMES = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','13:00','13:30','14:00','14:30'];
const BOOKED = new Set(['09:00','10:00','13:30']);

export const TrusteeOfficeScheduler: FC = () => {
  const [selected, setSelected] = useState<string|null>(null);
  const [office, setOffice] = useState('dnrd');
  const [txDate, setTxDate] = useState('2026-09-14');
  const [confirmed, setConfirmed] = useState(false);

  const book = () => { if(selected) setConfirmed(true); };

  return (
    <Wrap data-testid="trustee-office-scheduler">
      <Head>
        <Title>🏛️ Trustee Office Appointment Queue</Title>
        <div style={{fontSize:'.7rem',color:'#8B5CF6',fontWeight:700}}>DLD Booking</div>
      </Head>
      <Body>
        <FormGrid>
          <Field>
            <Label>Trustee Office</Label>
            <Select value={office} onChange={e=>setOffice(e.target.value)}>
              <option value="dnrd">DNRD — Bur Dubai</option>
              <option value="emaar">Emaar — Downtown</option>
              <option value="jlt">JLT Trustee Centre</option>
              <option value="dip">DIP Office</option>
            </Select>
          </Field>
          <Field><Label>Transfer Date</Label><Input type="date" value={txDate} onChange={e=>setTxDate(e.target.value)} /></Field>
        </FormGrid>

        <div>
          <div style={{fontSize:'.7rem',color:'#64748B',marginBottom:8,fontWeight:600}}>Available Time Slots — {new Date(txDate).toLocaleDateString('en-AE',{weekday:'long',day:'numeric',month:'short'})}</div>
          <CalendarGrid>
            {TIMES.map(t=>(
              <TimeSlot key={t} $booked={BOOKED.has(t)} $selected={selected===t} $available={!BOOKED.has(t)} onClick={()=>!BOOKED.has(t)&&setSelected(t)}>
                <SlotTime>{t}</SlotTime>
                <SlotStatus $booked={BOOKED.has(t)} $selected={selected===t}>
                  {BOOKED.has(t)?'Booked':selected===t?'Selected':'Free'}
                </SlotStatus>
              </TimeSlot>
            ))}
          </CalendarGrid>
        </div>

        {confirmed ? (
          <div style={{padding:'14px',borderRadius:'11px',background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.25)',textAlign:'center'}}>
            <div style={{fontSize:'1rem',fontWeight:900,color:'#10B981'}}>✅ Appointment Confirmed!</div>
            <div style={{fontSize:'.72rem',color:'#64748B',marginTop:4}}>
              {txDate} at {selected} — WC-TRUST-{Date.now().toString().slice(-6)}
            </div>
          </div>
        ) : (
          <BookBtn onClick={book} style={{opacity:selected?1:0.5}}>
            {selected ? `📅 Book ${selected} Slot at ${office.toUpperCase()}` : 'Select a time slot above'}
          </BookBtn>
        )}
      </Body>
    </Wrap>
  );
};
export default TrusteeOfficeScheduler;
