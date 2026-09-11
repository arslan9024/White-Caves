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
const Input = styled.input`padding:8px 10px;border-radius:7px;border:1px solid rgba(16,185,129,0.2);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.8rem;font-weight:700;width:100%;box-sizing:border-box;outline:none;&:focus{border-color:#10B981}`;
const Select = styled.select`padding:8px 10px;border-radius:7px;border:1px solid rgba(16,185,129,0.2);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.78rem;font-weight:600;width:100%;outline:none;&:focus{border-color:#10B981}`;

const ResultCard = styled.div`padding:18px;border-radius:14px;background:rgba(15,23,42,0.8);border:1px solid rgba(16,185,129,0.15)`;
const ResultRow = styled.div<{$bold?:boolean}>`
  display:flex;justify-content:space-between;align-items:center;
  padding:${p=>p.$bold?'10px 12px':'6px 0'};
  border-bottom:${p=>p.$bold?'none':'1px solid rgba(100,116,139,0.08)'};
  border-radius:${p=>p.$bold?'8px':'0'};
  background:${p=>p.$bold?'rgba(16,185,129,0.07)':'transparent'};
  border:${p=>p.$bold?'1px solid rgba(16,185,129,0.15)':'none'};
  margin-top:${p=>p.$bold?'8px':'0'};
`;
const RL = styled.div<{$bold?:boolean}>`font-size:${p=>p.$bold?.8:.72}rem;color:${p=>p.$bold?'#94A3B8':'#64748B'};font-weight:${p=>p.$bold?700:400}`;
const RV = styled.div<{$bold?:boolean;$color?:string}>`font-size:${p=>p.$bold?.9:.78}rem;font-weight:${p=>p.$bold?900:700};color:${p=>p.$color||p.$bold?'#10B981':'#CBD5E1'}`;

const YieldBar = styled.div`height:12px;border-radius:6px;background:rgba(30,41,59,0.5);overflow:hidden;margin-top:8px`;
const YieldFill = styled.div<{$pct:number}>`height:100%;width:${p=>p.$pct}%;background:linear-gradient(90deg,#059669,#10B981);border-radius:6px;transition:width .5s`;

export const RoiYieldProjectionTool: FC = () => {
  const [price, setPrice] = useState('2800000');
  const [beds, setBeds] = useState('2');
  const [location, setLocation] = useState('marina');

  const p = parseFloat(price)||0;
  const RENTS: Record<string,Record<string,number>> = {
    marina:{studio:75000,'1':110000,'2':165000,'3':230000},
    downtown:{studio:90000,'1':130000,'2':200000,'3':290000},
    jvc:{studio:45000,'1':65000,'2':90000,'3':130000},
    palm:{studio:120000,'1':180000,'2':280000,'3':400000},
  };
  const annualRent = (RENTS[location][beds]||150000);
  const grossYield = (annualRent/p)*100;
  const netYield = grossYield * 0.82; // ~18% expenses
  const cap7yr = p * (1 + 0.07)**7; // 7% annual appreciation
  const totalReturn7yr = cap7yr - p + annualRent*7;
  const roi7yr = ((totalReturn7yr/p)*100);

  return (
    <Wrap data-testid="roi-yield-projection-tool">
      <Head>
        <Title>📈 ROI & Yield Projection Tool</Title>
        <div style={{fontSize:'.7rem',color:'#10B981',fontWeight:700}}>DLD Data</div>
      </Head>
      <Body>
        <InputGrid>
          <Field><Label>Purchase Price (AED)</Label><Input type="number" value={price} onChange={e=>setPrice(e.target.value)} /></Field>
          <Field><Label>Bedrooms</Label>
            <Select value={beds} onChange={e=>setBeds(e.target.value)}>
              <option value="studio">Studio</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
            </Select>
          </Field>
          <Field style={{gridColumn:'1/-1'}}><Label>Location</Label>
            <Select value={location} onChange={e=>setLocation(e.target.value)}>
              <option value="marina">Dubai Marina</option>
              <option value="downtown">Downtown Dubai</option>
              <option value="palm">Palm Jumeirah</option>
              <option value="jvc">JVC</option>
            </Select>
          </Field>
        </InputGrid>

        <ResultCard>
          <div style={{fontSize:'.7rem',color:'#64748B',fontWeight:600,marginBottom:10}}>📊 Investment Analysis</div>
          <ResultRow><RL>Annual Rental Income</RL><RV>AED {annualRent.toLocaleString()}</RV></ResultRow>
          <ResultRow><RL>Gross Rental Yield</RL><RV $color="#F59E0B">{grossYield.toFixed(2)}%</RV></ResultRow>
          <ResultRow><RL>Net Yield (after costs)</RL><RV $color="#10B981">{netYield.toFixed(2)}%</RV></ResultRow>
          <div style={{marginTop:8}}>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:'.68rem',color:'#64748B',marginBottom:6}}><span>Net Yield</span><span style={{color:'#10B981',fontWeight:700}}>{netYield.toFixed(2)}% p.a.</span></div>
            <YieldBar><YieldFill $pct={Math.min(100,netYield*10)} /></YieldBar>
          </div>
          <ResultRow><RL>7yr Capital Appreciation (7% p.a.)</RL><RV>AED {cap7yr.toLocaleString(undefined,{maximumFractionDigits:0})}</RV></ResultRow>
          <ResultRow $bold><RL $bold>Total 7yr ROI</RL><RV $bold>{roi7yr.toFixed(1)}%</RV></ResultRow>
        </ResultCard>
      </Body>
    </Wrap>
  );
};
export default RoiYieldProjectionTool;
