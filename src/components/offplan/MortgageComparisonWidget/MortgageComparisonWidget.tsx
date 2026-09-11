import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(16,185,129,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(16,185,129,0.05);border-bottom:1px solid rgba(16,185,129,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const InputGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:10px`;
const Field = styled.div`display:flex;flex-direction:column;gap:4px`;
const Label = styled.label`font-size:.7rem;color:#94A3B8;font-weight:600`;
const Input = styled.input`padding:8px 10px;border-radius:7px;border:1px solid rgba(16,185,129,0.2);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.78rem;font-weight:600;width:100%;box-sizing:border-box;outline:none;&:focus{border-color:#10B981}`;
const Select = styled.select`padding:8px 10px;border-radius:7px;border:1px solid rgba(16,185,129,0.2);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.78rem;font-weight:600;width:100%;outline:none;&:focus{border-color:#10B981}`;

const CompGrid = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px`;
const CompCard = styled.div<{$best:boolean}>`padding:12px;border-radius:10px;text-align:center;background:${p=>p.$best?'rgba(16,185,129,0.1)':'rgba(15,23,42,0.6)'};border:2px solid ${p=>p.$best?'rgba(16,185,129,0.4)':'rgba(100,116,139,0.12)'}`;
const CompBank = styled.div<{$best:boolean}>`font-size:.72rem;font-weight:700;color:${p=>p.$best?'#10B981':'#94A3B8'}`;
const CompRate = styled.div<{$best:boolean}>`font-size:1.1rem;font-weight:900;color:${p=>p.$best?'#10B981':'#CBD5E1'};margin:4px 0`;
const CompMonthly = styled.div`font-size:.65rem;color:#64748B`;
const BestTag = styled.div`font-size:.58rem;font-weight:700;padding:2px 7px;border-radius:4px;background:rgba(16,185,129,0.15);color:#10B981;display:inline-block;margin-top:4px`;

const BANKS = [
  {name:'Emirates NBD',rate:3.49,type:'Fixed 5yr'},
  {name:'ADCB',rate:3.25,type:'Fixed 3yr'},
  {name:'FAB',rate:3.99,type:'Variable'},
];

export const MortgageComparisonWidget: FC = () => {
  const [price, setPrice] = useState('2800000');
  const [down, setDown] = useState('25');
  const [years, setYears] = useState('25');

  const p = parseFloat(price)||0;
  const d = parseFloat(down)||25;
  const y = parseInt(years)||25;
  const loan = p * (1 - d/100);
  const bestIdx = BANKS.reduce((bi,b,i)=>b.rate<BANKS[bi].rate?i:bi,0);

  const monthly = (bank:typeof BANKS[0]) => {
    const r = bank.rate/100/12;
    const n = y*12;
    return (loan * r * (1+r)**n / ((1+r)**n - 1));
  };

  return (
    <Wrap data-testid="mortgage-comparison-widget">
      <Head>
        <Title>🏦 Mortgage Comparison Widget</Title>
        <div style={{fontSize:'.7rem',color:'#10B981',fontWeight:700}}>UAE Banks</div>
      </Head>
      <Body>
        <InputGrid>
          <Field><Label>Property Value (AED)</Label><Input type="number" value={price} onChange={e=>setPrice(e.target.value)} /></Field>
          <Field><Label>Down Payment (%)</Label><Input type="number" value={down} onChange={e=>setDown(e.target.value)} min="20" max="50" /></Field>
          <Field style={{gridColumn:'1/-1'}}><Label>Mortgage Term</Label>
            <Select value={years} onChange={e=>setYears(e.target.value)}>
              <option value="10">10 years</option>
              <option value="15">15 years</option>
              <option value="20">20 years</option>
              <option value="25">25 years</option>
            </Select>
          </Field>
        </InputGrid>

        <div>
          <div style={{fontSize:'.7rem',color:'#64748B',fontWeight:600,marginBottom:4}}>Loan Amount: <span style={{color:'#10B981',fontWeight:800}}>AED {loan.toLocaleString(undefined,{maximumFractionDigits:0})}</span></div>
          <CompGrid>
            {BANKS.map((b,i)=>(
              <CompCard key={i} $best={i===bestIdx}>
                <CompBank $best={i===bestIdx}>{b.name}</CompBank>
                <CompRate $best={i===bestIdx}>{b.rate}%</CompRate>
                <CompMonthly>AED {monthly(b).toLocaleString(undefined,{maximumFractionDigits:0})}/mo</CompMonthly>
                <CompMonthly>{b.type}</CompMonthly>
                {i===bestIdx&&<BestTag>✓ Best Rate</BestTag>}
              </CompCard>
            ))}
          </CompGrid>
        </div>

        <div style={{padding:'10px 14px',borderRadius:'9px',background:'rgba(16,185,129,0.06)',border:'1px solid rgba(16,185,129,0.15)',fontSize:'.7rem',color:'#94A3B8'}}>
          💡 Based on {down}% down payment · {years}-year term · CBUAE regulations: Max 80% LTV for expats (80% for UAE nationals on first property)
        </div>
      </Body>
    </Wrap>
  );
};
export default MortgageComparisonWidget;
