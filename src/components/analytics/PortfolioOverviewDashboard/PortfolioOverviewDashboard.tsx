import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(59,130,246,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(59,130,246,0.05);border-bottom:1px solid rgba(59,130,246,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const FilterRow = styled.div`display:flex;gap:8px;flex-wrap:wrap`;
const FilterBtn = styled.button<{$active:boolean}>`padding:5px 12px;border-radius:999px;border:1px solid ${p=>p.$active?'rgba(59,130,246,0.5)':'rgba(100,116,139,0.2)'};background:${p=>p.$active?'rgba(59,130,246,0.1)':'transparent'};color:${p=>p.$active?'#60A5FA':'#64748B'};font-size:.68rem;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;transition:all .15s`;

const PortfolioList = styled.div`display:flex;flex-direction:column;gap:6px`;
const PortfolioRow = styled.div<{$type:string}>`display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;background:rgba(15,23,42,0.7);border:1px solid rgba(100,116,139,0.1)`;
const PropIcon = styled.div`font-size:1rem;flex-shrink:0`;
const PropInfo = styled.div`flex:1`;
const PropName = styled.div`font-size:.76rem;font-weight:700;color:#CBD5E1`;
const PropMeta = styled.div`font-size:.65rem;color:#64748B;margin-top:2px`;
const PropValue = styled.div`text-align:right`;
const PropPrice = styled.div`font-size:.78rem;font-weight:900;color:#10B981`;
const PropReturn = styled.div<{$up:boolean}>`font-size:.65rem;font-weight:700;color:${p=>p.$up?'#10B981':'#EF4444'}`;

const SummaryBar = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:8px`;
const SCard = styled.div<{$color:string}>`padding:10px;border-radius:9px;background:rgba(15,23,42,0.6);border:1px solid ${p=>p.$color}20;text-align:center`;
const SV = styled.div<{$color:string}>`font-size:.88rem;font-weight:900;color:${p=>p.$color}`;
const SL = styled.div`font-size:.6rem;color:#64748B;margin-top:2px`;

const PROPS = [
  {icon:'🏢',name:'Marina Heights 14B',type:'Residential',area:'Dubai Marina',purchasePrice:1900000,currentValue:2450000,roi:8.2,rented:true},
  {icon:'🏛️',name:'Business Bay Office 22',type:'Commercial',area:'Business Bay',purchasePrice:3200000,currentValue:4100000,roi:6.8,rented:true},
  {icon:'🌴',name:'Palm Jumeirah Villa',type:'Residential',area:'Palm Jumeirah',purchasePrice:28000000,currentValue:42000000,roi:14.1,rented:false},
  {icon:'🏗️',name:'EMAAR Beachfront 3A',type:'Off-Plan',area:'Emaar Beachfront',purchasePrice:2200000,currentValue:2800000,roi:11.3,rented:false},
];

export const PortfolioOverviewDashboard: FC = () => {
  const [filter, setFilter] = useState('All');
  const filters = ['All','Residential','Commercial','Off-Plan'];
  const filtered = filter==='All'?PROPS:PROPS.filter(p=>p.type===filter);
  const totalValue = filtered.reduce((a,p)=>a+p.currentValue,0);
  const totalCost = filtered.reduce((a,p)=>a+p.purchasePrice,0);
  const totalGain = totalValue - totalCost;
  const avgRoi = filtered.reduce((a,p)=>a+p.roi,0)/filtered.length;

  return (
    <Wrap data-testid="portfolio-overview-dashboard">
      <Head>
        <Title>💼 Portfolio Overview Dashboard</Title>
        <div style={{fontSize:'.7rem',color:'#3B82F6',fontWeight:700}}>{PROPS.length} Assets</div>
      </Head>
      <Body>
        <FilterRow>
          {filters.map(f=><FilterBtn key={f} $active={filter===f} onClick={()=>setFilter(f)}>{f}</FilterBtn>)}
        </FilterRow>

        <SummaryBar>
          <SCard $color="#10B981"><SV $color="#10B981">AED {(totalValue/1000000).toFixed(1)}M</SV><SL>Portfolio Value</SL></SCard>
          <SCard $color="#F59E0B"><SV $color="#F59E0B">AED {(totalGain/1000000).toFixed(1)}M</SV><SL>Total Gain</SL></SCard>
          <SCard $color="#3B82F6"><SV $color="#3B82F6">{avgRoi.toFixed(1)}%</SV><SL>Avg ROI</SL></SCard>
        </SummaryBar>

        <PortfolioList>
          {filtered.map((p,i)=>(
            <PortfolioRow key={i} $type={p.type}>
              <PropIcon>{p.icon}</PropIcon>
              <PropInfo>
                <PropName>{p.name}</PropName>
                <PropMeta>{p.type} · {p.area} · {p.rented?'✅ Rented':'⬜ Vacant'}</PropMeta>
              </PropInfo>
              <PropValue>
                <PropPrice>AED {(p.currentValue/1000000).toFixed(1)}M</PropPrice>
                <PropReturn $up={true}>↑ {((( p.currentValue - p.purchasePrice)/p.purchasePrice)*100).toFixed(1)}% gain</PropReturn>
              </PropValue>
            </PortfolioRow>
          ))}
        </PortfolioList>
      </Body>
    </Wrap>
  );
};
export default PortfolioOverviewDashboard;
