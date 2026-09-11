import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:#0F172A;border-radius:20px;overflow:hidden;border:1px solid rgba(100,116,139,0.12)`;

const MainImage = styled.div<{$gradient:string}>`
  width:100%;aspect-ratio:16/9;background:${p=>p.$gradient};position:relative;display:flex;align-items:center;justify-content:center;cursor:pointer;
`;
const MainLabel = styled.div`color:rgba(255,255,255,.25);font-size:1rem;font-weight:700`;
const ImageCounter = styled.div`position:absolute;bottom:12px;left:12px;padding:4px 12px;border-radius:999px;background:rgba(0,0,0,0.6);backdrop-filter:blur(8px);font-size:.7rem;font-weight:700;color:#FFF`;

const ActionRow = styled.div`position:absolute;bottom:12px;right:12px;display:flex;gap:6px`;
const ActionBtn = styled.button<{$active?:boolean}>`padding:6px 12px;border-radius:8px;border:none;font-size:.68rem;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;backdrop-filter:blur(10px);transition:all .15s;background:${p=>p.$active?'rgba(239,68,68,0.4)':'rgba(0,0,0,0.5)'};color:#FFF;&:hover{background:rgba(59,130,246,0.5)}`;

const ThumbnailStrip = styled.div`display:flex;gap:6px;padding:10px;overflow-x:auto;&::-webkit-scrollbar{height:3px}&::-webkit-scrollbar-thumb{background:rgba(59,130,246,0.3);border-radius:2px}`;
const Thumb = styled.div<{$gradient:string;$active:boolean}>`
  min-width:72px;height:52px;border-radius:8px;background:${p=>p.$gradient};cursor:pointer;flex-shrink:0;
  border:2px solid ${p=>p.$active?'#3B82F6':'transparent'};transition:all .15s;
  display:flex;align-items:center;justify-content:center;font-size:.55rem;color:rgba(255,255,255,.4);
  &:hover{border-color:rgba(59,130,246,0.5)}
`;

const PHOTOS = [
  {label:'Living Room',gradient:'linear-gradient(135deg,#0a1428,#1a2840)'},
  {label:'Master Bedroom',gradient:'linear-gradient(135deg,#1a0814,#280a1e)'},
  {label:'Kitchen',gradient:'linear-gradient(135deg,#0a2010,#0e2814)'},
  {label:'Bathroom',gradient:'linear-gradient(135deg,#0a1040,#101848)'},
  {label:'Balcony / Sea View',gradient:'linear-gradient(135deg,#041428,#062040)'},
  {label:'Building Lobby',gradient:'linear-gradient(135deg,#141414,#202020)'},
  {label:'Pool & Gym',gradient:'linear-gradient(135deg,#0a1428,#0a2028)'},
  {label:'Floor Plan',gradient:'linear-gradient(135deg,#081028,#0e1838)'},
];

export const PropertyHeroGallery: FC = () => {
  const [active, setActive] = useState(0);
  const [saved, setSaved] = useState(false);

  return (
    <Wrap data-testid="property-hero-gallery">
      <MainImage $gradient={PHOTOS[active].gradient}>
        <MainLabel>📷 {PHOTOS[active].label}</MainLabel>
        <ImageCounter>📷 {active+1} / {PHOTOS.length}</ImageCounter>
        <ActionRow>
          <ActionBtn onClick={()=>setSaved(s=>!s)} $active={saved}>{saved?'❤️ Saved':'🤍 Save'}</ActionBtn>
          <ActionBtn>📤 Share</ActionBtn>
          <ActionBtn>⛶ Fullscreen</ActionBtn>
        </ActionRow>
      </MainImage>
      <ThumbnailStrip>
        {PHOTOS.map((p,i)=>(
          <Thumb key={i} $gradient={p.gradient} $active={active===i} onClick={()=>setActive(i)}>{p.label.slice(0,6)}</Thumb>
        ))}
      </ThumbnailStrip>
    </Wrap>
  );
};
export default PropertyHeroGallery;
