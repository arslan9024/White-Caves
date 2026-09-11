import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(239,68,68,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(239,68,68,0.05);border-bottom:1px solid rgba(239,68,68,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const UnitGrid = styled.div`display:grid;grid-template-columns:repeat(6,1fr);gap:4px`;
const UnitCell = styled.div<{$status:'available'|'locked'|'reserved'|'selected'}>`
  aspect-ratio:1;border-radius:5px;cursor:pointer;
  background:${p=>({available:'rgba(16,185,129,0.1)',locked:'rgba(239,68,68,0.12)',reserved:'rgba(245,158,11,0.1)',selected:'rgba(59,130,246,0.2)'}[p.$status])};
  border:1px solid ${p=>({available:'rgba(16,185,129,0.3)',locked:'rgba(239,68,68,0.3)',reserved:'rgba(245,158,11,0.25)',selected:'rgba(59,130,246,0.5)'}[p.$status])};
  display:flex;align-items:center;justify-content:center;font-size:.55rem;font-weight:700;
  color:${p=>({available:'#10B981',locked:'#EF4444',reserved:'#F59E0B',selected:'#60A5FA'}[p.$status])};
  transition:all .1s;
`;

const LegendRow = styled.div`display:flex;gap:10px;flex-wrap:wrap`;
const Legend = styled.div`display:flex;align-items:center;gap:4px;font-size:.65rem;color:#64748B`;
const LDot = styled.div<{$color:string}>`width:8px;height:8px;border-radius:2px;background:${p=>p.$color}`;

const Summary = styled.div`padding:12px 16px;border-radius:12px;background:rgba(15,23,42,0.8);border:1px solid rgba(100,116,139,0.15)`;
const SRow = styled.div`display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid rgba(100,116,139,0.08);&:last-child{border-bottom:none}`;
const SL = styled.div`font-size:.72rem;color:#64748B`;
const SV = styled.div`font-size:.72rem;font-weight:700;color:#CBD5E1`;

const LockBtn = styled.button<{$done:boolean}>`width:100%;padding:12px;border-radius:10px;border:none;background:${p=>p.$done?'rgba(16,185,129,0.1)':'linear-gradient(90deg,#DC2626,#EF4444)'};color:${p=>p.$done?'#10B981':'#FFF'};font-size:.85rem;font-weight:800;cursor:pointer;transition:all .2s;&:hover{filter:brightness(1.1)}`;

// Generate 36 units
const generateUnits = () => {
  const statuses: ('available'|'locked'|'reserved')[] = ['available','available','available','locked','reserved'];
  return Array.from({length:36},(_,i)=>statuses[statuses[i%5]==='reserved'&&i>10?0:i%5]);
};

export const BulkUnitReservationLock: FC = () => {
  const [baseUnits] = useState<('available'|'locked'|'reserved')[]>(generateUnits);
  const [selected, setSelected] = useState(new Set<number>());
  const [locked, setLocked] = useState(false);

  const toggle = (i:number) => {
    if(baseUnits[i]!=='available') return;
    setSelected(prev=>{const n=new Set(prev);n.has(i)?n.delete(i):n.add(i);return n});
  };

  const getStatus = (i:number):'available'|'locked'|'reserved'|'selected' =>
    selected.has(i)&&!locked?'selected':locked&&selected.has(i)?'locked':baseUnits[i];

  const lockAll = () => { if(selected.size>0) setLocked(true); };

  return (
    <Wrap data-testid="bulk-unit-reservation-lock">
      <Head>
        <Title>🔒 Bulk Unit Reservation Lock</Title>
        <div style={{fontSize:'.7rem',color:'#EF4444',fontWeight:700}}>Launch Day</div>
      </Head>
      <Body>
        <UnitGrid>
          {baseUnits.map((_,i)=>(
            <UnitCell key={i} $status={getStatus(i)} onClick={()=>toggle(i)}>
              {i+1}
            </UnitCell>
          ))}
        </UnitGrid>

        <LegendRow>
          <Legend><LDot $color="rgba(16,185,129,0.4)"/>Available</Legend>
          <Legend><LDot $color="rgba(59,130,246,0.5)"/>Selected</Legend>
          <Legend><LDot $color="rgba(239,68,68,0.5)"/>Locked</Legend>
          <Legend><LDot $color="rgba(245,158,11,0.4)"/>Reserved</Legend>
        </LegendRow>

        <Summary>
          <SRow><SL>Units Selected</SL><SV style={{color:'#60A5FA'}}>{selected.size}</SV></SRow>
          <SRow><SL>Total Value</SL><SV style={{color:'#10B981'}}>AED {(selected.size*2800000).toLocaleString()}</SV></SRow>
          <SRow><SL>EOI Deposits Required</SL><SV>AED {(selected.size*50000).toLocaleString()}</SV></SRow>
          <SRow><SL>Status</SL><SV style={{color:locked?'#EF4444':'#64748B'}}>{locked?'🔒 LOCKED':'Pending Lock'}</SV></SRow>
        </Summary>

        <LockBtn $done={locked} onClick={lockAll} style={{opacity:selected.size>0?1:0.4}}>
          {locked?`✅ ${selected.size} Units Locked for Launch`:selected.size?`🔒 Lock ${selected.size} Units (AED ${(selected.size*50000).toLocaleString()} EOI)`:'Select units to lock'}
        </LockBtn>
      </Body>
    </Wrap>
  );
};
export default BulkUnitReservationLock;
