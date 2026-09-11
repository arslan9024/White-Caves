import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden`;
const Head = styled.div`padding:14px 18px;border-bottom:1px solid rgba(100,116,139,0.1);display:flex;align-items:center;justify-content:space-between`;
const HeadTitle = styled.div`font-size:.85rem;font-weight:700;color:#CBD5E1`;

/* SVG waterfall */
const ChartWrap = styled.div`padding:16px 16px 8px`;
const ChartSvg = styled.svg`width:100%`;

const BarLabel = styled.text`font-family:'Inter',sans-serif;font-size:8px;fill:#64748B;text-anchor:middle`;
const ValLabel = styled.text`font-family:'Inter',sans-serif;font-size:8px;fill:#E2E8F0;text-anchor:middle;font-weight:700`;
const GridLineEl = styled.line`stroke:rgba(100,116,139,0.1);stroke-width:1`;

const SummaryRow = styled.div`display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:12px 16px`;
const SCard = styled.div<{$color:string}>`padding:10px;border-radius:9px;background:${p=>p.$color}08;border:1px solid ${p=>p.$color}20;text-align:center`;
const SVal = styled.div<{$color:string}>`font-size:.8rem;font-weight:900;color:${p=>p.$color}`;
const SLab = styled.div`font-size:.58rem;color:#64748B;margin-top:3px`;

const W = 380; const H = 160; const BAR_W = 40; const GAP = 12;

const BARS = [
  {label:'Gross Revenue',value:3200000,color:'#3B82F6',type:'full'},
  {label:'Commissions',value:-480000,color:'#EF4444',type:'neg'},
  {label:'VAT Output',value:-144000,color:'#F97316',type:'neg'},
  {label:'Salaries',value:-680000,color:'#EF4444',type:'neg'},
  {label:'Overheads',value:-220000,color:'#F59E0B',type:'neg'},
  {label:'Net Profit',value:1676000,color:'#10B981',type:'full'},
];

const MAX_ABS = 3200000;
const CH = H - 40; // chart height area
const midY = 30 + CH * 0.5; // zero line

export const ExecutiveRevenueWaterfall: FC = () => {
  let running = 0;
  const bars = BARS.map(b=>{
    const startVal = b.type==='full'?0:running;
    const start = midY - (startVal/MAX_ABS)*CH;
    const end = midY - ((startVal+b.value)/MAX_ABS)*CH;
    const y = Math.min(start,end);
    const h = Math.abs(end-start);
    if(b.type!=='full') running += b.value;
    return {...b,y,h,startVal};
  });

  const totalX = (i:number) => 20 + i*(BAR_W+GAP);

  return (
    <Wrap data-testid="executive-revenue-waterfall">
      <Head>
        <HeadTitle>💧 Revenue Waterfall — Sep 2026</HeadTitle>
        <div style={{fontSize:'.68rem',color:'#10B981',fontWeight:700}}>Net Profit Margin: 52%</div>
      </Head>
      <ChartWrap>
        <ChartSvg viewBox={`0 0 ${W} ${H}`}>
          {/* Zero line */}
          <GridLineEl x1={0} y1={midY} x2={W} y2={midY}/>
          {/* Grid lines */}
          {[-0.5,0.5].map((f,i)=><GridLineEl key={i} x1={0} y1={midY+f*CH} x2={W} y2={midY+f*CH}/>)}

          {bars.map((b,i)=>{
            const x = totalX(i);
            const mid = b.y + b.h/2;
            return (
              <g key={i}>
                {/* Connector line */}
                {i>0&&b.type!=='full'&&(
                  <line x1={totalX(i-1)+BAR_W} y1={bars[i-1].y+(b.value<0?0:bars[i-1].h)}
                    x2={x} y2={b.y+(b.value<0?0:b.h)}
                    stroke="rgba(100,116,139,0.3)" strokeWidth={1} strokeDasharray="2 2"/>
                )}
                <rect x={x} y={b.y} width={BAR_W} height={Math.max(b.h,2)} fill={b.color} opacity={0.85} rx={3}/>
                <BarLabel x={x+BAR_W/2} y={H-4}>{b.label.replace(' ','\n').substring(0,7)}</BarLabel>
                <ValLabel x={x+BAR_W/2} y={b.value>=0?b.y-4:b.y+b.h+10}>
                  {b.value>=0?'+':''}{(b.value/1000000).toFixed(2)}M
                </ValLabel>
              </g>
            );
          })}
        </ChartSvg>
      </ChartWrap>

      <SummaryRow>
        <SCard $color="#3B82F6"><SVal $color="#3B82F6">AED 3.2M</SVal><SLab>Gross Revenue</SLab></SCard>
        <SCard $color="#EF4444"><SVal $color="#EF4444">AED 1.52M</SVal><SLab>Total Costs</SLab></SCard>
        <SCard $color="#10B981"><SVal $color="#10B981">AED 1.68M</SVal><SLab>Net Profit</SLab></SCard>
        <SCard $color="#F59E0B"><SVal $color="#F59E0B">52.4%</SVal><SLab>EBITDA Margin</SLab></SCard>
      </SummaryRow>
    </Wrap>
  );
};
export default ExecutiveRevenueWaterfall;
