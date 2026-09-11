import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(139,92,246,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(139,92,246,0.05);border-bottom:1px solid rgba(139,92,246,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const NatGrid = styled.div`display:grid;grid-template-columns:repeat(2,1fr);gap:8px`;
const NatCard = styled.div<{$selected:boolean}>`padding:12px;border-radius:10px;cursor:pointer;background:${p=>p.$selected?'rgba(139,92,246,0.1)':'rgba(15,23,42,0.6)'};border:2px solid ${p=>p.$selected?'rgba(139,92,246,0.4)':'rgba(100,116,139,0.12)'};transition:all .15s`;
const NatFlag = styled.div`font-size:1.4rem;margin-bottom:4px`;
const NatName = styled.div<{$selected:boolean}>`font-size:.72rem;font-weight:700;color:${p=>p.$selected?'#A78BFA':'#94A3B8'}`;
const NatCount = styled.div`font-size:.65rem;color:#64748B;margin-top:2px`;
const NatPct = styled.div<{$selected:boolean}>`font-size:.82rem;font-weight:900;color:${p=>p.$selected?'#8B5CF6':'#CBD5E1'};margin-top:4px`;

const StatList = styled.div`display:flex;flex-direction:column;gap:6px`;
const StatRow = styled.div`display:flex;justify-content:space-between;padding:7px 12px;border-radius:8px;background:rgba(15,23,42,0.5);border:1px solid rgba(100,116,139,0.1)`;
const SL = styled.div`font-size:.72rem;color:#64748B`;
const SV = styled.div`font-size:.72rem;font-weight:700;color:#CBD5E1`;

const NATIONALITIES = [
  {flag:'🇦🇪',name:'UAE Nationals',count:287,pct:'23.1%',avgBudget:'AED 18.4M',prefArea:'Palm Jumeirah'},
  {flag:'🇮🇳',name:'Indian',count:198,pct:'16.0%',avgBudget:'AED 4.2M',prefArea:'JVC / JLT'},
  {flag:'🇬🇧',name:'British',count:156,pct:'12.6%',avgBudget:'AED 7.8M',prefArea:'Dubai Marina'},
  {flag:'🇷🇺',name:'Russian',count:142,pct:'11.5%',avgBudget:'AED 9.1M',prefArea:'Business Bay'},
  {flag:'🇨🇳',name:'Chinese',count:121,pct:'9.8%',avgBudget:'AED 11.2M',prefArea:'Downtown'},
  {flag:'🌍',name:'Other',count:336,pct:'27.1%',avgBudget:'AED 5.5M',prefArea:'Various'},
];

export const BuyerNationalityAnalytics: FC = () => {
  const [sel, setSel] = useState(0);
  const nat = NATIONALITIES[sel];

  return (
    <Wrap data-testid="buyer-nationality-analytics">
      <Head>
        <Title>🌍 Buyer Nationality Analytics</Title>
        <div style={{fontSize:'.7rem',color:'#8B5CF6',fontWeight:700}}>DLD Data 2026</div>
      </Head>
      <Body>
        <NatGrid>
          {NATIONALITIES.map((n,i)=>(
            <NatCard key={i} $selected={sel===i} onClick={()=>setSel(i)}>
              <NatFlag>{n.flag}</NatFlag>
              <NatName $selected={sel===i}>{n.name}</NatName>
              <NatCount>{n.count} buyers</NatCount>
              <NatPct $selected={sel===i}>{n.pct}</NatPct>
            </NatCard>
          ))}
        </NatGrid>

        <StatList>
          <StatRow><SL>Nationality</SL><SV>{nat.flag} {nat.name}</SV></StatRow>
          <StatRow><SL>Share of Buyers</SL><SV style={{color:'#8B5CF6'}}>{nat.pct}</SV></StatRow>
          <StatRow><SL>Average Budget</SL><SV style={{color:'#10B981'}}>{nat.avgBudget}</SV></StatRow>
          <StatRow><SL>Preferred Area</SL><SV>{nat.prefArea}</SV></StatRow>
          <StatRow><SL>Total Buyers (Q3)</SL><SV>{nat.count}</SV></StatRow>
        </StatList>
      </Body>
    </Wrap>
  );
};
export default BuyerNationalityAnalytics;
