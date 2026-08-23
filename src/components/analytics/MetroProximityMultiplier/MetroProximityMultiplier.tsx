import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const Wrapper = styled.div`width: 100%; background: linear-gradient(135deg, #0F172A, #1E293B); border: 2px solid rgba(239,68,68,0.2); border-radius: 14px; overflow: hidden; font-family: 'Inter', sans-serif; animation: ${fadeIn} 0.4s ease;`;
const Header = styled.div`padding: 12px 16px; background: rgba(239,68,68,0.05); border-bottom: 1px solid rgba(239,68,68,0.12); display: flex; align-items: center; justify-content: space-between;`;
const Title = styled.h3`margin: 0; color: #FFF; font-size: 0.85rem; font-weight: 700; display: flex; align-items: center; gap: 6px;`;

const Body = styled.div`padding: 16px;`;
const MetroMap = styled.div`position: relative; width: 100%; height: 180px; background: rgba(15,23,42,0.7); border-radius: 10px; overflow: hidden; margin-bottom: 14px;`;
const MetroLine = styled.div<{ $color: string; $top: number }>`position: absolute; left: 0; right: 0; top: ${p => p.$top}%; height: 3px; background: ${p => p.$color}; opacity: 0.8;`;
const Station = styled.div<{ $left: number; $top: number; $active: boolean }>`
  position: absolute;
  left: ${p => p.$left}%;
  top: ${p => p.$top}%;
  width: 12px; height: 12px;
  border-radius: 50%;
  border: 2px solid #FFF;
  background: ${p => p.$active ? '#EF4444' : '#334155'};
  transform: translate(-50%, -50%);
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 2;
  &:hover { transform: translate(-50%, -50%) scale(1.4); }
`;
const StationLabel = styled.div<{ $left: number; $top: number }>`
  position: absolute;
  left: ${p => p.$left}%;
  top: calc(${p => p.$top}% + 10px);
  font-size: 0.58rem;
  color: #94A3B8;
  transform: translateX(-50%);
  white-space: nowrap;
`;

const SliderRow = styled.div`display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px;`;
const SliderMeta = styled.div`display: flex; justify-content: space-between;`;
const SliderKey = styled.span`font-size: 0.75rem; color: #94A3B8; font-weight: 600;`;
const SliderVal = styled.span`font-size: 0.75rem; font-weight: 800; color: #EF4444;`;
const Range = styled.input`width: 100%; accent-color: #EF4444; cursor: pointer;`;

const ResultGrid = styled.div`display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;`;
const ResultCard = styled.div`padding: 10px; border-radius: 9px; background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.18); text-align: center;`;
const ResultVal = styled.div`font-size: 0.95rem; font-weight: 900; color: #EF4444;`;
const ResultLab = styled.div`font-size: 0.62rem; color: #64748B; margin-top: 2px;`;

const STATIONS = [
  { name: 'DMCC', left: 15, top: 35, line: 'red' },
  { name: 'Jumeirah Lakes', left: 30, top: 35, line: 'red' },
  { name: 'Business Bay', left: 55, top: 55, line: 'red' },
  { name: 'Burj Khalifa/Dubai Mall', left: 65, top: 55, line: 'red' },
  { name: 'Union', left: 50, top: 35, line: 'green' },
  { name: 'BurJuman', left: 60, top: 35, line: 'green' },
];

export const MetroProximityMultiplier: FC = () => {
  const [distanceKm, setDistanceKm] = useState(0.5);
  const [activeStation, setActiveStation] = useState('DMCC');

  const multiplier = distanceKm <= 0.5 ? 1.18 : distanceKm <= 1 ? 1.10 : distanceKm <= 2 ? 1.04 : 1.0;
  const premiumPct = ((multiplier - 1) * 100).toFixed(0);

  return (
    <Wrapper data-testid="metro-proximity-multiplier">
      <Header>
        <Title>🚇 Metro Proximity Valuation</Title>
        <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary, #64748B)' }}>DLD Multiplier Model</div>
      </Header>
      <Body>
        <MetroMap>
          <MetroLine $color="#EF4444" $top={35} />
          <MetroLine $color="#10B981" $top={55} />
          {STATIONS.map(s => (
            <React.Fragment key={s.name}>
              <Station $left={s.left} $top={s.top} $active={s.name === activeStation} onClick={() => setActiveStation(s.name)} />
              <StationLabel $left={s.left} $top={s.top}>{s.name}</StationLabel>
            </React.Fragment>
          ))}
        </MetroMap>
        <SliderRow>
          <SliderMeta><SliderKey>Distance to Nearest Station</SliderKey><SliderVal>{distanceKm} km</SliderVal></SliderMeta>
          <Range type="range" min={0.1} max={5} step={0.1} value={distanceKm} onChange={e => setDistanceKm(+e.target.value)} />
        </SliderRow>
        <ResultGrid>
          <ResultCard><ResultVal>x{multiplier.toFixed(2)}</ResultVal><ResultLab>Multiplier</ResultLab></ResultCard>
          <ResultCard><ResultVal>+{premiumPct}%</ResultVal><ResultLab>Value Premium</ResultLab></ResultCard>
          <ResultCard><ResultVal>{activeStation}</ResultVal><ResultLab>Nearest Station</ResultLab></ResultCard>
        </ResultGrid>
      </Body>
    </Wrapper>
  );
};
export default MetroProximityMultiplier;
