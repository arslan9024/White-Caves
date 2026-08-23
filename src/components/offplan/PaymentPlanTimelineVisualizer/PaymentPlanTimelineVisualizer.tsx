/**
 * PaymentPlanTimelineVisualizer — Wave 53 GOAL-072
 * Payment plan construction timeline milestone visualization (10/90, 50/50, post-handover)
 * White Caves Real Estate LLC — Off-Plan Sales Suite
 */
import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const shimmer = keyframes`0%{opacity:0.5}50%{opacity:1}100%{opacity:0.5}`;

const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(239,68,68,0.22);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} 0.4s ease;`;
const Head = styled.div`padding:14px 20px;background:rgba(239,68,68,0.05);border-bottom:1px solid rgba(239,68,68,0.12);display:flex;align-items:center;justify-content:space-between;`;
const Title = styled.h3`margin:0;color:#FFF;font-size:0.9rem;font-weight:700;`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:18px;`;

const PlanTabs = styled.div`display:flex;gap:6px;flex-wrap:wrap;`;
const Tab = styled.button<{$active:boolean}>`padding:6px 14px;border-radius:20px;border:${p=>p.$active?'none':'1px solid rgba(100,116,139,0.25)'};background:${p=>p.$active?'linear-gradient(90deg,#DC2626,#EF4444)':'rgba(15,23,42,0.6)'};color:${p=>p.$active?'#FFF':'#94A3B8'};font-size:0.72rem;font-weight:700;cursor:pointer;transition:all 0.2s ease;&:hover{border-color:rgba(239,68,68,0.4);}`;

const Timeline = styled.div`position:relative;padding:4px 0;`;
const TrackLine = styled.div`position:absolute;left:16px;top:24px;bottom:24px;width:2px;background:rgba(100,116,139,0.2);`;
const Milestone = styled.div<{$done:boolean;$current:boolean}>`display:flex;gap:14px;align-items:flex-start;padding:8px 0;position:relative;`;
const MsDot = styled.div<{$done:boolean;$current:boolean}>`width:32px;height:32px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:800;border:2px solid ${p=>p.$done?'#10B981':p.$current?'#EF4444':'rgba(100,116,139,0.3)'};background:${p=>p.$done?'rgba(16,185,129,0.15)':p.$current?'rgba(239,68,68,0.15)':'rgba(15,23,42,0.6)'};color:${p=>p.$done?'#10B981':p.$current?'#EF4444':'#64748B'};position:relative;z-index:1;animation: ${p=>p.$current ? shimmer : 'none'} 1.5s ease infinite;`;
const MsContent = styled.div`flex:1;padding-bottom:16px;`;
const MsTitle = styled.div<{$done:boolean;$current:boolean}>`font-size:0.8rem;font-weight:700;color:${p=>p.$done?'#10B981':p.$current?'#FCA5A5':'#E2E8F0'};`;
const MsMeta = styled.div`font-size:0.68rem;color:#64748B;margin-top:3px;`;
const MsAmount = styled.div<{$done:boolean}>`font-size:0.85rem;font-weight:900;color:${p=>p.$done?'#10B981':'#EF4444'};margin-top:4px;`;
const MsTag = styled.div<{$done:boolean;$current:boolean}>`display:inline-block;font-size:0.6rem;font-weight:800;padding:2px 8px;border-radius:4px;background:${p=>p.$done?'rgba(16,185,129,0.1)':p.$current?'rgba(239,68,68,0.1)':'rgba(100,116,139,0.08)'};color:${p=>p.$done?'#10B981':p.$current?'#EF4444':'#64748B'};margin-top:4px;`;

const Summary = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:10px;`;
const SumCard = styled.div`padding:10px;border-radius:9px;background:rgba(15,23,42,0.6);border:1px solid rgba(100,116,139,0.15);text-align:center;`;
const SumVal = styled.div<{$red?:boolean;$green?:boolean}>`font-size:0.92rem;font-weight:900;color:${p=>p.$red?'#EF4444':p.$green?'#10B981':'#E2E8F0'};`;
const SumLab = styled.div`font-size:0.62rem;color:#64748B;margin-top:2px;`;

type Plan = { id: string; label: string; milestones: TimelineMilestone[] };
type TimelineMilestone = { label: string; pct: number; when: string; paid: boolean; current: boolean };

const UNIT_PRICE = 2_000_000;

