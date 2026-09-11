import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const progressFill = keyframes`from{stroke-dashoffset:314}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.85);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden`;
const Head = styled.div`padding:14px 18px;border-bottom:1px solid rgba(100,116,139,0.1);display:flex;align-items:center;justify-content:space-between`;
const HeadTitle = styled.div`font-size:.85rem;font-weight:700;color:#CBD5E1`;
const Body = styled.div`padding:20px;display:flex;gap:20px;align-items:flex-start`;

const GaugeWrap = styled.div`flex-shrink:0;position:relative;width:120px;height:120px`;
const GaugeSvg = styled.svg`width:100%;height:100%;transform:rotate(-90deg)`;
const GaugeBg = styled.circle`fill:none;stroke:rgba(30,41,59,0.8);stroke-width:10`;
const GaugeFill = styled.circle<{$score:number;$color:string}>`
  fill:none;stroke:${p=>p.$color};stroke-width:10;stroke-linecap:round;
  stroke-dasharray:314;stroke-dashoffset:${p=>314-(p.$score/100)*314};
  transition:stroke-dashoffset 1s ease;
`;
const GaugeCenter = styled.div`position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center`;
const GaugeScore = styled.div<{$color:string}>`font-size:1.5rem;font-weight:900;color:${p=>p.$color}`;
const GaugeLabel = styled.div`font-size:.58rem;color:#64748B;margin-top:2px`;

const Signals = styled.div`flex:1;display:flex;flex-direction:column;gap:6px`;
const SigRow = styled.div<{$active:boolean}>`
  display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:8px;
  background:${p=>p.$active?'rgba(16,185,129,0.07)':'rgba(15,23,42,0.5)'};
  border:1px solid ${p=>p.$active?'rgba(16,185,129,0.25)':'rgba(100,116,139,0.1)'};
  cursor:pointer;transition:all .15s;
`;
const SigCheck = styled.div<{$active:boolean}>`
  width:16px;height:16px;border-radius:4px;border:2px solid ${p=>p.$active?'#10B981':'rgba(100,116,139,0.4)'};
  background:${p=>p.$active?'#10B981':'transparent'};display:flex;align-items:center;justify-content:center;
  font-size:.6rem;color:#FFF;flex-shrink:0;transition:all .2s;
`;
const SigInfo = styled.div`flex:1`;
const SigLabel = styled.div<{$active:boolean}>`font-size:.72rem;font-weight:700;color:${p=>p.$active?'#CBD5E1':'#64748B'}`;
const SigPoints = styled.div<{$active:boolean}>`font-size:.62rem;font-weight:700;color:${p=>p.$active?'#10B981':'#475569'}`;

const SIGNALS = [
  {label:'Opened 3+ emails this week',points:'+15 pts'},
  {label:'Replied to WhatsApp within 1hr',points:'+20 pts'},
  {label:'Viewed 5+ property listings',points:'+12 pts'},
  {label:'Requested a viewing',points:'+25 pts'},
  {label:'Downloaded floor plan',points:'+8 pts'},
  {label:'Visited website 10+ times',points:'+10 pts'},
  {label:'Completed KYC documents',points:'+20 pts'},
];

export const LeadAutoScoreGauge: FC = () => {
  const [active, setActive] = useState(new Set([0,1,3,6]));

  const score = Array.from(active).reduce((sum,i)=>{
    const pts = parseInt(SIGNALS[i].points);
    return sum + pts;
  },0);
  const cappedScore = Math.min(100, score);
  const color = cappedScore>=75?'#10B981':cappedScore>=45?'#F59E0B':'#EF4444';
  const grade = cappedScore>=75?'Hot 🔥':cappedScore>=45?'Warm 🌤️':'Cold ❄️';

  const toggle = (i:number)=>setActive(prev=>{const n=new Set(prev);n.has(i)?n.delete(i):n.add(i);return n});

  return (
    <Wrap data-testid="lead-auto-score-gauge">
      <Head>
        <HeadTitle>🎯 Lead Auto-Score Engine</HeadTitle>
        <div style={{fontSize:'.68rem',fontWeight:700,color:color}}>{grade}</div>
      </Head>
      <Body>
        <GaugeWrap>
          <GaugeSvg viewBox="0 0 110 110">
            <GaugeBg cx={55} cy={55} r={50}/>
            <GaugeFill cx={55} cy={55} r={50} $score={cappedScore} $color={color}/>
          </GaugeSvg>
          <GaugeCenter>
            <GaugeScore $color={color}>{cappedScore}</GaugeScore>
            <GaugeLabel>Lead Score</GaugeLabel>
          </GaugeCenter>
        </GaugeWrap>

        <Signals>
          <div style={{fontSize:'.65rem',color:'#475569',fontWeight:600,marginBottom:2}}>Behaviour Signals</div>
          {SIGNALS.map((s,i)=>(
            <SigRow key={i} $active={active.has(i)} onClick={()=>toggle(i)}>
              <SigCheck $active={active.has(i)}>{active.has(i)?'✓':''}</SigCheck>
              <SigInfo>
                <SigLabel $active={active.has(i)}>{s.label}</SigLabel>
              </SigInfo>
              <SigPoints $active={active.has(i)}>{active.has(i)?s.points:'—'}</SigPoints>
            </SigRow>
          ))}
        </Signals>
      </Body>
    </Wrap>
  );
};
export default LeadAutoScoreGauge;
