import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const progress = keyframes`0%{width:0}100%{width:100%}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(16,185,129,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(16,185,129,0.05);border-bottom:1px solid rgba(16,185,129,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const SectionList = styled.div`display:flex;flex-direction:column;gap:6px`;
const SectionRow = styled.div<{$ok:boolean}>`
  display:flex;align-items:flex-start;gap:10px;padding:10px 12px;border-radius:9px;
  background:${p=>p.$ok?'rgba(16,185,129,0.06)':'rgba(15,23,42,0.6)'};
  border:1px solid ${p=>p.$ok?'rgba(16,185,129,0.2)':'rgba(100,116,139,0.1)'};
`;
const SectionIcon = styled.div`font-size:.85rem;flex-shrink:0;margin-top:2px`;
const SectionBody = styled.div`flex:1`;
const SectionName = styled.div`font-size:.76rem;font-weight:700;color:#CBD5E1`;
const SectionSub = styled.div`font-size:.67rem;color:#64748B;margin-top:2px;line-height:1.4`;
const SectionStatus = styled.div<{$ok:boolean}>`font-size:.62rem;font-weight:700;padding:2px 8px;border-radius:4px;flex-shrink:0;background:${p=>p.$ok?'rgba(16,185,129,0.15)':'rgba(245,158,11,0.12)'};color:${p=>p.$ok?'#10B981':'#F59E0B'}`;

const PhotoGrid = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:6px`;
const PhotoSlot = styled.div<{$filled:boolean}>`aspect-ratio:1;border-radius:8px;background:${p=>p.$filled?'rgba(16,185,129,0.1)':'rgba(15,23,42,0.5)'};border:1px solid ${p=>p.$filled?'rgba(16,185,129,0.25)':'rgba(100,116,139,0.15)'};display:flex;align-items:center;justify-content:center;font-size:.85rem;cursor:pointer`;

const PBar = styled.div`height:4px;border-radius:2px;background:rgba(30,41,59,0.5);overflow:hidden`;
const PFill = styled.div<{$pct:number}>`height:100%;width:${p=>p.$pct}%;background:linear-gradient(90deg,#059669,#10B981);border-radius:2px;transition:width .4s ease`;

const GenBtn = styled.button<{$done:boolean}>`width:100%;padding:12px;border-radius:10px;border:none;background:${p=>p.$done?'rgba(16,185,129,0.1)':'linear-gradient(90deg,#059669,#10B981)'};color:${p=>p.$done?'#10B981':'#FFF'};font-size:.85rem;font-weight:800;cursor:pointer;transition:all .2s;&:hover{filter:brightness(1.1)}`;

const SECTIONS = [
  {icon:'🏠',name:'Exterior & Facade',sub:'Condition of paint, windows, signage',ok:true},
  {icon:'🛋️',name:'Living & Common Areas',sub:'Flooring, walls, lighting',ok:true},
  {icon:'🍳',name:'Kitchen',sub:'Appliances, cabinets, plumbing',ok:true},
  {icon:'🛁',name:'Bathrooms',sub:'Tiles, fixtures, waterproofing',ok:false},
  {icon:'❄️',name:'HVAC System',sub:'Filter condition, cooling efficiency',ok:true},
  {icon:'🔌',name:'Electrical Systems',sub:'Panel board, outlets, earthing',ok:true},
  {icon:'🅿️',name:'Parking & Basement',sub:'Striping, drainage, lighting',ok:false},
  {icon:'🔒',name:'Security Systems',sub:'CCTV, access control, alarms',ok:true},
];

export const PropertyConditionReportGenerator: FC = () => {
  const [photos, setPhotos] = useState(new Set<number>([0,2,4]));
  const [generated, setGenerated] = useState(false);
  const okCount = SECTIONS.filter(s=>s.ok).length;
  const pct = (okCount/SECTIONS.length)*100;

  return (
    <Wrap data-testid="property-condition-report-generator">
      <Head>
        <Title>📋 Property Condition Report</Title>
        <div style={{fontSize:'.7rem',color:'#10B981',fontWeight:700}}>{okCount}/{SECTIONS.length} OK</div>
      </Head>
      <Body>
        <div>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:'.7rem',color:'#64748B',marginBottom:6,fontWeight:600}}>
            <span>Overall Property Score</span><span style={{color:pct>=75?'#10B981':'#F59E0B',fontWeight:700}}>{pct.toFixed(0)}%</span>
          </div>
          <PBar><PFill $pct={pct} /></PBar>
        </div>

        <SectionList>
          {SECTIONS.map((s,i)=>(
            <SectionRow key={i} $ok={s.ok}>
              <SectionIcon>{s.icon}</SectionIcon>
              <SectionBody><SectionName>{s.name}</SectionName><SectionSub>{s.sub}</SectionSub></SectionBody>
              <SectionStatus $ok={s.ok}>{s.ok?'✓ GOOD':'⚠ ISSUE'}</SectionStatus>
            </SectionRow>
          ))}
        </SectionList>

        <div style={{fontSize:'.7rem',color:'#64748B',fontWeight:600}}>📸 Site Photographs ({photos.size}/9)</div>
        <PhotoGrid>
          {Array.from({length:9},(_,i)=>(
            <PhotoSlot key={i} $filled={photos.has(i)} onClick={()=>setPhotos(prev=>{const n=new Set(prev);n.has(i)?n.delete(i):n.add(i);return n})}>
              {photos.has(i)?'📸':'➕'}
            </PhotoSlot>
          ))}
        </PhotoGrid>

        <GenBtn $done={generated} onClick={()=>setGenerated(true)}>
          {generated?`✅ Report Generated — ${okCount}/${SECTIONS.length} sections passing`:'📄 Generate Condition Report PDF'}
        </GenBtn>
      </Body>
    </Wrap>
  );
};
export default PropertyConditionReportGenerator;
