import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(16,185,129,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(16,185,129,0.05);border-bottom:1px solid rgba(16,185,129,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const CalGrid = styled.div`display:grid;grid-template-columns:repeat(7,1fr);gap:4px`;
const CalHeader = styled.div`text-align:center;font-size:.6rem;font-weight:700;color:#64748B;padding:4px 0`;
const CalDay = styled.div<{$hasTask:boolean;$today:boolean;$sel:boolean}>`
  aspect-ratio:1;border-radius:7px;display:flex;align-items:center;justify-content:center;
  font-size:.72rem;font-weight:700;cursor:pointer;
  background:${p=>p.$sel?'rgba(16,185,129,0.2)':p.$today?'rgba(59,130,246,0.12)':p.$hasTask?'rgba(245,158,11,0.08)':'transparent'};
  border:1px solid ${p=>p.$sel?'rgba(16,185,129,0.5)':p.$today?'rgba(59,130,246,0.3)':p.$hasTask?'rgba(245,158,11,0.25)':'rgba(100,116,139,0.1)'};
  color:${p=>p.$sel?'#10B981':p.$today?'#60A5FA':p.$hasTask?'#F59E0B':'#94A3B8'};
  transition:all .15s;
`;
const TaskDot = styled.div`width:4px;height:4px;border-radius:50%;background:#F59E0B;margin:0 auto;margin-top:2px`;

const TaskList = styled.div`display:flex;flex-direction:column;gap:6px`;
const TaskRow = styled.div<{$status:'due'|'completed'|'upcoming'}>`
  display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:9px;
  background:${p=>({due:'rgba(245,158,11,0.08)',completed:'rgba(16,185,129,0.06)',upcoming:'rgba(15,23,42,0.6)'}[p.$status])};
  border:1px solid ${p=>({due:'rgba(245,158,11,0.25)',completed:'rgba(16,185,129,0.2)',upcoming:'rgba(100,116,139,0.1)'}[p.$status])};
`;
const TaskIcon = styled.div`font-size:.85rem;flex-shrink:0`;
const TaskInfo = styled.div`flex:1`;
const TaskName = styled.div`font-size:.75rem;font-weight:700;color:#CBD5E1`;
const TaskSub = styled.div`font-size:.65rem;color:#64748B;margin-top:1px`;
const TaskBadge = styled.div<{$status:'due'|'completed'|'upcoming'}>`
  font-size:.62rem;font-weight:700;padding:2px 8px;border-radius:4px;
  background:${p=>({due:'rgba(245,158,11,0.15)',completed:'rgba(16,185,129,0.15)',upcoming:'rgba(100,116,139,0.1)'}[p.$status])};
  color:${p=>({due:'#F59E0B',completed:'#10B981',upcoming:'#64748B'}[p.$status])};
`;

const DAYS = ['S','M','T','W','T','F','S'];
const TASK_DAYS = new Set([3,7,12,14,18,21,25,28]);
const TODAY = 7;
const TASKS = [
  {icon:'❄️',name:'Central AC Quarterly Servicing',sub:'Tower A — All 24 units',status:'due' as const},
  {icon:'🛗',name:'Elevator Annual Safety Inspection',sub:'Tower A & B — ThyssenKrupp',status:'completed' as const},
  {icon:'🔥',name:'Fire Suppression System Test',sub:'Civil Defense compliance',status:'upcoming' as const},
  {icon:'🌊',name:'Water Tank Cleaning & Chlorination',sub:'DEWA compliance — semi-annual',status:'upcoming' as const},
  {icon:'🔌',name:'Generator Load Test & Fuel Check',sub:'72-hour autonomy verification',status:'due' as const},
];

export const HvacInspectionCalendar: FC = () => {
  const [selDay, setSelDay] = useState(TODAY);

  return (
    <Wrap data-testid="hvac-inspection-calendar">
      <Head>
        <Title>🛠️ HVAC & Inspection Calendar</Title>
        <div style={{fontSize:'.7rem',color:'#10B981',fontWeight:700}}>September 2026</div>
      </Head>
      <Body>
        <div>
          <CalGrid>{DAYS.map(d=><CalHeader key={d}>{d}</CalHeader>)}</CalGrid>
          <CalGrid>
            {Array.from({length:30},(_,i)=>i+1).map(d=>(
              <div key={d} style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                <CalDay $hasTask={TASK_DAYS.has(d)} $today={d===TODAY} $sel={d===selDay} onClick={()=>setSelDay(d)}>{d}</CalDay>
                {TASK_DAYS.has(d)&&<TaskDot/>}
              </div>
            ))}
          </CalGrid>
        </div>

        <div style={{fontSize:'.7rem',color:'#64748B',fontWeight:600}}>📋 Scheduled Inspections</div>
        <TaskList>
          {TASKS.map((t,i)=>(
            <TaskRow key={i} $status={t.status}>
              <TaskIcon>{t.icon}</TaskIcon>
              <TaskInfo><TaskName>{t.name}</TaskName><TaskSub>{t.sub}</TaskSub></TaskInfo>
              <TaskBadge $status={t.status}>{({due:'DUE',completed:'DONE',upcoming:'UPCOMING'})[t.status]}</TaskBadge>
            </TaskRow>
          ))}
        </TaskList>
      </Body>
    </Wrap>
  );
};
export default HvacInspectionCalendar;
