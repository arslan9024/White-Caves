import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0A0614,#0F172A);border:2px solid rgba(245,158,11,0.3);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(245,158,11,0.06);border-bottom:1px solid rgba(245,158,11,0.15);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const DeckPreview = styled.div`padding:0;border-radius:14px;background:linear-gradient(135deg,#0F172A,#1E293B);border:1px solid rgba(245,158,11,0.2);overflow:hidden`;
const DeckCover = styled.div`height:120px;background:linear-gradient(135deg,rgba(245,158,11,0.12),rgba(239,68,68,0.08));display:flex;align-items:center;justify-content:center;flex-direction:column;border-bottom:1px solid rgba(245,158,11,0.15)`;
const DeckTitle = styled.div`font-size:1rem;font-weight:900;color:#F59E0B;margin-bottom:4px`;
const DeckSub = styled.div`font-size:.7rem;color:#64748B`;

const SlideList = styled.div`padding:12px;display:flex;flex-direction:column;gap:6px`;
const Slide = styled.div<{$active:boolean}>`display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:7px;background:${p=>p.$active?'rgba(245,158,11,0.08)':'rgba(15,23,42,0.5)'};border:1px solid ${p=>p.$active?'rgba(245,158,11,0.25)':'rgba(100,116,139,0.1)'};cursor:pointer;transition:all .15s`;
const SlideNum = styled.div`font-size:.65rem;font-weight:800;color:#F59E0B;width:20px;flex-shrink:0`;
const SlideLabel = styled.div`font-size:.74rem;color:#CBD5E1;flex:1`;
const SlideType = styled.div`font-size:.6rem;font-weight:700;color:#64748B;background:rgba(100,116,139,0.15);padding:2px 7px;border-radius:4px`;

const SLIDES = [
  {num:'01',label:'Executive Summary — White Caves Portfolio',type:'Cover'},
  {num:'02',label:'Property 1: Palm Jumeirah Villa — AED 18M',type:'Listing'},
  {num:'03',label:'Property 2: Downtown Penthouse — AED 12.5M',type:'Listing'},
  {num:'04',label:'Property 3: DIFC Sky Villa — AED 9.8M',type:'Listing'},
  {num:'05',label:'Market Intelligence — Dubai UHNW Trends Q3 2026',type:'Market'},
  {num:'06',label:'ROI Analysis & 5-Year Yield Projections',type:'Finance'},
  {num:'07',label:'Golden Visa & Residency Pathway Overview',type:'Legal'},
  {num:'08',label:'White Caves Concierge Services & SLA',type:'Service'},
];

const GenBtn = styled.button`width:100%;padding:12px;border-radius:10px;border:none;background:linear-gradient(90deg,#D97706,#F59E0B);color:#FFF;font-size:.85rem;font-weight:800;cursor:pointer;transition:all .2s;&:hover{filter:brightness(1.1)}`;
const DlBtn = styled.button`flex:1;padding:10px;border-radius:9px;border:1px solid rgba(245,158,11,0.3);background:transparent;color:#F59E0B;font-size:.78rem;font-weight:700;cursor:pointer;transition:all .2s;&:hover{background:rgba(245,158,11,0.08)}`;

export const PortfolioDeckGenerator: FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [generated, setGenerated] = useState(false);
  const [clientName, setClientName] = useState('Sheikh Mohammed Al Maktoum');

  return (
    <Wrap data-testid="portfolio-deck-generator">
      <Head>
        <Title>📊 Portfolio Deck Generator</Title>
        <div style={{fontSize:'.7rem',color:'#F59E0B',fontWeight:700}}>UHNW Bespoke</div>
      </Head>
      <Body>
        <div style={{display:'flex',flexDirection:'column',gap:4}}>
          <label style={{fontSize:'.7rem',color:'#94A3B8',fontWeight:600}}>Client Name</label>
          <input value={clientName} onChange={e=>setClientName(e.target.value)} style={{padding:'8px 10px',borderRadius:'7px',border:'1px solid rgba(245,158,11,0.25)',background:'rgba(15,23,42,0.8)',color:'#E2E8F0',fontSize:'.8rem',outline:'none'}} />
        </div>

        <DeckPreview>
          <DeckCover>
            <DeckTitle>🏛️ White Caves Exclusive Portfolio</DeckTitle>
            <DeckSub>Prepared for {clientName}</DeckSub>
            <DeckSub style={{marginTop:4}}>Confidential · {new Date().toLocaleDateString('en-AE',{month:'long',year:'numeric'})}</DeckSub>
          </DeckCover>
          <SlideList>
            {SLIDES.map((s,i)=>(
              <Slide key={i} $active={i===activeSlide} onClick={()=>setActiveSlide(i)}>
                <SlideNum>{s.num}</SlideNum>
                <SlideLabel>{s.label}</SlideLabel>
                <SlideType>{s.type}</SlideType>
              </Slide>
            ))}
          </SlideList>
        </DeckPreview>

        {!generated ? (
          <GenBtn onClick={()=>setGenerated(true)}>✨ Generate Bespoke Deck ({SLIDES.length} slides)</GenBtn>
        ) : (
          <div style={{display:'flex',gap:8}}>
            <DlBtn>📥 Download PDF</DlBtn>
            <DlBtn>📧 Email to Client</DlBtn>
            <DlBtn>🔗 Share Link</DlBtn>
          </div>
        )}
      </Body>
    </Wrap>
  );
};
export default PortfolioDeckGenerator;
