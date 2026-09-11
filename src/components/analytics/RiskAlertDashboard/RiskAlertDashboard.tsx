import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(239,68,68,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(239,68,68,0.05);border-bottom:1px solid rgba(239,68,68,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const AlertList = styled.div`display:flex;flex-direction:column;gap:7px`;
const AlertCard = styled.div<{$level:'critical'|'warning'|'info'}>`
  padding:12px 14px;border-radius:11px;
  background:${p=>({critical:'rgba(239,68,68,0.09)',warning:'rgba(245,158,11,0.07)',info:'rgba(59,130,246,0.06)'}[p.$level])};
  border:2px solid ${p=>({critical:'rgba(239,68,68,0.35)',warning:'rgba(245,158,11,0.25)',info:'rgba(59,130,246,0.2)'}[p.$level])};
`;
const AlertTop = styled.div`display:flex;align-items:flex-start;gap:10px;margin-bottom:6px`;
const AlertIcon = styled.div`font-size:1rem;flex-shrink:0`;
const AlertTitle = styled.div`font-size:.76rem;font-weight:700;color:#E2E8F0;flex:1`;
const AlertTime = styled.div`font-size:.62rem;color:#64748B;flex-shrink:0`;
const AlertDesc = styled.div`font-size:.68rem;color:#94A3B8;line-height:1.4`;
const AlertActions = styled.div`display:flex;gap:6px;margin-top:8px`;
const ActionBtn = styled.button<{$primary?:boolean}>`padding:4px 10px;border-radius:6px;border:1px solid ${p=>p.$primary?'rgba(16,185,129,0.4)':'rgba(100,116,139,0.2)'};background:${p=>p.$primary?'rgba(16,185,129,0.1)':'transparent'};color:${p=>p.$primary?'#10B981':'#64748B'};font-size:.65rem;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif`;

const ALERTS = [
  {level:'critical' as const,icon:'🚨',title:'Bounced Cheque — Unit 7C',desc:'Cheque No. 0042821 AED 18,500 bounced. Tenant: Ahmed Al Farsi. 3rd occurrence — legal notice required.',time:'09:14'},
  {level:'critical' as const,icon:'⚠️',title:'RERA Form A Expiry — 3 Properties',desc:'Form A permits TRK-2025-8821, 8844, 8891 expire in 72 hours. Immediate renewal needed to avoid listing suspension.',time:'08:30'},
  {level:'warning' as const,icon:'🔶',title:'Lead SLA Breach — 4 Leads',desc:'Sheikh Abdullah, James R., Zhang Wei, Rania A. exceeded 15-min response SLA. Supervisor escalation triggered.',time:'08:05'},
  {level:'warning' as const,icon:'💳',title:'PDC Cheque Due Tomorrow',desc:'6 post-dated cheques totalling AED 142,000 are due for deposit tomorrow. Confirm with banking team.',time:'07:00'},
  {level:'info' as const,icon:'📋',title:'VAT Filing Deadline — 15 Sep',desc:'Q3 2026 UAE VAT return due in 8 days. @Invoice team: prepare 5% VAT summary report.',time:'Yesterday'},
];

export const RiskAlertDashboard: FC = () => {
  const [dismissed, setDismissed] = useState(new Set<number>());
  const visible = ALERTS.filter((_,i)=>!dismissed.has(i));

  return (
    <Wrap data-testid="risk-alert-dashboard">
      <Head>
        <Title>🚨 Risk Alert Dashboard</Title>
        <div style={{fontSize:'.7rem',color:'#EF4444',fontWeight:700}}>{visible.length} Active</div>
      </Head>
      <Body>
        {visible.length===0 && (
          <div style={{textAlign:'center',padding:'24px',fontSize:'.8rem',color:'#10B981',fontWeight:700}}>
            ✅ All alerts cleared — System healthy
          </div>
        )}
        <AlertList>
          {ALERTS.map((a,i)=>!dismissed.has(i)&&(
            <AlertCard key={i} $level={a.level}>
              <AlertTop>
                <AlertIcon>{a.icon}</AlertIcon>
                <AlertTitle>{a.title}</AlertTitle>
                <AlertTime>{a.time}</AlertTime>
              </AlertTop>
              <AlertDesc>{a.desc}</AlertDesc>
              <AlertActions>
                <ActionBtn $primary>✅ Resolve</ActionBtn>
                <ActionBtn onClick={()=>setDismissed(p=>{const n=new Set(p);n.add(i);return n})}>Dismiss</ActionBtn>
              </AlertActions>
            </AlertCard>
          ))}
        </AlertList>
      </Body>
    </Wrap>
  );
};
export default RiskAlertDashboard;
