import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(245,158,11,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(245,158,11,0.05);border-bottom:1px solid rgba(245,158,11,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const QuarterGrid = styled.div`display:grid;grid-template-columns:repeat(2,1fr);gap:8px`;
const QuarterCard = styled.div<{$active:boolean}>`padding:14px;border-radius:12px;background:${p=>p.$active?'rgba(245,158,11,0.1)':'rgba(15,23,42,0.6)'};border:2px solid ${p=>p.$active?'rgba(245,158,11,0.4)':'rgba(100,116,139,0.12)'};cursor:pointer;transition:all .15s`;
const QLabel = styled.div<{$active:boolean}>`font-size:.8rem;font-weight:700;color:${p=>p.$active?'#F59E0B':'#94A3B8'}`;
const QSub = styled.div`font-size:.65rem;color:#64748B;margin-top:2px`;
const QVal = styled.div<{$active:boolean}>`font-size:1rem;font-weight:900;color:${p=>p.$active?'#F59E0B':'#CBD5E1'};margin-top:6px`;

const MetricRow = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:8px`;
const MetCard = styled.div<{$color:string}>`padding:10px;border-radius:9px;background:rgba(15,23,42,0.6);border:1px solid ${p=>p.$color}20;text-align:center`;
const MetVal = styled.div<{$color:string}>`font-size:.88rem;font-weight:900;color:${p=>p.$color}`;
const MetLab = styled.div`font-size:.6rem;color:#64748B;margin-top:2px`;

const TargetBar = styled.div`height:10px;border-radius:5px;background:rgba(30,41,59,0.5);overflow:hidden`;
const TargetFill = styled.div<{$pct:number;$over:boolean}>`height:100%;width:${p=>Math.min(p.$pct,100)}%;background:${p=>p.$over?'linear-gradient(90deg,#D97706,#F59E0B)':'linear-gradient(90deg,#059669,#10B981)'};border-radius:5px;transition:width .5s`;

const QUARTERS = [
  {label:'Q1 2026',sub:'Jan–Mar',sales:48,revenue:134400000,target:120000000,deals:48},
  {label:'Q2 2026',sub:'Apr–Jun',sales:62,revenue:178400000,target:150000000,deals:62},
  {label:'Q3 2026',sub:'Jul–Sep (YTD)',sales:41,revenue:114800000,target:150000000,deals:41},
  {label:'Q4 2026',sub:'Oct–Dec (Forecast)',sales:0,revenue:0,target:180000000,deals:0},
];

export const QuarterlyTargetTracker: FC = () => {
  const [activeQ, setActiveQ] = useState(2);
  const q = QUARTERS[activeQ];
  const pct = q.revenue>0?(q.revenue/q.target)*100:0;

  return (
    <Wrap data-testid="quarterly-target-tracker">
      <Head>
        <Title>📈 Quarterly Target Tracker</Title>
        <div style={{fontSize:'.7rem',color:'#F59E0B',fontWeight:700}}>FY 2026</div>
      </Head>
      <Body>
        <QuarterGrid>
          {QUARTERS.map((q,i)=>(
            <QuarterCard key={i} $active={activeQ===i} onClick={()=>setActiveQ(i)}>
              <QLabel $active={activeQ===i}>{q.label}</QLabel>
              <QSub>{q.sub}</QSub>
              <QVal $active={activeQ===i}>{q.revenue>0?`AED ${(q.revenue/1000000).toFixed(1)}M`:'Forecast'}</QVal>
            </QuarterCard>
          ))}
        </QuarterGrid>

        <div>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:'.7rem',color:'#64748B',marginBottom:6,fontWeight:600}}>
            <span>Revenue vs Target</span>
            <span style={{color:pct>=100?'#10B981':'#F59E0B',fontWeight:700}}>
              {pct>0?`${pct.toFixed(1)}% of AED ${(q.target/1000000).toFixed(0)}M target`:`Target: AED ${(q.target/1000000).toFixed(0)}M`}
            </span>
          </div>
          <TargetBar><TargetFill $pct={pct} $over={pct>100} /></TargetBar>
        </div>

        <MetricRow>
          <MetCard $color="#F59E0B"><MetVal $color="#F59E0B">{q.deals||'—'}</MetVal><MetLab>Deals Closed</MetLab></MetCard>
          <MetCard $color="#10B981"><MetVal $color="#10B981">{q.revenue>0?`AED ${(q.revenue/1000000).toFixed(1)}M`:'—'}</MetVal><MetLab>Revenue</MetLab></MetCard>
          <MetCard $color="#3B82F6"><MetVal $color="#3B82F6">{q.deals>0?`AED ${((q.revenue/q.deals)/1000000).toFixed(1)}M`:'—'}</MetVal><MetLab>Avg Deal</MetLab></MetCard>
        </MetricRow>
      </Body>
    </Wrap>
  );
};
export default QuarterlyTargetTracker;
