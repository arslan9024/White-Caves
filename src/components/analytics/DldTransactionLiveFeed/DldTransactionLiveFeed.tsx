import React, { FC, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const blink = keyframes`0%,100%{opacity:1}50%{opacity:.3}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#050D1A,#0F172A);border:2px solid rgba(59,130,246,0.3);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(59,130,246,0.06);border-bottom:1px solid rgba(59,130,246,0.15);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const LiveDot = styled.div`width:8px;height:8px;border-radius:50%;background:#3B82F6;animation:${blink} 1.5s ease-in-out infinite`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const StatRow = styled.div`display:grid;grid-template-columns:repeat(4,1fr);gap:8px`;
const StatCard = styled.div<{$color:string}>`padding:12px 10px;border-radius:10px;background:rgba(15,23,42,0.7);border:1px solid ${p=>p.$color}22;text-align:center`;
const StatVal = styled.div<{$color:string}>`font-size:.95rem;font-weight:900;color:${p=>p.$color}`;
const StatLab = styled.div`font-size:.6rem;color:#64748B;margin-top:3px`;

const FeedScroll = styled.div`display:flex;flex-direction:column;gap:5px;max-height:220px;overflow-y:auto;&::-webkit-scrollbar{width:3px}&::-webkit-scrollbar-thumb{background:rgba(59,130,246,0.3);border-radius:2px}`;
const FeedRow = styled.div<{$type:string}>`
  display:grid;grid-template-columns:auto 1fr auto auto;gap:10px;align-items:center;
  padding:8px 12px;border-radius:8px;
  background:${p=>p.$type==='SALE'?'rgba(16,185,129,0.06)':p.$type==='RENT'?'rgba(59,130,246,0.06)':'rgba(245,158,11,0.05)'};
  border:1px solid ${p=>p.$type==='SALE'?'rgba(16,185,129,0.15)':p.$type==='RENT'?'rgba(59,130,246,0.15)':'rgba(245,158,11,0.12)'};
`;
const FeedType = styled.div<{$type:string}>`font-size:.62rem;font-weight:900;padding:2px 7px;border-radius:4px;background:${p=>p.$type==='SALE'?'rgba(16,185,129,0.15)':p.$type==='RENT'?'rgba(59,130,246,0.15)':'rgba(245,158,11,0.12)'};color:${p=>p.$type==='SALE'?'#10B981':p.$type==='RENT'?'#60A5FA':'#F59E0B'}`;
const FeedProp = styled.div`font-size:.72rem;color:#94A3B8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap`;
const FeedPrice = styled.div`font-size:.72rem;font-weight:700;color:#CBD5E1;white-space:nowrap`;
const FeedTime = styled.div`font-size:.6rem;color:#475569;font-family:'Courier New',monospace;white-space:nowrap`;

const INITIAL_FEED = [
  {type:'SALE',prop:'Marina Heights 14B · 2BR',price:'AED 2.45M',time:'09:42:11'},
  {type:'RENT',prop:'Downtown Apt 8A · 1BR',price:'AED 130K/yr',time:'09:41:38'},
  {type:'SALE',prop:'Palm Villa 22 · 5BR',price:'AED 42M',time:'09:40:52'},
  {type:'OFFPLAN',prop:'DAMAC Lagoons · 3BR',price:'AED 3.8M',time:'09:40:19'},
  {type:'RENT',prop:'JVC Apt 4C · Studio',price:'AED 48K/yr',time:'09:39:44'},
];

export const DldTransactionLiveFeed: FC = () => {
  const [feed, setFeed] = useState(INITIAL_FEED);
  const [totalSales, setTotalSales] = useState(2847);
  const [totalVolume, setTotalVolume] = useState(8200000000);

  useEffect(()=>{
    const types = ['SALE','RENT','OFFPLAN'] as const;
    const props = ['Business Bay 11F','JBR Apt 3A','Jumeirah Villa 7','EMAAR Beach 2C','Meydan Villa 4'];
    const iv = setInterval(()=>{
      const t = types[Math.floor(Math.random()*types.length)];
      const p = props[Math.floor(Math.random()*props.length)];
      const price = t==='RENT'?`AED ${(Math.random()*200+60).toFixed(0)}K/yr`:`AED ${(Math.random()*10+1).toFixed(1)}M`;
      const now = new Date().toLocaleTimeString('en',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
      setFeed(prev=>[{type:t,prop:p,price,time:now},...prev.slice(0,9)]);
      if(t==='SALE'||t==='OFFPLAN'){setTotalSales(p=>p+1);setTotalVolume(p=>p+Math.random()*5000000+1000000);}
    },4000);
    return ()=>clearInterval(iv);
  },[]);

  return (
    <Wrap data-testid="dld-transaction-live-feed">
      <Head>
        <Title>📡 DLD Transaction Live Feed</Title>
        <div style={{display:'flex',alignItems:'center',gap:6}}><LiveDot/><div style={{fontSize:'.7rem',color:'#3B82F6',fontWeight:700}}>LIVE</div></div>
      </Head>
      <Body>
        <StatRow>
          <StatCard $color="#10B981"><StatVal $color="#10B981">{totalSales.toLocaleString()}</StatVal><StatLab>YTD Sales</StatLab></StatCard>
          <StatCard $color="#3B82F6"><StatVal $color="#3B82F6">AED {(totalVolume/1000000000).toFixed(1)}B</StatVal><StatLab>Volume</StatLab></StatCard>
          <StatCard $color="#F59E0B"><StatVal $color="#F59E0B">+14.2%</StatVal><StatLab>YoY Growth</StatLab></StatCard>
          <StatCard $color="#8B5CF6"><StatVal $color="#8B5CF6">42</StatVal><StatLab>Today Txns</StatLab></StatCard>
        </StatRow>

        <div style={{fontSize:'.7rem',color:'#64748B',fontWeight:600}}>🔴 Live Transactions</div>
        <FeedScroll>
          {feed.map((f,i)=>(
            <FeedRow key={i} $type={f.type}>
              <FeedType $type={f.type}>{f.type}</FeedType>
              <FeedProp>{f.prop}</FeedProp>
              <FeedPrice>{f.price}</FeedPrice>
              <FeedTime>{f.time}</FeedTime>
            </FeedRow>
          ))}
        </FeedScroll>
      </Body>
    </Wrap>
  );
};
export default DldTransactionLiveFeed;
