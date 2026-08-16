/**
 * FinancialPandLDashboard — Wave 50 GOAL-049
 * Real-time financial P&L dashboard with budget-vs-actual variance
 * White Caves Real Estate LLC — Finance Suite
 */
import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(16,185,129,0.22);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} 0.4s ease;`;
const Head = styled.div`padding:14px 20px;background:rgba(16,185,129,0.05);border-bottom:1px solid rgba(16,185,129,0.12);display:flex;align-items:center;justify-content:space-between;`;
const Title = styled.h3`margin:0;color:#FFF;font-size:0.9rem;font-weight:700;`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:16px;`;

const Tabs = styled.div`display:flex;gap:6px;`;
const Tab = styled.button<{$active:boolean}>`padding:5px 14px;border-radius:20px;border:${p=>p.$active?'none':'1px solid rgba(100,116,139,0.25)'};background:${p=>p.$active?'linear-gradient(90deg,#059669,#10B981)':'transparent'};color:${p=>p.$active?'#FFF':'#94A3B8'};font-size:0.72rem;font-weight:700;cursor:pointer;`;

const KpiRow = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:10px;`;
const Kpi = styled.div`padding:12px;border-radius:10px;background:rgba(15,23,42,0.7);border:1px solid rgba(100,116,139,0.15);`;
const KpiLabel = styled.div`font-size:0.65rem;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.04em;`;
const KpiVal = styled.div<{$green?:boolean;$red?:boolean}>`font-size:1.1rem;font-weight:900;color:${p=>p.$green?'#10B981':p.$red?'#EF4444':'#E2E8F0'};margin:4px 0;`;
const KpiVar = styled.div<{$positive:boolean}>`font-size:0.68rem;font-weight:700;color:${p=>p.$positive?'#10B981':'#EF4444'};`;

const Table = styled.table`width:100%;border-collapse:collapse;font-size:0.72rem;`;
const Th = styled.th`text-align:left;padding:7px 10px;color:#64748B;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;font-size:0.65rem;border-bottom:1px solid rgba(100,116,139,0.15);`;
const Tr = styled.tr<{$section?:boolean}>`background:${p=>p.$section?'rgba(15,23,42,0.5)':'transparent'};&:hover td{background:rgba(15,23,42,0.3);}`;
const Td = styled.td`padding:8px 10px;color:#CBD5E1;border-bottom:1px solid rgba(100,116,139,0.08);`;
const TdNum = styled(Td)<{$positive?:boolean;$negative?:boolean}>`text-align:right;font-weight:700;color:${p=>p.$positive?'#10B981':p.$negative?'#EF4444':'#E2E8F0'};`;

const BarCell = styled.td`padding:8px 10px;border-bottom:1px solid rgba(100,116,139,0.08);`;
const MiniBar = styled.div`height:6px;border-radius:3px;background:rgba(15,23,42,0.8);overflow:hidden;min-width:60px;`;
const MiniFill = styled.div<{$pct:number;$over:boolean}>`height:100%;width:${p=>Math.min(100,p.$pct)}%;border-radius:3px;background:${p=>p.$over?'#EF4444':'#10B981'};`;

type Row = { label:string; budget:number; actual:number; category:string };
type Period = 'Q1'|'Q2'|'Q3'|'YTD';

