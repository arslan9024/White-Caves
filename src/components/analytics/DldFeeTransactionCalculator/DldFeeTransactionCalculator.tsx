import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(239,68,68,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(239,68,68,0.05);border-bottom:1px solid rgba(239,68,68,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const InputGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:10px`;
const Field = styled.div`display:flex;flex-direction:column;gap:4px`;
const Label = styled.label`font-size:.7rem;color:#94A3B8;font-weight:600`;
const Input = styled.input`padding:8px 10px;border-radius:7px;border:1px solid rgba(239,68,68,0.2);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.78rem;font-weight:600;width:100%;box-sizing:border-box;outline:none;&:focus{border-color:#EF4444}`;
const Select = styled.select`padding:8px 10px;border-radius:7px;border:1px solid rgba(239,68,68,0.2);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.78rem;font-weight:600;width:100%;outline:none;&:focus{border-color:#EF4444}`;

const FeeGrid = styled.div`display:flex;flex-direction:column;gap:5px`;
const FeeRow = styled.div<{$total?:boolean}>`display:flex;justify-content:space-between;align-items:center;padding:${p=>p.$total?'10px 14px':'7px 12px'};border-radius:${p=>p.$total?'9px':'7px'};background:${p=>p.$total?'rgba(239,68,68,0.09)':'rgba(15,23,42,0.5)'};border:${p=>p.$total?'2px solid rgba(239,68,68,0.3)':'1px solid rgba(100,116,139,0.1)'}`;
const FL = styled.div<{$total?:boolean}>`font-size:${p=>p.$total?.8:.72}rem;color:${p=>p.$total?'#94A3B8':'#64748B'};font-weight:${p=>p.$total?700:400}`;
const FV = styled.div<{$total?:boolean}>`font-size:${p=>p.$total?.92:.75}rem;font-weight:${p=>p.$total?900:700};color:${p=>p.$total?'#EF4444':'#CBD5E1'}`;

const CalcBtn = styled.button`width:100%;padding:12px;border-radius:10px;border:none;background:linear-gradient(90deg,#DC2626,#EF4444);color:#FFF;font-size:.85rem;font-weight:800;cursor:pointer;transition:all .2s;&:hover{filter:brightness(1.1)}`;

export const DldFeeTransactionCalculator: FC = () => {
  const [price, setPrice] = useState('2800000');
  const [type, setType] = useState('apartment');
  const [nationality, setNationality] = useState('expat');
  const [calculated, setCalculated] = useState(true);

  const p = parseFloat(price)||0;
  const dldFee = p * 0.04;
  const agencyCommission = p * 0.02;
  const registrationFee = p>500000?4200:2100;
  const mortgageReg = p*0.0025;
  const trusteeeFee = 4000;
  const valuationFee = 3500;
  const total = dldFee + agencyCommission + registrationFee + mortgageReg + trusteeeFee + valuationFee;
  const totalCost = p + total;

  return (
    <Wrap data-testid="dld-fee-transaction-calculator">
      <Head>
        <Title>🏛️ DLD Fee Transaction Calculator</Title>
        <div style={{fontSize:'.7rem',color:'#EF4444',fontWeight:700}}>Dubai 2026</div>
      </Head>
      <Body>
        <InputGrid>
          <Field><Label>Property Price (AED)</Label><Input type="number" value={price} onChange={e=>{setPrice(e.target.value);setCalculated(false)}} /></Field>
          <Field><Label>Property Type</Label>
            <Select value={type} onChange={e=>setType(e.target.value)}>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="commercial">Commercial</option>
              <option value="land">Land</option>
            </Select>
          </Field>
          <Field style={{gridColumn:'1/-1'}}><Label>Buyer Type</Label>
            <Select value={nationality} onChange={e=>setNationality(e.target.value)}>
              <option value="uae">UAE National</option>
              <option value="expat">Expat / Foreign Buyer</option>
            </Select>
          </Field>
        </InputGrid>

        <CalcBtn onClick={()=>setCalculated(true)}>🧮 Calculate All DLD Fees</CalcBtn>

        {calculated && (
          <FeeGrid>
            <FeeRow><FL>DLD Transfer Fee (4%)</FL><FV>AED {dldFee.toLocaleString()}</FV></FeeRow>
            <FeeRow><FL>Agency Commission (2%)</FL><FV>AED {agencyCommission.toLocaleString()}</FV></FeeRow>
            <FeeRow><FL>DLD Registration Fee</FL><FV>AED {registrationFee.toLocaleString()}</FV></FeeRow>
            <FeeRow><FL>Mortgage Registration (0.25%)</FL><FV>AED {mortgageReg.toLocaleString()}</FV></FeeRow>
            <FeeRow><FL>Trustee Office Fee</FL><FV>AED {trusteeeFee.toLocaleString()}</FV></FeeRow>
            <FeeRow><FL>Valuation Fee</FL><FV>AED {valuationFee.toLocaleString()}</FV></FeeRow>
            <FeeRow $total><FL $total>Total Transaction Costs</FL><FV $total>AED {total.toLocaleString()}</FV></FeeRow>
            <FeeRow><FL>Total Cost of Purchase</FL><FV style={{color:'#60A5FA'}}>AED {totalCost.toLocaleString()}</FV></FeeRow>
          </FeeGrid>
        )}
      </Body>
    </Wrap>
  );
};
export default DldFeeTransactionCalculator;
