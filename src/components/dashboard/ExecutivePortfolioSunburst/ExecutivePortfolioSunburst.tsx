import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden`;
const Head = styled.div`padding:14px 18px;border-bottom:1px solid rgba(100,116,139,0.1);display:flex;align-items:center;justify-content:space-between`;
const HeadTitle = styled.div`font-size:.85rem;font-weight:700;color:#CBD5E1`;
const Body = styled.div`padding:16px;display:flex;flex-direction:column;gap:12px`;

/* SVG donut chart */
const DonutWrap = styled.div`display:flex;gap:20px;align-items:center`;
const DonutSvg = styled.svg`width:140px;height:140px;flex-shrink:0`;
const DonutCenter = styled.div`position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center`;
const DonutWrapRel = styled.div`position:relative;width:140px;height:140px;flex-shrink:0`;

const LegendList = styled.div`flex:1;display:flex;flex-direction:column;gap:6px`;
const LegRow = styled.div<{$active:boolean}>`
  display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:8px;cursor:pointer;
  background:${p=>p.$active?'rgba(30,41,59,0.8)':'transparent'};transition:all .15s;
  &:hover{background:rgba(30,41,59,0.6)}
`;
const LegDot = styled.div<{$color:string}>`width:10px;height:10px;border-radius:3px;background:${p=>p.$color};flex-shrink:0`;
const LegInfo = styled.div`flex:1`;
const LegLabel = styled.div`font-size:.72rem;font-weight:700;color:#CBD5E1`;
const LegAED = styled.div`font-size:.65rem;color:#64748B;margin-top:1px`;
const LegPct = styled.div<{$color:string}>`font-size:.72rem;font-weight:800;color:${p=>p.$color}`;

const SEGMENTS = [
  {label:'Residential Sales',aed:'AED 1.85M',pct:58,color:'#3B82F6'},
  {label:'Commercial',aed:'AED 0.64M',pct:20,color:'#8B5CF6'},
  {label:'Off-Plan',aed:'AED 0.48M',pct:15,color:'#F59E0B'},
  {label:'Rental Income',aed:'AED 0.23M',pct:7,color:'#10B981'},
];

// Generate donut path arcs
const RADIUS = 50; const CX = 70; const CY = 70; const STROKE = 24;
const circumference = 2 * Math.PI * RADIUS;

let cumPct = 0;
const arcs = SEGMENTS.map(s=>{
  const offset = circumference * (1 - s.pct/100);
  const rotation = cumPct * 3.6; // degrees
  cumPct += s.pct;
  return {...s, dashOffset: offset, rotation};
});

export const ExecutivePortfolioSunburst: FC = () => {
  const [active, setActive] = useState<number|null>(null);
  const activeData = active!==null?SEGMENTS[active]:null;

  return (
    <Wrap data-testid="executive-portfolio-sunburst">
      <Head>
        <HeadTitle>🍩 Portfolio Revenue Mix — Sep 2026</HeadTitle>
        <div style={{fontSize:'.68rem',color:'#64748B',fontWeight:700}}>Total: AED 3.2M</div>
      </Head>
      <Body>
        <DonutWrap>
          <DonutWrapRel>
            <DonutSvg viewBox="0 0 140 140">
              {/* Background ring */}
              <circle cx={CX} cy={CY} r={RADIUS} fill="none" stroke="rgba(30,41,59,0.8)" strokeWidth={STROKE}/>
              {/* Segments */}
              {arcs.map((a,i)=>(
                <circle key={i} cx={CX} cy={CY} r={RADIUS} fill="none"
                  stroke={a.color} strokeWidth={active===i?STROKE+4:STROKE}
                  strokeDasharray={circumference}
                  strokeDashoffset={a.dashOffset}
                  strokeLinecap="butt"
                  style={{transform:`rotate(${a.rotation-90}deg)`,transformOrigin:'70px 70px',transition:'stroke-width .2s',cursor:'pointer',opacity:active===null||active===i?1:0.4}}
                  onClick={()=>setActive(active===i?null:i)}
                />
              ))}
            </DonutSvg>
            <DonutCenter>
              {activeData?(
                <>
                  <div style={{fontSize:'.65rem',fontWeight:800,color:arcs[active!].color}}>{activeData.pct}%</div>
                  <div style={{fontSize:'.55rem',color:'#64748B',textAlign:'center',maxWidth:60}}>{activeData.label}</div>
                </>
              ):(
                <>
                  <div style={{fontSize:'.65rem',fontWeight:900,color:'#E2E8F0'}}>AED</div>
                  <div style={{fontSize:'.72rem',fontWeight:900,color:'#3B82F6'}}>3.2M</div>
                  <div style={{fontSize:'.52rem',color:'#64748B'}}>Total</div>
                </>
              )}
            </DonutCenter>
          </DonutWrapRel>

          <LegendList>
            {SEGMENTS.map((s,i)=>(
              <LegRow key={i} $active={active===i} onClick={()=>setActive(active===i?null:i)}>
                <LegDot $color={s.color}/>
                <LegInfo><LegLabel>{s.label}</LegLabel><LegAED>{s.aed}</LegAED></LegInfo>
                <LegPct $color={s.color}>{s.pct}%</LegPct>
              </LegRow>
            ))}
          </LegendList>
        </DonutWrap>
      </Body>
    </Wrap>
  );
};
export default ExecutivePortfolioSunburst;
