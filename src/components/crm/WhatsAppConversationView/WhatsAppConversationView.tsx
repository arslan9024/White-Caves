import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.95);border:1px solid rgba(100,116,139,0.15);border-radius:18px;display:flex;flex-direction:column;height:500px;overflow:hidden`;

const Head = styled.div`padding:12px 18px;border-bottom:1px solid rgba(100,116,139,0.1);display:flex;align-items:center;justify-content:space-between;background:rgba(15,23,42,0.98);z-index:10`;
const UserInfo = styled.div`display:flex;align-items:center;gap:10px`;
const Avatar = styled.div`width:40px;height:40px;border-radius:50%;background:#1e3a8a;display:flex;align-items:center;justify-content:center;font-size:1.1rem`;
const NameStack = styled.div`display:flex;flex-direction:column`;
const Name = styled.div`font-size:.85rem;font-weight:700;color:#E2E8F0`;
const Status = styled.div`font-size:.65rem;color:#10B981;font-weight:600`;

const Actions = styled.div`display:flex;gap:8px`;
const ActionBtn = styled.button`width:32px;height:32px;border-radius:50%;border:1px solid rgba(100,116,139,0.2);background:rgba(30,41,59,0.5);color:#CBD5E1;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;&:hover{background:rgba(59,130,246,0.2);color:#60A5FA;border-color:rgba(59,130,246,0.3)}`;

const ChatArea = styled.div`flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:12px;background:url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMGYxNzJhIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMxZTI5M2IiPjwvcmVjdD4KPC9zdmc+')`;

const DateBadge = styled.div`align-self:center;padding:4px 12px;border-radius:10px;background:rgba(30,41,59,0.8);font-size:.6rem;font-weight:700;color:#94A3B8;margin:10px 0`;

const Bubble = styled.div<{$mine:boolean}>`
  max-width:75%;padding:10px 14px;position:relative;
  border-radius:${p=>p.$mine?'16px 16px 4px 16px':'16px 16px 16px 4px'};
  align-self:${p=>p.$mine?'flex-end':'flex-start'};
  background:${p=>p.$mine?'#056162':'#262d31'};
  color:#E2E8F0;font-size:.78rem;line-height:1.45;
  box-shadow:0 1px 2px rgba(0,0,0,0.2);
`;
const BTime = styled.div`font-size:.55rem;color:rgba(255,255,255,0.5);text-align:right;margin-top:4px;display:flex;justify-content:flex-end;gap:4px;align-items:center`;

const MediaWrap = styled.div`width:200px;height:120px;border-radius:10px;background:#1e293b;margin-bottom:6px;display:flex;align-items:center;justify-content:center;font-size:2rem`;

const InputArea = styled.div`padding:12px 18px;background:rgba(30,41,59,0.9);display:flex;align-items:center;gap:10px;border-top:1px solid rgba(100,116,139,0.1)`;
const PlusBtn = styled.button`font-size:1.2rem;color:#94A3B8;background:transparent;border:none;cursor:pointer`;
const Input = styled.input`flex:1;padding:10px 16px;border-radius:20px;border:none;background:#1e293b;color:#E2E8F0;font-size:.8rem;outline:none;font-family:'Inter',sans-serif;&::placeholder{color:#64748B}`;
const MicBtn = styled.button`width:38px;height:38px;border-radius:50%;border:none;background:#056162;color:#FFF;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;&:hover{background:#008f8f}`;

export const WhatsAppConversationView: FC = () => {
  return (
    <Wrap data-testid="whatsapp-conversation-view">
      <Head>
        <UserInfo>
          <Avatar>👨</Avatar>
          <NameStack>
            <Name>James Robertson</Name>
            <Status>online</Status>
          </NameStack>
        </UserInfo>
        <Actions>
          <ActionBtn>📞</ActionBtn>
          <ActionBtn>📹</ActionBtn>
          <ActionBtn>🔍</ActionBtn>
        </Actions>
      </Head>
      <ChatArea>
        <DateBadge>TODAY</DateBadge>
        <Bubble $mine={false}>
          Good morning! We are very interested in the Downtown penthouse. Is the price negotiable?
          <BTime>09:12</BTime>
        </Bubble>
        <Bubble $mine={true}>
          <MediaWrap>🏢</MediaWrap>
          Hi James! The seller is open to reasonable offers, especially for cash buyers. Would you like me to send you the floor plans?
          <BTime>09:15 <span style={{color:'#38bdf8'}}>✓✓</span></BTime>
        </Bubble>
        <Bubble $mine={false}>
          Yes please, and also details on the service charges.
          <BTime>09:18</BTime>
        </Bubble>
        <Bubble $mine={true}>
          Attached the floor plan. The service charge is AED 22/sqft. Let me know if you want to schedule a viewing!
          <BTime>09:20 <span style={{color:'#38bdf8'}}>✓✓</span></BTime>
        </Bubble>
      </ChatArea>
      <InputArea>
        <PlusBtn>＋</PlusBtn>
        <Input placeholder="Type a message" />
        <MicBtn>🎙️</MicBtn>
      </InputArea>
    </Wrap>
  );
};
export default WhatsAppConversationView;
