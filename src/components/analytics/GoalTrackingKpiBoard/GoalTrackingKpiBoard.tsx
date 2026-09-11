import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(245,158,11,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(245,158,11,0.05);border-bottom:1px solid rgba(245,158,11,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const PerformGrid = styled.div`display:grid;grid-template-columns:repeat(2,1fr);gap:8px`;
const PCard = styled.div<{$color:string}>`padding:14px;border-radius:12px;background:rgba(15,23,42,0.7);border:1px solid ${p=>p.$color}22`;
const PVal = styled.div<{$color:string}>`font-size:1.05rem;font-weight:900;color:${p=>p.$color}`;
const PLab = styled.div`font-size:.63rem;color:#64748B;margin-top:3px`;
const PChange = styled.div<{$up:boolean}>`font-size:.62rem;font-weight:700;color:${p=>p.$up?'#10B981':'#EF4444'};margin-top:3px`;

const GoalList = styled.div`display:flex;flex-direction:column;gap:6px`;
const GoalRow = styled.div`padding:10px 14px;border-radius:10px;background:rgba(15,23,42,0.7);border:1px solid rgba(100,116,139,0.1)`;
const GoalTop = styled.div`display:flex;justify-content:space-between;align-items:center;margin-bottom:6px`;
const GoalName = styled.div`font-size:.74rem;font-weight:700;color:#CBD5E1`;
const GoalPct = styled.div<{$done:boolean}>`font-size:.72rem;font-weight:900;color:${p=>p.$done?'#10B981':'#F59E0B'}`;
const GoalBar = styled.div`height:7px;border-radius:4px;background:rgba(30,41,59,0.7);overflow:hidden`;
const GoalFill = styled.div<{$pct:number;$done:boolean}>`height:100%;width:${p=>Math.min(100,p.$pct)}%;background:${p=>p.$done?'linear-gradient(90deg,#059669,#10B981)':'linear-gradient(90deg,#D97706,#F59E0B)'};border-radius:4px;transition:width .5s`;

const GOALS_DATA = [
  {name:'Monthly Revenue Target',current:2460000,target:3000000},
  {name:'New Listings (units)',current:28,target:35},
  {name:'Client Satisfaction Score',current:4.6,target:5.0},
  {name:'Response Time SLA (<15min)',current:87,target:95},
  {name:'Deals Closed',current:41,target:50},
];

export const GoalTrackingKpiBoard: FC = () => (
  <Wrap data-testid="goal-tracking-kpi-board">
    <Head>
      <Title>🎯 Goal Tracking KPI Board</Title>
      <div style={{fontSize:'.7rem',color:'#F59E0B',fontWeight:700}}>Q3 2026</div>
    </Head>
    <Body>
      <PerformGrid>
        <PCard $color="#10B981"><PVal $color="#10B981">AED 2.46M</PVal><PLab>Monthly Revenue</PLab><PChange $up>↑ +8.4%</PChange></PCard>
        <PCard $color="#3B82F6"><PVal $color="#3B82F6">41 / 50</PVal><PLab>Deals Closed</PLab><PChange $up>↑ On Track</PChange></PCard>
        <PCard $color="#F59E0B"><PVal $color="#F59E0B">4.6 / 5.0</PVal><PLab>Client Score</PLab><PChange $up>↑ Excellent</PChange></PCard>
        <PCard $color="#8B5CF6"><PVal $color="#8B5CF6">87%</PVal><PLab>SLA Compliance</PLab><PChange $up={false}>↓ -3pp vs target</PChange></PCard>
      </PerformGrid>

      <GoalList>
        {GOALS_DATA.map((g,i)=>{
          const pct = (g.current/g.target)*100;
          return (
            <GoalRow key={i}>
              <GoalTop>
                <GoalName>{g.name}</GoalName>
                <GoalPct $done={pct>=100}>{pct>=100?'✅ ':''}{pct.toFixed(0)}%</GoalPct>
              </GoalTop>
              <GoalBar><GoalFill $pct={pct} $done={pct>=100} /></GoalBar>
              <div style={{display:'flex',justifyContent:'space-between',marginTop:4,fontSize:'.62rem',color:'#475569'}}>
                <span>Current: {typeof g.current==='number'&&g.current>10000?`AED ${g.current.toLocaleString()}`:g.current}</span>
                <span>Target: {typeof g.target==='number'&&g.target>10000?`AED ${g.target.toLocaleString()}`:g.target}</span>
              </div>
            </GoalRow>
          );
        })}
      </GoalList>
    </Body>
  </Wrap>
);
export default GoalTrackingKpiBoard;
