/**
 * OffPlanAssignmentCalculator — Wave 53 GOAL-075
 * Off-plan unit flip / assignment eligibility calculator (DLD 30-40% paid rule)
 * White Caves Real Estate LLC — Off-Plan Sales Suite
 */
import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(239,68,68,0.22);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} 0.4s ease;`;
const Head = styled.div`padding:14px 20px;background:rgba(239,68,68,0.05);border-bottom:1px solid rgba(239,68,68,0.12);display:flex;align-items:center;justify-content:space-between;`;
const Title = styled.h3`margin:0;color:#FFF;font-size:0.9rem;font-weight:700;`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:16px;`;

const FieldGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:10px;`;
const Field = styled.div`display:flex;flex-direction:column;gap:4px;`;
const FLabel = styled.label`font-size:0.68rem;color:#94A3B8;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;`;
const Input = styled.input`padding:9px 12px;border-radius:8px;border:1px solid rgba(100,116,139,0.25);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:0.82rem;font-weight:600;width:100%;box-sizing:border-box;outline:none;&:focus{border-color:#EF4444;}`;
const Select = styled.select`padding:9px 12px;border-radius:8px;border:1px solid rgba(100,116,139,0.25);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:0.82rem;font-weight:600;width:100%;outline:none;&:focus{border-color:#EF4444;}`;

const EligibilityCard = styled.div<{$eligible:boolean}>`padding:20px;border-radius:14px;background:${p=>p.$eligible?'rgba(16,185,129,0.07)':'rgba(239,68,68,0.07)'};border:2px solid ${p=>p.$eligible?'rgba(16,185,129,0.3)':'rgba(239,68,68,0.3)'};text-align:center;`;
const EligIcon = styled.div`font-size:2.5rem;margin-bottom:8px;`;
const EligTitle = styled.div<{$eligible:boolean}>`font-size:1rem;font-weight:900;color:${p=>p.$eligible?'#10B981':'#EF4444'};`;
const EligSub = styled.div`font-size:0.75rem;color:#64748B;margin-top:6px;line-height:1.5;`;

const ProgressBar = styled.div`border-radius:8px;overflow:hidden;background:rgba(15,23,42,0.7);border:1px solid rgba(100,116,139,0.15);padding:12px;`;
const BarLabel = styled.div`display:flex;justify-content:space-between;margin-bottom:6px;`;
const BarKey = styled.div`font-size:0.72rem;color:#94A3B8;font-weight:600;`;
const BarVal = styled.div<{$ok:boolean}>`font-size:0.72rem;font-weight:800;color:${p=>p.$ok?'#10B981':'#EF4444'};`;
const Track = styled.div`height:8px;border-radius:4px;background:rgba(30,41,59,0.8);overflow:hidden;`;
const Fill = styled.div<{$pct:number;$ok:boolean}>`height:100%;width:${p=>Math.min(100,p.$pct)}%;border-radius:4px;background:${p=>p.$ok?'linear-gradient(90deg,#059669,#10B981)':'linear-gradient(90deg,#DC2626,#EF4444)'};transition:width 0.6s ease;`;

const MetricGrid = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:10px;`;
const MetricCard = styled.div`padding:12px;border-radius:10px;background:rgba(15,23,42,0.6);border:1px solid rgba(100,116,139,0.15);text-align:center;`;
const MVal = styled.div<{$red?:boolean;$green?:boolean}>`font-size:0.95rem;font-weight:900;color:${p=>p.$red?'#EF4444':p.$green?'#10B981':'#E2E8F0'};`;
const MLab = styled.div`font-size:0.62rem;color:#64748B;margin-top:3px;`;

const DeveloperNote = styled.div`padding:10px 14px;border-radius:8px;background:rgba(245,158,11,0.07);border:1px solid rgba(245,158,11,0.2);font-size:0.72rem;color:#F59E0B;line-height:1.5;`;

