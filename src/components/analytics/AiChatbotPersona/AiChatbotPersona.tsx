import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0A0614,#0F172A);border:2px solid rgba(139,92,246,0.3);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(139,92,246,0.08);border-bottom:1px solid rgba(139,92,246,0.2);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const ChatContainer = styled.div`display:flex;flex-direction:column;gap:10px;max-height:260px;overflow-y:auto;padding-right:4px;&::-webkit-scrollbar{width:3px}&::-webkit-scrollbar-thumb{background:rgba(139,92,246,0.3);border-radius:2px}`;
const MsgWrap = styled.div<{$ai:boolean}>`display:flex;gap:8px;align-items:flex-start;flex-direction:${p=>p.$ai?'row':'row-reverse'}`;
const Avatar = styled.div<{$ai:boolean}>`width:28px;height:28px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:.75rem;background:${p=>p.$ai?'rgba(139,92,246,0.2)':'rgba(16,185,129,0.15)'};border:1px solid ${p=>p.$ai?'rgba(139,92,246,0.3)':'rgba(16,185,129,0.25)'}`;
const Bubble = styled.div<{$ai:boolean}>`max-width:78%;padding:9px 12px;border-radius:${p=>p.$ai?'4px 12px 12px 12px':'12px 4px 12px 12px'};background:${p=>p.$ai?'rgba(139,92,246,0.1)':'rgba(16,185,129,0.08)'};border:1px solid ${p=>p.$ai?'rgba(139,92,246,0.25)':'rgba(16,185,129,0.2)'};font-size:.73rem;color:#CBD5E1;line-height:1.5`;
const Sender = styled.div<{$ai:boolean}>`font-size:.6rem;font-weight:700;margin-bottom:3px;color:${p=>p.$ai?'#A78BFA':'#10B981'}`;

const InputRow = styled.div`display:flex;gap:8px`;
const ChatInput = styled.input`flex:1;padding:10px 14px;border-radius:10px;border:1px solid rgba(139,92,246,0.25);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.78rem;font-weight:600;outline:none;font-family:'Inter',sans-serif;&:focus{border-color:#8B5CF6}`;
const SendBtn = styled.button`padding:10px 16px;border-radius:10px;border:none;background:linear-gradient(90deg,#7C3AED,#8B5CF6);color:#FFF;font-size:.8rem;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;&:hover{filter:brightness(1.1)}`;

const INITIAL_MSGS = [
  {ai:true,text:"Marhaba! I'm Zainab, your White Caves AI assistant. How can I help you find your dream property in Dubai today? 🏡"},
  {ai:false,text:"Hi! I'm looking for a 2-bedroom apartment in Dubai Marina with sea views. Budget around AED 2.5M."},
  {ai:true,text:"Perfect choice! Dubai Marina has some stunning sea-view 2BR options. I found 3 listings matching your criteria:\n\n🏙️ Marina Heights 14B — AED 2.45M · 1,450 sqft · Full sea view\n🌊 Marina Gate Tower 8A — AED 2.38M · 1,280 sqft · Marina view\n✨ Cayan Tower 22C — AED 2.62M · 1,520 sqft · Sea + skyline view\n\nWould you like me to arrange private viewings? I can book all 3 for this weekend! 📅"},
];

const AI_RESPONSES = [
  "Great question! Based on DLD data, Dubai Marina 2BR prices have appreciated 7.2% YoY. Your budget of AED 2.5M is very competitive in this area.",
  "I can arrange private viewings for all 3 properties this weekend. Which days work best for you — Saturday or Sunday?",
  "Absolutely! All 3 properties are RERA-registered with valid Form A permits. I can send you the full documentation via WhatsApp.",
  "The maintenance fee for Marina Heights 14B is approximately AED 25,000/year, covering gym, pool, and 24h security.",
];
let aiIdx = 0;

export const AiChatbotPersona: FC = () => {
  const [msgs, setMsgs] = useState(INITIAL_MSGS);
  const [input, setInput] = useState('');

  const send = () => {
    if(!input.trim()) return;
    const userMsg = {ai:false,text:input};
    const aiReply = {ai:true,text:AI_RESPONSES[aiIdx%AI_RESPONSES.length]};
    aiIdx++;
    setMsgs(prev=>[...prev,userMsg]);
    setTimeout(()=>setMsgs(prev=>[...prev,aiReply]),800);
    setInput('');
  };

  return (
    <Wrap data-testid="ai-chatbot-persona">
      <Head>
        <Title>🤖 Zainab — AI Property Advisor</Title>
        <div style={{fontSize:'.7rem',color:'#A78BFA',fontWeight:700}}>Online Now</div>
      </Head>
      <Body>
        <ChatContainer>
          {msgs.map((m,i)=>(
            <MsgWrap key={i} $ai={m.ai}>
              <Avatar $ai={m.ai}>{m.ai?'🤖':'👤'}</Avatar>
              <div>
                <Sender $ai={m.ai}>{m.ai?'Zainab (AI Advisor)':'You'}</Sender>
                <Bubble $ai={m.ai} style={{whiteSpace:'pre-wrap'}}>{m.text}</Bubble>
              </div>
            </MsgWrap>
          ))}
        </ChatContainer>

        <InputRow>
          <ChatInput
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&send()}
            placeholder="Ask about properties, prices, areas..."
          />
          <SendBtn onClick={send}>Send →</SendBtn>
        </InputRow>
      </Body>
    </Wrap>
  );
};
export default AiChatbotPersona;
