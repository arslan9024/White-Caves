import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.85);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden`;
const Head = styled.div`padding:14px 18px;border-bottom:1px solid rgba(100,116,139,0.1);display:flex;align-items:center;justify-content:space-between`;
const HeadTitle = styled.div`font-size:.85rem;font-weight:700;color:#CBD5E1`;

const CanvasWrap = styled.div`padding:16px;position:relative`;
const SVGWrap = styled.svg`width:100%;border-radius:12px;background:rgba(10,18,40,0.8);border:1px solid rgba(100,116,139,0.15)`;

const RoomLabel = styled.text`font-family:'Inter',sans-serif;font-size:10px;fill:#64748B;font-weight:600;text-anchor:middle`;
const DimLabel = styled.text`font-family:'Inter',sans-serif;font-size:8px;fill:#475569;text-anchor:middle`;

const LegendRow = styled.div`display:flex;gap:12px;padding:0 16px 14px;flex-wrap:wrap`;
const LegendItem = styled.div<{$color:string}>`display:flex;align-items:center;gap:5px;font-size:.63rem;color:#64748B`;
const LegendDot = styled.div<{$color:string}>`width:10px;height:10px;border-radius:2px;background:${p=>p.$color}`;

interface Room {id:number;x:number;y:number;w:number;h:number;label:string;dim:string;color:string}
const ROOMS: Room[] = [
  {id:1,x:10,y:10,w:120,h:100,label:'Living Room',dim:'22\' × 18\'',color:'rgba(59,130,246,0.12)'},
  {id:2,x:140,y:10,w:90,h:80,label:'Master Bed',dim:'16\' × 14\'',color:'rgba(139,92,246,0.12)'},
  {id:3,x:10,y:120,w:80,h:80,label:'Bedroom 2',dim:'14\' × 14\'',color:'rgba(139,92,246,0.08)'},
  {id:4,x:100,y:120,w:70,h:60,label:'Kitchen',dim:'12\' × 10\'',color:'rgba(16,185,129,0.12)'},
  {id:5,x:10,y:210,w:60,h:50,label:'Bath 1',dim:'9\' × 8\'',color:'rgba(245,158,11,0.1)'},
  {id:6,x:80,y:190,w:50,h:40,label:'Bath 2',dim:'7\' × 7\'',color:'rgba(245,158,11,0.08)'},
  {id:7,x:180,y:100,w:50,h:90,label:'Balcony',dim:'9\' × 16\'',color:'rgba(20,184,166,0.12)'},
  {id:8,x:140,y:100,w:30,h:40,label:'Hall',dim:'5\' × 7\'',color:'rgba(100,116,139,0.08)'},
];

export const PropertyFloorPlanViewer: FC = () => {
  const [selected, setSelected] = useState<number|null>(null);

  return (
    <Wrap data-testid="property-floor-plan-viewer">
      <Head>
        <HeadTitle>🗺️ Interactive Floor Plan — 2BR Apt (1,450 sqft)</HeadTitle>
        <div style={{fontSize:'.65rem',color:'#64748B'}}>Click room to highlight</div>
      </Head>
      <CanvasWrap>
        <SVGWrap viewBox="0 0 250 280">
          {ROOMS.map(r=>(
            <g key={r.id} onClick={()=>setSelected(r.id===selected?null:r.id)} style={{cursor:'pointer'}}>
              <rect x={r.x} y={r.y} width={r.w} height={r.h}
                fill={selected===r.id?r.color.replace(/[\d.]+\)$/,'0.35)'):r.color}
                stroke={selected===r.id?'rgba(59,130,246,0.8)':'rgba(100,116,139,0.3)'}
                strokeWidth={selected===r.id?1.5:1}
                rx={4}/>
              <RoomLabel x={r.x+r.w/2} y={r.y+r.h/2-4}>{r.label}</RoomLabel>
              <DimLabel x={r.x+r.w/2} y={r.y+r.h/2+8}>{r.dim}</DimLabel>
            </g>
          ))}
          {/* North indicator */}
          <text x={220} y={20} fontSize={10} fill="#475569" textAnchor="middle" fontFamily="Inter">N↑</text>
        </SVGWrap>
      </CanvasWrap>
      <LegendRow>
        <LegendItem $color="#3B82F6"><LegendDot $color="rgba(59,130,246,0.3)"/>Living Areas</LegendItem>
        <LegendItem $color="#8B5CF6"><LegendDot $color="rgba(139,92,246,0.3)"/>Bedrooms</LegendItem>
        <LegendItem $color="#10B981"><LegendDot $color="rgba(16,185,129,0.3)"/>Kitchen</LegendItem>
        <LegendItem $color="#F59E0B"><LegendDot $color="rgba(245,158,11,0.3)"/>Bathrooms</LegendItem>
        <LegendItem $color="#14B8A6"><LegendDot $color="rgba(20,184,166,0.3)"/>Outdoor</LegendItem>
      </LegendRow>
    </Wrap>
  );
};
export default PropertyFloorPlanViewer;
