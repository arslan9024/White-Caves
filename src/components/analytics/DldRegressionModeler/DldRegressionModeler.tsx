import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); }`;

const Wrapper = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #0F172A, #1E293B);
  border: 2px solid rgba(239,68,68,0.25);
  border-radius: 18px;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  animation: ${fadeIn} 0.4s ease;
`;
const Header = styled.div`padding: 14px 20px; background: rgba(239,68,68,0.05); border-bottom: 1px solid rgba(239,68,68,0.12); display: flex; align-items: center; justify-content: space-between;`;
const Title = styled.h3`margin: 0; color: #FFF; font-size: 0.9rem; font-weight: 700; display: flex; align-items: center; gap: 8px;`;

const ChartArea = styled.div`padding: 20px; display: flex; flex-direction: column; gap: 16px;`;

const CommunityRow = styled.div<{ $hover?: boolean }>`
  display: grid;
  grid-template-columns: 140px 1fr 100px;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(100,116,139,0.12);
  cursor: pointer;
  transition: background 0.15s ease;
  &:hover { background: rgba(239,68,68,0.04); border-radius: 8px; padding: 10px 8px; margin: 0 -8px; }
`;

const CommunityName = styled.div`font-size: 0.78rem; font-weight: 700; color: #CBD5E1;`;
const CommunityArea = styled.div`font-size: 0.65rem; color: #64748B;`;

const BarTrack = styled.div`height: 8px; background: rgba(30,41,59,0.8); border-radius: 4px; overflow: hidden;`;
const BarFill = styled.div<{ $pct: number; $trend: 'up' | 'down' | 'flat' }>`
  height: 100%;
  width: ${p => p.$pct}%;
  border-radius: 4px;
  background: ${p => p.$trend === 'up' ? 'linear-gradient(90deg,#10B981,#34D399)' : p.$trend === 'down' ? 'linear-gradient(90deg,#EF4444,#F97316)' : 'linear-gradient(90deg,#F59E0B,#FBBF24)'};
  transition: width 0.6s ease;
`;

const PriceCol = styled.div`text-align: right;`;
const PriceValue = styled.div`font-size: 0.82rem; font-weight: 800; color: #E2E8F0;`;
const TrendChip = styled.span<{ $trend: 'up' | 'down' | 'flat' }>`
  font-size: 0.65rem;
  font-weight: 700;
  color: ${p => p.$trend === 'up' ? '#10B981' : p.$trend === 'down' ? '#EF4444' : '#F59E0B'};
`;

const Footer = styled.div`padding: 12px 20px; background: rgba(0,0,0,0.3); border-top: 1px solid rgba(100,116,139,0.12); display: flex; justify-content: space-between; align-items: center;`;
const FooterNote = styled.div`font-size: 0.68rem; color: #475569;`;
const UpdateBadge = styled.div`font-size: 0.68rem; color: #EF4444; font-weight: 700;`;

const DATA = [
  { name: 'Dubai Marina', area: 'Marina', psf: 1840, pct: 92, trend: 'up' as const, change: '+12.4%' },
  { name: 'Downtown Dubai', area: 'Downtown', psf: 2210, pct: 100, trend: 'up' as const, change: '+9.1%' },
  { name: 'Palm Jumeirah', area: 'Palm', psf: 2650, pct: 88, trend: 'up' as const, change: '+15.3%' },
  { name: 'JBR', area: 'JBR', psf: 1560, pct: 75, trend: 'flat' as const, change: '+2.1%' },
  { name: 'Business Bay', area: 'Bay', psf: 1320, pct: 65, trend: 'flat' as const, change: '+3.8%' },
  { name: 'Dubai South', area: 'South', psf: 780, pct: 38, trend: 'down' as const, change: '-1.2%' },
];

export const DldRegressionModeler: FC = () => {
  const [selected, setSelected] = useState<string>('Downtown Dubai');
  const selectedData = DATA.find(d => d.name === selected);

  return (
    <Wrapper data-testid="dld-regression-modeler">
      <Header>
        <Title>📊 DLD Price-Per-Sqft Cluster Analysis</Title>
        <UpdateBadge>● LIVE Q4 2025</UpdateBadge>
      </Header>
      <ChartArea>
        {DATA.map(d => (
          <CommunityRow key={d.name} onClick={() => setSelected(d.name)}>
            <div>
              <CommunityName>{d.name}</CommunityName>
              <CommunityArea>{d.area}</CommunityArea>
            </div>
            <BarTrack><BarFill $pct={d.pct} $trend={d.trend} /></BarTrack>
            <PriceCol>
              <PriceValue>AED {d.psf.toLocaleString()}</PriceValue>
              <TrendChip $trend={d.trend}>{d.trend === 'up' ? '▲' : d.trend === 'down' ? '▼' : '→'} {d.change}</TrendChip>
            </PriceCol>
          </CommunityRow>
        ))}
      </ChartArea>
      <Footer>
        <FooterNote>
          Source: DLD Transaction Register • {selected}: AED {selectedData?.psf.toLocaleString()}/sqft
        </FooterNote>
        <FooterNote>Updated: Q4 2025</FooterNote>
      </Footer>
    </Wrapper>
  );
};
export default DldRegressionModeler;
