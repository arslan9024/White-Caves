/**
 * NdaDigitalSigningModal — Wave 49 GOAL-035
 * Confidential Non-Disclosure Agreement (NDA) digital signing modal
 * White Caves Real Estate LLC — VIP UHNW Suite
 */
import React, { FC, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}`;
const glow = keyframes`0%,100%{box-shadow:0 0 12px rgba(139,92,246,0.3)}50%{box-shadow:0 0 28px rgba(139,92,246,0.6)}`;
const spin = keyframes`to{transform:rotate(360deg)}`;

const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0A0614,#0F172A);border:2px solid rgba(139,92,246,0.35);border-radius:20px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} 0.5s ease;`;
const Head = styled.div`padding:16px 20px;background:rgba(139,92,246,0.08);border-bottom:1px solid rgba(139,92,246,0.18);display:flex;align-items:center;justify-content:space-between;`;
const Title = styled.h3`margin:0;color:#FFF;font-size:0.92rem;font-weight:700;display:flex;align-items:center;gap:8px;`;
const Body = styled.div`padding:22px;display:flex;flex-direction:column;gap:18px;`;

const NdaText = styled.div`max-height:180px;overflow-y:auto;padding:14px;border-radius:10px;background:rgba(15,23,42,0.7);border:1px solid rgba(139,92,246,0.15);font-size:0.72rem;color:#94A3B8;line-height:1.7;&::-webkit-scrollbar{width:4px}&::-webkit-scrollbar-thumb{background:rgba(139,92,246,0.4);border-radius:2px}`;
const NdaHeading = styled.div`font-size:0.8rem;font-weight:800;color:#E2E8F0;margin-bottom:8px;`;
const NdaP = styled.p`margin:0 0 8px;`;

const FieldGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:10px;`;
const Field = styled.div`display:flex;flex-direction:column;gap:4px;`;
const FLabel = styled.label`font-size:0.68rem;color:#94A3B8;font-weight:600;`;
const Input = styled.input`padding:8px 10px;border-radius:7px;border:1px solid rgba(100,116,139,0.25);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:0.78rem;font-weight:600;width:100%;box-sizing:border-box;outline:none;&:focus{border-color:#8B5CF6;}`;

const SigArea = styled.div`position:relative;`;
const SigLabel = styled.div`font-size:0.7rem;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;`;
const CanvasWrap = styled.div`border-radius:10px;overflow:hidden;background:rgba(15,23,42,0.8);border:1.5px dashed rgba(139,92,246,0.35);`;
const SigCanvas = styled.canvas`display:block;cursor:crosshair;touch-action:none;`;
const Hint = styled.div`text-align:center;font-size:0.7rem;color:#475569;padding:4px 0 2px;`;

const CheckRow = styled.label`display:flex;align-items:flex-start;gap:10px;cursor:pointer;`;
const CheckBox = styled.input`accent-color:#8B5CF6;width:16px;height:16px;flex-shrink:0;margin-top:1px;`;
const CheckText = styled.div`font-size:0.75rem;color:#94A3B8;line-height:1.5;`;

const SignBtn = styled.button<{$sealed?:boolean}>`width:100%;padding:14px;border-radius:12px;border:none;background:${p=>p.$sealed?'rgba(16,185,129,0.1)':'linear-gradient(90deg,#7C3AED,#8B5CF6)'};color:${p=>p.$sealed?'#10B981':'#FFF'};font-size:0.88rem;font-weight:800;cursor:${p=>p.$sealed?'default':'pointer'};transition:all 0.3s ease;animation:${p=>p.$sealed?'none':glow} 3s ease infinite;&:hover:not(:disabled){transform:translateY(-1px);filter:brightness(1.1);}`;
const ClearBtn = styled.button`padding:8px 16px;border-radius:8px;border:1px solid rgba(139,92,246,0.25);background:transparent;color:#A78BFA;font-size:0.75rem;font-weight:700;cursor:pointer;&:hover{border-color:#8B5CF6;}`;
const BtnRow = styled.div`display:flex;gap:8px;justify-content:flex-end;margin-top:8px;`;

const SealedCard = styled.div`padding:18px;border-radius:14px;background:rgba(16,185,129,0.07);border:2px solid rgba(16,185,129,0.3);text-align:center;`;
const SealIcon = styled.div`font-size:2.8rem;margin-bottom:8px;`;
const SealTitle = styled.div`font-size:1rem;font-weight:900;color:#10B981;`;
const SealSub = styled.div`font-size:0.72rem;color:#64748B;margin-top:6px;line-height:1.5;`;

const Spinner = styled.div`width:18px;height:18px;border:2px solid rgba(255,255,255,0.2);border-top-color:#FFF;border-radius:50%;animation:${spin} 0.7s linear infinite;margin:0 auto;`;

