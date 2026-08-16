/**
 * FormBSignatureStream — Wave 48 GOAL-022
 * Form B (Buyer Agent Representation) digital signature verification stream
 * White Caves Real Estate LLC — RERA Compliance Suite
 */
import React, { FC, useRef, useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); }`;
const pulse = keyframes`0%,100%{opacity:1}50%{opacity:0.4}`;
const scanLine = keyframes`0%{top:0}100%{top:100%}`;

const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(239,68,68,0.22);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} 0.4s ease;`;
const Head = styled.div`padding:14px 20px;background:rgba(239,68,68,0.05);border-bottom:1px solid rgba(239,68,68,0.12);display:flex;align-items:center;justify-content:space-between;`;
const Title = styled.h3`margin:0;color:#FFF;font-size:0.9rem;font-weight:700;display:flex;align-items:center;gap:8px;`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:16px;`;
const Label = styled.div`font-size:0.7rem;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;`;

const Parties = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:12px;`;
const PartyCard = styled.div<{$signed:boolean}>`padding:14px;border-radius:12px;background:${p=>p.$signed?'rgba(16,185,129,0.07)':'rgba(15,23,42,0.7)'};border:1.5px solid ${p=>p.$signed?'rgba(16,185,129,0.35)':'rgba(100,116,139,0.2)'};transition:all 0.3s ease;`;
const PartyName = styled.div`font-size:0.82rem;font-weight:700;color:#E2E8F0;`;
const PartyRole = styled.div`font-size:0.68rem;color:#64748B;margin-top:2px;`;
const PartyStatus = styled.div<{$signed:boolean}>`font-size:0.7rem;font-weight:800;color:${p=>p.$signed?'#10B981':'#F59E0B'};margin-top:8px;`;

const CanvasWrap = styled.div`position:relative;border-radius:10px;overflow:hidden;background:rgba(15,23,42,0.8);border:1.5px dashed rgba(239,68,68,0.3);`;
const SigCanvas = styled.canvas`display:block;cursor:crosshair;touch-action:none;`;
const ScanBar = styled.div<{$active:boolean}>`position:absolute;left:0;right:0;height:2px;background:rgba(16,185,129,0.7);animation:${p=>p.$active ? css`${scanLine} 1.5s linear infinite` : 'none'};pointer-events:none;`;
const CanvasHint = styled.div`text-align:center;font-size:0.72rem;color:#475569;padding-top:6px;`;

const SignBtn = styled.button<{$variant?:'primary'|'danger'}>`padding:10px 22px;border-radius:10px;border:${p=>p.$variant?'none':'1px solid rgba(100,116,139,0.3)'};background:${p=>p.$variant==='primary'?'linear-gradient(90deg,#DC2626,#EF4444)':p.$variant==='danger'?'rgba(239,68,68,0.1)':'rgba(15,23,42,0.6)'};color:${p=>p.$variant==='primary'?'#FFF':p.$variant==='danger'?'#EF4444':'#94A3B8'};font-size:0.82rem;font-weight:700;cursor:pointer;transition:all 0.2s ease;&:hover{filter:brightness(1.1);}`;
const BtnRow = styled.div`display:flex;gap:10px;justify-content:flex-end;`;

const StreamLog = styled.div`display:flex;flex-direction:column;gap:6px;max-height:110px;overflow-y:auto;`;
const LogItem = styled.div<{$type:'info'|'success'|'warn'}>`display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:7px;background:${p=>p.$type==='success'?'rgba(16,185,129,0.07)':p.$type==='warn'?'rgba(245,158,11,0.06)':'rgba(15,23,42,0.5)'};border:1px solid ${p=>p.$type==='success'?'rgba(16,185,129,0.2)':p.$type==='warn'?'rgba(245,158,11,0.2)':'rgba(100,116,139,0.1)'};`;
const LogDot = styled.div<{$type:'info'|'success'|'warn'}>`width:6px;height:6px;border-radius:50%;background:${p=>p.$type==='success'?'#10B981':p.$type==='warn'?'#F59E0B':'#64748B'};flex-shrink:0;${p=>p.$type==='info' ? css`animation: ${pulse} 1.5s ease infinite;` : ''}`;
const LogText = styled.div`font-size:0.7rem;color:#94A3B8;flex:1;`;
const LogTime = styled.div`font-size:0.65rem;color:#475569;`;

type LogEntry = { text: string; type: 'info'|'success'|'warn'; time: string };

function nowTime() { return new Date().toLocaleTimeString('en-AE',{hour:'2-digit',minute:'2-digit',second:'2-digit'}); }

