import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(245,158,11,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(245,158,11,0.05);border-bottom:1px solid rgba(245,158,11,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const ListingGrid = styled.div`display:flex;flex-direction:column;gap:8px`;
const ListingCard = styled.div`padding:14px 16px;border-radius:12px;background:rgba(15,23,42,0.8);border:1px solid rgba(245,158,11,0.12)`;
const LTop = styled.div`display:flex;align-items:flex-start;gap:10px;margin-bottom:10px`;
const LTitle = styled.div`font-size:.8rem;font-weight:700;color:#E2E8F0;flex:1`;
const LPrice = styled.div`font-size:.82rem;font-weight:900;color:#F59E0B`;
const ScoreBar = styled.div`height:8px;border-radius:4px;background:rgba(30,41,59,0.7);overflow:hidden;flex:1`;
const ScoreFill = styled.div<{$pct:number}>`height:100%;width:${p=>p.$pct}%;background:linear-gradient(90deg,#D97706,#F59E0B);border-radius:4px`;
const MetaRow = styled.div`display:flex;gap:10px;flex-wrap:wrap;margin-bottom:8px`;
const MetaTag = styled.div`font-size:.65rem;color:#64748B`;
const ScoreRow = styled.div`display:flex;align-items:center;gap:8px`;
const ScoreLab = styled.div`font-size:.67rem;color:#64748B;flex-shrink:0`;
const ScoreVal = styled.div`font-size:.7rem;font-weight:700;color:#F59E0B;flex-shrink:0;width:36px`;
const BoostBtn = styled.button<{$active:boolean}>`padding:5px 12px;border-radius:6px;border:none;background:${p=>p.$active?'rgba(245,158,11,0.15)':'rgba(245,158,11,0.08)'};color:#F59E0B;font-size:.68rem;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;transition:all .15s;&:hover{background:rgba(245,158,11,0.25)}`;

const LISTINGS = [
  {title:'Marina Heights, Unit 14B · 2BR · Sea View',price:'AED 2.45M',beds:'2BR',sqft:'1,450 sqft',area:'Dubai Marina',score:62,views:284,pf:'★ 4.2',boosted:false},
  {title:'Downtown Sky Residence · 1BR · Burj View',price:'AED 1.89M',beds:'1BR',sqft:'780 sqft',area:'Downtown',score:81,views:612,pf:'★ 4.8',boosted:true},
  {title:'JVC Family Apartment · 3BR · Garden View',price:'AED 1.1M',beds:'3BR',sqft:'1,820 sqft',area:'JVC',score:48,views:97,pf:'★ 3.6',boosted:false},
];

export const ListingQualityScoreOptimizer: FC = () => {
  const [boosted, setBoosted] = useState(new Set<number>([1]));

  return (
    <Wrap data-testid="listing-quality-score-optimizer">
      <Head>
        <Title>⭐ Listing Quality Score Optimizer</Title>
        <div style={{fontSize:'.7rem',color:'#F59E0B',fontWeight:700}}>Property Finder</div>
      </Head>
      <Body>
        <ListingGrid>
          {LISTINGS.map((l,i)=>(
            <ListingCard key={i}>
              <LTop>
                <div style={{flex:1}}>
                  <LTitle>{l.title}</LTitle>
                  <MetaRow>
                    <MetaTag>🛏 {l.beds}</MetaTag>
                    <MetaTag>📐 {l.sqft}</MetaTag>
                    <MetaTag>📍 {l.area}</MetaTag>
                    <MetaTag>👁 {l.views} views</MetaTag>
                    <MetaTag>PF {l.pf}</MetaTag>
                  </MetaRow>
                </div>
                <LPrice>{l.price}</LPrice>
              </LTop>
              <ScoreRow>
                <ScoreLab>Quality Score</ScoreLab>
                <ScoreBar><ScoreFill $pct={boosted.has(i)?Math.min(100,l.score+22):l.score} /></ScoreBar>
                <ScoreVal>{boosted.has(i)?Math.min(100,l.score+22):l.score}/100</ScoreVal>
                <BoostBtn $active={boosted.has(i)} onClick={()=>setBoosted(prev=>{const n=new Set(prev);n.has(i)?n.delete(i):n.add(i);return n})}>
                  {boosted.has(i)?'⚡ Boosted':'Boost'}
                </BoostBtn>
              </ScoreRow>
            </ListingCard>
          ))}
        </ListingGrid>
      </Body>
    </Wrap>
  );
};
export default ListingQualityScoreOptimizer;
