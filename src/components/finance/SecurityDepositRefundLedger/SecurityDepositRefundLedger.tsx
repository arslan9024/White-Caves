import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(139,92,246,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(139,92,246,0.05);border-bottom:1px solid rgba(139,92,246,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const SummaryGrid = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:8px`;
const SCard = styled.div<{$color:string}>`padding:12px;border-radius:10px;background:rgba(15,23,42,0.6);border:1px solid ${p=>p.$color}20;text-align:center`;
const SVal = styled.div<{$color:string}>`font-size:.95rem;font-weight:900;color:${p=>p.$color}`;
const SLab = styled.div`font-size:.62rem;color:#64748B;margin-top:2px`;

const DeductionList = styled.div`display:flex;flex-direction:column;gap:6px`;
const DeductRow = styled.div<{$included:boolean}>`
  display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:8px;cursor:pointer;
  background:${p=>p.$included?'rgba(239,68,68,0.06)':'rgba(15,23,42,0.5)'};
  border:1px solid ${p=>p.$included?'rgba(239,68,68,0.2)':'rgba(100,116,139,0.1)'};
  transition:all .15s;
`;
const DeductToggle = styled.div<{$on:boolean}>`width:30px;height:16px;border-radius:8px;background:${p=>p.$on?'#8B5CF6':'rgba(100,116,139,0.3)'};position:relative;flex-shrink:0;transition:background .2s;&::after{content:'';position:absolute;top:2px;left:${p=>p.$on?'16px':'2px'};width:12px;height:12px;border-radius:50%;background:#FFF;transition:left .2s}`;
const DeductLabel = styled.div`flex:1;font-size:.74rem;color:#94A3B8`;
const DeductAmt = styled.div<{$included:boolean}>`font-size:.74rem;font-weight:700;color:${p=>p.$included?'#EF4444':'#475569'}`;

const DEDUCTIONS = [
  {label:'Apartment Repainting (full unit)',amount:3500},
  {label:'Carpet Replacement (master bedroom)',amount:1800},
  {label:'Broken AC Remote Control',amount:250},
  {label:'Missing Kitchen Appliances (microwave)',amount:650},
  {label:'Window cleaning (beyond normal wear)',amount:400},
  {label:'Parking area scratch repair',amount:900},
];

const RefundBtn = styled.button`width:100%;padding:12px;border-radius:10px;border:none;background:linear-gradient(90deg,#7C3AED,#8B5CF6);color:#FFF;font-size:.85rem;font-weight:800;cursor:pointer;transition:all .2s;&:hover{filter:brightness(1.1)}`;

export const SecurityDepositRefundLedger: FC = () => {
  const [deposit] = useState(15000);
  const [included, setIncluded] = useState(new Set([0,1,3]));
  const [processed, setProcessed] = useState(false);

  const toggle = (i:number) => setIncluded(prev=>{const n=new Set(prev);n.has(i)?n.delete(i):n.add(i);return n});

  const totalDeductions = DEDUCTIONS.filter((_,i)=>included.has(i)).reduce((a,d)=>a+d.amount,0);
  const refundAmount = deposit - totalDeductions;

  return (
    <Wrap data-testid="security-deposit-refund-ledger">
      <Head>
        <Title>💰 Security Deposit Refund Ledger</Title>
        <div style={{fontSize:'.7rem',color:'#8B5CF6',fontWeight:700}}>Itemized</div>
      </Head>
      <Body>
        <SummaryGrid>
          <SCard $color="#CBD5E1"><SVal $color="#CBD5E1">AED {deposit.toLocaleString()}</SVal><SLab>Original Deposit</SLab></SCard>
          <SCard $color="#EF4444"><SVal $color="#EF4444">AED {totalDeductions.toLocaleString()}</SVal><SLab>Deductions</SLab></SCard>
          <SCard $color="#10B981"><SVal $color="#10B981">AED {refundAmount.toLocaleString()}</SVal><SLab>Refund Amount</SLab></SCard>
        </SummaryGrid>

        <div style={{fontSize:'.72rem',color:'#64748B',fontWeight:600}}>Toggle deductions (click to include/exclude):</div>
        <DeductionList>
          {DEDUCTIONS.map((d,i)=>(
            <DeductRow key={i} $included={included.has(i)} onClick={()=>toggle(i)}>
              <DeductToggle $on={included.has(i)} />
              <DeductLabel>{d.label}</DeductLabel>
              <DeductAmt $included={included.has(i)}>-AED {d.amount.toLocaleString()}</DeductAmt>
            </DeductRow>
          ))}
        </DeductionList>

        {processed && (
          <div style={{padding:'12px',borderRadius:'10px',background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.25)',textAlign:'center',fontSize:'.78rem',fontWeight:700,color:'#10B981'}}>
            ✅ Refund of AED {refundAmount.toLocaleString()} processed — Bank Transfer initiated
          </div>
        )}

        <RefundBtn onClick={()=>setProcessed(true)}>
          💸 Process Refund — AED {refundAmount.toLocaleString()} to Tenant
        </RefundBtn>
      </Body>
    </Wrap>
  );
};
export default SecurityDepositRefundLedger;
