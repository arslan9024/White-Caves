import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;max-width:400px;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:linear-gradient(180deg,#0F172A,#020617);border:1px solid rgba(251,191,36,0.3);border-radius:24px;overflow:hidden;padding:24px;color:#FFF;box-shadow:0 10px 40px rgba(0,0,0,0.8)`;
const Title = styled.h2`margin:0 0 20px;font-size:1.2rem;font-weight:900;text-align:center;color:#FDE047;text-transform:uppercase;letter-spacing:2px`;

const RankList = styled.div`display:flex;flex-direction:column;gap:12px`;
const RankRow = styled.div<{$top3?:boolean}>`
  display:flex;align-items:center;padding:12px;border-radius:12px;
  background:${p=>p.$top3?'linear-gradient(90deg,rgba(251,191,36,0.1),transparent)':'rgba(255,255,255,0.03)'};
  border:1px solid ${p=>p.$top3?'rgba(251,191,36,0.2)':'transparent'};
`;

const Pos = styled.div<{$top3?:boolean}>`width:30px;font-size:1.2rem;font-weight:900;color:${p=>p.$top3?'#FDE047':'#64748B'}`;
const Ava = styled.div`width:36px;height:36px;border-radius:18px;background:#334155;margin-right:12px;display:flex;align-items:center;justify-content:center;font-size:.8rem`;
const Name = styled.div`flex:1;font-weight:800;font-size:.95rem;color:#E2E8F0`;
const Rev = styled.div`font-weight:900;font-size:1rem;color:#10B981`;
const Trend = styled.div<{$up:boolean}>`font-size:.7rem;margin-left:8px;color:${p=>p.$up?'#10B981':'#EF4444'}`;

export const BrokerLeaderboardRanking: FC = () => {
  return (
    <Wrap data-testid="broker-leaderboard-ranking">
      <Title>🏆 Top Performers (Oct)</Title>
      
      <RankList>
        <RankRow $top3={true}>
          <Pos $top3={true}>1</Pos>
          <Ava>MA</Ava>
          <Name>Mohammed Ali</Name>
          <Rev>4.2M</Rev>
          <Trend $up={true}>▲</Trend>
        </RankRow>
        <RankRow $top3={true}>
          <Pos $top3={true}>2</Pos>
          <Ava>SJ</Ava>
          <Name>Sarah Jenkins</Name>
          <Rev>3.8M</Rev>
          <Trend $up={false}>▼</Trend>
        </RankRow>
        <RankRow $top3={true}>
          <Pos $top3={true}>3</Pos>
          <Ava>DK</Ava>
          <Name>David Kim</Name>
          <Rev>2.9M</Rev>
          <Trend $up={true}>▲</Trend>
        </RankRow>
        <RankRow>
          <Pos>4</Pos>
          <Ava>AL</Ava>
          <Name>Aisha Latif</Name>
          <Rev>1.5M</Rev>
          <Trend $up={true}>▲</Trend>
        </RankRow>
        <RankRow>
          <Pos>5</Pos>
          <Ava>RB</Ava>
          <Name>Ryan Brooks</Name>
          <Rev>1.1M</Rev>
          <Trend $up={false}>▼</Trend>
        </RankRow>
      </RankList>
    </Wrap>
  );
};
export default BrokerLeaderboardRanking;
