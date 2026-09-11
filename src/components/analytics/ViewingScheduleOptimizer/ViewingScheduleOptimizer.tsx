import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(16,185,129,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(16,185,129,0.05);border-bottom:1px solid rgba(16,185,129,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const TimeGrid = styled.div`display:grid;grid-template-columns:repeat(7,1fr);gap:4px`;
const TimeHeader = styled.div`font-size:.58rem;font-weight:700;color:#64748B;text-align:center;padding:3px 0`;
const TimeSlot = styled.div<{$bookings:number}>`
  aspect-ratio:1;border-radius:5px;display:flex;align-items:center;justify-content:center;
  font-size:.6rem;font-weight:700;cursor:pointer;
  background:${p=>p.$bookings>=3?'rgba(239,68,68,0.2)':p.$bookings>=1?'rgba(16,185,129,0.15)':'rgba(15,23,42,0.4)'};
  border:1px solid ${p=>p.$bookings>=3?'rgba(239,68,68,0.35)':p.$bookings>=1?'rgba(16,185,129,0.3)':'rgba(100,116,139,0.1)'};
  color:${p=>p.$bookings>=3?'#EF4444':p.$bookings>=1?'#10B981':'#475569'};
  transition:all .15s;&:hover{filter:brightness(1.2)}
`;
const UpcomingList = styled.div`display:flex;flex-direction:column;gap:6px`;
const ViewRow = styled.div`display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:9px;background:rgba(15,23,42,0.7);border:1px solid rgba(16,185,129,0.12)`;
const ViewTime = styled.div`font-size:.7rem;font-weight:700;color:#10B981;font-family:'Courier New',monospace;flex-shrink:0;width:50px`;
const ViewInfo = styled.div`flex:1`;
const ViewProp = styled.div`font-size:.74rem;font-weight:700;color:#CBD5E1`;
const ViewClient = styled.div`font-size:.65rem;color:#64748B;margin-top:2px`;
const ViewAgent = styled.div`font-size:.65rem;font-weight:700;color:#60A5FA;flex-shrink:0`;

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const HEATMAP = [2,0,1,3,1,2,0, 1,3,2,1,0,3,1, 0,1,3,2,1,0,2, 3,1,0,2,3,1,0, 2,0,1,3,2,1,3, 3,2,1,0,2,3,1];
const VIEWINGS = [
  {time:'10:00',prop:'Marina Heights 14B',client:'Sarah Thompson',agent:'Victoria C.'},
  {time:'11:30',prop:'Palm Villa 22',client:'Sheikh Abdullah',agent:'Ahmed R.'},
  {time:'14:00',prop:'Downtown Penthouse',client:'James Rothschild',agent:'Victoria C.'},
  {time:'16:30',prop:'JVC Family Apt 4C',client:'Rania Al Farsi',agent:'Jaime T.'},
];

export const ViewingScheduleOptimizer: FC = () => {
  const [booked, setBooked] = useState(new Set<number>([10,11,17]));

  return (
    <Wrap data-testid="viewing-schedule-optimizer">
      <Head>
        <Title>📅 Viewing Schedule Optimizer</Title>
        <div style={{fontSize:'.7rem',color:'#10B981',fontWeight:700}}>Today: {VIEWINGS.length} viewings</div>
      </Head>
      <Body>
        <div>
          <div style={{fontSize:'.7rem',color:'#64748B',fontWeight:600,marginBottom:6}}>Weekly Viewing Heatmap</div>
          <TimeGrid>
            {DAYS.map(d=><TimeHeader key={d}>{d}</TimeHeader>)}
            {HEATMAP.map((b,i)=>(
              <TimeSlot key={i} $bookings={booked.has(i)?b+1:b} onClick={()=>setBooked(prev=>{const n=new Set(prev);n.has(i)?n.delete(i):n.add(i);return n})}>
                {booked.has(i)?b+1:b||''}
              </TimeSlot>
            ))}
          </TimeGrid>
          <div style={{display:'flex',gap:10,marginTop:6}}>
            <div style={{display:'flex',alignItems:'center',gap:4,fontSize:'.6rem',color:'#64748B'}}><div style={{width:8,height:8,borderRadius:2,background:'rgba(16,185,129,0.3)'}}/>1–2 viewings</div>
            <div style={{display:'flex',alignItems:'center',gap:4,fontSize:'.6rem',color:'#64748B'}}><div style={{width:8,height:8,borderRadius:2,background:'rgba(239,68,68,0.3)'}}/>3+ peak</div>
          </div>
        </div>

        <div style={{fontSize:'.7rem',color:'#64748B',fontWeight:600}}>📋 Today's Schedule</div>
        <UpcomingList>
          {VIEWINGS.map((v,i)=>(
            <ViewRow key={i}>
              <ViewTime>{v.time}</ViewTime>
              <ViewInfo><ViewProp>{v.prop}</ViewProp><ViewClient>{v.client}</ViewClient></ViewInfo>
              <ViewAgent>{v.agent}</ViewAgent>
            </ViewRow>
          ))}
        </UpcomingList>
      </Body>
    </Wrap>
  );
};
export default ViewingScheduleOptimizer;
