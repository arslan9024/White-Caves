/**
 * SecurityDepositRefundLedger — Wave 50 GOAL-047
 * Tenant security deposit refund ledger with itemized deduction breakdown
 * White Caves Real Estate LLC — Finance & Leasing Suite
 */
import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(16,185,129,0.22);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} 0.4s ease;`;
const Head = styled.div`padding:14px 20px;background:rgba(16,185,129,0.05);border-bottom:1px solid rgba(16,185,129,0.12);display:flex;align-items:center;justify-content:space-between;`;
const Title = styled.h3`margin:0;color:#FFF;font-size:0.9rem;font-weight:700;display:flex;align-items:center;gap:8px;`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:16px;`;

const DepositHeader = styled.div`padding:16px;border-radius:12px;background:rgba(15,23,42,0.7);border:1px solid rgba(16,185,129,0.18);display:flex;justify-content:space-between;align-items:center;`;
const DepositAmt = styled.div`font-size:1.6rem;font-weight:900;color:#10B981;`;
const DepositSub = styled.div`font-size:0.72rem;color:#64748B;margin-top:4px;`;
const DepositMeta = styled.div`text-align:right;`;
const DepositLabel = styled.div`font-size:0.68rem;color:#64748B;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;`;

const DeductionList = styled.div`display:flex;flex-direction:column;gap:6px;`;
const DeductionRow = styled.div`display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:9px;background:rgba(15,23,42,0.6);border:1px solid rgba(100,116,139,0.15);`;
const DedIcon = styled.div`font-size:1.1rem;flex-shrink:0;`;
const DedInfo = styled.div`flex:1;`;
const DedName = styled.div`font-size:0.78rem;font-weight:700;color:#CBD5E1;`;
const DedNote = styled.div`font-size:0.67rem;color:#64748B;margin-top:2px;`;
const DedAmount = styled.div<{$disputed?:boolean}>`font-size:0.85rem;font-weight:800;color:${p=>p.$disputed?'#F59E0B':'#EF4444'};min-width:70px;text-align:right;`;
const DedTag = styled.div<{$disputed?:boolean}>`font-size:0.6rem;font-weight:700;padding:1px 6px;border-radius:4px;background:${p=>p.$disputed?'rgba(245,158,11,0.12)':'rgba(239,68,68,0.08)'};color:${p=>p.$disputed?'#F59E0B':'#EF4444'};text-align:center;margin-top:3px;`;

const AddRow = styled.div`display:grid;grid-template-columns:1fr 1fr auto;gap:8px;align-items:end;`;
const Input = styled.input`padding:8px 10px;border-radius:7px;border:1px solid rgba(100,116,139,0.25);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:0.78rem;width:100%;outline:none;&:focus{border-color:#10B981;}box-sizing:border-box;`;
const AddBtn = styled.button`padding:9px 16px;border-radius:7px;border:none;background:rgba(16,185,129,0.15);color:#10B981;font-size:0.78rem;font-weight:700;cursor:pointer;white-space:nowrap;&:hover{background:rgba(16,185,129,0.25);}`;

const Summary = styled.div`padding:14px;border-radius:12px;background:rgba(15,23,42,0.8);border:1.5px solid rgba(16,185,129,0.25);`;
const SumRow = styled.div`display:flex;justify-content:space-between;padding:5px 0;`;
const SumLabel = styled.div`font-size:0.75rem;color:#94A3B8;`;
const SumValue = styled.div<{$green?:boolean;$red?:boolean}>`font-size:0.78rem;font-weight:700;color:${p=>p.$green?'#10B981':p.$red?'#EF4444':'#E2E8F0'};`;
const Divider = styled.div`border-top:1px solid rgba(100,116,139,0.15);margin:6px 0;`;
const RefundAmt = styled.div<{$positive:boolean}>`font-size:1.3rem;font-weight:900;color:${p=>p.$positive?'#10B981':'#EF4444'};`;

const ProcessBtn = styled.button`width:100%;padding:12px;border-radius:10px;border:none;background:linear-gradient(90deg,#059669,#10B981);color:#FFF;font-size:0.85rem;font-weight:800;cursor:pointer;&:hover{filter:brightness(1.08);}`;
const DoneCard = styled.div`padding:14px;border-radius:12px;background:rgba(16,185,129,0.07);border:1px solid rgba(16,185,129,0.25);text-align:center;font-size:0.82rem;font-weight:700;color:#10B981;`;

type Deduction = { id:number; name:string; note:string; amount:number; icon:string; disputed?:boolean };