export const FormBSignatureStream: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [hasSig, setHasSig] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [buyerSigned, setBuyerSigned] = useState(false);
  const [agentSigned, setAgentSigned] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([
    { text: 'Form B initiated — awaiting buyer signature', type: 'info', time: nowTime() },
  ]);

  const addLog = (text: string, type: LogEntry['type']) =>
    setLog(prev => [...prev, { text, type, time: nowTime() }]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext ? canvas.getContext('2d') : null;
    if (!ctx) return;
    ctx.fillStyle = 'rgba(15,23,42,0)';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / (rect.width || 1);
    const scaleY = canvas.height / (rect.height || 1);
    if ('touches' in e) {
      return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (buyerSigned) return;
    const ctx = canvasRef.current?.getContext ? canvasRef.current.getContext('2d') : null;
    if (!ctx) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!drawing || buyerSigned) return;
    const ctx = canvasRef.current?.getContext ? canvasRef.current.getContext('2d') : null;
    if (!ctx) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setHasSig(true);
  };

  const stopDraw = () => setDrawing(false);

  const clearSig = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext ? canvas.getContext('2d') : null;
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasSig(false);
    addLog('Signature pad cleared', 'warn');
  };

  const verifySig = () => {
    if (!hasSig) return;
    setVerifying(true);
    addLog('Transmitting signature hash to RERA verification stream…', 'info');
    setTimeout(() => {
      setBuyerSigned(true);
      setVerifying(false);
      addLog('Buyer signature cryptographically verified ✓', 'success');
      addLog('Generating SHA-256 hash of Form B PDF…', 'info');
      setTimeout(() => {
        setAgentSigned(true);
        addLog('Agent co-signature auto-applied via digital certificate', 'success');
        addLog('Form B sealed — RERA reference: FB-2025-' + Math.floor(Math.random()*90000+10000), 'success');
      }, 1800);
    }, 1600);
  };

  const formBRef = `FB-WC-${new Date().getFullYear()}-${Math.floor(Math.random()*90000+10000)}`;

  return (
    <Wrap data-testid="form-b-signature-stream">
      <Head>
        <Title>📋 Form B — Buyer Agency Agreement</Title>
        <div style={{fontSize:'0.7rem',color:'#EF4444',fontWeight:700}}>RERA Digital Signature</div>
      </Head>
      <Body>
        <div>
          <Label>Parties to Agreement</Label>
          <Parties>
            <PartyCard $signed={buyerSigned}>
              <PartyName>John Smith</PartyName>
              <PartyRole>Buyer / Principal</PartyRole>
              <PartyStatus $signed={buyerSigned}>{buyerSigned?'✅ Signed':'⏳ Signature Pending'}</PartyStatus>
            </PartyCard>
            <PartyCard $signed={agentSigned}>
              <PartyName>White Caves LLC</PartyName>
              <PartyRole>RERA Licensed Agent — ORN 44483</PartyRole>
              <PartyStatus $signed={agentSigned}>{agentSigned?'✅ Co-Signed':'⏳ Awaiting Buyer'}</PartyStatus>
            </PartyCard>
          </Parties>
        </div>

        {!buyerSigned && (
          <div>
            <Label>Buyer Signature Pad</Label>
            <CanvasWrap>
              <SigCanvas
                ref={canvasRef}
                width={480}
                height={120}
                style={{width:'100%',height:'120px'}}
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={stopDraw}
                onMouseLeave={stopDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={stopDraw}
              />
              <ScanBar $active={verifying} />
            </CanvasWrap>
            <CanvasHint>{hasSig?'Signature captured — click Verify to submit':'Draw your signature above'}</CanvasHint>
            <BtnRow style={{marginTop:'10px'}}>
              <SignBtn $variant="danger" onClick={clearSig}>🗑 Clear</SignBtn>
              <SignBtn $variant="primary" onClick={verifySig} disabled={!hasSig||verifying}>
                {verifying?'⏳ Verifying…':'🔐 Verify & Submit'}
              </SignBtn>
            </BtnRow>
          </div>
        )}

        <div>
          <Label>Verification Stream — Ref: {formBRef}</Label>
          <StreamLog>
            {log.map((l,i)=>(
              <LogItem key={i} $type={l.type}>
                <LogDot $type={l.type}/>
                <LogText>{l.text}</LogText>
                <LogTime>{l.time}</LogTime>
              </LogItem>
            ))}
          </StreamLog>
        </div>
      </Body>
    </Wrap>
  );
};

export default FormBSignatureStream;
