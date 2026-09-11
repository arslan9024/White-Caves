import React, { FC, useEffect, useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const scrollLeft = keyframes`from{transform:translateX(0)}to{transform:translateX(-50%)}`;
const blink = keyframes`0%,100%{opacity:1}50%{opacity:.3}`;

const TickerWrap = styled.div`
  position:fixed;bottom:0;left:0;right:0;z-index:100;
  background:rgba(5,17,42,0.9);backdrop-filter:blur(16px);
  border-top:1px solid rgba(59,130,246,0.2);
  height:38px;overflow:hidden;display:flex;align-items:center;
  font-family:'Inter',sans-serif;
`;

const LiveBadge = styled.div`
  flex-shrink:0;padding:0 16px;height:100%;display:flex;align-items:center;gap:6px;
  background:rgba(239,68,68,0.15);border-right:1px solid rgba(239,68,68,0.2);
`;
const LiveDot = styled.div`width:7px;height:7px;border-radius:50%;background:#EF4444;animation:${blink} 1s ease-in-out infinite`;
const LiveText = styled.div`font-size:.65rem;font-weight:900;color:#EF4444;letter-spacing:.5px`;

const Track = styled.div`flex:1;overflow:hidden;position:relative`;
const TrackInner = styled.div<{$paused:boolean}>`
  display:flex;white-space:nowrap;align-items:center;gap:0;
  animation:${scrollLeft} 40s linear infinite;
  animation-play-state:${p=>p.$paused?'paused':'running'};
`;

const TickerItem = styled.div`
  display:inline-flex;align-items:center;gap:8px;padding:0 24px;
  border-right:1px solid rgba(100,116,139,0.2);flex-shrink:0;
`;
const ItemLabel = styled.span`font-size:.68rem;font-weight:600;color:#64748B`;
const ItemValue = styled.span<{$up?:boolean}>`font-size:.72rem;font-weight:800;color:${p=>p.$up===undefined?'#CBD5E1':p.$up?'#10B981':'#EF4444'}`;
const ItemChange = styled.span<{$up:boolean}>`font-size:.65rem;font-weight:700;color:${p=>p.$up?'#10B981':'#EF4444'};margin-left:4px`;

const TICKS = [
  {label:'DLD Txns Today',value:'247',unit:'',up:undefined},
  {label:'Palm Jumeirah PSF',value:'AED 3,250',unit:'',up:true,change:'+2.1%'},
  {label:'Dubai Marina PSF',value:'AED 1,950',unit:'',up:true,change:'+1.4%'},
  {label:'Downtown PSF',value:'AED 2,840',unit:'',up:false,change:'-0.3%'},
  {label:'JVC PSF',value:'AED 980',unit:'',up:true,change:'+4.2%'},
  {label:'YTD Volume',value:'AED 186B',unit:'',up:true,change:'+18.4% YoY'},
  {label:'Off-Plan Share',value:'62%',unit:'',up:true,change:'+8pp'},
  {label:'Avg Mortgage Rate',value:'3.49%',unit:'p.a.',up:undefined},
  {label:'Active Listings',value:'48,220',unit:'',up:true,change:'+1,200 this wk'},
  {label:'New Launches',value:'4',unit:'projects today',up:undefined},
];

export const MarketPulseLiveTicker: FC = () => {
  const [paused, setPaused] = useState(false);
  const doubled = [...TICKS,...TICKS]; // duplicate for seamless loop

  return (
    <TickerWrap
      data-testid="market-pulse-live-ticker"
      onMouseEnter={()=>setPaused(true)}
      onMouseLeave={()=>setPaused(false)}
    >
      <LiveBadge><LiveDot/><LiveText>LIVE</LiveText></LiveBadge>
      <Track>
        <TrackInner $paused={paused}>
          {doubled.map((t,i)=>(
            <TickerItem key={i}>
              <ItemLabel>{t.label}:</ItemLabel>
              <ItemValue $up={t.up}>{t.value} {t.unit}</ItemValue>
              {'change' in t && t.change && (
                <ItemChange $up={!!t.up}>{t.up?'▲':'▼'} {t.change}</ItemChange>
              )}
            </TickerItem>
          ))}
        </TrackInner>
      </Track>
    </TickerWrap>
  );
};
export default MarketPulseLiveTicker;
