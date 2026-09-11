import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(59,130,246,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(59,130,246,0.05);border-bottom:1px solid rgba(59,130,246,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const AmenityGrid = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:8px`;
const AmenityCard = styled.div<{$sel:boolean}>`padding:14px 10px;border-radius:12px;text-align:center;cursor:pointer;background:${p=>p.$sel?'rgba(59,130,246,0.12)':'rgba(15,23,42,0.6)'};border:2px solid ${p=>p.$sel?'rgba(59,130,246,0.45)':'rgba(100,116,139,0.15)'};transition:all .15s`;
const AmenIcon = styled.div`font-size:1.5rem;margin-bottom:4px`;
const AmenName = styled.div<{$sel:boolean}>`font-size:.72rem;font-weight:700;color:${p=>p.$sel?'#60A5FA':'#94A3B8'}`;
const AmenAvail = styled.div`font-size:.62rem;color:#64748B;margin-top:2px`;

const SlotGrid = styled.div`display:grid;grid-template-columns:repeat(4,1fr);gap:6px`;
const SlotBtn = styled.div<{$booked:boolean;$sel:boolean}>`padding:8px 6px;border-radius:7px;text-align:center;cursor:${p=>p.$booked?'default':'pointer'};background:${p=>p.$sel?'rgba(59,130,246,0.15)':p.$booked?'rgba(239,68,68,0.06)':'rgba(16,185,129,0.06)'};border:1px solid ${p=>p.$sel?'rgba(59,130,246,0.45)':p.$booked?'rgba(239,68,68,0.2)':'rgba(16,185,129,0.2)'};transition:all .15s`;
const SlotTime = styled.div`font-size:.68rem;font-weight:700;color:#CBD5E1`;
const SlotSt = styled.div<{$booked:boolean}>`font-size:.58rem;color:${p=>p.$booked?'#EF4444':'#10B981'}`;

const BookBtn = styled.button<{$done:boolean}>`width:100%;padding:12px;border-radius:10px;border:none;background:${p=>p.$done?'rgba(59,130,246,0.1)':'linear-gradient(90deg,#1D4ED8,#3B82F6)'};color:${p=>p.$done?'#60A5FA':'#FFF'};font-size:.85rem;font-weight:800;cursor:pointer;transition:all .2s;&:hover{filter:brightness(1.1)}`;

const AMENITIES = [
  {id:'gym',name:'Gym',icon:'🏋️',avail:'Open 6AM-11PM'},
  {id:'pool',name:'Pool',icon:'🏊',avail:'7AM-10PM'},
  {id:'tennis',name:'Tennis',icon:'🎾',avail:'7AM-9PM'},
  {id:'bbq',name:'BBQ Area',icon:'🔥',avail:'4PM-11PM'},
  {id:'sauna',name:'Sauna',icon:'🧖',avail:'By booking'},
  {id:'lounge',name:'Sky Lounge',icon:'🌆',avail:'VIP only'},
];
const SLOTS = ['06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'];
const BOOKED_SLOTS = new Set(['08:00','09:00','14:00','15:00']);

export const AmenityBookingCalendar: FC = () => {
  const [selected, setSelected] = useState('gym');
  const [selSlot, setSelSlot] = useState<string|null>(null);
  const [booked, setBooked] = useState(false);

  const book = () => { if(selSlot) setBooked(true); };

  return (
    <Wrap data-testid="amenity-booking-calendar">
      <Head>
        <Title>🏊 Amenity Booking Calendar</Title>
        <div style={{fontSize:'.7rem',color:'#3B82F6',fontWeight:700}}>Community</div>
      </Head>
      <Body>
        <AmenityGrid>
          {AMENITIES.map(a=>(
            <AmenityCard key={a.id} $sel={selected===a.id} onClick={()=>{setSelected(a.id);setSelSlot(null);setBooked(false)}}>
              <AmenIcon>{a.icon}</AmenIcon>
              <AmenName $sel={selected===a.id}>{a.name}</AmenName>
              <AmenAvail>{a.avail}</AmenAvail>
            </AmenityCard>
          ))}
        </AmenityGrid>

        <div style={{fontSize:'.7rem',color:'#64748B',fontWeight:600}}>Available Slots — Today</div>
        <SlotGrid>
          {SLOTS.map(s=>(
            <SlotBtn key={s} $booked={BOOKED_SLOTS.has(s)} $sel={selSlot===s} onClick={()=>!BOOKED_SLOTS.has(s)&&setSelSlot(s)}>
              <SlotTime>{s}</SlotTime>
              <SlotSt $booked={BOOKED_SLOTS.has(s)}>{BOOKED_SLOTS.has(s)?'Booked':selSlot===s?'Selected':'Free'}</SlotSt>
            </SlotBtn>
          ))}
        </SlotGrid>

        {booked && (
          <div style={{padding:'12px 14px',borderRadius:'10px',background:'rgba(59,130,246,0.08)',border:'1px solid rgba(59,130,246,0.25)',textAlign:'center',fontSize:'.78rem',fontWeight:700,color:'#60A5FA'}}>
            ✅ Booking Confirmed — {AMENITIES.find(a=>a.id===selected)?.name} at {selSlot}
          </div>
        )}

        <BookBtn $done={booked} onClick={book} style={{opacity:selSlot?1:0.5}}>
          {booked?'✅ Booking Confirmed':selSlot?`🏊 Book ${AMENITIES.find(a=>a.id===selected)?.name} at ${selSlot}`:'Select a time slot above'}
        </BookBtn>
      </Body>
    </Wrap>
  );
};
export default AmenityBookingCalendar;
