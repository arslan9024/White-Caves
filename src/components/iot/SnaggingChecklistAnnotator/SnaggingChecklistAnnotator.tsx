import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(245,158,11,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(245,158,11,0.05);border-bottom:1px solid rgba(245,158,11,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const SectionTabs = styled.div`display:flex;gap:6px`;
const STab = styled.button<{$active:boolean}>`flex:1;padding:8px;border-radius:8px;border:1px solid ${p=>p.$active?'rgba(245,158,11,0.4)':'rgba(100,116,139,0.2)'};background:${p=>p.$active?'rgba(245,158,11,0.08)':'transparent'};color:${p=>p.$active?'#F59E0B':'#64748B'};font-size:.72rem;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;transition:all .15s`;

const RoomGrid = styled.div`display:grid;grid-template-columns:repeat(2,1fr);gap:8px`;
const RoomCard = styled.div<{$status:'ok'|'issue'|'note'}>`
  padding:12px;border-radius:10px;cursor:pointer;
  background:${p=>({ok:'rgba(16,185,129,0.06)',issue:'rgba(239,68,68,0.08)',note:'rgba(245,158,11,0.07)'}[p.$status])};
  border:1px solid ${p=>({ok:'rgba(16,185,129,0.2)',issue:'rgba(239,68,68,0.25)',note:'rgba(245,158,11,0.2)'}[p.$status])};
  transition:all .15s;
`;
const RoomIcon = styled.div`font-size:1.1rem;margin-bottom:4px`;
const RoomName = styled.div`font-size:.74rem;font-weight:700;color:#CBD5E1`;
const RoomStatus = styled.div<{$status:'ok'|'issue'|'note'}>`font-size:.65rem;font-weight:700;color:${p=>({ok:'#10B981',issue:'#EF4444',note:'#F59E0B'}[p.$status])};margin-top:2px`;

const PhotoUpload = styled.div`padding:14px;border-radius:12px;background:rgba(15,23,42,0.7);border:2px dashed rgba(245,158,11,0.25);text-align:center;cursor:pointer;transition:all .2s;&:hover{border-color:rgba(245,158,11,0.5)}`;
const UploadIcon = styled.div`font-size:2rem;margin-bottom:4px`;
const UploadText = styled.div`font-size:.72rem;color:#64748B`;

const SignBtn = styled.button`width:100%;padding:12px;border-radius:10px;border:none;background:linear-gradient(90deg,#D97706,#F59E0B);color:#FFF;font-size:.85rem;font-weight:800;cursor:pointer;transition:all .2s;&:hover{filter:brightness(1.1)}`;

const ROOMS = [
  {icon:'🛋️',name:'Living Room',status:'ok' as const},
  {icon:'🛏',name:'Master Bedroom',status:'ok' as const},
  {icon:'🛁',name:'Master Bathroom',status:'issue' as const},
  {icon:'🍳',name:'Kitchen',status:'note' as const},
  {icon:'🛏',name:'Bedroom 2',status:'ok' as const},
  {icon:'🚿',name:'Bathroom 2',status:'ok' as const},
  {icon:'🅿️',name:'Parking Bay',status:'note' as const},
  {icon:'📦',name:'Storage Room',status:'ok' as const},
];

export const SnaggingChecklistAnnotator: FC = () => {
  const [tab, setTab] = useState<'movein'|'moveout'>('movein');
  const [rooms, setRooms] = useState(ROOMS);
  const [completed, setCompleted] = useState(false);

  const cycleStatus = (i:number) => {
    const cycle = {ok:'issue',issue:'note',note:'ok'} as const;
    setRooms(prev=>prev.map((r,j)=>j===i?{...r,status:cycle[r.status]}:r));
  };

  const issues = rooms.filter(r=>r.status==='issue').length;
  const notes = rooms.filter(r=>r.status==='note').length;

  return (
    <Wrap data-testid="snagging-checklist-annotator">
      <Head>
        <Title>📋 Snagging Checklist Annotator</Title>
        <div style={{fontSize:'.7rem',color:'#F59E0B',fontWeight:700}}>{tab==='movein'?'Move-In':'Move-Out'}</div>
      </Head>
      <Body>
        <SectionTabs>
          <STab $active={tab==='movein'} onClick={()=>setTab('movein')}>📥 Move-In</STab>
          <STab $active={tab==='moveout'} onClick={()=>setTab('moveout')}>📤 Move-Out</STab>
        </SectionTabs>

        <div style={{display:'flex',gap:12,padding:'8px 12px',borderRadius:'9px',background:'rgba(15,23,42,0.5)',border:'1px solid rgba(100,116,139,0.12)'}}>
          <div style={{fontSize:'.72rem',color:'#10B981',fontWeight:700}}>✅ {rooms.filter(r=>r.status==='ok').length} OK</div>
          <div style={{fontSize:'.72rem',color:'#EF4444',fontWeight:700}}>⚠️ {issues} Issues</div>
          <div style={{fontSize:'.72rem',color:'#F59E0B',fontWeight:700}}>📝 {notes} Notes</div>
        </div>

        <RoomGrid>
          {rooms.map((r,i)=>(
            <RoomCard key={i} $status={r.status} onClick={()=>cycleStatus(i)}>
              <RoomIcon>{r.icon}</RoomIcon>
              <RoomName>{r.name}</RoomName>
              <RoomStatus $status={r.status}>{({ok:'✓ OK',issue:'⚠ Issue',note:'📝 Note'}[r.status])}</RoomStatus>
            </RoomCard>
          ))}
        </RoomGrid>

        <PhotoUpload>
          <UploadIcon>📸</UploadIcon>
          <UploadText>Tap to upload condition photos · Annotate defects</UploadText>
        </PhotoUpload>

        <SignBtn onClick={()=>setCompleted(true)}>
          {completed?'✅ Checklist Submitted & Signed':'✍️ Sign & Submit Snagging Report'}
        </SignBtn>
      </Body>
    </Wrap>
  );
};
export default SnaggingChecklistAnnotator;
