import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(16,185,129,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(16,185,129,0.05);border-bottom:1px solid rgba(16,185,129,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const MonthTabs = styled.div`display:flex;gap:4px;overflow-x:auto;&::-webkit-scrollbar{height:3px}&::-webkit-scrollbar-thumb{background:rgba(16,185,129,0.3);border-radius:2px}`;
const MonthTab = styled.button<{$active:boolean}>`flex-shrink:0;padding:5px 12px;border-radius:999px;border:1px solid ${p=>p.$active?'rgba(16,185,129,0.5)':'rgba(100,116,139,0.2)'};background:${p=>p.$active?'rgba(16,185,129,0.1)':'transparent'};color:${p=>p.$active?'#10B981':'#64748B'};font-size:.68rem;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;white-space:nowrap`;

const CashflowTable = styled.div`display:flex;flex-direction:column;gap:4px`;
const CFRow = styled.div<{$type:'income'|'expense'|'total'}>`
  display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:8px;
  background:${p=>({income:'rgba(16,185,129,0.06)',expense:'rgba(239,68,68,0.05)',total:'rgba(59,130,246,0.08)'}[p.$type])};
  border:1px solid ${p=>({income:'rgba(16,185,129,0.15)',expense:'rgba(239,68,68,0.12)',total:'rgba(59,130,246,0.2)'}[p.$type])};
`;
const CFIcon = styled.div`font-size:.8rem;flex-shrink:0`;
const CFLabel = styled.div`font-size:.73rem;color:#94A3B8;flex:1`;
const CFAmount = styled.div<{$type:'income'|'expense'|'total'}>`
  font-size:${p=>p.$type==='total'?.88:.75}rem;
  font-weight:${p=>p.$type==='total'?900:700};
  color:${p=>({income:'#10B981',expense:'#EF4444',total:'#60A5FA'}[p.$type])};
`;

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'];
const DATA: Record<string,{income:number;expense:number}[]> = {
  Sep:[
    {income:840000,expense:0},{income:0,expense:45000},{income:0,expense:89000},{income:0,expense:32000},{income:0,expense:180000},
  ],
};
const ITEMS = [
  {icon:'💰',label:'Rental Collections',type:'income' as const,amt:840000},
  {icon:'🔧',label:'Maintenance & Repairs',type:'expense' as const,amt:-45000},
  {icon:'👥',label:'Staff & Admin',type:'expense' as const,amt:-89000},
  {icon:'📢',label:'Marketing Spend',type:'expense' as const,amt:-32000},
  {icon:'💼',label:'Agent Commissions',type:'expense' as const,amt:-180000},
];

export const CashflowForecastCalendar: FC = () => {
  const [month, setMonth] = useState('Sep');
  const netCash = ITEMS.reduce((a,i)=>a+i.amt,0);

  return (
    <Wrap data-testid="cashflow-forecast-calendar">
      <Head>
        <Title>💸 Cashflow Forecast Calendar</Title>
        <div style={{fontSize:'.7rem',color:'#10B981',fontWeight:700}}>2026</div>
      </Head>
      <Body>
        <MonthTabs>
          {MONTHS.map(m=>(
            <MonthTab key={m} $active={month===m} onClick={()=>setMonth(m)}>{m}</MonthTab>
          ))}
        </MonthTabs>

        <CashflowTable>
          {ITEMS.map((item,i)=>(
            <CFRow key={i} $type={item.type}>
              <CFIcon>{item.icon}</CFIcon>
              <CFLabel>{item.label}</CFLabel>
              <CFAmount $type={item.type}>
                {item.type==='income'?'+':''} AED {Math.abs(item.amt).toLocaleString()}
              </CFAmount>
            </CFRow>
          ))}
          <CFRow $type="total">
            <CFIcon>📊</CFIcon>
            <CFLabel style={{fontWeight:700,color:'#CBD5E1'}}>Net Cashflow — {month} 2026</CFLabel>
            <CFAmount $type="total">AED {netCash.toLocaleString()}</CFAmount>
          </CFRow>
        </CashflowTable>

        <div style={{padding:'10px 14px',borderRadius:'9px',background:'rgba(16,185,129,0.06)',border:'1px solid rgba(16,185,129,0.15)',fontSize:'.72rem',color:'#94A3B8'}}>
          📅 12-month rolling forecast · Net Operating Income: <strong style={{color:'#10B981'}}>AED {netCash.toLocaleString()}</strong> for {month}
        </div>
      </Body>
    </Wrap>
  );
};
export default CashflowForecastCalendar;
