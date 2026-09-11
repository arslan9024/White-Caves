import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const confetti = keyframes`0%{transform:scale(0) rotate(0)}100%{transform:scale(1) rotate(360deg);opacity:0}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;position:relative;overflow:hidden`;

const ProgressRow = styled.div`display:flex;justify-content:space-between;align-items:center;margin-bottom:20px`;
const DotRow = styled.div`display:flex;gap:6px`;
const Dot = styled.div<{$active:boolean;$done:boolean}>`
  width:${p=>p.$active?'24px':'8px'};height:8px;border-radius:4px;transition:all .3s;
  background:${p=>p.$done||p.$active?'#3B82F6':'rgba(100,116,139,0.25)'}
`;
const SkipBtn = styled.button`padding:6px 14px;border-radius:8px;border:none;background:rgba(100,116,139,0.1);color:#64748B;font-size:.72rem;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;&:hover{background:rgba(100,116,139,0.2)}`;

const Slide = styled.div<{$show:boolean}>`display:${p=>p.$show?'flex':'none'};flex-direction:column;align-items:center;gap:20px;padding:20px;text-align:center;min-height:340px;justify-content:center`;
const SlideIllo = styled.div`font-size:4rem;margin-bottom:8px`;
const SlideTitle = styled.h2`font-size:1.2rem;font-weight:900;color:#FFF;margin:0 0 8px`;
const SlideDesc = styled.p`font-size:.8rem;color:#94A3B8;line-height:1.6;margin:0;max-width:280px`;

const NextBtn = styled.button`
  padding:14px 32px;border-radius:14px;border:none;background:linear-gradient(90deg,#1D4ED8,#3B82F6);
  color:#FFF;font-size:.88rem;font-weight:800;cursor:pointer;font-family:'Inter',sans-serif;
  box-shadow:0 8px 20px rgba(59,130,246,0.4);transition:all .2s;&:hover{filter:brightness(1.1);transform:translateY(-1px)}
`;
const FinishBtn = styled(NextBtn)`background:linear-gradient(90deg,#059669,#10B981);box-shadow:0 8px 20px rgba(16,185,129,0.4)`;

const SLIDES = [
  {illo:'🏙️',title:'Dubai\'s Smartest Property Search',desc:'Search 48,000+ properties across Palm Jumeirah, Downtown, Marina, and all major Dubai areas.'},
  {illo:'🤝',title:'Connect with RERA-Certified Agents',desc:'Chat, call, or WhatsApp verified luxury agents in seconds. Real humans, not bots.'},
  {illo:'📊',title:'Live Market Insights',desc:'DLD data, price trends, yield calculators, and investment analytics — all in one place.'},
  {illo:'🎉',title:'You\'re Ready to Explore!',desc:'Your personalised Dubai property journey starts now. Let\'s find your dream home.'},
];

export const MobileOnboardingCarousel: FC = () => {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  if(done) return (
    <Wrap data-testid="mobile-onboarding-carousel">
      <div style={{textAlign:'center',padding:'40px 20px'}}>
        <div style={{fontSize:'3.5rem',marginBottom:16}}>🎉</div>
        <div style={{fontSize:'1.1rem',fontWeight:900,color:'#10B981',marginBottom:8}}>Welcome to White Caves!</div>
        <div style={{fontSize:'.78rem',color:'#64748B'}}>Your journey to finding the perfect Dubai property begins now.</div>
      </div>
    </Wrap>
  );

  return (
    <Wrap data-testid="mobile-onboarding-carousel">
      <ProgressRow>
        <DotRow>{SLIDES.map((_,i)=><Dot key={i} $active={step===i} $done={i<step}/>)}</DotRow>
        <SkipBtn onClick={()=>setDone(true)}>Skip</SkipBtn>
      </ProgressRow>

      {SLIDES.map((s,i)=>(
        <Slide key={i} $show={step===i}>
          <SlideIllo>{s.illo}</SlideIllo>
          <SlideTitle>{s.title}</SlideTitle>
          <SlideDesc>{s.desc}</SlideDesc>
          {i<SLIDES.length-1?(
            <NextBtn onClick={()=>setStep(p=>p+1)}>Continue →</NextBtn>
          ):(
            <FinishBtn onClick={()=>setDone(true)}>🚀 Get Started</FinishBtn>
          )}
        </Slide>
      ))}
    </Wrap>
  );
};
export default MobileOnboardingCarousel;
