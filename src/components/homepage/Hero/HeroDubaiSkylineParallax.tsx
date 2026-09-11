import React, { FC, useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

const float = keyframes`0%,100%{transform:translateY(0px) rotate(-1deg)}50%{transform:translateY(-12px) rotate(1deg)}`;
const fadeUp = keyframes`from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}`;
const shimmer = keyframes`0%{background-position:-200% center}100%{background-position:200% center}`;
const pulse = keyframes`0%,100%{opacity:.6}50%{opacity:1}`;

const Wrap = styled.div`
  position:relative;width:100%;min-height:100vh;overflow:hidden;
  background:linear-gradient(180deg,#020818 0%,#05112A 40%,#080E24 80%,#0A0614 100%);
  font-family:'Inter',sans-serif;display:flex;align-items:center;justify-content:center;
`;

/* Parallax star layers */
const StarLayer = styled.div<{$speed:number;$count:number}>`
  position:absolute;inset:0;pointer-events:none;
  background-image:${p=>`radial-gradient(1px 1px at ${Array.from({length:p.$count},()=>`${Math.random()*100}% ${Math.random()*100}%`).join(', ')}, rgba(255,255,255,0.8), transparent)`};
  animation:${p=>css`${keyframes`from{transform:translateY(0)}to{transform:translateY(-30px)}`} ${p.$speed}s linear infinite alternate`};
`;

const SkylineLayer = styled.div`
  position:absolute;bottom:0;left:0;right:0;height:45%;
  background:linear-gradient(180deg,transparent 0%,rgba(5,17,42,0.4) 40%,rgba(5,17,42,0.9) 100%);
  &::before{
    content:'';position:absolute;bottom:0;left:0;right:0;height:100%;
    background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1400 300'%3E%3Crect x='0' y='180' width='30' height='120' fill='%230a1428'/%3E%3Crect x='35' y='150' width='20' height='150' fill='%230d1930'/%3E%3Crect x='60' y='200' width='50' height='100' fill='%230a1428'/%3E%3Crect x='115' y='100' width='15' height='200' fill='%230d1930'/%3E%3Crect x='135' y='80' width='8' height='220' fill='%23162040'/%3E%3Crect x='148' y='170' width='40' height='130' fill='%230a1428'/%3E%3Crect x='200' y='120' width='60' height='180' fill='%230d1930'/%3E%3Crect x='270' y='60' width='20' height='240' fill='%23162040'/%3E%3Crect x='295' y='130' width='80' height='170' fill='%230a1428'/%3E%3Crect x='385' y='160' width='35' height='140' fill='%230d1930'/%3E%3Crect x='430' y='90' width='25' height='210' fill='%23162040'/%3E%3Crect x='460' y='140' width='90' height='160' fill='%230a1428'/%3E%3Crect x='560' y='50' width='12' height='250' fill='%231a2a50'/%3E%3Crect x='580' y='110' width='70' height='190' fill='%230d1930'/%3E%3Crect x='660' y='170' width='50' height='130' fill='%230a1428'/%3E%3Crect x='720' y='80' width='30' height='220' fill='%23162040'/%3E%3Crect x='760' y='130' width='100' height='170' fill='%230d1930'/%3E%3Crect x='870' y='60' width='20' height='240' fill='%231a2a50'/%3E%3Crect x='900' y='150' width='60' height='150' fill='%230a1428'/%3E%3Crect x='970' y='90' width='40' height='210' fill='%230d1930'/%3E%3Crect x='1020' y='140' width='80' height='160' fill='%23162040'/%3E%3Crect x='1110' y='170' width='30' height='130' fill='%230a1428'/%3E%3Crect x='1150' y='100' width='50' height='200' fill='%230d1930'/%3E%3Crect x='1210' y='130' width='190' height='170' fill='%230a1428'/%3E%3C/svg%3E") bottom/cover no-repeat;
  }
`;

const GlowOrb = styled.div<{$x:number;$y:number;$color:string;$size:number}>`
  position:absolute;left:${p=>p.$x}%;top:${p=>p.$y}%;
  width:${p=>p.$size}px;height:${p=>p.$size}px;border-radius:50%;
  background:radial-gradient(circle,${p=>p.$color} 0%,transparent 70%);
  transform:translate(-50%,-50%);pointer-events:none;opacity:.35;
  filter:blur(40px);
`;

const Content = styled.div`
  position:relative;z-index:10;text-align:center;padding:0 24px;
  animation:${fadeUp} .9s ease;max-width:900px;
`;

const Badge = styled.div`
  display:inline-flex;align-items:center;gap:6px;padding:6px 16px;border-radius:999px;
  background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);
  font-size:.75rem;font-weight:700;color:#F59E0B;letter-spacing:.5px;margin-bottom:20px;
  animation:${pulse} 2s ease-in-out infinite;
`;

const H1 = styled.h1`
  font-size:clamp(2.2rem,6vw,4.2rem);font-weight:900;line-height:1.1;margin:0 0 16px;
  background:linear-gradient(135deg,#FFFFFF 0%,#E2E8F0 40%,#94A3B8 70%,#60A5FA 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  background-size:200%;animation:${shimmer} 4s linear infinite;
`;

const Sub = styled.p`
  font-size:clamp(.9rem,2vw,1.15rem);color:#94A3B8;max-width:600px;margin:0 auto 32px;
  line-height:1.65;
`;

const CtaRow = styled.div`display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:40px`;

const CtaBtn = styled.a<{$primary?:boolean}>`
  padding:14px 28px;border-radius:12px;font-size:.9rem;font-weight:800;
  cursor:pointer;text-decoration:none;transition:all .2s;display:inline-flex;align-items:center;gap:8px;
  ${p=>p.$primary?css`
    background:linear-gradient(135deg,#1D4ED8,#3B82F6);color:#FFF;
    box-shadow:0 0 24px rgba(59,130,246,0.4);
    &:hover{box-shadow:0 0 40px rgba(59,130,246,0.6);transform:translateY(-2px)}
  `:css`
    background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.15);color:#E2E8F0;
    backdrop-filter:blur(10px);
    &:hover{background:rgba(255,255,255,0.1);transform:translateY(-2px)}
  `}
`;

const FloatingCards = styled.div`
  display:flex;gap:16px;justify-content:center;flex-wrap:wrap;
`;

const PropCard = styled.div<{$delay:number}>`
  padding:14px 18px;border-radius:16px;background:rgba(255,255,255,0.05);
  border:1px solid rgba(255,255,255,0.1);backdrop-filter:blur(20px);
  animation:${float} ${p=>3+p.$delay*.5}s ease-in-out ${p=>p.$delay*.3}s infinite;
  text-align:left;min-width:200px;
`;
const CardArea = styled.div`font-size:.65rem;color:#64748B;font-weight:600;margin-bottom:4px`;
const CardPrice = styled.div`font-size:.92rem;font-weight:900;color:#FFF;margin-bottom:2px`;
const CardMeta = styled.div`font-size:.65rem;color:#94A3B8`;
const CardTag = styled.div`display:inline-block;padding:2px 8px;border-radius:999px;font-size:.58rem;font-weight:700;background:rgba(16,185,129,0.15);color:#10B981;margin-top:6px`;

const CARDS = [
  {area:'Palm Jumeirah',price:'AED 42M',meta:'5BR Villa · Sea view',tag:'🔥 Hot'},
  {area:'Dubai Marina',price:'AED 2.45M',meta:'2BR Apt · DIFC view',tag:'✨ New'},
  {area:'Downtown Dubai',price:'AED 18.9M',meta:'4BR PH · Burj view',tag:'⭐ Premium'},
];

export const HeroDubaiSkylineParallax: FC = () => {
  const [scrollY, setScrollY] = useState(0);
  useEffect(()=>{
    const h = ()=>setScrollY(window.scrollY);
    window.addEventListener('scroll',h,{passive:true});
    return ()=>window.removeEventListener('scroll',h);
  },[]);

  return (
    <Wrap data-testid="hero-dubai-skyline-parallax">
      {/* Glowing orbs */}
      <GlowOrb $x={20} $y={30} $color="rgba(59,130,246,0.6)" $size={400}/>
      <GlowOrb $x={80} $y={60} $color="rgba(139,92,246,0.5)" $size={300}/>
      <GlowOrb $x={50} $y={80} $color="rgba(245,158,11,0.3)" $size={200}/>

      {/* Skyline */}
      <SkylineLayer style={{transform:`translateY(${scrollY*0.15}px)`}}/>

      <Content>
        <Badge>🏆 Dubai's #1 Luxury Real Estate Agency</Badge>

        <H1>Find Your Dream<br/>Property in Dubai</H1>

        <Sub>
          White Caves Real Estate — trusted by 500+ families. RERA-certified agents,
          off-plan specialists, and investment advisors serving Palm Jumeirah,
          Downtown, Marina, and beyond.
        </Sub>

        <CtaRow>
          <CtaBtn $primary href="#">🔍 Search Properties</CtaBtn>
          <CtaBtn href="#">💬 WhatsApp Agent</CtaBtn>
          <CtaBtn href="#">📊 Market Report</CtaBtn>
        </CtaRow>

        <FloatingCards>
          {CARDS.map((c,i)=>(
            <PropCard key={i} $delay={i}>
              <CardArea>📍 {c.area}</CardArea>
              <CardPrice>{c.price}</CardPrice>
              <CardMeta>{c.meta}</CardMeta>
              <CardTag>{c.tag}</CardTag>
            </PropCard>
          ))}
        </FloatingCards>
      </Content>
    </Wrap>
  );
};
export default HeroDubaiSkylineParallax;
