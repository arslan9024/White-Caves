import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(245,158,11,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(245,158,11,0.05);border-bottom:1px solid rgba(245,158,11,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const InputGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:10px`;
const Field = styled.div`display:flex;flex-direction:column;gap:4px`;
const Label = styled.label`font-size:.7rem;color:#94A3B8;font-weight:600`;
const Input = styled.input`padding:8px 10px;border-radius:7px;border:1px solid rgba(100,116,139,0.3);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.78rem;font-weight:600;width:100%;box-sizing:border-box;outline:none;&:focus{border-color:#F59E0B}`;

const ResultCard = styled.div`padding:18px;border-radius:14px;background:rgba(15,23,42,0.8);border:1px solid rgba(245,158,11,0.2)`;
const RTitle = styled.div`font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#64748B;margin-bottom:12px`;
const FeeRow = styled.div<{$bold?:boolean}>`display:flex;justify-content:space-between;padding:${p=>p.$bold?'9px 10px':'6px 0'};border-bottom:${p=>p.$bold?'none':'1px solid rgba(100,116,139,0.08)'};border-radius:${p=>p.$bold?'7px':'0'};background:${p=>p.$bold?'rgba(245,158,11,0.08)':'transparent'};border:${p=>p.$bold?'1px solid rgba(245,158,11,0.18)':'none'};margin-top:${p=>p.$bold?'8px':'0'}`;
const FL = styled.div<{$bold?:boolean}>`font-size:${p=>p.$bold?.8:.72}rem;color:${p=>p.$bold?'#94A3B8':'#64748B'};font-weight:${p=>p.$bold?700:400}`;
const FV = styled.div<{$bold?:boolean;$color?:string}>`font-size:${p=>p.$bold?.92:.78}rem;font-weight:${p=>p.$bold?900:700};color:${p=>p.$color||p.$bold?'#F59E0B':'#CBD5E1'}`;

const ProgressBar = styled.div`height:8px;border-radius:4px;background:rgba(30,41,59,0.8);overflow:hidden`;
const ProgressFill = styled.div<{$pct:number;$color:string}>`height:100%;width:${p=>p.$pct}%;border-radius:4px;background:${p=>p.$color};transition:width .5s ease`;

const CalcBtn = styled.button`width:100%;padding:12px;border-radius:10px;border:none;background:linear-gradient(90deg,#D97706,#F59E0B);color:#FFF;font-size:.85rem;font-weight:800;cursor:pointer;transition:all .2s;&:hover{filter:brightness(1.1)}`;

export const ReserveFundEscrowCalculator: FC = () => {
  const [units, setUnits] = useState('42');
  const [serviceCharge, setServiceCharge] = useState('18000');
  const [reserveRate, setReserveRate] = useState('10');
  const [shown, setShown] = useState(true);

  const sc = parseFloat(serviceCharge)||0;
  const u = parseInt(units)||0;
  const rate = parseFloat(reserveRate)||10;
  const annualSC = sc * u;
  const reserveAnnual = annualSC * (rate/100);
  const currentBalance = reserveAnnual * 2.3; // simulated accumulated balance
  const targetBalance = annualSC * 0.5;
  const fundedPct = Math.min(100,(currentBalance/targetBalance)*100);

  return (
    <Wrap data-testid="reserve-fund-escrow-calculator">
      <Head>
        <Title>🏦 Reserve Fund Escrow Calculator</Title>
        <div style={{fontSize:'.7rem',color:'#F59E0B',fontWeight:700}}>RERA Reg.</div>
      </Head>
      <Body>
        <InputGrid>
          <Field><Label>No. of Units</Label><Input type="number" value={units} onChange={e=>setUnits(e.target.value)} /></Field>
          <Field><Label>Service Charge / Unit / Year (AED)</Label><Input type="number" value={serviceCharge} onChange={e=>setServiceCharge(e.target.value)} /></Field>
          <Field><Label>Reserve Contribution Rate (%)</Label><Input type="number" value={reserveRate} onChange={e=>setReserveRate(e.target.value)} min="5" max="30" /></Field>
          <Field><Label>Target Reserve Balance</Label><Input readOnly value={`AED ${targetBalance.toLocaleString()}`} style={{color:'#F59E0B'}} /></Field>
        </InputGrid>

        <CalcBtn onClick={()=>setShown(true)}>🧮 Calculate Reserve Fund</CalcBtn>

        {shown && (
          <ResultCard>
            <RTitle>📋 Reserve Fund Breakdown — {u} Units</RTitle>
            <FeeRow><FL>Annual Service Charge Revenue</FL><FV>AED {annualSC.toLocaleString()}</FV></FeeRow>
            <FeeRow><FL>Reserve Fund Contribution ({rate}%)</FL><FV>AED {reserveAnnual.toLocaleString()}/yr</FV></FeeRow>
            <FeeRow><FL>Current Escrow Balance</FL><FV style={{color:currentBalance>=targetBalance?'#10B981':'#F59E0B'}}>AED {currentBalance.toLocaleString()}</FV></FeeRow>
            <FeeRow><FL>RERA Target Balance (50% of SC)</FL><FV>AED {targetBalance.toLocaleString()}</FV></FeeRow>
            <div style={{margin:'8px 0'}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'.7rem',color:'#64748B',marginBottom:6}}>
                <span>Reserve Fund Status</span><span style={{color:fundedPct>=100?'#10B981':'#F59E0B',fontWeight:700}}>{fundedPct.toFixed(0)}% Funded</span>
              </div>
              <ProgressBar><ProgressFill $pct={fundedPct} $color={fundedPct>=100?'#10B981':'linear-gradient(90deg,#D97706,#F59E0B)'} /></ProgressBar>
            </div>
            <FeeRow $bold><FL $bold>Annual Reserve Contribution</FL><FV $bold>AED {reserveAnnual.toLocaleString()}</FV></FeeRow>
          </ResultCard>
        )}
      </Body>
    </Wrap>
  );
};
export default ReserveFundEscrowCalculator;
