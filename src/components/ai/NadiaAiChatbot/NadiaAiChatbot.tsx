import React, { FC, useState, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); }`;
const blink = keyframes`0%, 100% { opacity: 1; } 50% { opacity: 0; }`;
const typing = keyframes`from { width: 0; } to { width: 100%; }`;

const Wrapper = styled.div`width: 100%; background: linear-gradient(135deg, #0A0614, #0F172A); border: 2px solid rgba(139,92,246,0.3); border-radius: 20px; overflow: hidden; font-family: 'Inter', sans-serif; animation: ${fadeIn} 0.5s ease; display: flex; flex-direction: column; height: 520px;`;
const Header = styled.div`padding: 14px 20px; background: rgba(139,92,246,0.08); border-bottom: 1px solid rgba(139,92,246,0.15); display: flex; align-items: center; gap: 12px; flex-shrink: 0;`;
const AgentAvatar = styled.div`width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, #7C3AED, #8B5CF6); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; box-shadow: 0 0 12px rgba(139,92,246,0.4);`;
const AgentInfo = styled.div`flex: 1;`;
const AgentName = styled.div`font-size: 0.88rem; font-weight: 800; color: #FFF;`;
const AgentStatus = styled.div`font-size: 0.68rem; color: #10B981; font-weight: 600; display: flex; align-items: center; gap: 4px;`;
const StatusDot = styled.div`width: 6px; height: 6px; border-radius: 50%; background: #10B981;`;

const MessagesArea = styled.div`flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; &::-webkit-scrollbar { width: 4px; } &::-webkit-scrollbar-track { background: transparent; } &::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 2px; }`;

const Message = styled.div<{ $from: 'user' | 'nadia' }>`display: flex; justify-content: ${p => p.$from === 'user' ? 'flex-end' : 'flex-start'}; gap: 8px; align-items: flex-end;`;
const Bubble = styled.div<{ $from: 'user' | 'nadia' }>`
  max-width: 75%;
  padding: 10px 14px;
  border-radius: ${p => p.$from === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px'};
  background: ${p => p.$from === 'user' ? 'linear-gradient(135deg, #7C3AED, #8B5CF6)' : 'rgba(30,41,59,0.9)'};
  border: 1px solid ${p => p.$from === 'user' ? 'rgba(139,92,246,0.4)' : 'rgba(100,116,139,0.2)'};
  font-size: 0.78rem;
  color: ${p => p.$from === 'user' ? '#FFF' : '#CBD5E1'};
  line-height: 1.5;
`;
const BubbleTime = styled.div`font-size: 0.6rem; color: #475569; margin-top: 3px; text-align: right;`;

const TypingIndicator = styled.div`display: flex; align-items: center; gap: 4px; padding: 10px 14px; background: rgba(30,41,59,0.9); border-radius: 14px 14px 14px 4px; border: 1px solid rgba(100,116,139,0.2); width: fit-content;`;
const Dot = styled.div<{ $delay: number }>`width: 6px; height: 6px; border-radius: 50%; background: #8B5CF6; animation: ${blink} 1.4s ease-in-out infinite; animation-delay: ${p => p.$delay}s;`;

const InputArea = styled.div`padding: 12px 16px; border-top: 1px solid rgba(139,92,246,0.12); display: flex; gap: 10px; flex-shrink: 0; background: rgba(15,23,42,0.6);`;
const ChatInput = styled.input`flex: 1; padding: 10px 14px; border-radius: 12px; border: 1px solid rgba(139,92,246,0.25); background: rgba(15,23,42,0.8); color: #E2E8F0; font-size: 0.8rem; outline: none; font-family: 'Inter', sans-serif; &:focus { border-color: #8B5CF6; } &::placeholder { color: #475569; }`;
const SendBtn = styled.button`padding: 10px 18px; border-radius: 12px; border: none; background: linear-gradient(90deg, #7C3AED, #8B5CF6); color: #FFF; font-size: 0.8rem; font-weight: 700; cursor: pointer; transition: all 0.15s ease; &:hover { filter: brightness(1.1); }`;

const QuickReplies = styled.div`display: flex; gap: 6px; flex-wrap: wrap; padding: 0 16px 10px;`;
const QuickBtn = styled.button`padding: 5px 12px; border-radius: 999px; border: 1px solid rgba(139,92,246,0.3); background: transparent; color: #A78BFA; font-size: 0.68rem; font-weight: 700; cursor: pointer; transition: all 0.15s ease; font-family: 'Inter', sans-serif; &:hover { background: rgba(139,92,246,0.12); }`;

const NADIA_RESPONSES: Record<string, string> = {
  default: "Hello! I'm Nadia, your White Caves AI real estate assistant. I can help you find properties, answer market questions, or schedule viewings in Dubai. What are you looking for today?",
  price: "Dubai property prices vary by community. Downtown Dubai averages AED 2,210/sqft, Dubai Marina at AED 1,840/sqft, and Palm Jumeirah at AED 2,650/sqft. Which area interests you?",
  viewing: "I'd be happy to schedule a viewing! Our agents offer morning (9am–12pm) and afternoon (2pm–7pm) slots, 7 days a week. Which property and date works best for you?",
  golden: "The UAE Golden Visa requires a property value of at least AED 2,000,000 (freehold). The visa is valid for 10 years and includes spouse and children. Would you like me to show eligible properties?",
  mortgage: "UAE banks typically offer 75% LTV for expats and 80% for UAE nationals on properties up to AED 5M. Interest rates currently range from 4.2%–5.5% variable. Want me to run the numbers for a specific property?",
  off_plan: "Off-plan properties in Dubai offer 20–30% developer payment plans with post-handover options. Areas like Dubai Creek Harbour, Downtown, and Dubai Hills are popular. What's your budget?",
};

function getNadiaResponse(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes('price') || m.includes('cost') || m.includes('aed')) return NADIA_RESPONSES.price;
  if (m.includes('viewing') || m.includes('visit') || m.includes('schedule')) return NADIA_RESPONSES.viewing;
  if (m.includes('golden visa') || m.includes('visa')) return NADIA_RESPONSES.golden;
  if (m.includes('mortgage') || m.includes('loan') || m.includes('finance')) return NADIA_RESPONSES.mortgage;
  if (m.includes('off-plan') || m.includes('offplan') || m.includes('developer')) return NADIA_RESPONSES.off_plan;
  return NADIA_RESPONSES.default;
}

