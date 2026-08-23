import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const Wrapper = styled.div`width: 100%; background: linear-gradient(135deg, #0F172A, #1E293B); border: 2px solid rgba(239,68,68,0.2); border-radius: 14px; overflow: hidden; font-family: 'Inter', sans-serif; animation: ${fadeIn} 0.4s ease;`;
const Title = styled.div`padding: 12px 16px; font-size: 0.82rem; font-weight: 700; color: #CBD5E1; border-bottom: 1px solid rgba(100,116,139,0.15); display: flex; align-items: center; justify-content: space-between;`;
const Body = styled.div`padding: 14px 16px; display: flex; flex-direction: column; gap: 10px;`;
const Row = styled.div`display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; border-radius: 8px; background: rgba(15,23,42,0.6); cursor: pointer; transition: background 0.15s; &:hover { background: rgba(239,68,68,0.06); }`;
const CName = styled.div`font-size: 0.78rem; font-weight: 700; color: #CBD5E1;`;
const Score = styled.div<{ $score: number }>`
  display: flex; align-items: center; gap: 8px;
`;
const ScoreDots = styled.div`display: flex; gap: 3px;`;
const Dot = styled.div<{ $filled: boolean }>`width: 8px; height: 8px; border-radius: 50%; background: ${p => p.$filled ? '#EF4444' : 'rgba(100,116,139,0.3)'};`;
const ScoreNum = styled.div`font-size: 0.75rem; font-weight: 800; color: #EF4444;`;
const Badge = styled.div<{ $liq: 'high' | 'medium' | 'low' }>`padding: 2px 8px; border-radius: 5px; font-size: 0.65rem; font-weight: 700; background: ${p => ({ high: 'rgba(16,185,129,0.15)', medium: 'rgba(245,158,11,0.15)', low: 'rgba(239,68,68,0.15)' }[p.$liq])}; color: ${p => ({ high: '#10B981', medium: '#F59E0B', low: '#EF4444' }[p.$liq])};`;

const COMMUNITIES = [
  { name: 'Downtown Dubai', score: 9.2, liq: 'high' as const },
  { name: 'Dubai Marina', score: 8.8, liq: 'high' as const },
  { name: 'Palm Jumeirah', score: 8.1, liq: 'high' as const },
  { name: 'Business Bay', score: 6.4, liq: 'medium' as const },
  { name: 'JVC', score: 5.2, liq: 'medium' as const },
  { name: 'Dubai South', score: 3.1, liq: 'low' as const },
];

export const LiquidityIndexBadge: FC = () => (
  <Wrapper data-testid="liquidity-index-badge">
    <Title><span>💧 Secondary Market Liquidity Index</span><span style={{ fontSize: '0.65rem', color: 'var(--text-secondary, #64748B)' }}>Score /10</span></Title>
    <Body>
      {COMMUNITIES.map(c => (
        <Row key={c.name}>
          <CName>{c.name}</CName>
          <Score $score={c.score}>
            <ScoreDots>{Array.from({ length: 10 }).map((_, i) => <Dot key={i} $filled={i < Math.round(c.score)} />)}</ScoreDots>
            <ScoreNum>{c.score}</ScoreNum>
            <Badge $liq={c.liq}>{c.liq.toUpperCase()}</Badge>
          </Score>
        </Row>
      ))}
    </Body>
  </Wrapper>
);
export default LiquidityIndexBadge;
