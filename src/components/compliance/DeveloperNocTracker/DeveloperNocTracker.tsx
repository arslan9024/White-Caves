import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(245,158,11,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(245,158,11,0.05);border-bottom:1px solid rgba(245,158,11,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const DevGrid = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:8px`;
const DevCard = styled.div<{$sel:boolean}>`
  padding:12px 10px;border-radius:11px;text-align:center;cursor:pointer;
  background:${p=>p.$sel?'rgba(245,158,11,0.1)':'rgba(15,23,42,0.6)'};
  border:2px solid ${p=>p.$sel?'rgba(245,158,11,0.4)':'rgba(100,116,139,0.15)'};
  transition:all .15s;
`;
const DevLogo = styled.div`font-size:1.5rem;margin-bottom:4px`;
const DevName = styled.div`font-size:.7rem;font-weight:700;color:#CBD5E1`;

const StepTrack = styled.div`display:flex;flex-direction:column;gap:8px`;
const StepRow = styled.div<{$status:'done'|'current'|'pending'}>`
  display:flex;align-items:flex-start;gap:10px;padding:10px 12px;border-radius:9px;
  background:${p=>({done:'rgba(16,185,129,0.06)',current:'rgba(245,158,11,0.08)',pending:'rgba(15,23,42,0.5)'}[p.$status])};
  border:1px solid ${p=>({done:'rgba(16,185,129,0.2)',current:'rgba(245,158,11,0.25)',pending:'rgba(100,116,139,0.1)'}[p.$status])};
`;
const StepIco = styled.div`font-size:.85rem;flex-shrink:0;margin-top:2px`;
const StepBody = styled.div`flex:1`;
const StepName = styled.div`font-size:.75rem;font-weight:700;color:#CBD5E1`;
const StepSub = styled.div`font-size:.67rem;color:#64748B;margin-top:2px`;
const StepBadge = styled.div<{$status:'done'|'current'|'pending'}>`
  padding:2px 8px;border-radius:5px;font-size:.6rem;font-weight:700;flex-shrink:0;align-self:flex-start;
  background:${p=>({done:'rgba(16,185,129,0.15)',current:'rgba(245,158,11,0.15)',pending:'rgba(100,116,139,0.1)'}[p.$status])};
  color:${p=>({done:'#10B981',current:'#F59E0B',pending:'#64748B'}[p.$status])};
`;

const DEVS = [
  {id:'emaar',name:'EMAAR',logo:'🏙️'},
  {id:'damac',name:'DAMAC',logo:'🏢'},
  {id:'nakheel',name:'Nakheel',logo:'🌴'},
];

const NOC_STEPS = [
  {label:'Submit NOC Request + Service Charge Receipt',sub:'Upload DLD receipt + clearance letter',status:'done' as const},
  {label:'Developer Fee Payment',sub:'Admin fee AED 500–2,500 depending on developer',status:'done' as const},
  {label:'Developer Internal Processing',sub:'Typically 3–7 business days',status:'current' as const},
  {label:'Developer NOC Certificate Issued',sub:'Valid for 30 days from issue date',status:'pending' as const},
  {label:'DLD Title Transfer with NOC',sub:'Book Trustee Office appointment within NOC validity',status:'pending' as const},
];

export const DeveloperNocTracker: FC = () => {
  const [dev, setDev] = useState('emaar');
  const d = DEVS.find(d=>d.id===dev)!;

  return (
    <Wrap data-testid="developer-noc-tracker">
      <Head>
        <Title>📑 Master Developer NOC Tracker</Title>
        <div style={{fontSize:'.7rem',color:'#F59E0B',fontWeight:700}}>Step 3 of 5</div>
      </Head>
      <Body>
        <DevGrid>
          {DEVS.map(dv=>(
            <DevCard key={dv.id} $sel={dev===dv.id} onClick={()=>setDev(dv.id)}>
              <DevLogo>{dv.logo}</DevLogo>
              <DevName>{dv.name}</DevName>
            </DevCard>
          ))}
        </DevGrid>

        <div style={{padding:'10px 14px',borderRadius:'9px',background:'rgba(245,158,11,0.06)',border:'1px solid rgba(245,158,11,0.18)'}}>
          <div style={{fontSize:'.72rem',fontWeight:700,color:'#F59E0B'}}>{d.logo} {d.name} Properties</div>
          <div style={{fontSize:'.68rem',color:'#64748B',marginTop:3}}>NOC Ref: NOC-{d.name.toUpperCase()}-2025-{Math.floor(Math.random()*90000+10000)} · Est. 5 business days</div>
        </div>

        <StepTrack>
          {NOC_STEPS.map((s,i)=>(
            <StepRow key={i} $status={s.status}>
              <StepIco>{({done:'✅',current:'🔄',pending:'⏳'})[s.status]}</StepIco>
              <StepBody><StepName>{s.label}</StepName><StepSub>{s.sub}</StepSub></StepBody>
              <StepBadge $status={s.status}>{({done:'DONE',current:'IN PROGRESS',pending:'PENDING'})[s.status]}</StepBadge>
            </StepRow>
          ))}
        </StepTrack>
      </Body>
    </Wrap>
  );
};
export default DeveloperNocTracker;