const DATA: Record<Period, Row[]> = {
  Q1:[
    { label:'Commission Income', budget:850000, actual:912000, category:'Revenue' },
    { label:'Off-Plan Sales Commission', budget:600000, actual:720000, category:'Revenue' },
    { label:'Property Management Fees', budget:180000, actual:165000, category:'Revenue' },
    { label:'Leasing Commissions', budget:220000, actual:198000, category:'Revenue' },
    { label:'Salaries & Commissions', budget:420000, actual:408000, category:'Expenses' },
    { label:'Office Rent', budget:90000, actual:90000, category:'Expenses' },
    { label:'Marketing & Advertising', budget:75000, actual:88000, category:'Expenses' },
    { label:'Software & Tech', budget:30000, actual:27500, category:'Expenses' },
    { label:'RERA & DLD Fees', budget:15000, actual:14200, category:'Expenses' },
    { label:'VAT Payable (5%)', budget:92500, actual:99750, category:'Tax' },
  ],
  Q2:[
    { label:'Commission Income', budget:950000, actual:880000, category:'Revenue' },
    { label:'Off-Plan Sales Commission', budget:700000, actual:810000, category:'Revenue' },
    { label:'Property Management Fees', budget:190000, actual:202000, category:'Revenue' },
    { label:'Leasing Commissions', budget:240000, actual:215000, category:'Revenue' },
    { label:'Salaries & Commissions', budget:440000, actual:435000, category:'Expenses' },
    { label:'Office Rent', budget:90000, actual:90000, category:'Expenses' },
    { label:'Marketing & Advertising', budget:80000, actual:95000, category:'Expenses' },
    { label:'Software & Tech', budget:30000, actual:31000, category:'Expenses' },
    { label:'RERA & DLD Fees', budget:15000, actual:16500, category:'Expenses' },
    { label:'VAT Payable (5%)', budget:104000, actual:105350, category:'Tax' },
  ],
  Q3:[
    { label:'Commission Income', budget:1000000, actual:1050000, category:'Revenue' },
    { label:'Off-Plan Sales Commission', budget:750000, actual:820000, category:'Revenue' },
    { label:'Property Management Fees', budget:200000, actual:190000, category:'Revenue' },
    { label:'Leasing Commissions', budget:250000, actual:270000, category:'Revenue' },
    { label:'Salaries & Commissions', budget:460000, actual:452000, category:'Expenses' },
    { label:'Office Rent', budget:90000, actual:90000, category:'Expenses' },
    { label:'Marketing & Advertising', budget:85000, actual:78000, category:'Expenses' },
    { label:'Software & Tech', budget:32000, actual:30000, category:'Expenses' },
    { label:'RERA & DLD Fees', budget:15000, actual:14000, category:'Expenses' },
    { label:'VAT Payable (5%)', budget:110000, actual:116500, category:'Tax' },
  ],
  YTD:[
    { label:'Commission Income', budget:2800000, actual:2842000, category:'Revenue' },
    { label:'Off-Plan Sales Commission', budget:2050000, actual:2350000, category:'Revenue' },
    { label:'Property Management Fees', budget:570000, actual:557000, category:'Revenue' },
    { label:'Leasing Commissions', budget:710000, actual:683000, category:'Revenue' },
    { label:'Salaries & Commissions', budget:1320000, actual:1295000, category:'Expenses' },
    { label:'Office Rent', budget:270000, actual:270000, category:'Expenses' },
    { label:'Marketing & Advertising', budget:240000, actual:261000, category:'Expenses' },
    { label:'Software & Tech', budget:92000, actual:88500, category:'Expenses' },
    { label:'RERA & DLD Fees', budget:45000, actual:44700, category:'Expenses' },
    { label:'VAT Payable (5%)', budget:306500, actual:321600, category:'Tax' },
  ],
};

