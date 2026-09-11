import React, { FC, useState, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`from{opacity:0}to{opacity:1}`;
const kenBurns = keyframes`0%{transform:scale(1) translate(0,0)}100%{transform:scale(1.08) translate(-1%,-1%)}`;
const slideUp = keyframes`from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;position:relative;overflow:hidden;border-radius:24px`;

const Slide = styled.div<{$active:boolean}>`
  position:${p=>p.$active?'relative':'absolute'};inset:0;
  display:${p=>p.$active?'block':'none'};
`;

const ImageBg = styled.div<{$gradient:string}>`
  width:100%;aspect-ratio:16/7;position:relative;overflow:hidden;
  background:${p=>p.$gradient};
`;

const KenBurnsOverlay = styled.div<{$active:boolean}>`
  position:absolute;inset:0;
  background:linear-gradient(135deg,rgba(5,10,30,0.3),rgba(0,0,0,0.15));
  ${p=>p.$active&&css`animation:${kenBurns} 8s ease-in-out forwards`}
`;

const PriceBanner = styled.div<{$active:boolean}>`
  position:absolute;bottom:0;left:0;right:0;padding:40px 40px 32px;
  background:linear-gradient(0deg,rgba(5,10,30,0.98) 0%,rgba(5,10,30,0.8) 60%,transparent 100%);
  ${p=>p.$active&&css`animation:${slideUp} .6s .2s ease both`}
`;

const PropBadge = styled.div`
  display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:999px;
  background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.3);
  font-size:.65rem;font-weight:700;color:#F59E0B;margin-bottom:10px;
`;
const PropTitle = styled.div`font-size:clamp(1.2rem,3vw,2rem);font-weight:900;color:#FFF;margin-bottom:6px`;
const PropMeta = styled.div`font-size:.8rem;color:#94A3B8;margin-bottom:14px`;
const PropPrice = styled.div`font-size:clamp(1.5rem,4vw,2.5rem);font-weight:900;color:#F59E0B;margin-bottom:16px`;

const ActionRow = styled.div`display:flex;gap:10px;flex-wrap:wrap`;
const ActionBtn = styled.a<{$primary?:boolean}>`
  padding:10px 22px;border-radius:10px;font-size:.8rem;font-weight:800;cursor:pointer;text-decoration:none;
  ${p=>p.$primary?css`background:linear-gradient(90deg,#1D4ED8,#3B82F6);color:#FFF;&:hover{filter:brightness(1.1)}`:css`background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#E2E8F0;backdrop-filter:blur(8px);&:hover{background:rgba(255,255,255,0.15)}`}
  transition:all .2s;
`;

const NavRow = styled.div`display:flex;align-items:center;gap:10px;padding:16px;background:#0F172A;border-top:1px solid rgba(100,116,139,0.1)`;
const DotBtn = styled.button<{$active:boolean}>`width:${p=>p.$active?'24px':'8px'};height:8px;border-radius:4px;border:none;cursor:pointer;transition:all .3s;background:${p=>p.$active?'#3B82F6':'rgba(100,116,139,0.3)'}`;
const NavBtn = styled.button`padding:6px 14px;border-radius:7px;border:1px solid rgba(100,116,139,0.2);background:transparent;color:#64748B;font-size:.72rem;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;transition:all .15s;&:hover{background:rgba(100,116,139,0.1);color:#CBD5E1}`;

const PROPERTIES = [
  {badge:'🔥 Hot Listing',title:'Five Palm Jumeirah Penthouse',meta:'5BR · 8,200 sqft · Private pool · Private beach',price:'AED 78,000,000',gradient:'linear-gradient(135deg,#1a0a2e 0%,#0d1a40 50%,#0a2818 100%)'},
  {badge:'⭐ Premium',title:'Bulgari Resort Residences, Jumeirah Bay',meta:'3BR Mansion · 5,400 sqft · Full sea view · Concierge',price:'AED 45,000,000',gradient:'linear-gradient(135deg,#1a0a0a 0%,#2a1410 50%,#1a0a0a 100%)'},
  {badge:'✨ Newly Listed',title:'Address Residences, Downtown',meta:'4BR Penthouse · 4,800 sqft · Burj Khalifa view · Furnished',price:'AED 28,500,000',gradient:'linear-gradient(135deg,#0a1028 0%,#101830 50%,#0a0820 100%)'},
  {badge:'🏆 Best Value',title:'Ellington The Crestmark, Business Bay',meta:'2BR Apt · 1,680 sqft · Canal view · High floor',price:'AED 4,200,000',gradient:'linear-gradient(135deg,#0a1428 0%,#101828 50%,#080e20 100%)'},
];

export const LuxuryPropertyShowcase: FC = () => {
  const [active, setActive] = useState(0);

  return (
    <Wrap data-testid="luxury-property-showcase">
      {PROPERTIES.map((p,i)=>(
        <Slide key={i} $active={active===i}>
          <ImageBg $gradient={p.gradient}>
            <KenBurnsOverlay $active={active===i} />
            <PriceBanner $active={active===i}>
              <PropBadge>{p.badge}</PropBadge>
              <PropTitle>{p.title}</PropTitle>
              <PropMeta>{p.meta}</PropMeta>
              <PropPrice>{p.price}</PropPrice>
              <ActionRow>
                <ActionBtn $primary href="#">🏠 View Property</ActionBtn>
                <ActionBtn href="#">💬 WhatsApp Agent</ActionBtn>
                <ActionBtn href="#">📞 Call Now</ActionBtn>
              </ActionRow>
            </PriceBanner>
          </ImageBg>
        </Slide>
      ))}
      <NavRow>
        <div style={{display:'flex',gap:6,flex:1}}>
          {PROPERTIES.map((_,i)=><DotBtn key={i} $active={active===i} onClick={()=>setActive(i)}/>)}
        </div>
        <NavBtn onClick={()=>setActive(p=>(p-1+PROPERTIES.length)%PROPERTIES.length)}>← Prev</NavBtn>
        <NavBtn onClick={()=>setActive(p=>(p+1)%PROPERTIES.length)}>Next →</NavBtn>
        <div style={{fontSize:'.68rem',color:'#475569',fontWeight:600}}>{active+1} / {PROPERTIES.length}</div>
      </NavRow>
    </Wrap>
  );
};
export default LuxuryPropertyShowcase;
