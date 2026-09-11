import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const glow = keyframes`0%,100%{box-shadow:0 0 20px rgba(245,158,11,0.3)}50%{box-shadow:0 0 40px rgba(245,158,11,0.6)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0A0614,#0F0A1E);border:2px solid rgba(245,158,11,0.4);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease,${glow} 3s ease-in-out infinite`;
const Head = styled.div`padding:14px 20px;background:rgba(245,158,11,0.08);border-bottom:1px solid rgba(245,158,11,0.2);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:16px`;

const HeroSection = styled.div`text-align:center;padding:10px 0`;
const HeroIcon = styled.div`font-size:2.4rem;margin-bottom:8px`;
const HeroTitle = styled.div`font-size:1rem;font-weight:900;color:#F59E0B;margin-bottom:4px`;
const HeroSub = styled.div`font-size:.75rem;color:#94A3B8`;

const StatsGrid = styled.div`display:grid;grid-template-columns:repeat(2,1fr);gap:8px;@media(min-width:768px){grid-template-columns:repeat(4,1fr);}`;
const StatCard = styled.div<{$color:string}>`padding:14px;border-radius:12px;background:rgba(15,23,42,0.8);border:1px solid ${p=>p.$color}33;text-align:center`;
const StatNum = styled.div<{$color:string}>`font-size:1.4rem;font-weight:900;color:${p=>p.$color}`;
const StatLab = styled.div`font-size:.65rem;color:#64748B;margin-top:3px`;

const AchievementList = styled.div`display:flex;flex-direction:column;gap:6px`;
const AchRow = styled.div<{$unlocked:boolean}>`
  display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;
  background:${p=>p.$unlocked?'rgba(245,158,11,0.08)':'rgba(15,23,42,0.4)'};
  border:1px solid ${p=>p.$unlocked?'rgba(245,158,11,0.3)':'rgba(100,116,139,0.1)'};
  opacity:${p=>p.$unlocked?1:.5};
`;
const AchIcon = styled.div`font-size:1.1rem;flex-shrink:0`;
const AchInfo = styled.div`flex:1`;
const AchName = styled.div`font-size:.75rem;font-weight:700;color:#E2E8F0`;
const AchDesc = styled.div`font-size:.63rem;color:#64748B;margin-top:2px`;
const AchXp = styled.div<{$unlocked:boolean}>`font-size:.7rem;font-weight:900;color:${p=>p.$unlocked?'#F59E0B':'#475569'}`;

const ACHIEVEMENTS = [
  {icon:'🚀',name:'First Deal Closed',desc:'Closed your first property deal',xp:'+100 XP',unlocked:true},
  {icon:'💎',name:'Diamond Broker',desc:'Closed 50+ deals in a year',xp:'+1000 XP',unlocked:true},
  {icon:'⚡',name:'Speed Closer',desc:'Closed deal within 24h of lead',xp:'+250 XP',unlocked:true},
  {icon:'🌟',name:'5-Star Agent',desc:'100 perfect client reviews',xp:'+500 XP',unlocked:false},
  {icon:'🏆',name:'Top 1% Nationwide',desc:'Ranked #1 in Dubai this quarter',xp:'+2000 XP',unlocked:false},
];

export const AgentGamificationDashboard: FC = () => {
  const [level, setLevel] = useState(7);
  const xpCurrent = 3420;
  const xpNext = 5000;

  return (
    <Wrap data-testid="agent-gamification-dashboard">
      <Head>
        <Title>🎮 Agent Gamification Dashboard</Title>
        <div style={{fontSize:'.7rem',color:'#F59E0B',fontWeight:700}}>Level {level}</div>
      </Head>
      <Body>
        <HeroSection>
          <HeroIcon>🏆</HeroIcon>
          <HeroTitle>Victoria Chen — Diamond Agent</HeroTitle>
          <HeroSub>Level {level} · {xpCurrent.toLocaleString()} / {xpNext.toLocaleString()} XP</HeroSub>
          <div style={{height:10,borderRadius:5,background:'rgba(30,41,59,0.7)',overflow:'hidden',margin:'10px 0'}}>
            <div style={{height:'100%',width:`${(xpCurrent/xpNext)*100}%`,background:'linear-gradient(90deg,#D97706,#F59E0B)',borderRadius:5,transition:'width .5s'}}/>
          </div>
        </HeroSection>

        <StatsGrid>
          <StatCard $color="#F59E0B"><StatNum $color="#F59E0B">52</StatNum><StatLab>Deals Closed</StatLab></StatCard>
          <StatCard $color="#10B981"><StatNum $color="#10B981">AED 145M</StatNum><StatLab>Total Volume</StatLab></StatCard>
          <StatCard $color="#8B5CF6"><StatNum $color="#8B5CF6">4.9 ⭐</StatNum><StatLab>Client Rating</StatLab></StatCard>
          <StatCard $color="#3B82F6"><StatNum $color="#3B82F6">#3</StatNum><StatLab>Dubai Ranking</StatLab></StatCard>
        </StatsGrid>

        <div style={{fontSize:'.7rem',color:'#64748B',fontWeight:600}}>🏅 Achievements</div>
        <AchievementList>
          {ACHIEVEMENTS.map((a,i)=>(
            <AchRow key={i} $unlocked={a.unlocked}>
              <AchIcon>{a.icon}</AchIcon>
              <AchInfo><AchName>{a.name}</AchName><AchDesc>{a.desc}</AchDesc></AchInfo>
              <AchXp $unlocked={a.unlocked}>{a.unlocked?a.xp:'Locked'}</AchXp>
            </AchRow>
          ))}
        </AchievementList>
      </Body>
    </Wrap>
  );
};
export default AgentGamificationDashboard;
