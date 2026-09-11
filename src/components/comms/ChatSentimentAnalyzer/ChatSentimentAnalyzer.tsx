import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(245,158,11,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(245,158,11,0.05);border-bottom:1px solid rgba(245,158,11,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const ChatHistory = styled.div`display:flex;flex-direction:column;gap:8px;max-height:200px;overflow-y:auto;padding-right:4px;&::-webkit-scrollbar{width:3px}&::-webkit-scrollbar-thumb{background:rgba(245,158,11,0.3);border-radius:2px}`;
const MsgWrap = styled.div<{$user:boolean}>`display:flex;justify-content:${p=>p.$user?'flex-end':'flex-start'}`;
const Bubble = styled.div<{$user:boolean}>`
  max-width:75%;padding:8px 12px;border-radius:${p=>p.$user?'12px 12px 4px 12px':'12px 12px 12px 4px'};
  background:${p=>p.$user?'rgba(245,158,11,0.15)':'rgba(15,23,42,0.8)'};
  border:1px solid ${p=>p.$user?'rgba(245,158,11,0.25)':'rgba(100,116,139,0.2)'};
  font-size:.73rem;color:#CBD5E1;line-height:1.45;
`;
const Sender = styled.div<{$user:boolean}>`font-size:.6rem;color:${p=>p.$user?'#F59E0B':'#64748B'};margin-bottom:3px;font-weight:700`;

const SentimentMeter = styled.div`padding:14px;border-radius:12px;background:rgba(15,23,42,0.7);border:1px solid rgba(245,158,11,0.15)`;
const SMLabel = styled.div`font-size:.7rem;color:#64748B;font-weight:600;margin-bottom:8px`;
const SMBar = styled.div`height:10px;border-radius:5px;background:rgba(30,41,59,0.8);overflow:hidden;margin-bottom:6px`;
const SMFill = styled.div<{$pct:number;$color:string}>`height:100%;width:${p=>p.$pct}%;background:${p=>p.$color};border-radius:5px;transition:width .5s ease`;
const SMRow = styled.div`display:flex;justify-content:space-between;font-size:.68rem;color:#64748B`;

const ScoreGrid = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:8px`;
const ScoreCard = styled.div<{$color:string}>`padding:10px;border-radius:9px;background:rgba(15,23,42,0.6);border:1px solid ${p=>p.$color}20;text-align:center`;
const ScoreVal = styled.div<{$color:string}>`font-size:.95rem;font-weight:900;color:${p=>p.$color}`;
const ScoreLab = styled.div`font-size:.62rem;color:#64748B;margin-top:2px`;

const AnalyzeBtn = styled.button<{$done:boolean}>`width:100%;padding:12px;border-radius:10px;border:none;background:${p=>p.$done?'rgba(245,158,11,0.1)':'linear-gradient(90deg,#D97706,#F59E0B)'};color:${p=>p.$done?'#F59E0B':'#FFF'};font-size:.85rem;font-weight:800;cursor:pointer;transition:all .2s;&:hover{filter:brightness(1.1)}`;

const CHAT = [
  {user:false,name:'Client',msg:'Hello, I saw your listing for the Marina Heights apartment. I have been looking for something like this for months.'},
  {user:true,name:'Agent Victoria',msg:'Great to hear from you! That unit is stunning — gorgeous sea views and fully upgraded. Would you like to arrange a viewing?'},
  {user:false,name:'Client',msg:'Yes, definitely interested. However, the price is slightly above my budget. Is there any flexibility?'},
  {user:true,name:'Agent Victoria',msg:'The seller has some flexibility. Let me check with them and get back to you within the hour.'},
  {user:false,name:'Client',msg:'Perfect, thank you! I really hope this works out — it is exactly what I have been searching for.'},
];

export const ChatSentimentAnalyzer: FC = () => {
  const [analyzed, setAnalyzed] = useState(false);

  return (
    <Wrap data-testid="chat-sentiment-analyzer">
      <Head>
        <Title>😊 Chat Sentiment Analyzer</Title>
        <div style={{fontSize:'.7rem',color:'#F59E0B',fontWeight:700}}>AI Analysis</div>
      </Head>
      <Body>
        <ChatHistory>
          {CHAT.map((m,i)=>(
            <MsgWrap key={i} $user={m.user}>
              <div style={{maxWidth:'75%'}}>
                <Sender $user={m.user}>{m.name}</Sender>
                <Bubble $user={m.user}>{m.msg}</Bubble>
              </div>
            </MsgWrap>
          ))}
        </ChatHistory>

        {analyzed && (
          <>
            <SentimentMeter>
              <SMLabel>📊 Overall Sentiment — High Intent Buyer</SMLabel>
              <SMBar><SMFill $pct={78} $color="linear-gradient(90deg,#F59E0B,#10B981)" /></SMBar>
              <SMRow><span>Negative</span><span style={{color:'#10B981',fontWeight:700}}>78% Positive</span><span>Very Positive</span></SMRow>
            </SentimentMeter>
            <ScoreGrid>
              <ScoreCard $color="#10B981"><ScoreVal $color="#10B981">78%</ScoreVal><ScoreLab>Positive</ScoreLab></ScoreCard>
              <ScoreCard $color="#F59E0B"><ScoreVal $color="#F59E0B">17%</ScoreVal><ScoreLab>Neutral</ScoreLab></ScoreCard>
              <ScoreCard $color="#EF4444"><ScoreVal $color="#EF4444">5%</ScoreVal><ScoreLab>Negative</ScoreLab></ScoreCard>
            </ScoreGrid>
            <div style={{padding:'10px 14px',borderRadius:'9px',background:'rgba(16,185,129,0.06)',border:'1px solid rgba(16,185,129,0.2)',fontSize:'.72rem',color:'#94A3B8'}}>
              💡 <strong style={{color:'#10B981'}}>HIGH INTENT:</strong> Client shows strong purchase intent with price sensitivity. Recommend personalized offer within 2 hours.
            </div>
          </>
        )}

        <AnalyzeBtn $done={analyzed} onClick={()=>setAnalyzed(true)}>
          {analyzed?'✅ Sentiment Analyzed':'🤖 Analyze Chat Sentiment (AI)'}
        </AnalyzeBtn>
      </Body>
    </Wrap>
  );
};
export default ChatSentimentAnalyzer;
