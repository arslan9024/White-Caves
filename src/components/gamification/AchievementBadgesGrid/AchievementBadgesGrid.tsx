import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:#0F172A;border:1px solid rgba(255,255,255,0.1);border-radius:18px;overflow:hidden;padding:24px;color:#FFF`;
const Title = styled.h2`margin:0 0 24px;font-size:1.1rem;font-weight:800`;

const Grid = styled.div`display:grid;grid-template-columns:repeat(4,1fr);gap:16px`;

const BadgeCard = styled.div<{$earned:boolean}>`
  display:flex;flex-direction:column;align-items:center;text-align:center;padding:20px 12px;border-radius:12px;
  background:${p=>p.$earned?'rgba(255,255,255,0.05)':'rgba(255,255,255,0.01)'};
  border:1px solid ${p=>p.$earned?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.02)'};
  opacity:${p=>p.$earned?1:0.4};
  filter:${p=>p.$earned?'none':'grayscale(100%)'};
`;

const Icon = styled.div`font-size:2.5rem;margin-bottom:12px`;
const BName = styled.div`font-size:.85rem;font-weight:800;color:#E2E8F0;margin-bottom:4px`;
const BDesc = styled.div`font-size:.7rem;color:#94A3B8`;

export const AchievementBadgesGrid: FC = () => {
  return (
    <Wrap data-testid="achievement-badges-grid">
      <Title>🏅 My Achievements</Title>
      
      <Grid>
        <BadgeCard $earned={true}>
          <Icon>🚀</Icon>
          <BName>Fast Starter</BName>
          <BDesc>Closed first deal within 30 days of joining.</BDesc>
        </BadgeCard>
        
        <BadgeCard $earned={true}>
          <Icon>🏗️</Icon>
          <BName>Off-Plan Pro</BName>
          <BDesc>Sold 5+ properties direct from developer.</BDesc>
        </BadgeCard>
        
        <BadgeCard $earned={false}>
          <Icon>💎</Icon>
          <BName>100M Club</BName>
          <BDesc>Cross AED 100M in career sales.</BDesc>
        </BadgeCard>
        
        <BadgeCard $earned={false}>
          <Icon>👑</Icon>
          <BName>King of the Marina</BName>
          <BDesc>Most transactions in Dubai Marina (Yearly).</BDesc>
        </BadgeCard>
      </Grid>
    </Wrap>
  );
};
export default AchievementBadgesGrid;
