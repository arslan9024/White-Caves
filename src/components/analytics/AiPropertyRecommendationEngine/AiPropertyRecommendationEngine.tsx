import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0A0614,#0F172A);border:2px solid rgba(139,92,246,0.3);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(139,92,246,0.08);border-bottom:1px solid rgba(139,92,246,0.2);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const SearchRow = styled.div`display:flex;gap:8px`;
const SearchInput = styled.input`flex:1;padding:9px 14px;border-radius:9px;border:1px solid rgba(139,92,246,0.25);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.78rem;font-weight:600;outline:none;font-family:'Inter',sans-serif;&:focus{border-color:#8B5CF6}`;
const SearchBtn = styled.button`padding:9px 16px;border-radius:9px;border:none;background:linear-gradient(90deg,#7C3AED,#8B5CF6);color:#FFF;font-size:.78rem;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif`;

const RecommendGrid = styled.div`display:flex;flex-direction:column;gap:8px`;
const RecommendCard = styled.div<{$match:number}>`padding:14px 16px;border-radius:12px;background:rgba(15,23,42,0.7);border:2px solid ${p=>p.$match>=90?'rgba(139,92,246,0.4)':p.$match>=70?'rgba(59,130,246,0.2)':'rgba(100,116,139,0.12)'};`;
const CardTop = styled.div`display:flex;align-items:flex-start;gap:10px;margin-bottom:8px`;
const CardIcon = styled.div`font-size:1.2rem`;
const CardTitle = styled.div`flex:1;font-size:.8rem;font-weight:700;color:#E2E8F0`;
const CardPrice = styled.div`font-size:.82rem;font-weight:900;color:#A78BFA`;
const MatchBadge = styled.div<{$match:number}>`font-size:.65rem;font-weight:900;padding:3px 9px;border-radius:5px;background:${p=>p.$match>=90?'rgba(139,92,246,0.2)':p.$match>=70?'rgba(59,130,246,0.12)':'rgba(100,116,139,0.1)'};color:${p=>p.$match>=90?'#A78BFA':p.$match>=70?'#60A5FA':'#64748B'}`;
const TagRow = styled.div`display:flex;gap:6px;flex-wrap:wrap`;
const Tag = styled.div`font-size:.63rem;color:#64748B;background:rgba(30,41,59,0.7);border:1px solid rgba(100,116,139,0.15);padding:2px 8px;border-radius:4px`;

const RECOMMENDATIONS = [
  {icon:'🏢',title:'Marina Heights 14B',price:'AED 2.45M',match:96,tags:['2BR','Sea View','Dubai Marina','Ready','Gym+Pool']},
  {icon:'🌊',title:'Marina Gate Tower 8A',price:'AED 2.38M',match:88,tags:['2BR','Marina View','JBR Walk','Furnished']},
  {icon:'✨',title:'Cayan Tower 22C',price:'AED 2.62M',match:74,tags:['2BR','Twisted Tower','Iconic','Sky Pool']},
  {icon:'🌴',title:'JBR Murjan 6 · 2BR',price:'AED 2.29M',match:66,tags:['2BR','Beachfront','Short Walk JBR','Rented']},
];

export const AiPropertyRecommendationEngine: FC = () => {
  const [query, setQuery] = useState('2BR Dubai Marina sea view AED 2.5M');

  return (
    <Wrap data-testid="ai-property-recommendation-engine">
      <Head>
        <Title>🤖 AI Property Recommendation Engine</Title>
        <div style={{fontSize:'.7rem',color:'#A78BFA',fontWeight:700}}>ML Matched</div>
      </Head>
      <Body>
        <SearchRow>
          <SearchInput
            value={query}
            onChange={e=>setQuery(e.target.value)}
            placeholder="Describe your ideal property..."
          />
          <SearchBtn>🔍 AI Search</SearchBtn>
        </SearchRow>

        <div style={{padding:'8px 12px',borderRadius:'8px',background:'rgba(139,92,246,0.07)',border:'1px solid rgba(139,92,246,0.15)',fontSize:'.72rem',color:'#94A3B8'}}>
          🤖 AI analysed 4,280 listings · Matched on: location, budget, bedrooms, view type, amenities
        </div>

        <RecommendGrid>
          {RECOMMENDATIONS.map((r,i)=>(
            <RecommendCard key={i} $match={r.match}>
              <CardTop>
                <CardIcon>{r.icon}</CardIcon>
                <CardTitle>{r.title}</CardTitle>
                <CardPrice>{r.price}</CardPrice>
                <MatchBadge $match={r.match}>{r.match}% match</MatchBadge>
              </CardTop>
              <TagRow>{r.tags.map((t,j)=><Tag key={j}>{t}</Tag>)}</TagRow>
            </RecommendCard>
          ))}
        </RecommendGrid>
      </Body>
    </Wrap>
  );
};
export default AiPropertyRecommendationEngine;
