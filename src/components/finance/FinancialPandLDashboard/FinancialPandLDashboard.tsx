import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(59,130,246,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(59,130,246,0.05);border-bottom:1px solid rgba(59,130,246,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const KpiGrid = styled.div`display:grid;grid-template-columns:repeat(2,1fr);gap:10px`;
const KpiCard = styled.div<{$color:string}>`padding:14px;border-radius:12px;background:rgba(15,23,42,0.7);border:1px solid ${p=>p.$color}25`;
const KpiVal = styled.div<{$color:string}>`font-size:1.1rem;font-weight:900;color:${p=>p.$color}`;
const KpiLab = styled.div`font-size:.68rem;color:#64748B;margin-top:3px`;
const KpiChange = styled.div<{$up:boolean}>`font-size:.65rem;font-weight:700;color:${p=>p.$up?'#10B981':'#EF4444'};margin-top:4px`;

const MonthlyBars = styled.div`display:flex;align-items:flex-end;gap:4px;height:80px;padding:0 4px`;
const Bar = styled.div<{$h:number;$budget:boolean}>`
  flex:1;border-radius:3px 3px 0 0;
  background:${p=>p.$budget?'rgba(100,116,139,0.2)':'linear-gradient(180deg,#3B82F6,#1D4ED8)'};
  height:${p=>p.$h}%;
  transition:height .4s ease;
`;
const BarLabel = styled.div`font-size:.58rem;color:#475569;text-align:center;flex:1`;

const VarRow = styled.div<{$favorable:boolean}>`
  display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:8px;
  background:${p=>p.$favorable?'rgba(16,185,129,0.06)':'rgba(239,68,68,0.06)'};
  border:1px solid ${p=>p.$favorable?'rgba(16,185,129,0.15)':'rgba(239,68,68,0.15)'};
`;
const VarLabel = styled.div`flex:1;font-size:.73rem;color:#94A3B8`;
const VarAmt = styled.div<{$favorable:boolean}>`font-size:.75rem;font-weight:700;color:${p=>p.$favorable?'#10B981':'#EF4444'}`;

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'];
const ACTUAL = [68,74,71,82,79,88,85,91,94];
const BUDGET = [75,75,75,80,80,85,85,90,90];

const VARIANCES = [
  {label:'Rental Income',actual:1_840_000,budget:1_750_000,favorable:true},
  {label:'Commission Revenue',actual:620_000,budget:700_000,favorable:false},
  {label:'Admin Expenses',actual:89_000,budget:95_000,favorable:true},
  {label:'Marketing Spend',actual:112_000,budget:100_000,favorable:false},
  {label:'Staff Costs',actual:380_000,budget:390_000,favorable:true},
];

export const FinancialPandLDashboard: FC = () => {
  const revenue = 2_460_000;
  const expenses = 581_000;
  const netProfit = revenue - expenses;
  const margin = ((netProfit/revenue)*100).toFixed(1);

  return (
    <Wrap data-testid="financial-pandl-dashboard">
      <Head>
        <Title>📊 P&L Dashboard — Budget vs Actual</Title>
        <div style={{fontSize:'.7rem',color:'#3B82F6',fontWeight:700}}>YTD 2026</div>
      </Head>
      <Body>
        <KpiGrid>
          <KpiCard $color="#10B981"><KpiVal $color="#10B981">AED {revenue.toLocaleString()}</KpiVal><KpiLab>YTD Revenue</KpiLab><KpiChange $up>↑ +8.4% vs Budget</KpiChange></KpiCard>
          <KpiCard $color="#EF4444"><KpiVal $color="#EF4444">AED {expenses.toLocaleString()}</KpiVal><KpiLab>YTD Expenses</KpiLab><KpiChange $up>↓ -2.1% vs Budget</KpiChange></KpiCard>
          <KpiCard $color="#3B82F6"><KpiVal $color="#3B82F6">AED {netProfit.toLocaleString()}</KpiVal><KpiLab>Net Profit</KpiLab><KpiChange $up>↑ +12.2% vs Budget</KpiChange></KpiCard>
          <KpiCard $color="#F59E0B"><KpiVal $color="#F59E0B">{margin}%</KpiVal><KpiLab>Net Margin</KpiLab><KpiChange $up>↑ Strong Performance</KpiChange></KpiCard>
        </KpiGrid>

        <div>
          <div style={{fontSize:'.7rem',color:'#64748B',fontWeight:700,marginBottom:8}}>Monthly Revenue vs Budget (AED 000s)</div>
          <MonthlyBars>
            {MONTHS.map((m,i)=>(
              <div key={m} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'stretch',gap:2}}>
                <div style={{display:'flex',alignItems:'flex-end',gap:1,height:72}}>
                  <Bar $h={ACTUAL[i]} $budget={false} />
                  <Bar $h={BUDGET[i]} $budget={true} />
                </div>
                <BarLabel>{m}</BarLabel>
              </div>
            ))}
          </MonthlyBars>
          <div style={{display:'flex',gap:12,marginTop:6}}>
            <div style={{display:'flex',alignItems:'center',gap:4,fontSize:'.62rem',color:'#64748B'}}><div style={{width:8,height:8,borderRadius:2,background:'#3B82F6'}}/>Actual</div>
            <div style={{display:'flex',alignItems:'center',gap:4,fontSize:'.62rem',color:'#64748B'}}><div style={{width:8,height:8,borderRadius:2,background:'rgba(100,116,139,0.3)'}}/>Budget</div>
          </div>
        </div>

        {VARIANCES.map((v,i)=>(
          <VarRow key={i} $favorable={v.favorable}>
            <VarLabel>{v.label}</VarLabel>
            <div style={{fontSize:'.68rem',color:'#475569'}}>Budget: AED {v.budget.toLocaleString()}</div>
            <VarAmt $favorable={v.favorable}>{v.favorable?'↑':'↓'} AED {Math.abs(v.actual-v.budget).toLocaleString()}</VarAmt>
          </VarRow>
        ))}
      </Body>
    </Wrap>
  );
};
export default FinancialPandLDashboard;
