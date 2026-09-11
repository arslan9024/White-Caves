import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const spin = keyframes`0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(16,185,129,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(16,185,129,0.05);border-bottom:1px solid rgba(16,185,129,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const PayoutList = styled.div`display:flex;flex-direction:column;gap:7px`;
const PayoutRow = styled.div<{$status:'queued'|'processing'|'sent'}>`
  display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:9px;
  background:${p=>({queued:'rgba(59,130,246,0.06)',processing:'rgba(245,158,11,0.07)',sent:'rgba(16,185,129,0.06)'}[p.$status])};
  border:1px solid ${p=>({queued:'rgba(59,130,246,0.2)',processing:'rgba(245,158,11,0.2)',sent:'rgba(16,185,129,0.2)'}[p.$status])};
`;
const LandlordName = styled.div`font-size:.76rem;font-weight:700;color:#CBD5E1;flex:1`;
const PayAmt = styled.div`font-size:.78rem;font-weight:900;color:#10B981`;
const StatusBadge = styled.div<{$status:'queued'|'processing'|'sent'}>`
  padding:3px 9px;border-radius:5px;font-size:.62rem;font-weight:700;
  background:${p=>({queued:'rgba(59,130,246,0.15)',processing:'rgba(245,158,11,0.15)',sent:'rgba(16,185,129,0.15)'}[p.$status])};
  color:${p=>({queued:'#60A5FA',processing:'#F59E0B',sent:'#10B981'}[p.$status])};
  display:flex;align-items:center;gap:4px;
`;
const Spinner = styled.div`width:10px;height:10px;border:2px solid rgba(245,158,11,0.3);border-top-color:#F59E0B;border-radius:50%;animation:${spin} .8s linear infinite`;

const SummaryRow = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:8px`;
const SCard = styled.div<{$color:string}>`padding:10px;border-radius:9px;background:rgba(15,23,42,0.6);border:1px solid ${p=>p.$color}20;text-align:center`;
const SVal = styled.div<{$color:string}>`font-size:.9rem;font-weight:900;color:${p=>p.$color}`;
const SLab = styled.div`font-size:.6rem;color:#64748B;margin-top:2px`;

const DispatchBtn = styled.button<{$done:boolean}>`width:100%;padding:12px;border-radius:10px;border:none;background:${p=>p.$done?'rgba(16,185,129,0.1)':'linear-gradient(90deg,#059669,#10B981)'};color:${p=>p.$done?'#10B981':'#FFF'};font-size:.85rem;font-weight:800;cursor:pointer;transition:all .2s;&:hover{filter:brightness(1.1)}`;

const LANDLORDS = [
  {name:'Khalid Al Mansouri',iban:'AE07 0331 2345 6789',net:42000},
  {name:'Sarah Thompson',iban:'AE22 0990 0000 1234',net:28500},
  {name:'Ahmed Al Zaabi',iban:'AE57 0650 0000 9876',net:61800},
  {name:'Linda Weber',iban:'AE11 0400 0000 5432',net:35200},
];

export const LandlordPayoutBatchDispatch: FC = () => {
  const [status, setStatus] = useState<'idle'|'processing'|'done'>('idle');
  const [statuses, setStatuses] = useState<('queued'|'processing'|'sent')[]>(LANDLORDS.map(()=>'queued'));

  const dispatch = () => {
    setStatus('processing');
    LANDLORDS.forEach((_,i)=>{
      setTimeout(()=>{
        setStatuses(prev=>{const n=[...prev];n[i]='processing';return n});
        setTimeout(()=>{
          setStatuses(prev=>{const n=[...prev];n[i]='sent';return n});
          if(i===LANDLORDS.length-1) setStatus('done');
        },1000+i*300);
      },i*600);
    });
  };

  const total = LANDLORDS.reduce((a,l)=>a+l.net,0);
  const sent = statuses.filter(s=>s==='sent').length;

  return (
    <Wrap data-testid="landlord-payout-batch-dispatch">
      <Head>
        <Title>💸 Landlord Payout Batch Dispatch</Title>
        <div style={{fontSize:'.7rem',color:'#10B981',fontWeight:700}}>Auto-Transfer</div>
      </Head>
      <Body>
        <SummaryRow>
          <SCard $color="#CBD5E1"><SVal $color="#CBD5E1">{LANDLORDS.length}</SVal><SLab>Landlords</SLab></SCard>
          <SCard $color="#10B981"><SVal $color="#10B981">AED {total.toLocaleString()}</SVal><SLab>Total Batch</SLab></SCard>
          <SCard $color={sent===LANDLORDS.length?'#10B981':'#F59E0B'}><SVal $color={sent===LANDLORDS.length?'#10B981':'#F59E0B'}>{sent}/{LANDLORDS.length}</SVal><SLab>Transferred</SLab></SCard>
        </SummaryRow>

        <PayoutList>
          {LANDLORDS.map((l,i)=>(
            <PayoutRow key={i} $status={statuses[i]}>
              <div style={{fontSize:'.8rem'}}>🏦</div>
              <div style={{flex:1}}>
                <LandlordName>{l.name}</LandlordName>
                <div style={{fontSize:'.65rem',color:'#475569',marginTop:2}}>{l.iban.slice(0,8)}...</div>
              </div>
              <PayAmt>AED {l.net.toLocaleString()}</PayAmt>
              <StatusBadge $status={statuses[i]}>
                {statuses[i]==='processing'&&<Spinner/>}
                {({queued:'⏳ Queued',processing:'Processing',sent:'✅ Sent'}[statuses[i]])}
              </StatusBadge>
            </PayoutRow>
          ))}
        </PayoutList>

        <DispatchBtn $done={status==='done'} onClick={status==='idle'?dispatch:undefined}>
          {status==='idle'?'🚀 Dispatch Monthly Payouts':status==='processing'?`⏳ Processing ${sent}/${LANDLORDS.length}...`:`✅ All ${LANDLORDS.length} Payouts Sent — AED ${total.toLocaleString()}`}
        </DispatchBtn>
      </Body>
    </Wrap>
  );
};
export default LandlordPayoutBatchDispatch;
