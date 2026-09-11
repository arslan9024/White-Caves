import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`display:flex;align-items:center;justify-content:space-between;margin-bottom:16px`;
const HeadTitle = styled.div`font-size:.85rem;font-weight:700;color:#CBD5E1`;
const HeadBadge = styled.div`font-size:.65rem;color:#64748B;background:rgba(30,41,59,0.8);border:1px solid rgba(100,116,139,0.15);padding:3px 10px;border-radius:5px`;

const CalendarWrap = styled.div`background:rgba(15,23,42,0.85);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden`;
const CalHead = styled.div`padding:12px 16px;border-bottom:1px solid rgba(100,116,139,0.1);display:flex;align-items:center;justify-content:space-between`;
const MonthNav = styled.button`padding:4px 10px;border-radius:6px;border:none;background:rgba(59,130,246,0.1);color:#60A5FA;font-size:.72rem;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;transition:all .15s;&:hover{background:rgba(59,130,246,0.2)}`;
const MonthLabel = styled.div`font-size:.8rem;font-weight:700;color:#CBD5E1`;

const DayGrid = styled.div`display:grid;grid-template-columns:repeat(7,1fr);gap:2px;padding:10px`;
const DayHeader = styled.div`text-align:center;font-size:.6rem;font-weight:700;color:#475569;padding:4px 0`;
const Day = styled.div<{$today:boolean;$hasEvent:boolean;$selected:boolean}>`
  text-align:center;padding:6px 2px;border-radius:7px;font-size:.68rem;font-weight:${p=>p.$today?900:600};
  cursor:pointer;position:relative;transition:all .15s;
  color:${p=>p.$today?'#FFF':p.$selected?'#60A5FA':'#94A3B8'};
  background:${p=>p.$today?'#3B82F6':p.$selected?'rgba(59,130,246,0.12)':'transparent'};
  &:hover{background:${p=>p.$today?'#3B82F6':'rgba(59,130,246,0.08)'}}
`;
const EventDot = styled.div<{$color:string}>`width:4px;height:4px;border-radius:50%;background:${p=>p.$color};margin:1px auto 0`;

const UpcomingList = styled.div`border-top:1px solid rgba(100,116,139,0.1);padding:10px 14px;display:flex;flex-direction:column;gap:5px;max-height:130px;overflow-y:auto`;
const EventRow = styled.div<{$color:string}>`display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:7px;background:${p=>p.$color}08;border-left:2px solid ${p=>p.$color}`;
const EventTime = styled.div`font-size:.65rem;font-weight:700;color:#60A5FA;font-family:'Courier New',monospace;flex-shrink:0;width:44px`;
const EventLabel = styled.div`font-size:.68rem;color:#CBD5E1;font-weight:600;flex:1`;
const EventType = styled.div<{$color:string}>`font-size:.58rem;font-weight:700;color:${p=>p.$color}`;

const DAYS_HEADER = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const TODAY = 8; // Sep 8
const EVENT_DAYS: Record<number,{color:string;count:number}> = {
  3:{color:'#F59E0B',count:1},8:{color:'#10B981',count:3},
  12:{color:'#3B82F6',count:2},15:{color:'#EF4444',count:1},
  19:{color:'#8B5CF6',count:2},22:{color:'#F59E0B',count:1},24:{color:'#10B981',count:2},
};

const EVENTS = [
  {time:'10:00',label:'Viewing — Marina Heights 14B',color:'#10B981',type:'Viewing'},
  {time:'11:30',label:'Client Call — Sheikh Abdullah',color:'#3B82F6',type:'Call'},
  {time:'14:00',label:'SPA Signing — Downtown PH',color:'#8B5CF6',type:'Legal'},
  {time:'16:30',label:'Team Meeting — Q3 Review',color:'#F59E0B',type:'Internal'},
];

export const DashboardMiniCalendar: FC = () => {
  const [selected, setSelected] = useState(TODAY);
  const [month, setMonth] = useState('September 2026');

  const days = Array.from({length:35},(_,i)=>i-2); // offset for Sep starting on Tue

  return (
    <Wrap data-testid="dashboard-mini-calendar">
      <Head>
        <HeadTitle>📅 Calendar</HeadTitle>
        <HeadBadge>4 events today</HeadBadge>
      </Head>
      <CalendarWrap>
        <CalHead>
          <MonthNav onClick={()=>{}}>←</MonthNav>
          <MonthLabel>{month}</MonthLabel>
          <MonthNav onClick={()=>{}}>→</MonthNav>
        </CalHead>
        <DayGrid>
          {DAYS_HEADER.map(d=><DayHeader key={d}>{d}</DayHeader>)}
          {days.map((d,i)=>{
            const day = d+1;
            const valid = day>=1&&day<=30;
            const ev = EVENT_DAYS[day];
            return (
              <Day key={i} $today={day===TODAY} $hasEvent={!!ev} $selected={selected===day&&day!==TODAY}
                onClick={()=>valid&&setSelected(day)}>
                {valid?day:''}
                {valid&&ev&&<EventDot $color={ev.color}/>}
              </Day>
            );
          })}
        </DayGrid>
        <UpcomingList>
          {EVENTS.map((e,i)=>(
            <EventRow key={i} $color={e.color}>
              <EventTime>{e.time}</EventTime>
              <EventLabel>{e.label}</EventLabel>
              <EventType $color={e.color}>{e.type}</EventType>
            </EventRow>
          ))}
        </UpcomingList>
      </CalendarWrap>
    </Wrap>
  );
};
export default DashboardMiniCalendar;
