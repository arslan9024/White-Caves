import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(59,130,246,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(59,130,246,0.05);border-bottom:1px solid rgba(59,130,246,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const MapContainer = styled.div`aspect-ratio:16/10;border-radius:14px;background:linear-gradient(135deg,#0d1a3a,#0a2040);border:1px solid rgba(59,130,246,0.25);position:relative;overflow:hidden`;
const MapGrid = styled.div`position:absolute;inset:0;opacity:.06;background-image:linear-gradient(rgba(100,116,139,1) 1px,transparent 1px),linear-gradient(90deg,rgba(100,116,139,1) 1px,transparent 1px);background-size:20px 20px`;
const MapLabel = styled.div`position:absolute;top:10px;left:14px;font-size:.72rem;font-weight:700;color:#60A5FA`;

interface PinProps { $x:number; $y:number; $color:string; $selected:boolean; }
const MapPin = styled.div<PinProps>`
  position:absolute;left:${p=>p.$x}%;top:${p=>p.$y}%;transform:translate(-50%,-100%);cursor:pointer;
  filter:${p=>p.$selected?'brightness(1.3)':'brightness(0.85)'};transition:all .15s;
  &:hover{filter:brightness(1.3);transform:translate(-50%,-105%)}
`;

const PinTooltip = styled.div`
  position:absolute;bottom:calc(100% + 4px);left:50%;transform:translateX(-50%);
  background:#0F172A;border:1px solid rgba(59,130,246,0.3);border-radius:6px;
  padding:6px 10px;font-size:.65rem;color:#E2E8F0;white-space:nowrap;pointer-events:none;
  font-family:'Inter',sans-serif;font-weight:600;
`;

const PropList = styled.div`display:flex;flex-direction:column;gap:6px`;
const PropRow = styled.div<{$sel:boolean}>`display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:9px;cursor:pointer;background:${p=>p.$sel?'rgba(59,130,246,0.08)':'rgba(15,23,42,0.6)'};border:1px solid ${p=>p.$sel?'rgba(59,130,246,0.3)':'rgba(100,116,139,0.1)'};transition:all .15s`;
const PColor = styled.div<{$color:string}>`width:10px;height:10px;border-radius:50%;background:${p=>p.$color};flex-shrink:0`;
const PName = styled.div`font-size:.75rem;font-weight:700;color:#CBD5E1;flex:1`;
const PPrice = styled.div`font-size:.72rem;font-weight:900;color:#10B981`;

const PROPERTIES = [
  {name:'Marina Heights 14B',price:'AED 2.45M',color:'#3B82F6',x:22,y:35,type:'2BR Apt'},
  {name:'Downtown Penthouse',price:'AED 18.9M',color:'#8B5CF6',x:55,y:45,type:'4BR PH'},
  {name:'Palm Jumeirah Villa',price:'AED 42M',color:'#F59E0B',x:38,y:65,type:'5BR Villa'},
  {name:'JVC Family Apt',price:'AED 1.1M',color:'#10B981',x:70,y:55,type:'3BR Apt'},
  {name:'Business Bay Office',price:'AED 4.8M',color:'#EF4444',x:60,y:30,type:'Office'},
];

export const PropertyMapPinCluster: FC = () => {
  const [selected, setSelected] = useState<number|null>(0);
  const [hovered, setHovered] = useState<number|null>(null);

  return (
    <Wrap data-testid="property-map-pin-cluster">
      <Head>
        <Title>🗺️ Property Map Pin Cluster</Title>
        <div style={{fontSize:'.7rem',color:'#3B82F6',fontWeight:700}}>Dubai Metro</div>
      </Head>
      <Body>
        <MapContainer>
          <MapGrid/>
          <MapLabel>🗺️ Dubai Emirate</MapLabel>
          {PROPERTIES.map((p,i)=>(
            <MapPin key={i} $x={p.x} $y={p.y} $color={p.color} $selected={selected===i}
              onClick={()=>setSelected(i)} onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(null)}>
              {hovered===i&&<PinTooltip>{p.name}<br/>{p.price}</PinTooltip>}
              <div style={{fontSize:selected===i?'1.5rem':'1.2rem',transition:'font-size .15s'}}>📍</div>
              <div style={{fontSize:'.5rem',color:p.color,fontWeight:900,textAlign:'center',marginTop:-4,textShadow:'0 1px 4px rgba(0,0,0,.8)'}}>{p.type}</div>
            </MapPin>
          ))}
        </MapContainer>

        <PropList>
          {PROPERTIES.map((p,i)=>(
            <PropRow key={i} $sel={selected===i} onClick={()=>setSelected(i)}>
              <PColor $color={p.color}/>
              <PName>{p.name} · {p.type}</PName>
              <PPrice>{p.price}</PPrice>
            </PropRow>
          ))}
        </PropList>
      </Body>
    </Wrap>
  );
};
export default PropertyMapPinCluster;
