import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(245,158,11,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(245,158,11,0.05);border-bottom:1px solid rgba(245,158,11,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const InputRow = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:10px`;
const Field = styled.div`display:flex;flex-direction:column;gap:4px`;
const Label = styled.label`font-size:.7rem;color:#94A3B8;font-weight:600`;
const Input = styled.input`padding:8px 10px;border-radius:7px;border:1px solid rgba(245,158,11,0.2);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.8rem;font-weight:700;width:100%;box-sizing:border-box;outline:none;&:focus{border-color:#F59E0B}`;

const TierList = styled.div`display:flex;flex-direction:column;gap:6px`;
const TierRow = styled.div<{$active:boolean}>`
  display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:9px;
  background:${p=>p.$active?'rgba(245,158,11,0.1)':'rgba(15,23,42,0.6)'};
  border:2px solid ${p=>p.$active?'rgba(245,158,11,0.4)':'rgba(100,116,139,0.12)'};
`;
const TierName = styled.div<{$active:boolean}>`font-size:.78rem;font-weight:700;flex:1;color:${p=>p.$active?'#F59E0B':'#94A3B8'}`;
const TierThreshold = styled.div`font-size:.68rem;color:#64748B`;
const TierRate = styled.div<{$active:boolean}>`font-size:.85rem;font-weight:900;color:${p=>p.$active?'#F59E0B':'#64748B'}`;
const TierEarning = styled.div<{$active:boolean}>`font-size:.75rem;font-weight:700;color:${p=>p.$active?'#10B981':'#475569'}`;

const TIERS = [
  {name:'Base Tier',threshold:'1–5 units',rate:50,desc:'50/50 split'},
  {name:'Silver Tier',threshold:'6–10 units',rate:60,desc:'60/40 split'},
  {name:'Gold Tier',threshold:'11–20 units',rate:65,desc:'65/35 split'},
  {name:'Platinum Tier',threshold:'21–50 units',rate:70,desc:'70/30 split'},
  {name:'Diamond Elite',threshold:'50+ units',rate:75,desc:'75/25 split — Top Broker'},
];

export const CommissionAcceleratorEngine: FC = () => {
  const [units, setUnits] = useState('12');
  const [devComm, setDevComm] = useState('3');

  const u = parseInt(units)||0;
  const baseComm = parseFloat(devComm)||3;
  const tier = u<=5?0:u<=10?1:u<=20?2:u<=50?3:4;
  const myRate = TIERS[tier].rate/100;
  const perUnitValue = 2800000;
  const totalSales = u * perUnitValue;
  const totalDevComm = totalSales * (baseComm/100);
  const myComm = totalDevComm * myRate;

  return (
    <Wrap data-testid="commission-accelerator-engine">
      <Head>
        <Title>🚀 Commission Accelerator Engine</Title>
        <div style={{fontSize:'.7rem',color:'#F59E0B',fontWeight:700}}>{TIERS[tier].name}</div>
      </Head>
      <Body>
        <InputRow>
          <Field><Label>Units Sold (YTD)</Label><Input type="number" value={units} onChange={e=>setUnits(e.target.value)} /></Field>
          <Field><Label>Developer Commission (%)</Label><Input type="number" value={devComm} onChange={e=>setDevComm(e.target.value)} step="0.5" /></Field>
        </InputRow>

        <TierList>
          {TIERS.map((t,i)=>(
            <TierRow key={i} $active={i===tier}>
              <TierName $active={i===tier}>{i===tier?'🏆 ':''}{t.name}</TierName>
              <TierThreshold>{t.threshold}</TierThreshold>
              <TierRate $active={i===tier}>{t.rate}%</TierRate>
              <TierEarning $active={i===tier}>
                {i===tier?`AED ${myComm.toLocaleString(undefined,{maximumFractionDigits:0})}`:t.desc}
              </TierEarning>
            </TierRow>
          ))}
        </TierList>

        <div style={{padding:'12px 16px',borderRadius:'12px',background:'rgba(245,158,11,0.07)',border:'1px solid rgba(245,158,11,0.2)'}}>
          <div style={{fontSize:'.7rem',color:'#64748B',fontWeight:600,marginBottom:8}}>My Commission Summary</div>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}><span style={{fontSize:'.72rem',color:'#94A3B8'}}>Total Sales Volume</span><span style={{fontSize:'.75rem',fontWeight:700,color:'#CBD5E1'}}>AED {totalSales.toLocaleString()}</span></div>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}><span style={{fontSize:'.72rem',color:'#94A3B8'}}>Developer Commission Pool</span><span style={{fontSize:'.75rem',fontWeight:700,color:'#CBD5E1'}}>AED {totalDevComm.toLocaleString()}</span></div>
          <div style={{display:'flex',justifyContent:'space-between'}}><span style={{fontSize:'.72rem',color:'#F59E0B',fontWeight:700}}>My Earnings ({TIERS[tier].rate}% split)</span><span style={{fontSize:'.9rem',fontWeight:900,color:'#F59E0B'}}>AED {myComm.toLocaleString(undefined,{maximumFractionDigits:0})}</span></div>
        </div>
      </Body>
    </Wrap>
  );
};
export default CommissionAcceleratorEngine;
