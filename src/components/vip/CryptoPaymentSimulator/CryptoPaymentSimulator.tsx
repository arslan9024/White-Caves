import React, { FC, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const shimmer = keyframes`0%{background-position:-200% 0}100%{background-position:200% 0}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0A0614,#0F172A);border:2px solid rgba(245,158,11,0.3);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(245,158,11,0.06);border-bottom:1px solid rgba(245,158,11,0.15);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const CryptoGrid = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:8px`;
const CryptoCard = styled.div<{$sel:boolean}>`
  padding:12px 8px;border-radius:12px;text-align:center;cursor:pointer;
  background:${p=>p.$sel?'rgba(245,158,11,0.1)':'rgba(15,23,42,0.7)'};
  border:2px solid ${p=>p.$sel?'rgba(245,158,11,0.5)':'rgba(100,116,139,0.2)'};
  transition:all .15s;
`;
const CoinIcon = styled.div`font-size:1.5rem;margin-bottom:4px`;
const CoinName = styled.div`font-size:.7rem;font-weight:800;color:#E2E8F0`;
const CoinRate = styled.div<{$live:boolean}>`
  font-size:.65rem;color:${p=>p.$live?'#10B981':'#64748B'};font-weight:700;margin-top:2px;
  background:${p=>p.$live?'linear-gradient(90deg,#10B981,#34D399,#10B981)':''};
  background-size:200% 100%;
  animation:${p=>p.$live?shimmer:''} 2s linear infinite;
  -webkit-background-clip:${p=>p.$live?'text':''};
  -webkit-text-fill-color:${p=>p.$live?'transparent':''};
`;

const ConvCard = styled.div`padding:18px;border-radius:14px;background:rgba(15,23,42,0.8);border:1px solid rgba(245,158,11,0.2)`;
const ConvRow = styled.div`display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(100,116,139,0.1)`;
const CL = styled.div`font-size:.72rem;color:#64748B`;
const CV = styled.div`font-size:.78rem;font-weight:800;color:#F59E0B`;

const LockBtn = styled.button<{$locked:boolean}>`
  width:100%;padding:12px;border-radius:10px;border:none;
  background:${p=>p.$locked?'rgba(16,185,129,0.1)':'linear-gradient(90deg,#D97706,#F59E0B)'};
  color:${p=>p.$locked?'#10B981':'#FFF'};font-size:.85rem;font-weight:800;cursor:pointer;transition:all .2s;
  &:hover{filter:brightness(1.1)}
`;

const COINS = [
  {id:'btc',name:'Bitcoin',icon:'₿',rate:248420},
  {id:'eth',name:'Ethereum',icon:'Ξ',rate:13420},
  {id:'usdt',name:'USDT',icon:'₮',rate:3.67},
  {id:'usdc',name:'USDC',icon:'$',rate:3.67},
  {id:'ada',name:'Cardano',icon:'₳',rate:2.18},
  {id:'bnb',name:'BNB',icon:'🔶',rate:1248},
];

export const CryptoPaymentSimulator: FC = () => {
  const [coin, setCoin] = useState('btc');
  const [aed, setAed] = useState(3500000);
  const [locked, setLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  const c = COINS.find(x=>x.id===coin)!;
  const cryptoAmt = aed / c.rate;

  useEffect(() => {
    if(!locked) return;
    setLockTimer(300);
    const iv = setInterval(()=>setLockTimer(prev=>{if(prev<=0){clearInterval(iv);setLocked(false);return 0;}return prev-1;}),1000);
    return ()=>clearInterval(iv);
  },[locked]);

  return (
    <Wrap data-testid="crypto-payment-simulator">
      <Head>
        <Title>₿ Crypto Payment Gateway</Title>
        <div style={{fontSize:'.7rem',color:'#F59E0B',fontWeight:700}}>FX Rate Lock</div>
      </Head>
      <Body>
        <CryptoGrid>
          {COINS.map(co=>(
            <CryptoCard key={co.id} $sel={coin===co.id} onClick={()=>{setCoin(co.id);setLocked(false)}}>
              <CoinIcon>{co.icon}</CoinIcon>
              <CoinName>{co.name}</CoinName>
              <CoinRate $live={!locked}>AED {co.rate.toLocaleString()}</CoinRate>
            </CryptoCard>
          ))}
        </CryptoGrid>

        <ConvCard>
          <ConvRow><CL>Property Value</CL><CV>AED {aed.toLocaleString()}</CV></ConvRow>
          <ConvRow><CL>1 {c.name} =</CL><CV>AED {c.rate.toLocaleString()}</CV></ConvRow>
          <ConvRow><CL>Amount Due</CL><CV>{cryptoAmt.toFixed(8)} {c.name}</CV></ConvRow>
          {locked && <ConvRow><CL>Rate Lock Expires</CL><CV style={{color:'#10B981'}}>⏱ {Math.floor(lockTimer/60)}:{String(lockTimer%60).padStart(2,'0')}</CV></ConvRow>}
        </ConvCard>

        <LockBtn $locked={locked} onClick={()=>setLocked(true)}>
          {locked ? `🔒 Rate Locked — ${Math.floor(lockTimer/60)}:${String(lockTimer%60).padStart(2,'0')} remaining` : '⚡ Lock FX Rate (5 min window)'}
        </LockBtn>
      </Body>
    </Wrap>
  );
};
export default CryptoPaymentSimulator;