export const SecurityDepositRefundLedger: FC = () => {
  const DEPOSIT = 10_000;
  const [deductions, setDeductions] = useState<Deduction[]>([
    { id:1, name:'Repainting — Master Bedroom', note:'Tenant damage beyond fair wear', amount:800, icon:'🎨' },
    { id:2, name:'Broken AC Unit Repair', note:'Compressor damage', amount:1200, icon:'❄️' },
    { id:3, name:'Deep Cleaning Fee', note:'Property returned in unsatisfactory condition', amount:350, icon:'🧹' },
  ]);
  const [newName, setNewName] = useState('');
  const [newAmt, setNewAmt] = useState('');
  const [processed, setProcessed] = useState(false);

  const totalDeductions = deductions.reduce((s,d)=>s+d.amount,0);
  const refund = DEPOSIT - totalDeductions;

  const addDeduction = () => {
    if (!newName || !newAmt) return;
    setDeductions(prev=>[...prev,{ id:Date.now(), name:newName, note:'Added manually', amount:parseFloat(newAmt)||0, icon:'📋' }]);
    setNewName(''); setNewAmt('');
  };

  const toggle = (id:number) => setDeductions(prev=>prev.map(d=>d.id===id?{...d,disputed:!d.disputed}:d));

  return (
    <Wrap data-testid="security-deposit-refund-ledger">
      <Head>
        <Title>🏦 Security Deposit Refund Ledger</Title>
        <div style={{fontSize:'0.7rem',color:'var(--accent-green, #10B981)',fontWeight:700}}>RERA Standard</div>
      </Head>
      <Body>
        <DepositHeader>
          <div>
            <DepositLabel>Security Deposit Held</DepositLabel>
            <DepositAmt>AED {DEPOSIT.toLocaleString()}</DepositAmt>
            <DepositSub>John Smith — Villa 12A, Palm Jumeirah</DepositSub>
          </div>
          <DepositMeta>
            <DepositLabel>Tenancy Period</DepositLabel>
            <DepositSub style={{color:'var(--text-secondary, #E2E8F0)',fontWeight:700,marginTop:'4px'}}>Jan 2025 – Jan 2026</DepositSub>
            <DepositSub>Move-out: {new Date().toLocaleDateString('en-AE')}</DepositSub>
          </DepositMeta>
        </DepositHeader>

        <div>
          <div style={{fontSize:'0.7rem',fontWeight:700,color:'var(--color-94a3b8, #94A3B8)',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:'8px'}}>
            Itemized Deductions ({deductions.length})
          </div>
          <DeductionList>
            {deductions.map(d=>(
              <DeductionRow key={d.id}>
                <DedIcon>{d.icon}</DedIcon>
                <DedInfo>
                  <DedName>{d.name}</DedName>
                  <DedNote>{d.note}</DedNote>
                  <DedTag $disputed={d.disputed}>{d.disputed?'⚠️ DISPUTED':'APPROVED'}</DedTag>
                </DedInfo>
                <div style={{textAlign:'right'}}>
                  <DedAmount $disputed={d.disputed}>- AED {d.amount.toLocaleString()}</DedAmount>
                  <div style={{marginTop:'4px'}}><button onClick={()=>toggle(d.id)} style={{background:'none',border:'1px solid rgba(100,116,139,0.2)',borderRadius:'4px',color:'var(--text-secondary, #64748B)',fontSize:'0.6rem',cursor:'pointer',padding:'2px 6px'}}>{d.disputed?'Un-dispute':'Dispute'}</button></div>
                </div>
              </DeductionRow>
            ))}
          </DeductionList>
        </div>

        {!processed && (
          <AddRow>
            <Input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Deduction description"/>
            <Input type="number" value={newAmt} onChange={e=>setNewAmt(e.target.value)} placeholder="Amount (AED)"/>
            <AddBtn onClick={addDeduction}>+ Add</AddBtn>
          </AddRow>
        )}

        <Summary>
          <SumRow><SumLabel>Security Deposit</SumLabel><SumValue $green>AED {DEPOSIT.toLocaleString()}</SumValue></SumRow>
          <SumRow><SumLabel>Total Deductions</SumLabel><SumValue $red>- AED {totalDeductions.toLocaleString()}</SumValue></SumRow>
          <Divider/>
          <SumRow>
            <SumLabel style={{fontWeight:800,color:'var(--text-secondary, #E2E8F0)'}}>Net Refund to Tenant</SumLabel>
            <RefundAmt $positive={refund>=0}>{refund>=0?`AED ${refund.toLocaleString()}`:`Tenant owes AED ${Math.abs(refund).toLocaleString()}`}</RefundAmt>
          </SumRow>
        </Summary>

        {processed ? (
          <DoneCard>✅ Refund of AED {refund.toLocaleString()} processed — Transfer ref: WC-SDR-{new Date().getFullYear()}-{Math.floor(Math.random()*90000+10000)}</DoneCard>
        ) : (
          <ProcessBtn onClick={()=>setProcessed(true)}>💸 Process Refund — AED {refund.toLocaleString()}</ProcessBtn>
        )}
      </Body>
    </Wrap>
  );
};

export default SecurityDepositRefundLedger;