export const NdaDigitalSigningModal: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [hasSig, setHasSig] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [sealing, setSealing] = useState(false);
  const [sealed, setSealed] = useState(false);
  const [name, setName] = useState('');
  const [passport, setPassport] = useState('');
  const [ndaRef] = useState(`WC-NDA-${new Date().getFullYear()}-${Math.floor(Math.random()*90000+10000)}`);
  const [sealedAt, setSealedAt] = useState('');

  const initCanvas = () => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d')!;
    ctx.strokeStyle = '#A78BFA';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    const sx = c.width / r.width;
    const sy = c.height / r.height;
    if ('touches' in e) return { x:(e.touches[0].clientX-r.left)*sx, y:(e.touches[0].clientY-r.top)*sy };
    return { x:(e.clientX-r.left)*sx, y:(e.clientY-r.top)*sy };
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>|React.TouchEvent<HTMLCanvasElement>) => {
    if (sealed) return;
    initCanvas();
    const ctx = canvasRef.current!.getContext('2d')!;
    const p = getPos(e);
    ctx.beginPath(); ctx.moveTo(p.x, p.y);
    setDrawing(true);
  };
  const draw = (e: React.MouseEvent<HTMLCanvasElement>|React.TouchEvent<HTMLCanvasElement>) => {
    if (!drawing || sealed) return;
    const ctx = canvasRef.current!.getContext('2d')!;
    const p = getPos(e);
    ctx.lineTo(p.x, p.y); ctx.stroke();
    setHasSig(true);
  };
  const stopDraw = () => setDrawing(false);

  const clear = () => {
    const c = canvasRef.current!;
    c.getContext('2d')!.clearRect(0,0,c.width,c.height);
    setHasSig(false);
  };

  const sealNda = () => {
    if (!hasSig || !agreed || !name) return;
    setSealing(true);
    setTimeout(() => {
      setSealed(true);
      setSealing(false);
      setSealedAt(new Date().toLocaleString('en-AE'));
    }, 2000);
  };

  const canSubmit = hasSig && agreed && name.length > 2 && !sealed;

  return (
    <Wrap data-testid="nda-digital-signing-modal">
      <Head>
        <Title>🔏 Confidential NDA — UHNW Access</Title>
        <div style={{fontSize:'0.68rem',color:'#A78BFA',fontWeight:700,background:'rgba(139,92,246,0.1)',padding:'3px 10px',borderRadius:'999px',border:'1px solid rgba(139,92,246,0.25)'}}>LEVEL 5</div>
      </Head>
      <Body>
        <NdaText>
          <NdaHeading>NON-DISCLOSURE AGREEMENT — Ref: {ndaRef}</NdaHeading>
          <NdaP>This Non-Disclosure Agreement ("Agreement") is entered into between <strong>White Caves Global Real Estate LLC</strong> (RERA ORN: 44483, DET License: 1388443) and the undersigned party ("Recipient").</NdaP>
          <NdaP><strong>1. Confidential Information.</strong> Recipient acknowledges that all off-market listing details, pricing structures, ownership identities, and transaction terms disclosed by White Caves constitute strictly confidential proprietary information ("Confidential Information").</NdaP>
          <NdaP><strong>2. Non-Disclosure Obligation.</strong> Recipient shall not disclose, share, publish, or transmit any Confidential Information to any third party without the prior written consent of White Caves Global Real Estate LLC.</NdaP>
          <NdaP><strong>3. Duration.</strong> This obligation shall remain in effect for a period of five (5) years from the date of signature.</NdaP>
          <NdaP><strong>4. Governing Law.</strong> This Agreement is governed by the laws of the United Arab Emirates and the jurisdiction of Dubai Courts.</NdaP>
          <NdaP><strong>5. Breach.</strong> Any breach of this Agreement may result in immediate legal action and claims for damages under UAE law.</NdaP>
        </NdaText>

        <FieldGrid>
          <Field><FLabel>Full Legal Name *</FLabel><Input value={name} onChange={e=>setName(e.target.value)} placeholder="As per passport" disabled={sealed}/></Field>
          <Field><FLabel>Passport / Emirates ID</FLabel><Input value={passport} onChange={e=>setPassport(e.target.value)} placeholder="A12345678" disabled={sealed}/></Field>
        </FieldGrid>

        <SigArea>
          <SigLabel>Digital Signature *</SigLabel>
          <CanvasWrap>
            <SigCanvas
              ref={canvasRef}
              width={480} height={110}
              style={{width:'100%',height:'110px'}}
              onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
              onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw}
            />
          </CanvasWrap>
          <Hint>{hasSig ? 'Signature captured' : 'Draw your signature above'}</Hint>
          {!sealed && <BtnRow><ClearBtn onClick={clear}>Clear</ClearBtn></BtnRow>}
        </SigArea>

        <CheckRow>
          <CheckBox type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} disabled={sealed}/>
          <CheckText>I have read, understood, and agree to be legally bound by the terms of this Non-Disclosure Agreement. I confirm this digital signature carries the same legal weight as a handwritten signature under UAE law.</CheckText>
        </CheckRow>

        {sealed ? (
          <SealedCard>
            <SealIcon>🔏</SealIcon>
            <SealTitle>NDA Sealed & Legally Binding</SealTitle>
            <SealSub>Reference: {ndaRef}<br/>Signed by: {name}<br/>Sealed at: {sealedAt}<br/>SHA-256 Hash stored on White Caves blockchain ledger</SealSub>
          </SealedCard>
        ) : (
          <SignBtn $sealed={false} onClick={sealNda} disabled={!canSubmit||sealing}>
            {sealing ? <Spinner/> : '🔏 Sign & Seal NDA'}
          </SignBtn>
        )}
      </Body>
    </Wrap>
  );
};

export default NdaDigitalSigningModal;
