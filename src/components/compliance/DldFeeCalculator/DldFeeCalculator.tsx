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
const Input = styled.input`padding:8px 10px;border-radius:7px;border:1px solid rgba(100,116,139,0.3);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.82rem;font-weight:700;width:100%;box-sizing:border-box;outline:none;&:focus{border-color:#10B981}`;

const CalcBtn = styled.button`width:100%;padding:12px;border-radius:10px;border:none;background:linear-gradient(90deg,#059669,#10B981);color:#FFF;font-size:.85rem;font-weight:800;cursor:pointer;transition:all .2s;&:hover{filter:brightness(1.1)}`;

const ResultCard = styled.div`padding:18px;border-radius:14px;background:rgba(15,23,42,0.8);border:1px solid rgba(16,185,129,0.2)`;
const ResultTitle = styled.div`font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#64748B;margin-bottom:12px`;
const FeeRow = styled.div<{$total?:boolean}>`
  display:flex;justify-content:space-between;padding:${p=>p.$total?'10px 12px':'6px 0'};
  border-bottom:${p=>p.$total?'none':'1px solid rgba(100,116,139,0.1)'};
  border-radius:${p=>p.$total?'8px':'0'};
  background:${p=>p.$total?'rgba(16,185,129,0.08)':'transparent'};
  border:${p=>p.$total?'1px solid rgba(16,185,129,0.2)':'none'};
  margin-top:${p=>p.$total?'8px':'0'};
`;
const FL = styled.div<{$total?:boolean}>`font-size:${p=>p.$total?.82:.72}rem;color:${p=>p.$total?'#94A3B8':'#64748B'};font-weight:${p=>p.$total?700:400}`;
const FV = styled.div<{$total?:boolean;$color?:string}>`font-size:${p=>p.$total?.95:.78}rem;font-weight:${p=>p.$total?900:700};color:${p=>p.$color||p.$total?'#10B981':'#CBD5E1'}`;

export const DldFeeCalculator: FC = () => {
  const [salePrice, setSalePrice] = useState('3500000');
  const [txType, setTxType] = useState<'resale'|'offplan'>('resale');
  const [mortgageAmt, setMortgageAmt] = useState('');
  const [shown, setShown] = useState(true);

  const price = parseFloat(salePrice)||0;
  const mortgage = parseFloat(mortgageAmt)||0;

  const dldTransfer = price * 0.04;
  const trusteeOffice = txType==='offplan' ? 4200 : 2100;
  const titleDeedIssuance = 250;
  const knowledgeFee = 10;
  const innovationFee = 10;
  const mortgageRegFee = mortgage>0 ? mortgage*0.0025 : 0;
  const mortgageAdminFee = mortgage>0 ? 290 : 0;
  const total = dldTransfer + trusteeOffice + titleDeedIssuance + knowledgeFee + innovationFee + mortgageRegFee + mortgageAdminFee;

  return (
    <Wrap data-testid="dld-fee-calculator">
      <Head>
        <Title>🏛️ DLD 4% Fee Auto-Calc Engine</Title>
        <div style={{fontSize:'.7rem',color:'#10B981',fontWeight:700}}>Law 85/2006</div>
      </Head>
      <Body>
        <InputGrid>
          <Field><Label>Sale Price (AED)</Label><Input type="number" value={salePrice} onChange={e=>setSalePrice(e.target.value)} /></Field>
          <Field>
            <Label>Transaction Type</Label>
            <Input
              as="select" value={txType}
              onChange={(e:any)=>setTxType(e.target.value)}
              style={{padding:'8px 10px',borderRadius:'7px',border:'1px solid rgba(100,116,139,0.3)',background:'rgba(15,23,42,0.8)',color:'#E2E8F0',fontSize:'.78rem',fontWeight:600,width:'100%',outline:'none'}}
            >
              <option value="resale">Resale (Secondary)</option>
              <option value="offplan">Off-Plan (Primary)</option>
            </Input>
          </Field>
          <Field style={{gridColumn:'1/-1'}}><Label>Mortgage Amount (AED) — leave blank if cash</Label><Input type="number" value={mortgageAmt} onChange={e=>setMortgageAmt(e.target.value)} placeholder="0 = Cash Purchase" /></Field>
        </InputGrid>

        <CalcBtn onClick={()=>setShown(true)}>🧮 Calculate All DLD Fees</CalcBtn>

        {shown && (
          <ResultCard>
            <ResultTitle>📋 DLD Fee Breakdown — AED {price.toLocaleString()}</ResultTitle>
            <FeeRow><FL>DLD Transfer Fee (4.00%)</FL><FV>AED {dldTransfer.toLocaleString()}</FV></FeeRow>
            <FeeRow><FL>Trustee Office Admin Fee</FL><FV>AED {trusteeOffice.toLocaleString()}</FV></FeeRow>
            <FeeRow><FL>Title Deed Issuance Fee</FL><FV>AED {titleDeedIssuance}</FV></FeeRow>
            <FeeRow><FL>Knowledge & Innovation Fee</FL><FV>AED {knowledgeFee+innovationFee}</FV></FeeRow>
            {mortgage>0 && <>
              <FeeRow><FL>Mortgage Registration (0.25%)</FL><FV>AED {mortgageRegFee.toLocaleString()}</FV></FeeRow>
              <FeeRow><FL>Mortgage Processing Fee</FL><FV>AED {mortgageAdminFee}</FV></FeeRow>
            </>}
            <FeeRow $total><FL $total>TOTAL TRANSFER COSTS</FL><FV $total $color="#10B981">AED {total.toLocaleString()}</FV></FeeRow>
          </ResultCard>
        )}
      </Body>
    </Wrap>
  );
};
export default DldFeeCalculator;