const PLANS: Plan[] = [
  {
    id:'10_90',
    label:'10/90 Plan',
    milestones:[
      { label:'Booking Fee', pct:10, when:'On booking', paid:true, current:false },
      { label:'90% — Post Handover (4% p.a.)', pct:90, when:'Post-handover over 5 yrs', paid:false, current:true },
    ]
  },
  {
    id:'50_50',
    label:'50/50 Plan',
    milestones:[
      { label:'Down Payment', pct:10, when:'On booking', paid:true, current:false },
      { label:'Construction Milestone 1', pct:15, when:'20% construction', paid:true, current:false },
      { label:'Construction Milestone 2', pct:15, when:'40% construction', paid:false, current:true },
      { label:'Handover', pct:10, when:'On handover', paid:false, current:false },
      { label:'Post-Handover Balance', pct:50, when:'Post-handover 18 months', paid:false, current:false },
    ]
  },
  {
    id:'40_60',
    label:'40/60 Post-Handover',
    milestones:[
      { label:'Booking', pct:5, when:'On booking', paid:true, current:false },
      { label:'SPA Signing', pct:10, when:'Within 30 days', paid:true, current:false },
      { label:'Foundation Complete', pct:10, when:'Q1 2026', paid:true, current:false },
      { label:'Superstructure 50%', pct:5, when:'Q3 2026', paid:false, current:true },
      { label:'Superstructure 100%', pct:5, when:'Q1 2027', paid:false, current:false },
      { label:'Handover', pct:5, when:'Q3 2027', paid:false, current:false },
      { label:'Post-Handover (6 installments)', pct:60, when:'Q4 2027–Q1 2029', paid:false, current:false },
    ]
  },
];

export const PaymentPlanTimelineVisualizer: FC = () => {
  const [activePlan, setActivePlan] = useState('40_60');
  const plan = PLANS.find(p=>p.id===activePlan)!;
  const paidAed = plan.milestones.filter(m=>m.paid).reduce((s,m)=>s+UNIT_PRICE*m.pct/100,0);
  const dueAed = UNIT_PRICE - paidAed;
  const paidPct = plan.milestones.filter(m=>m.paid).reduce((s,m)=>s+m.pct,0);

  return (
    <Wrap data-testid="payment-plan-timeline-visualizer">
      <Head>
        <Title>🏗️ Payment Plan Timeline</Title>
        <div style={{fontSize:'0.68rem',color:'var(--accent-red, #EF4444)',fontWeight:700}}>AED {(UNIT_PRICE/1e6).toFixed(1)}M Unit</div>
      </Head>
      <Body>
        <PlanTabs>
          {PLANS.map(p=>(
            <Tab key={p.id} $active={activePlan===p.id} onClick={()=>setActivePlan(p.id)}>{p.label}</Tab>
          ))}
        </PlanTabs>

        <Summary>
          <SumCard><SumVal $green>AED {(paidAed/1000).toFixed(0)}K</SumVal><SumLab>Paid ({paidPct}%)</SumLab></SumCard>
          <SumCard><SumVal $red>AED {(dueAed/1000).toFixed(0)}K</SumVal><SumLab>Remaining</SumLab></SumCard>
          <SumCard><SumVal>{plan.milestones.filter(m=>m.paid).length}/{plan.milestones.length}</SumVal><SumLab>Milestones Done</SumLab></SumCard>
        </Summary>

        <Timeline>
          <TrackLine/>
          {plan.milestones.map((m,i)=>(
            <Milestone key={i} $done={m.paid} $current={m.current}>
              <MsDot $done={m.paid} $current={m.current}>{m.paid?'✓':i+1}</MsDot>
              <MsContent>
                <MsTitle $done={m.paid} $current={m.current}>{m.label}</MsTitle>
                <MsMeta>📅 {m.when}</MsMeta>
                <MsAmount $done={m.paid}>{m.pct}% — AED {(UNIT_PRICE*m.pct/100).toLocaleString()}</MsAmount>
                <MsTag $done={m.paid} $current={m.current}>{m.paid?'✅ PAID':m.current?'🔴 DUE NOW':'⏳ UPCOMING'}</MsTag>
              </MsContent>
            </Milestone>
          ))}
        </Timeline>
      </Body>
    </Wrap>
  );
};

export default PaymentPlanTimelineVisualizer;