export const FinancialPandLDashboard: FC = () => {
  const [period,setPeriod] = useState<Period>('YTD');
  const rows = DATA[period];
  const revenue = rows.filter(r=>r.category==='Revenue');
  const expenses = rows.filter(r=>r.category==='Expenses'||r.category==='Tax');
  const totalRevBudget = revenue.reduce((s,r)=>s+r.budget,0);
  const totalRevActual = revenue.reduce((s,r)=>s+r.actual,0);
  const totalExpBudget = expenses.reduce((s,r)=>s+r.budget,0);
  const totalExpActual = expenses.reduce((s,r)=>s+r.actual,0);
  const netBudget = totalRevBudget - totalExpBudget;
  const netActual = totalRevActual - totalExpActual;
  const netVar = netActual - netBudget;

  const fmt = (n:number) => n>=0?`AED ${Math.abs(n).toLocaleString()}`:`-AED ${Math.abs(n).toLocaleString()}`;
  const varPct = (b:number,a:number) => b===0?0:((a-b)/b*100);

  return (
    <Wrap data-testid="financial-pandl-dashboard">
      <Head>
        <Title>📊 P&L Dashboard — 2025</Title>
        <Tabs>
          {(['Q1','Q2','Q3','YTD'] as Period[]).map(p=><Tab key={p} $active={period===p} onClick={()=>setPeriod(p)}>{p}</Tab>)}
        </Tabs>
      </Head>
      <Body>
        <KpiRow>
          <Kpi>
            <KpiLabel>Total Revenue</KpiLabel>
            <KpiVal $green>AED {(totalRevActual/1000).toFixed(0)}K</KpiVal>
            <KpiVar $positive={totalRevActual>=totalRevBudget}>{totalRevActual>=totalRevBudget?'▲':'▼'} {Math.abs(varPct(totalRevBudget,totalRevActual)).toFixed(1)}% vs budget</KpiVar>
          </Kpi>
          <Kpi>
            <KpiLabel>Total Expenses</KpiLabel>
            <KpiVal $red>AED {(totalExpActual/1000).toFixed(0)}K</KpiVal>
            <KpiVar $positive={totalExpActual<=totalExpBudget}>{totalExpActual<=totalExpBudget?'▼ Under':'▲ Over'} budget by {Math.abs(varPct(totalExpBudget,totalExpActual)).toFixed(1)}%</KpiVar>
          </Kpi>
          <Kpi>
            <KpiLabel>Net Profit</KpiLabel>
            <KpiVal $green={netActual>0} $red={netActual<0}>AED {(netActual/1000).toFixed(0)}K</KpiVal>
            <KpiVar $positive={netVar>=0}>{netVar>=0?'▲ Ahead':'▼ Behind'} target by AED {Math.abs(netVar).toLocaleString()}</KpiVar>
          </Kpi>
        </KpiRow>

        <Table>
          <thead>
            <tr>
              <Th>Line Item</Th>
              <Th style={{textAlign:'right'}}>Budget</Th>
              <Th style={{textAlign:'right'}}>Actual</Th>
              <Th style={{textAlign:'right'}}>Variance</Th>
              <Th>Attainment</Th>
            </tr>
          </thead>
          <tbody>
            <Tr $section><Td colSpan={5} style={{fontWeight:800,color:'#10B981',fontSize:'0.7rem',textTransform:'uppercase',letterSpacing:'0.05em'}}>Revenue</Td></Tr>
            {revenue.map((r,i)=>{
              const v=r.actual-r.budget;
              const pct=r.budget>0?(r.actual/r.budget*100):0;
              return (
                <Tr key={i}>
                  <Td>{r.label}</Td>
                  <TdNum>AED {(r.budget/1000).toFixed(0)}K</TdNum>
                  <TdNum $positive={r.actual>=r.budget}>AED {(r.actual/1000).toFixed(0)}K</TdNum>
                  <TdNum $positive={v>=0} $negative={v<0}>{v>=0?'+':''}{(v/1000).toFixed(0)}K</TdNum>
                  <BarCell><MiniBar><MiniFill $pct={pct} $over={pct>115}/></MiniBar></BarCell>
                </Tr>
              );
            })}
            <Tr $section><Td colSpan={5} style={{fontWeight:800,color:'#EF4444',fontSize:'0.7rem',textTransform:'uppercase',letterSpacing:'0.05em'}}>Expenses & Tax</Td></Tr>
            {expenses.map((r,i)=>{
              const v=r.actual-r.budget;
              const pct=r.budget>0?(r.actual/r.budget*100):0;
              return (
                <Tr key={i}>
                  <Td>{r.label}</Td>
                  <TdNum>AED {(r.budget/1000).toFixed(0)}K</TdNum>
                  <TdNum $negative={r.actual>r.budget}>AED {(r.actual/1000).toFixed(0)}K</TdNum>
                  <TdNum $positive={v<=0} $negative={v>0}>{v>=0?'+':''}{(v/1000).toFixed(0)}K</TdNum>
                  <BarCell><MiniBar><MiniFill $pct={pct} $over={pct>105}/></MiniBar></BarCell>
                </Tr>
              );
            })}
            <Tr $section>
              <Td style={{fontWeight:800,color:'#E2E8F0'}}>NET PROFIT</Td>
              <TdNum style={{fontWeight:900}}>AED {(netBudget/1000).toFixed(0)}K</TdNum>
              <TdNum $positive={netActual>0} style={{fontWeight:900}}>AED {(netActual/1000).toFixed(0)}K</TdNum>
              <TdNum $positive={netVar>=0} $negative={netVar<0} style={{fontWeight:900}}>{netVar>=0?'+':''}{(netVar/1000).toFixed(0)}K</TdNum>
              <BarCell/>
            </Tr>
          </tbody>
        </Table>
      </Body>
    </Wrap>
  );
};

export default FinancialPandLDashboard;
