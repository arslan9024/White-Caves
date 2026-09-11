import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden`;
const Head = styled.div`padding:14px 18px;border-bottom:1px solid rgba(100,116,139,0.1);display:flex;align-items:center;justify-content:space-between`;
const HeadTitle = styled.div`font-size:.85rem;font-weight:700;color:#CBD5E1`;
const Body = styled.div`padding:16px;display:flex;flex-direction:column;gap:10px`;

const InputGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:10px`;
const Field = styled.div`display:flex;flex-direction:column;gap:4px`;
const Label = styled.label`font-size:.68rem;color:#94A3B8;font-weight:600`;
const Input = styled.input`padding:9px 12px;border-radius:8px;border:1px solid rgba(100,116,139,0.2);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.8rem;font-weight:600;outline:none;width:100%;box-sizing:border-box;&:focus{border-color:rgba(59,130,246,0.4)}`;

const ResultGrid = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:8px`;
const ResultCard = styled.div<{$color:string}>`padding:12px;border-radius:12px;background:${p=>p.$color}08;border:1px solid ${p=>p.$color}25;text-align:center`;
const ResultVal = styled.div<{$color:string}>`font-size:1.1rem;font-weight:900;color:${p=>p.$color}`;
const ResultLabel = styled.div`font-size:.62rem;color:#64748B;margin-top:4px;line-height:1.3`;

const BreakdownList = styled.div`display:flex;flex-direction:column;gap:4px`;
const BRow = styled.div<{$total?:boolean}>`display:flex;justify-content:space-between;padding:${p=>p.$total?'9px 12px':'6px 12px'};border-radius:${p=>p.$total?'8px':'6px'};background:${p=>p.$total?'rgba(16,185,129,0.07)':'rgba(15,23,42,0.4)'};border:${p=>p.$total?'1px solid rgba(16,185,129,0.2)':'none'}`;
const BL = styled.div<{$total?:boolean}>`font-size:${p=>p.$total?.75:.68}rem;color:${p=>p.$total?'#94A3B8':'#64748B'};font-weight:${p=>p.$total?700:400}`;
const BV = styled.div<{$total?:boolean;$color?:string}>`font-size:${p=>p.$total?.85:.72}rem;font-weight:800;color:${p=>p.$color||( p.$total?'#10B981':'#CBD5E1')}`;

export const PropertyROIBreakdown: FC = () => {
  const [price, setPrice] = useState('2450000');
  const [rent, setRent] = useState('9500');
  const [occupancy, setOccupancy] = useState('92');
  const [mgmt, setMgmt] = useState('8');

  const p = parseFloat(price)||0;
  const r = parseFloat(rent)||0;
  const occ = parseFloat(occupancy)/100;
  const mgmtFee = parseFloat(mgmt)/100;
  const annualGrossRent = r * 12 * occ;
  const serviceCharge = p * 0.012; // 1.2% avg
  const mgmtFeeAED = annualGrossRent * mgmtFee;
  const maintenanceAllowance = 6000;
  const annualCosts = serviceCharge + mgmtFeeAED + maintenanceAllowance;
  const annualNetRent = annualGrossRent - annualCosts;
  const grossYield = (annualGrossRent / p * 100);
  const netYield = (annualNetRent / p * 100);
  const capAppreciation = p * 0.09; // 9% estimate

  return (
    <Wrap data-testid="property-roi-breakdown">
      <Head>
        <HeadTitle>💹 Investment ROI Breakdown</HeadTitle>
        <div style={{fontSize:'.68rem',color:'#10B981',fontWeight:700}}>AED Calculation</div>
      </Head>
      <Body>
        <InputGrid>
          <Field><Label>Property Price (AED)</Label><Input type="number" value={price} onChange={e=>setPrice(e.target.value)}/></Field>
          <Field><Label>Monthly Rent (AED)</Label><Input type="number" value={rent} onChange={e=>setRent(e.target.value)}/></Field>
          <Field><Label>Occupancy Rate (%)</Label><Input type="number" value={occupancy} onChange={e=>setOccupancy(e.target.value)} min="0" max="100"/></Field>
          <Field><Label>Mgmt Fee (%)</Label><Input type="number" value={mgmt} onChange={e=>setMgmt(e.target.value)} min="0" max="20"/></Field>
        </InputGrid>

        <ResultGrid>
          <ResultCard $color="#3B82F6"><ResultVal $color="#3B82F6">{grossYield.toFixed(1)}%</ResultVal><ResultLabel>Gross Rental Yield</ResultLabel></ResultCard>
          <ResultCard $color="#10B981"><ResultVal $color="#10B981">{netYield.toFixed(1)}%</ResultVal><ResultLabel>Net Rental Yield</ResultLabel></ResultCard>
          <ResultCard $color="#F59E0B"><ResultVal $color="#F59E0B">9.0%</ResultVal><ResultLabel>Capital Growth Est.</ResultLabel></ResultCard>
        </ResultGrid>

        <BreakdownList>
          <BRow><BL>Annual Gross Rent</BL><BV $color="#CBD5E1">AED {annualGrossRent.toLocaleString(undefined,{maximumFractionDigits:0})}</BV></BRow>
          <BRow><BL>Service Charge (1.2%)</BL><BV $color="#EF4444">- AED {serviceCharge.toLocaleString(undefined,{maximumFractionDigits:0})}</BV></BRow>
          <BRow><BL>Management Fee ({mgmt}%)</BL><BV $color="#EF4444">- AED {mgmtFeeAED.toLocaleString(undefined,{maximumFractionDigits:0})}</BV></BRow>
          <BRow><BL>Maintenance Allowance</BL><BV $color="#EF4444">- AED {maintenanceAllowance.toLocaleString()}</BV></BRow>
          <BRow $total><BL $total>Annual Net Income</BL><BV $total>AED {annualNetRent.toLocaleString(undefined,{maximumFractionDigits:0})}</BV></BRow>
          <BRow><BL>Est. Capital Appreciation</BL><BV $color="#F59E0B">+ AED {capAppreciation.toLocaleString(undefined,{maximumFractionDigits:0})}</BV></BRow>
        </BreakdownList>
      </Body>
    </Wrap>
  );
};
export default PropertyROIBreakdown;