interface Msg { from: 'user' | 'nadia'; text: string; time: string; }

const now = () => new Date().toLocaleTimeString('en-AE', { hour: '2-digit', minute: '2-digit' });

export const NadiaAiChatbot: FC = () => {
  const [messages, setMessages] = useState<Msg[]>([
    { from: 'nadia', text: NADIA_RESPONSES.default, time: now() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    const userMsg: Msg = { from: 'user', text, time: now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { from: 'nadia', text: getNadiaResponse(text), time: now() }]);
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 1200);
  }, []);

  const QUICK = ['💰 Property prices?', '📅 Book a viewing', '🇦🇪 Golden Visa', '🏦 Mortgage rates', '🏗️ Off-plan deals'];

  return (
    <Wrapper data-testid="nadia-ai-chatbot">
      <Header>
        <AgentAvatar>🤖</AgentAvatar>
        <AgentInfo>
          <AgentName>Nadia — White Caves AI Agent</AgentName>
          <AgentStatus><StatusDot />Online · Responds instantly</AgentStatus>
        </AgentInfo>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary, #64748B)' }}>GPT-4o Powered</div>
      </Header>
      <MessagesArea>
        {messages.map((m, i) => (
          <Message key={i} $from={m.from}>
            {m.from === 'nadia' && <AgentAvatar style={{ width: 28, height: 28, fontSize: '0.85rem' }}>🤖</AgentAvatar>}
            <div>
              <Bubble $from={m.from}>{m.text}</Bubble>
              <BubbleTime>{m.time}</BubbleTime>
            </div>
          </Message>
        ))}
        {isTyping && (
          <Message $from="nadia">
            <AgentAvatar style={{ width: 28, height: 28, fontSize: '0.85rem' }}>🤖</AgentAvatar>
            <TypingIndicator><Dot $delay={0} /><Dot $delay={0.2} /><Dot $delay={0.4} /></TypingIndicator>
          </Message>
        )}
        <div ref={endRef} />
      </MessagesArea>
      <QuickReplies>
        {QUICK.map(q => <QuickBtn key={q} onClick={() => sendMessage(q)}>{q}</QuickBtn>)}
      </QuickReplies>
      <InputArea>
        <ChatInput
          placeholder="Ask Nadia about Dubai properties..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
        />
        <SendBtn onClick={() => sendMessage(input)}>Send ➤</SendBtn>
      </InputArea>
    </Wrapper>
  );
};
export default NadiaAiChatbot;
