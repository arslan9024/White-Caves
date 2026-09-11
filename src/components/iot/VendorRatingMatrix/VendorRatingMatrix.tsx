import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(245,158,11,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(245,158,11,0.05);border-bottom:1px solid rgba(245,158,11,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const VendorGrid = styled.div`display:flex;flex-direction:column;gap:8px`;
const VendorCard = styled.div`padding:14px 16px;border-radius:12px;background:rgba(15,23,42,0.7);border:1px solid rgba(245,158,11,0.12)`;
const VendorTop = styled.div`display:flex;align-items:flex-start;gap:10px;margin-bottom:8px`;
const VendorName = styled.div`flex:1;font-size:.8rem;font-weight:700;color:#E2E8F0`;
const VendorType = styled.div`font-size:.65rem;font-weight:700;padding:2px 8px;border-radius:5px;background:rgba(245,158,11,0.12);color:#F59E0B;flex-shrink:0`;
const StarRow = styled.div`display:flex;gap:2px;margin-bottom:6px`;
const Star = styled.div<{$filled:boolean}>`font-size:.8rem;color:${p=>p.$filled?'#F59E0B':'rgba(245,158,11,0.2)'}`;
const MetaRow = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px`;
const MetaItem = styled.div`padding:6px;border-radius:6px;background:rgba(15,23,42,0.5);border:1px solid rgba(100,116,139,0.1);text-align:center`;
const MetaVal = styled.div`font-size:.8rem;font-weight:700;color:#CBD5E1`;
const MetaLab = styled.div`font-size:.58rem;color:#64748B;margin-top:2px`;

const SpendBar = styled.div`height:6px;border-radius:3px;background:rgba(30,41,59,0.5);overflow:hidden;margin-top:6px`;
const SpendFill = styled.div<{$pct:number}>`height:100%;width:${p=>p.$pct}%;background:linear-gradient(90deg,#D97706,#F59E0B);border-radius:3px`;

const VENDORS = [
  {name:'Ahmed Plumbing LLC',type:'Plumbing',stars:4,spend:48000,budget:50000,jobs:14,avgResponse:'22 min',onTime:'96%'},
  {name:'CoolAir HVAC Services',type:'HVAC',stars:5,spend:92000,budget:100000,jobs:28,avgResponse:'18 min',onTime:'99%'},
  {name:'Electra Pro Works',type:'Electrical',stars:3,spend:31000,budget:40000,jobs:9,avgResponse:'45 min',onTime:'78%'},
  {name:'CleanSpace Facility Mgmt',type:'Cleaning',stars:4,spend:18000,budget:20000,jobs:36,avgResponse:'1.2 hr',onTime:'92%'},
];

export const VendorRatingMatrix: FC = () => (
  <Wrap data-testid="vendor-rating-matrix">
    <Head>
      <Title>⭐ Vendor Rating Matrix</Title>
      <div style={{fontSize:'.7rem',color:'#F59E0B',fontWeight:700}}>Facilities</div>
    </Head>
    <Body>
      <VendorGrid>
        {VENDORS.map((v,i)=>(
          <VendorCard key={i}>
            <VendorTop>
              <VendorName>{v.name}</VendorName>
              <VendorType>{v.type}</VendorType>
            </VendorTop>
            <StarRow>{[1,2,3,4,5].map(s=><Star key={s} $filled={s<=v.stars}>★</Star>)}</StarRow>
            <div style={{fontSize:'.67rem',color:'#64748B',display:'flex',justifyContent:'space-between'}}>
              <span>YTD Spend: AED {v.spend.toLocaleString()}</span>
              <span style={{color:v.spend/v.budget<0.9?'#10B981':'#F59E0B',fontWeight:700}}>{((v.spend/v.budget)*100).toFixed(0)}% of budget</span>
            </div>
            <SpendBar><SpendFill $pct={(v.spend/v.budget)*100} /></SpendBar>
            <MetaRow>
              <MetaItem><MetaVal>{v.jobs}</MetaVal><MetaLab>Jobs Done</MetaLab></MetaItem>
              <MetaItem><MetaVal>{v.avgResponse}</MetaVal><MetaLab>Avg Response</MetaLab></MetaItem>
              <MetaItem><MetaVal style={{color:parseInt(v.onTime)>=90?'#10B981':'#EF4444'}}>{v.onTime}</MetaVal><MetaLab>On Time</MetaLab></MetaItem>
            </MetaRow>
          </VendorCard>
        ))}
      </VendorGrid>
    </Body>
  </Wrap>
);
export default VendorRatingMatrix;