export const OffPlanAssignmentCalculator: FC = () => {
  const [totalPrice, setTotalPrice] = useState('2500000');
  const [paidToDate, setPaidToDate] = useState('900000');
  const [developer, setDeveloper] = useState('EMAAR');
  const [unit, setUnit] = useState('2BR');

  const total = parseFloat(totalPrice) || 0;
  const paid = parseFloat(paidToDate) || 0;
  const paidPct = total > 0 ? (paid / total) * 100 : 0;

  const thresholds: Record<string, number> = { EMAAR: 30, DAMAC: 30, NAKHEEL: 40, MERAAS: 35, ALDAR: 30 };
  const threshold = thresholds[developer] || 30;
  const eligible = paidPct >= threshold;

  const dldAssignmentFee = total * 0.04; // DLD 4% on full sale price
  const agencyFeeAssignment = total * 0.02;
  const noi = total * 0.12; // assume 12% price appreciation as assignment gain
  const netGain = noi - dldAssignmentFee - agencyFeeAssignment;

  return (
    <Wrap data-testid="off-plan-assignment-calculator">
      <Head>
        <Title>📋 Off-Plan Assignment Eligibility</Title>
        <div style={{fontSize:'0.68rem',color:'#EF4444',fontWeight:700}}>DLD Flip Rule</div>
      </Head>
      <Body>
        <FieldGrid>
          <Field>
            <FLabel>Developer</FLabel>
            <Select value={developer} onChange={e=>setDeveloper(e.target.value)}>
              <option value="EMAAR">EMAAR</option>
              <option value="DAMAC">DAMAC</option>
              <option value="NAKHEEL">NAKHEEL</option>
              <option value="MERAAS">MERAAS</option>
              <option value="ALDAR">ALDAR</option>
            </Select>
          </Field>
          <Field>
            <FLabel>Unit Type</FLabel>
            <Select value={unit} onChange={e=>setUnit(e.target.value)}>
              <option value="Studio">Studio</option>
              <option value="1BR">1 Bedroom</option>
              <option value="2BR">2 Bedrooms</option>
              <option value="3BR">3 Bedrooms</option>
              <option value="4BR+">4BR+</option>
              <option value="Villa">Villa</option>
            </Select>
          </Field>
          <Field>
            <FLabel>Total Unit Price (AED)</FLabel>
            <Input type="number" value={totalPrice} onChange={e=>setTotalPrice(e.target.value)}/>
          </Field>
          <Field>
            <FLabel>Amount Paid to Date (AED)</FLabel>
            <Input type="number" value={paidToDate} onChange={e=>setPaidToDate(e.target.value)}/>
          </Field>
        </FieldGrid>

        <ProgressBar>
          <BarLabel>
            <BarKey>Payment Progress vs Assignment Threshold ({threshold}%)</BarKey>
            <BarVal $ok={eligible}>{paidPct.toFixed(1)}% paid</BarVal>
          </BarLabel>
          <Track><Fill $pct={paidPct} $ok={eligible}/></Track>
          <div style={{display:'flex',justifyContent:'flex-end',marginTop:'4px',fontSize:'0.65rem',color:'#475569'}}>
            Threshold: {threshold}% — Need AED {Math.max(0,(threshold/100*total)-paid).toLocaleString()} more
          </div>
        </ProgressBar>

        <EligibilityCard $eligible={eligible}>
          <EligIcon>{eligible?'✅':'🚫'}</EligIcon>
          <EligTitle $eligible={eligible}>{eligible?'ASSIGNMENT ELIGIBLE':'NOT YET ELIGIBLE'}</EligTitle>
          <EligSub>{eligible
            ?`You have paid ${paidPct.toFixed(1)}% (AED ${paid.toLocaleString()}). ${developer} requires only ${threshold}%. You may assign this unit.`
            :`${developer} requires minimum ${threshold}% payment. You need to pay AED ${Math.ceil((threshold/100*total)-paid).toLocaleString()} more before assigning.`
          }</EligSub>
        </EligibilityCard>

        <MetricGrid>
          <MetricCard><MVal $green>AED {paid.toLocaleString()}</MVal><MLab>Paid</MLab></MetricCard>
          <MetricCard><MVal $red>AED {(total-paid).toLocaleString()}</MVal><MLab>Balance Due</MLab></MetricCard>
          <MetricCard><MVal $green={netGain>0}>AED {Math.round(netGain).toLocaleString()}</MVal><MLab>Est. Net Gain</MLab></MetricCard>
        </MetricGrid>

        <DeveloperNote>
          ⚠️ <strong>{developer} Assignment Policy:</strong> Minimum {threshold}% of total purchase price must be paid to the developer before assignment is permitted. DLD transfer fee of 4% (AED {Math.round(dldAssignmentFee).toLocaleString()}) applies on the full unit price at time of assignment. Agency fee AED {Math.round(agencyFeeAssignment).toLocaleString()} (2%) additional.
        </DeveloperNote>
      </Body>
    </Wrap>
  );
};

export default OffPlanAssignmentCalculator;
