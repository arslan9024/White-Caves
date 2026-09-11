import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const progress = keyframes`0%{width:0}100%{width:100%}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#061208,#0A1A10);border:2px solid rgba(37,211,102,0.3);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(37,211,102,0.06);border-bottom:1px solid rgba(37,211,102,0.15);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const BrochurePreview = styled.div`padding:0;border-radius:14px;background:rgba(15,23,42,0.8);border:1px solid rgba(37,211,102,0.2);overflow:hidden`;
const BroTop = styled.div`height:100px;background:linear-gradient(135deg,#061208,#0d2416);display:flex;align-items:center;justify-content:center;flex-direction:column;border-bottom:1px solid rgba(37,211,102,0.15)`;
const BroBody = styled.div`padding:14px;display:flex;flex-direction:column;gap:6px`;
const BroRow = styled.div`display:flex;gap:8px;align-items:flex-start`;
const BroIcon = styled.div`font-size:.85rem;flex-shrink:0;margin-top:2px`;
const BroText = styled.div`font-size:.72rem;color:#94A3B8;line-height:1.4`;
const BroStrong = styled.span`color:#25D366;font-weight:700`;

const FieldGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:10px`;
const Field = styled.div`display:flex;flex-direction:column;gap:4px`;
const Label = styled.label`font-size:.7rem;color:#94A3B8;font-weight:600`;
const Input = styled.input`padding:8px 10px;border-radius:7px;border:1px solid rgba(37,211,102,0.2);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.78rem;font-weight:600;width:100%;box-sizing:border-box;outline:none;&:focus{border-color:#25D366}`;

const ProgressBar = styled.div<{$active:boolean}>`height:4px;border-radius:2px;background:rgba(30,41,59,0.5);overflow:hidden;display:${p=>p.$active?'block':'none'}`;
const ProgressFill = styled.div`height:100%;background:linear-gradient(90deg,#25D366,#128C7E);animation:${progress} 1.8s ease forwards`;

const GenerateBtn = styled.button<{$done:boolean}>`width:100%;padding:12px;border-radius:10px;border:none;background:${p=>p.$done?'rgba(37,211,102,0.1)':'linear-gradient(90deg,#128C7E,#25D366)'};color:${p=>p.$done?'#25D366':'#FFF'};font-size:.85rem;font-weight:800;cursor:pointer;transition:all .2s;&:hover{filter:brightness(1.1)}`;

export const WhatsAppBrochureGenerator: FC = () => {
  const [propName, setPropName] = useState('Marina Heights, Unit 14B');
  const [price, setPrice] = useState('AED 2,450,000');
  const [beds, setBeds] = useState('3');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generate = () => {
    setGenerating(true); setGenerated(false);
    setTimeout(()=>{setGenerating(false);setGenerated(true);},2000);
  };

  return (
    <Wrap data-testid="whatsapp-brochure-generator">
      <Head>
        <Title>📱 WhatsApp Brochure Generator</Title>
        <div style={{fontSize:'.7rem',color:'#25D366',fontWeight:700}}>PDF in Chat</div>
      </Head>
      <Body>
        <FieldGrid>
          <Field style={{gridColumn:'1/-1'}}><Label>Property Name</Label><Input value={propName} onChange={e=>setPropName(e.target.value)} /></Field>
          <Field><Label>Price</Label><Input value={price} onChange={e=>setPrice(e.target.value)} /></Field>
          <Field><Label>Bedrooms</Label><Input value={beds} onChange={e=>setBeds(e.target.value)} type="number" /></Field>
        </FieldGrid>

        <BrochurePreview>
          <BroTop>
            <div style={{fontSize:'1.2rem',fontWeight:900,color:'#25D366'}}>🏡 White Caves</div>
            <div style={{fontSize:'.7rem',color:'#4ADE80',marginTop:4}}>{propName}</div>
          </BroTop>
          <BroBody>
            <BroRow><BroIcon>💰</BroIcon><BroText><BroStrong>{price}</BroStrong></BroText></BroRow>
            <BroRow><BroIcon>🛏</BroIcon><BroText>{beds} Bedroom Apartment · 2 Bathrooms · 1,450 sqft</BroText></BroRow>
            <BroRow><BroIcon>📍</BroIcon><BroText>Dubai Marina · Sea & Marina Views · Fully Furnished</BroText></BroRow>
            <BroRow><BroIcon>✅</BroIcon><BroText>Gym · Pool · 24h Security · 2 Parking Spaces</BroText></BroRow>
            <BroRow><BroIcon>📞</BroIcon><BroText>Call: <BroStrong>+971 50 884 2100</BroStrong> · WhatsApp direct</BroText></BroRow>
          </BroBody>
        </BrochurePreview>

        <ProgressBar $active={generating}><ProgressFill /></ProgressBar>

        <GenerateBtn $done={generated} onClick={!generating?generate:undefined}>
          {generating?'⏳ Generating PDF...':generated?'✅ PDF Sent via WhatsApp — Download':'📄 Generate & Send Brochure PDF'}
        </GenerateBtn>
      </Body>
    </Wrap>
  );
};
export default WhatsAppBrochureGenerator;
