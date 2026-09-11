import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`
  padding:28px;border-radius:20px;
  background:linear-gradient(135deg,rgba(15,23,42,0.95),rgba(10,18,40,0.98));
  border:1px solid rgba(100,116,139,0.15);font-family:'Inter',sans-serif;
  animation:${fadeIn} .5s ease;position:relative;overflow:hidden;
`;

const GlowTop = styled.div`
  position:absolute;top:-60px;left:50%;transform:translateX(-50%);
  width:200px;height:120px;border-radius:50%;
  background:radial-gradient(circle,rgba(59,130,246,0.15),transparent 70%);pointer-events:none;
`;

const TimeBlock = styled.div`margin-bottom:6px;font-size:.7rem;color:#475569;font-weight:600;letter-spacing:.3px`;
const Greeting = styled.div`font-size:1.4rem;font-weight:900;color:#FFF;margin-bottom:4px`;
const Subtitle = styled.div`font-size:.78rem;color:#64748B;margin-bottom:20px`;

const AvatarRow = styled.div`display:flex;align-items:center;gap:12px;margin-bottom:20px;padding:14px;border-radius:14px;background:rgba(30,41,59,0.5);border:1px solid rgba(100,116,139,0.1)`;
const Avatar = styled.div`width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#1D4ED8,#8B5CF6);display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0`;
const AgentInfo = styled.div`flex:1`;
const AgentName = styled.div`font-size:.82rem;font-weight:800;color:#E2E8F0`;
const AgentRole = styled.div`font-size:.65rem;color:#64748B;margin-top:2px`;
const AgentLevel = styled.div`font-size:.65rem;font-weight:700;color:#F59E0B;margin-top:2px`;

const TargetsGrid = styled.div`display:flex;flex-direction:column;gap:8px;margin-bottom:16px`;
const TargetRow = styled.div`display:flex;flex-direction:column;gap:4px`;
const TargetLabelRow = styled.div`display:flex;justify-content:space-between`;
const TargetLabel = styled.div`font-size:.68rem;color:#94A3B8;font-weight:600`;
const TargetPct = styled.div<{$done:boolean}>`font-size:.68rem;font-weight:800;color:${p=>p.$done?'#10B981':'#F59E0B'}`;
const TargetBar = styled.div`height:6px;border-radius:3px;background:rgba(30,41,59,0.8);overflow:hidden`;
const TargetFill = styled.div<{$pct:number;$color:string}>`height:100%;width:${p=>Math.min(100,p.$pct)}%;background:${p=>p.$color};border-radius:3px;transition:width .6s ease`;

const QuoteCard = styled.div`padding:12px;border-radius:10px;background:rgba(59,130,246,0.05);border:1px solid rgba(59,130,246,0.15)`;
const QuoteText = styled.div`font-size:.72rem;color:#94A3B8;font-style:italic;line-height:1.55;margin-bottom:4px`;
const QuoteAuthor = styled.div`font-size:.62rem;color:#60A5FA;font-weight:700`;

const TARGETS = [
  {label:'Monthly Revenue',current:82,target:'AED 3M',color:'#10B981'},
  {label:'Deals to Close',current:60,target:'50 deals',color:'#3B82F6'},
  {label:'Lead Response SLA',current:87,target:'95%',color:'#F59E0B'},
];

export const DashboardWelcomeMoodBoard: FC = () => {
  const hour = new Date().getHours();
  const greeting = hour<12?'Good Morning ☀️':hour<17?'Good Afternoon 🌤️':'Good Evening 🌙';
  const subText = hour<12?'Let\'s make today count.':hour<17?'You\'re doing great — keep the momentum!':'Finishing strong. Well done today.';

  return (
    <Wrap data-testid="dashboard-welcome-mood-board">
      <GlowTop/>
      <TimeBlock>{new Date().toLocaleDateString('en-AE',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</TimeBlock>
      <Greeting>{greeting}, Victoria!</Greeting>
      <Subtitle>{subText}</Subtitle>

      <AvatarRow>
        <Avatar>👩</Avatar>
        <AgentInfo>
          <AgentName>Victoria Chen</AgentName>
          <AgentRole>Luxury Sales Director · Dubai Marina</AgentRole>
          <AgentLevel>🏆 Diamond Agent · Level 7 · 3,420 XP</AgentLevel>
        </AgentInfo>
      </AvatarRow>

      <div style={{fontSize:'.7rem',color:'#64748B',fontWeight:700,marginBottom:10}}>📊 Today's Targets</div>
      <TargetsGrid>
        {TARGETS.map((t,i)=>(
          <TargetRow key={i}>
            <TargetLabelRow>
              <TargetLabel>{t.label}</TargetLabel>
              <TargetPct $done={t.current>=100}>{t.current>=100?'✅ ':''}{t.current}% of {t.target}</TargetPct>
            </TargetLabelRow>
            <TargetBar><TargetFill $pct={t.current} $color={t.color}/></TargetBar>
          </TargetRow>
        ))}
      </TargetsGrid>

      <QuoteCard>
        <QuoteText>"In real estate, the best time to buy was always yesterday. The second best time is today."</QuoteText>
        <QuoteAuthor>— Dubai Proverb</QuoteAuthor>
      </QuoteCard>
    </Wrap>
  );
};
export default DashboardWelcomeMoodBoard;
