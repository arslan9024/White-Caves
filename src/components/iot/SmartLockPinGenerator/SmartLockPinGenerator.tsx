import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(59,130,246,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(59,130,246,0.05);border-bottom:1px solid rgba(59,130,246,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const LockDisplay = styled.div<{$open:boolean}>`
  text-align:center;padding:24px;border-radius:16px;
  background:${p=>p.$open?'rgba(16,185,129,0.08)':'rgba(15,23,42,0.7)'};
  border:2px solid ${p=>p.$open?'rgba(16,185,129,0.35)':'rgba(59,130,246,0.25)'};
  transition:all .3s ease;
`;
const LockIcon = styled.div`font-size:3rem;margin-bottom:8px`;
const LockStatus = styled.div<{$open:boolean}>`font-size:.9rem;font-weight:900;color:${p=>p.$open?'#10B981':'#3B82F6'}`;
const LockSub = styled.div`font-size:.7rem;color:#64748B;margin-top:4px`;

const PinDisplay = styled.div`display:flex;gap:8px;justify-content:center`;
const PinDigit = styled.div`width:36px;height:48px;border-radius:8px;background:rgba(59,130,246,0.1);border:2px solid rgba(59,130,246,0.3);display:flex;align-items:center;justify-content:center;font-size:1.4rem;font-weight:900;color:#60A5FA;font-family:'Courier New',monospace`;

const Numpad = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:8px`;
const NumBtn = styled.button`padding:14px;border-radius:10px;border:none;background:rgba(15,23,42,0.7);color:#E2E8F0;font-size:1rem;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;transition:all .15s;&:hover{background:rgba(59,130,246,0.15);color:#60A5FA}&:active{transform:scale(.95)}`;

const CORRECT_PIN = '4829';

export const SmartLockPinGenerator: FC = () => {
  const [pin, setPin] = useState('');
  const [status, setStatus] = useState<'idle'|'open'|'denied'>('idle');

  const press = (d: string) => {
    if(pin.length>=4) return;
    const newPin = pin+d;
    setPin(newPin);
    if(newPin.length===4) {
      setTimeout(()=>{
        setStatus(newPin===CORRECT_PIN?'open':'denied');
        setTimeout(()=>{setPin('');setStatus('idle');},3000);
      },300);
    }
  };

  const clear = () => { setPin(''); setStatus('idle'); };

  return (
    <Wrap data-testid="smart-lock-pin-generator">
      <Head>
        <Title>🔐 Smart Lock PIN Generator</Title>
        <div style={{fontSize:'.7rem',color:'#3B82F6',fontWeight:700}}>Self-Guided Viewing</div>
      </Head>
      <Body>
        <LockDisplay $open={status==='open'}>
          <LockIcon>{status==='open'?'🔓':status==='denied'?'❌':'🔒'}</LockIcon>
          <LockStatus $open={status==='open'}>
            {status==='open'?'UNLOCKED — Welcome!':status==='denied'?'INVALID PIN':'LOCKED'}
          </LockStatus>
          <LockSub>
            {status==='open'?'Unit 14B — Marina Heights · Access valid 30 min':status==='denied'?'Please try again or contact your agent':'Enter viewing PIN to unlock the unit'}
          </LockSub>
        </LockDisplay>

        <PinDisplay>
          {[0,1,2,3].map(i=>(
            <PinDigit key={i}>{pin[i]?'●':'_'}</PinDigit>
          ))}
        </PinDisplay>

        <Numpad>
          {['1','2','3','4','5','6','7','8','9'].map(d=>(
            <NumBtn key={d} onClick={()=>press(d)}>{d}</NumBtn>
          ))}
          <NumBtn onClick={clear} style={{color:'#EF4444'}}>⌫</NumBtn>
          <NumBtn onClick={()=>press('0')}>0</NumBtn>
          <NumBtn style={{background:'rgba(59,130,246,0.15)',color:'#60A5FA'}} onClick={()=>setPin(CORRECT_PIN)}>Demo PIN</NumBtn>
        </Numpad>

        <div style={{fontSize:'.68rem',color:'#64748B',textAlign:'center',fontStyle:'italic'}}>
          💡 Viewing PIN sent via WhatsApp · Valid today only · Demo PIN: {CORRECT_PIN}
        </div>
      </Body>
    </Wrap>
  );
};
export default SmartLockPinGenerator;
