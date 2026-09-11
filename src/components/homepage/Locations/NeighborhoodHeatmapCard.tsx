import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const shimmer = keyframes`0%{background-position:-200% center}100%{background-position:200% center}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;

const SectionHeader = styled.div`margin-bottom:24px;text-align:center`;
const SectionTitle = styled.h2`font-size:1.6rem;font-weight:900;margin:0 0 8px;background:linear-gradient(135deg,#FFF,#94A3B8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text`;
const SectionSub = styled.p`font-size:.82rem;color:#64748B;margin:0`;

const AreaGrid = styled.div`display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px`;

const AreaCard = styled.div<{$selected:boolean;$color:string}>`
  border-radius:18px;overflow:hidden;cursor:pointer;transition:all .2s;
  border:2px solid ${p=>p.$selected?p.$color+'80':'transparent'};
  &:hover{transform:translateY(-4px);border-color:${p=>p.$color+'60'}}
`;

const AreaTop = styled.div<{$gradient:string}>`
  height:120px;background:${p=>p.$gradient};position:relative;display:flex;align-items:flex-end;padding:12px;
`;
const AreaName = styled.div`font-size:1rem;font-weight:900;color:#FFF;text-shadow:0 2px 8px rgba(0,0,0,.6)`;
const HeatIndicator = styled.div<{$heat:number;$color:string}>`
  position:absolute;top:10px;right:10px;padding:3px 9px;border-radius:999px;
  background:${p=>p.$color+'22'};border:1px solid ${p=>p.$color+'55'};
  font-size:.6rem;font-weight:800;color:${p=>p.$color};
`;

const AreaBottom = styled.div`padding:14px;background:#0F172A`;
const PsfRow = styled.div`display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px`;
const PsfVal = styled.div`font-size:.92rem;font-weight:900;color:#E2E8F0`;
const PsfChange = styled.div<{$up:boolean}>`font-size:.7rem;font-weight:700;color:${p=>p.$up?'#10B981':'#EF4444'}`;

const AmenRow = styled.div`display:flex;gap:6px;flex-wrap:wrap`;
const AmenTag = styled.div`font-size:.6rem;color:#64748B;background:rgba(30,41,59,0.8);border:1px solid rgba(100,116,139,0.15);padding:2px 7px;border-radius:4px`;

const PctBar = styled.div`height:4px;border-radius:2px;background:rgba(30,41,59,0.7);overflow:hidden;margin:8px 0`;
const PctFill = styled.div<{$pct:number;$color:string}>`height:100%;width:${p=>p.$pct}%;background:${p=>p.$color};border-radius:2px`;

const AREAS = [
  {name:'Palm Jumeirah',psf:3250,change:'+12.4%',up:true,heat:99,heatLabel:'🔥 Hottest',color:'#F59E0B',gradient:'linear-gradient(135deg,#1a1000 0%,#2a1800 60%,#140e00 100%)',amenities:['Beach','Marina','Atlantis','Monorail'],pct:100},
  {name:'Downtown Dubai',psf:2840,change:'+9.8%',up:true,heat:92,heatLabel:'🏙️ Premium',color:'#3B82F6',gradient:'linear-gradient(135deg,#050d28 0%,#0a1840 60%,#050d28 100%)',amenities:['Burj Khalifa','Dubai Mall','Fountain','Metro'],pct:87},
  {name:'Dubai Marina',psf:1950,change:'+7.2%',up:true,heat:85,heatLabel:'⚡ Active',color:'#8B5CF6',gradient:'linear-gradient(135deg,#080520 0%,#100a30 60%,#080520 100%)',amenities:['Marina Walk','JBR Beach','Tram','Yachts'],pct:60},
  {name:'Business Bay',psf:1680,change:'+11.1%',up:true,heat:80,heatLabel:'📈 Rising',color:'#10B981',gradient:'linear-gradient(135deg,#021410 0%,#051c14 60%,#021410 100%)',amenities:['Canal','DIFC','Metro','Offices'],pct:52},
  {name:'JVC',psf:980,change:'+14.2%',up:true,heat:88,heatLabel:'💎 Value',color:'#EC4899',gradient:'linear-gradient(135deg,#1a0820 0%,#200a28 60%,#1a0820 100%)',amenities:['Parks','Schools','Retail','Quiet'],pct:30},
  {name:'Dubai Hills',psf:1420,change:'+6.5%',up:true,heat:76,heatLabel:'🌿 Luxury',color:'#14B8A6',gradient:'linear-gradient(135deg,#001a14 0%,#001e16 60%,#001a14 100%)',amenities:['Golf','Mall','Hospital','Parks'],pct:44},
];

export const NeighborhoodHeatmapCard: FC = () => {
  const [selected, setSelected] = useState(0);

  return (
    <Wrap data-testid="neighborhood-heatmap-card">
      <SectionHeader>
        <SectionTitle>Explore Dubai Neighbourhoods</SectionTitle>
        <SectionSub>DLD price data · Q3 2026 · Click any area to explore listings</SectionSub>
      </SectionHeader>
      <AreaGrid>
        {AREAS.map((a,i)=>(
          <AreaCard key={i} $selected={selected===i} $color={a.color} onClick={()=>setSelected(i)}>
            <AreaTop $gradient={a.gradient}>
              <AreaName>{a.name}</AreaName>
              <HeatIndicator $heat={a.heat} $color={a.color}>{a.heatLabel}</HeatIndicator>
            </AreaTop>
            <AreaBottom>
              <PsfRow>
                <PsfVal>AED {a.psf.toLocaleString()}/ft²</PsfVal>
                <PsfChange $up={a.up}>{a.up?'▲':'▼'} {a.change}</PsfChange>
              </PsfRow>
              <PctBar><PctFill $pct={a.pct} $color={a.color}/></PctBar>
              <AmenRow>{a.amenities.map((am,j)=><AmenTag key={j}>{am}</AmenTag>)}</AmenRow>
            </AreaBottom>
          </AreaCard>
        ))}
      </AreaGrid>
    </Wrap>
  );
};
export default NeighborhoodHeatmapCard;
