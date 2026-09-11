import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;max-width:500px;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.3);border-radius:18px;overflow:hidden;padding:24px;color:#FFF`;
const Title = styled.h2`margin:0 0 24px;font-size:1.2rem;font-weight:900;color:#F59E0B;display:flex;align-items:center;gap:8px`;

const List = styled.div`display:flex;flex-direction:column;gap:12px`;
const RankRow = styled.div`display:flex;align-items:center;background:rgba(30,41,59,0.6);border:1px solid rgba(255,255,255,0.05);padding:16px;border-radius:12px;transition:all .2s;&:hover{transform:translateX(5px);background:rgba(30,41,59,0.9)}`;

const RankNum = styled.div`width:30px;font-size:1.2rem;font-weight:900;color:#94A3B8`;
const Avatar = styled.div`width:40px;height:40px;border-radius:20px;background:#38BDF8;display:flex;align-items:center;justify-content:center;font-weight:800;color:#0F172A;margin-right:16px`;
const NameBox = styled.div`flex:1`;
const Name = styled.div`font-size:.95rem;font-weight:800;color:#E2E8F0`;
const Badge = styled.div`font-size:.7rem;color:#10B981;font-weight:700;margin-top:2px`;
const Rev = styled.div`font-size:1.1rem;font-weight:900;color:#FFF;text-align:right`;

export const AgentLeaderboard: FC = () => {
  return (
    <Wrap data-testid="agent-leaderboard">
      <Title>🏆 Top Performers (September)</Title>
      
      <List>
        <RankRow style={{borderColor:'rgba(245,158,11,0.5)',boxShadow:'0 0 15px rgba(245,158,11,0.1)'}}>
          <RankNum style={{color:'#F59E0B'}}>1</RankNum>
          <Avatar style={{background:'#F59E0B'}}>SJ</Avatar>
          <NameBox>
            <Name>Sarah Jenkins</Name>
            <Badge>⭐ Platinum Tier</Badge>
          </NameBox>
          <Rev>AED 2.4M</Rev>
        </RankRow>
        
        <RankRow>
          <RankNum>2</RankNum>
          <Avatar>MA</Avatar>
          <NameBox>
            <Name>Mohammed Ali</Name>
            <Badge>🚀 Rising Star</Badge>
          </NameBox>
          <Rev>AED 1.8M</Rev>
        </RankRow>

        <RankRow>
          <RankNum>3</RankNum>
          <Avatar style={{background:'#10B981'}}>ER</Avatar>
          <NameBox>
            <Name>Elena Rostova</Name>
          </NameBox>
          <Rev>AED 1.5M</Rev>
        </RankRow>
      </List>
    </Wrap>
  );
};
export default AgentLeaderboard;
