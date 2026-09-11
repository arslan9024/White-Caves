import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(245,158,11,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(245,158,11,0.05);border-bottom:1px solid rgba(245,158,11,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const TicketGrid = styled.div`display:flex;flex-direction:column;gap:8px`;
const TicketCard = styled.div<{$priority:'P0'|'P1'|'P2'}>`
  padding:12px 14px;border-radius:11px;
  background:${p=>({P0:'rgba(239,68,68,0.09)',P1:'rgba(245,158,11,0.07)',P2:'rgba(59,130,246,0.06)'}[p.$priority])};
  border:2px solid ${p=>({P0:'rgba(239,68,68,0.35)',P1:'rgba(245,158,11,0.25)',P2:'rgba(59,130,246,0.2)'}[p.$priority])};
`;
const TicketTop = styled.div`display:flex;align-items:flex-start;gap:8px;margin-bottom:6px`;
const PBadge = styled.div<{$priority:'P0'|'P1'|'P2'}>`font-size:.65rem;font-weight:900;padding:2px 8px;border-radius:5px;flex-shrink:0;background:${p=>({P0:'rgba(239,68,68,0.2)',P1:'rgba(245,158,11,0.15)',P2:'rgba(59,130,246,0.1)'}[p.$priority])};color:${p=>({P0:'#EF4444',P1:'#F59E0B',P2:'#60A5FA'}[p.$priority])}`;
const TicketTitle = styled.div`font-size:.78rem;font-weight:700;color:#E2E8F0;flex:1`;
const SLATimer = styled.div<{$priority:'P0'|'P1'|'P2'}>`font-size:.72rem;font-weight:900;color:${p=>({P0:'#EF4444',P1:'#F59E0B',P2:'#60A5FA'}[p.$priority])};flex-shrink:0`;
const TicketMeta = styled.div`display:flex;gap:10px;flex-wrap:wrap`;
const MetaTag = styled.div`font-size:.65rem;color:#64748B`;
const AssignedBadge = styled.div`font-size:.65rem;font-weight:700;color:#10B981;background:rgba(16,185,129,0.1);padding:2px 8px;border-radius:4px`;

const DispatchBtn = styled.button`width:100%;padding:11px;border-radius:9px;border:none;background:linear-gradient(90deg,#D97706,#F59E0B);color:#FFF;font-size:.82rem;font-weight:800;cursor:pointer;transition:all .2s;&:hover{filter:brightness(1.1)}`;

const TICKETS = [
  {id:'TK-8821',priority:'P0' as const,title:'Water leak — Apt 7C flooding bathroom',unit:'Unit 7C, Tower A',age:'14 min',sla:'2h',contractor:'Ahmed Plumbing LLC',assigned:false},
  {id:'TK-8820',priority:'P0' as const,title:'AC not working — 43°C outdoor temp',unit:'Unit 12B, Tower B',age:'38 min',sla:'2h',contractor:'CoolAir HVAC',assigned:true},
  {id:'TK-8818',priority:'P1' as const,title:'Elevator stuck between floors 3-4',unit:'Tower A Common',age:'1h 12m',sla:'4h',contractor:'ThyssenKrupp',assigned:true},
  {id:'TK-8815',priority:'P2' as const,title:'Lobby lightbulb replacement needed',unit:'Tower B Lobby',age:'2d 4h',sla:'72h',contractor:'Unassigned',assigned:false},
];

export const MaintenanceTicketDispatch: FC = () => {
  const [dispatched, setDispatched] = useState(new Set<string>());

  return (
    <Wrap data-testid="maintenance-ticket-dispatch">
      <Head>
        <Title>🔧 Maintenance Ticket Dispatch</Title>
        <div style={{fontSize:'.7rem',color:'#F59E0B',fontWeight:700}}>SLA Active</div>
      </Head>
      <Body>
        <TicketGrid>
          {TICKETS.map(t=>(
            <TicketCard key={t.id} $priority={t.priority}>
              <TicketTop>
                <PBadge $priority={t.priority}>{t.priority}</PBadge>
                <TicketTitle>{t.title}</TicketTitle>
                <SLATimer $priority={t.priority}>SLA:{t.sla}</SLATimer>
              </TicketTop>
              <TicketMeta>
                <MetaTag>📍 {t.unit}</MetaTag>
                <MetaTag>⏱ {t.age} ago</MetaTag>
                <MetaTag>🔧 {t.contractor}</MetaTag>
                {(t.assigned||dispatched.has(t.id))&&<AssignedBadge>✓ Assigned</AssignedBadge>}
              </TicketMeta>
              {!t.assigned && !dispatched.has(t.id) && (
                <button onClick={()=>setDispatched(p=>{const n=new Set(p);n.add(t.id);return n})}
                  style={{marginTop:8,width:'100%',padding:'6px',borderRadius:'7px',border:'1px solid rgba(245,158,11,0.3)',background:'rgba(245,158,11,0.08)',color:'#F59E0B',fontSize:'.72rem',fontWeight:700,cursor:'pointer',fontFamily:'Inter,sans-serif'}}>
                  ⚡ Dispatch Contractor
                </button>
              )}
            </TicketCard>
          ))}
        </TicketGrid>
        <DispatchBtn>📋 Create New Maintenance Ticket</DispatchBtn>
      </Body>
    </Wrap>
  );
};
export default MaintenanceTicketDispatch;
