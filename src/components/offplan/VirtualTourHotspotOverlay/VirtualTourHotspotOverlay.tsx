import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0A0614,#0F172A);border:2px solid rgba(139,92,246,0.3);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(139,92,246,0.08);border-bottom:1px solid rgba(139,92,246,0.2);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const VRContainer = styled.div<{$active:boolean}>`
  aspect-ratio:16/9;border-radius:16px;overflow:hidden;position:relative;
  background:${p=>p.$active?'linear-gradient(135deg,#1a0533 0%,#0d1a40 40%,#0a2040 100%)':'rgba(15,23,42,0.7)'};
  border:2px solid ${p=>p.$active?'rgba(139,92,246,0.5)':'rgba(139,92,246,0.2)'};
  cursor:pointer;
`;
const VRGrid = styled.div<{$active:boolean}>`
  position:absolute;inset:0;opacity:${p=>p.$active?.15:0};
  background-image:linear-gradient(rgba(139,92,246,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.3) 1px,transparent 1px);
  background-size:40px 40px;transition:opacity .5s;perspective:800px;transform:rotateX(20deg);
`;
const VRScene = styled.div<{$active:boolean}>`position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;transition:all .3s`;
const RoomLabel = styled.div<{$active:boolean}>`font-size:${p=>p.$active?'.85rem':'.8rem'};font-weight:900;color:${p=>p.$active?'#C4B5FD':'#94A3B8'}`;

const NavRow = styled.div`display:flex;gap:8px;flex-wrap:wrap`;
const NavBtn = styled.button<{$active:boolean}>`padding:6px 12px;border-radius:7px;border:1px solid ${p=>p.$active?'rgba(139,92,246,0.5)':'rgba(100,116,139,0.2)'};background:${p=>p.$active?'rgba(139,92,246,0.12)':'transparent'};color:${p=>p.$active?'#A78BFA':'#64748B'};font-size:.68rem;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;transition:all .15s`;

const ROOMS = ['🏠 Lobby','🛋️ Living Room','🛏 Master Bed','🍳 Kitchen','🏊 Pool Deck','🌆 Rooftop'];

const HotspotDot = styled.div<{$x:number;$y:number}>`
  position:absolute;left:${p=>p.$x}%;top:${p=>p.$y}%;
  width:12px;height:12px;border-radius:50%;
  background:rgba(139,92,246,0.8);
  border:2px solid #C4B5FD;
  cursor:pointer;
  &::after{content:'';position:absolute;inset:-4px;border-radius:50%;border:1px solid rgba(139,92,246,0.4);animation:pulse 2s ease-in-out infinite}
`;

export const VirtualTourHotspotOverlay: FC = () => {
  const [active, setActive] = useState(false);
  const [room, setRoom] = useState(0);

  return (
    <Wrap data-testid="virtual-tour-hotspot-overlay">
      <Head>
        <Title>🥽 Virtual Tour Hotspot Overlay</Title>
        <div style={{fontSize:'.7rem',color:'#A78BFA',fontWeight:700}}>360° VR</div>
      </Head>
      <Body>
        <VRContainer $active={active} onClick={()=>setActive(true)}>
          <VRGrid $active={active} />
          <VRScene $active={active}>
            {!active ? (
              <>
                <div style={{fontSize:'2.5rem',marginBottom:8}}>🥽</div>
                <RoomLabel $active={false}>Click to Enter Virtual Tour</RoomLabel>
                <div style={{fontSize:'.68rem',color:'#64748B',marginTop:4}}>Marina Heights, Unit 14B</div>
              </>
            ) : (
              <>
                <div style={{fontSize:'2rem',marginBottom:6}}>🏠</div>
                <RoomLabel $active={true}>{ROOMS[room]}</RoomLabel>
                <div style={{fontSize:'.7rem',color:'#7C3AED',marginTop:4}}>Marina Heights, Unit 14B</div>
              </>
            )}
          </VRScene>
          {active && (
            <>
              <HotspotDot $x={30} $y={50}/>
              <HotspotDot $x={55} $y={40}/>
              <HotspotDot $x={72} $y={60}/>
            </>
          )}
        </VRContainer>

        {active && (
          <NavRow>
            {ROOMS.map((r,i)=>(
              <NavBtn key={i} $active={room===i} onClick={()=>setRoom(i)}>{r}</NavBtn>
            ))}
          </NavRow>
        )}

        {!active && (
          <div style={{padding:'10px 14px',borderRadius:'9px',background:'rgba(139,92,246,0.07)',border:'1px solid rgba(139,92,246,0.2)',fontSize:'.72rem',color:'#94A3B8'}}>
            🥽 Immersive 360° virtual tour with clickable hotspots — view all rooms, amenities, and views without visiting in person.
          </div>
        )}
      </Body>
    </Wrap>
  );
};
export default VirtualTourHotspotOverlay;
