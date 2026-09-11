import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const pulse = keyframes`0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.4)}50%{box-shadow:0 0 0 15px rgba(239,68,68,0)}`;
const blink = keyframes`0%,100%{opacity:1}50%{opacity:.2}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0A0614,#0F172A);border:2px solid rgba(239,68,68,0.35);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(239,68,68,0.08);border-bottom:1px solid rgba(239,68,68,0.2);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const EmergencyBtn = styled.button<{$activated:boolean}>`
  width:120px;height:120px;border-radius:50%;border:none;margin:0 auto;display:block;
  background:${p=>p.$activated?'rgba(239,68,68,0.15)':'linear-gradient(135deg,#DC2626,#EF4444)'};
  color:#FFF;font-size:${p=>p.$activated?'.72rem':'1.8rem'};font-weight:900;cursor:pointer;
  animation:${p=>p.$activated?pulse:''} 1.5s ease-in-out infinite;
  border:4px solid ${p=>p.$activated?'rgba(239,68,68,0.5)':'#DC2626'};
  transition:all .3s;
  ${p=>p.$activated?'line-height:1.4;':''}
`;

const RouterList = styled.div`display:flex;flex-direction:column;gap:6px`;
const RouterRow = styled.div<{$active:boolean}>`
  display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:9px;
  background:${p=>p.$active?'rgba(239,68,68,0.08)':'rgba(15,23,42,0.6)'};
  border:1px solid ${p=>p.$active?'rgba(239,68,68,0.3)':'rgba(100,116,139,0.12)'};
  transition:all .2s;
`;
const EngIcon = styled.div`font-size:.9rem;flex-shrink:0`;
const EngName = styled.div`font-size:.76rem;font-weight:700;color:#E2E8F0;flex:1`;
const EngPhone = styled.div`font-size:.68rem;color:#64748B`;
const EngStatus = styled.div<{$active:boolean;$notified:boolean}>`font-size:.65rem;font-weight:700;padding:2px 8px;border-radius:4px;background:${p=>p.$notified?'rgba(16,185,129,0.15)':p.$active?'rgba(239,68,68,0.15)':'rgba(100,116,139,0.1)'};color:${p=>p.$notified?'#10B981':p.$active?'#EF4444':'#64748B'}`;

const ENGINEERS = [
  {name:'Ahmad Hassan (Plumbing)',phone:'+971 50 882 4441',specialty:'Water/Pipes',oncall:true},
  {name:'Carlos Rivera (Electrical)',phone:'+971 55 324 8822',specialty:'Power/Fire',oncall:true},
  {name:'Sarah Park (HVAC)',phone:'+971 52 776 9901',specialty:'AC/Ventilation',oncall:false},
  {name:'Mohammed Al Zaabi (Structural)',phone:'+971 56 441 2233',specialty:'Structural',oncall:false},
];

export const EmergencyHotlineRouter: FC = () => {
  const [activated, setActivated] = useState(false);
  const [notified, setNotified] = useState(new Set<number>());

  const activate = () => {
    setActivated(true);
    setTimeout(()=>setNotified(new Set([0,1])),1500);
  };

  return (
    <Wrap data-testid="emergency-hotline-router">
      <Head>
        <Title>🚨 Emergency Hotline Router</Title>
        <div style={{fontSize:'.7rem',color:'#EF4444',fontWeight:700,animation:activated?`${blink} .8s ease-in-out infinite`:''}}>
          {activated?'🔴 EMERGENCY ACTIVE':'Emergency Standby'}
        </div>
      </Head>
      <Body>
        <EmergencyBtn $activated={activated} onClick={!activated?activate:undefined}>
          {activated?'🚨\nEMERGENCY\nACTIVE':'🆘'}
        </EmergencyBtn>
        {!activated && (
          <div style={{fontSize:'.72rem',color:'#64748B',textAlign:'center',fontStyle:'italic'}}>Press to dispatch on-call engineers immediately</div>
        )}

        {activated && (
          <div style={{padding:'12px 14px',borderRadius:'10px',background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.3)',fontSize:'.72rem',color:'#FCA5A5'}}>
            🚨 <strong>EMERGENCY ACTIVATED</strong> — All on-call engineers notified via SMS + WhatsApp. Response time SLA: 15 minutes.
          </div>
        )}

        <div style={{fontSize:'.7rem',color:'#64748B',fontWeight:600}}>On-Call Engineers</div>
        <RouterList>
          {ENGINEERS.map((e,i)=>(
            <RouterRow key={i} $active={e.oncall&&activated}>
              <EngIcon>{e.oncall?'🔴':'⬜'}</EngIcon>
              <div style={{flex:1}}>
                <EngName>{e.name}</EngName>
                <EngPhone>{e.phone} · {e.specialty}</EngPhone>
              </div>
              <EngStatus $active={e.oncall&&activated} $notified={notified.has(i)}>
                {notified.has(i)?'✓ NOTIFIED':e.oncall?'ON-CALL':'OFF-DUTY'}
              </EngStatus>
            </RouterRow>
          ))}
        </RouterList>
      </Body>
    </Wrap>
  );
};
export default EmergencyHotlineRouter;
