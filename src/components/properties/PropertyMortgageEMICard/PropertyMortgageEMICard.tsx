import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden`;
const Head = styled.div`padding:14px 18px;border-bottom:1px solid rgba(100,116,139,0.1)`;
const HeadTitle = styled.div`font-size:.85rem;font-weight:700;color:#CBD5E1;margin-bottom:2px`;
const HeadSub = styled.div`font-size:.65rem;color:#64748B`;

const Body = styled.div`padding:16px;display:flex;flex-direction:column;gap:10px`;
const InputGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:10px`;
const Field = styled.div`display:flex;flex-direction:column;gap:4px`;
const Label = styled.label`font-size:.68rem;color:#94A3B8;font-weight:600`;
const SliderWrap = styled.div`display:flex;flex-direction:column;gap:4px`;
const SliderRow = styled.div`display:flex;align-items:center;gap:8px`;
const Slider = styled.input`flex:1;accent-color:#3B82F6;cursor:pointer`;
const SliderVal = styled.div`font-size:.72rem;font-weight:800;color:#60A5FA;width:70px;text-align:right;flex-shrink:0`;
const Select = styled.select`padding:8px 10px;border-radius:7px;border:1px solid rgba(100,116,139,0.2);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.75rem;font-weight:600;outline:none`;

const EMICard = styled.div`padding:20px;border-radius:14px;background:linear-gradient(135deg,rgba(59,130,246,0.08),rgba(139,92,246,0.05));border:2px solid rgba(59,130,246,0.25);text-align:center`;
const EMILabel = styled.div`font-size:.72rem;color:#64748B;font-weight:600;margin-bottom:6px`;
const EMIAmount = styled.div`font-size:2rem;font-weight:900;color:#60A5FA;margin-bottom:4px`;
const EMISub = styled.div`font-size:.65rem;color:#475569`;

const BreakdownRow = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:8px`;
const BCard = styled.div<{$color:string}>`padding:10px;border-radius:10px;background:${p=>p.$color}08;border:1px solid ${p=>p.$color}20;text-align:center`;
const BVal = styled.div<{$color:string}>`font-size:.82rem;font-weight:800;color:${p=>p.$color}`;
const BLab = styled.div`font-size:.6rem;color:#64748B;margin-top:3px`;

const BankRow = styled.div`display:flex;gap:6px;flex-wrap:wrap;margin-top:4px`;
const BankTag = styled.div`font-size:.6rem;font-weight:700;padding:3px 9px;border-radius:5px;background:rgba(30,41,59,0.8);border:1px solid rgba(100,116,139,0.15);color:#64748B`;

export const PropertyMortgageEMICard: FC = () => {
  const [price, setPrice] = useState(2450000);
  const [dp, setDp] = useState(20);
  const [rate, setRate] = useState(3.75);
  const [tenure, setTenure] = useState(25);

  const loanAmt = price * (1 - dp/100);
  const monthlyRate = rate / 100 / 12;
  const n = tenure * 12;
  const emi = loanAmt * monthlyRate * Math.pow(1+monthlyRate,n) / (Math.pow(1+monthlyRate,n)-1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - loanAmt;

  return (
    <Wrap data-testid="property-mortgage-emi-card">
      <Head>
        <HeadTitle>🏦 Mortgage EMI Calculator</HeadTitle>
        <HeadSub>Indicative rate — speak to our mortgage advisor for pre-approval</HeadSub>
      </Head>
      <Body>
        <InputGrid>
          <Field style={{gridColumn:'1/-1'}}>
            <Label>Down Payment: {dp}% — AED {(price*dp/100).toLocaleString(undefined,{maximumFractionDigits:0})}</Label>
            <SliderWrap><SliderRow><Slider type="range" min={20} max={50} step={5} value={dp} onChange={e=>setDp(+e.target.value)}/><SliderVal>{dp}%</SliderVal></SliderRow></SliderWrap>
          </Field>
          <Field>
            <Label>Interest Rate: {rate}% p.a.</Label>
            <SliderWrap><SliderRow><Slider type="range" min={2.5} max={6} step={0.25} value={rate} onChange={e=>setRate(+e.target.value)}/><SliderVal>{rate}%</SliderVal></SliderRow></SliderWrap>
          </Field>
          <Field>
            <Label>Tenure: {tenure} Years</Label>
            <SliderWrap><SliderRow><Slider type="range" min={5} max={25} step={5} value={tenure} onChange={e=>setTenure(+e.target.value)}/><SliderVal>{tenure} yr</SliderVal></SliderRow></SliderWrap>
          </Field>
        </InputGrid>

        <EMICard>
          <EMILabel>Monthly EMI</EMILabel>
          <EMIAmount>AED {emi.toLocaleString(undefined,{maximumFractionDigits:0})}</EMIAmount>
          <EMISub>Loan: AED {loanAmt.toLocaleString(undefined,{maximumFractionDigits:0})} at {rate}% for {tenure} years</EMISub>
        </EMICard>

        <BreakdownRow>
          <BCard $color="#3B82F6"><BVal $color="#3B82F6">AED {loanAmt.toLocaleString(undefined,{maximumFractionDigits:0})}</BVal><BLab>Loan Amount</BLab></BCard>
          <BCard $color="#EF4444"><BVal $color="#EF4444">AED {totalInterest.toLocaleString(undefined,{maximumFractionDigits:0})}</BVal><BLab>Total Interest</BLab></BCard>
          <BCard $color="#10B981"><BVal $color="#10B981">AED {totalPayment.toLocaleString(undefined,{maximumFractionDigits:0})}</BVal><BLab>Total Payment</BLab></BCard>
        </BreakdownRow>

        <div style={{fontSize:'.65rem',color:'#64748B',fontWeight:600}}>🏦 Partner Banks</div>
        <BankRow>
          {['Emirates NBD','ADCB','ENBD','Mashreq','RAKBANK','FAB','HSBC'].map(b=><BankTag key={b}>{b}</BankTag>)}
        </BankRow>
      </Body>
    </Wrap>
  );
};
export default PropertyMortgageEMICard;
