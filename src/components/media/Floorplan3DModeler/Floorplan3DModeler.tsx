import React, { FC, useState, useCallback, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// ─── Animations ─────────────────────────────────────────────────────────────
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const rotateY = keyframes`0% { transform: rotateY(0deg); } 100% { transform: rotateY(360deg); }`;
const glow = keyframes`0%, 100% { box-shadow: 0 0 12px rgba(239,68,68,0.3); } 50% { box-shadow: 0 0 30px rgba(239,68,68,0.7); }`;

// ─── Styled Components ───────────────────────────────────────────────────────
const Wrapper = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #0A0F1E 0%, #0F172A 100%);
  border: 2px solid rgba(239,68,68,0.35);
  border-radius: 20px;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  animation: ${fadeIn} 0.4s ease;
`;

const Header = styled.div`
  padding: 14px 20px;
  background: rgba(239,68,68,0.06);
  border-bottom: 1px solid rgba(239,68,68,0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  margin: 0; color: #FFF; font-size: 0.95rem; font-weight: 700;
  display: flex; align-items: center; gap: 8px;
`;

const ViewArea = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  background: radial-gradient(ellipse at 50% 30%, #111827 0%, #070B14 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 800px;
  overflow: hidden;
`;

const FloorGrid = styled.div`
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 55%;
  background:
    linear-gradient(rgba(239,68,68,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(239,68,68,0.06) 1px, transparent 1px);
  background-size: 50px 50px;
  transform: perspective(500px) rotateX(50deg);
  transform-origin: bottom;
`;

const FloorplanBox = styled.div<{ $selected: boolean }>`
  position: absolute;
  background: ${p => p.$selected ? 'rgba(239,68,68,0.18)' : 'rgba(30,41,59,0.6)'};
  border: 2px solid ${p => p.$selected ? '#EF4444' : 'rgba(100,116,139,0.35)'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  color: ${p => p.$selected ? '#EF4444' : '#64748B'};
  animation: ${p => p.$selected ? glow : 'none'} 2s ease-in-out infinite;
  &:hover { background: rgba(239,68,68,0.12); border-color: #EF4444; color: #EF4444; }
`;

const CentralVisualization = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const BuildingIcon = styled.div`
  font-size: 5rem;
  filter: drop-shadow(0 0 20px rgba(239,68,68,0.4));
`;

const ExtrusionLabel = styled.div`
  text-align: center;
  color: #EF4444;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.04em;
`;

const RoomPanel = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  background: rgba(239,68,68,0.08);
  border-top: 1px solid rgba(239,68,68,0.15);
`;

const RoomCell = styled.div<{ $active: boolean }>`
  padding: 12px 16px;
  background: ${p => p.$active ? 'rgba(239,68,68,0.08)' : 'rgba(15,23,42,0.9)'};
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { background: rgba(239,68,68,0.12); }
`;

const RoomName = styled.div`
  font-size: 0.78rem;
  font-weight: 700;
  color: #CBD5E1;
  margin-bottom: 2px;
`;

const RoomMeta = styled.div`
  font-size: 0.7rem;
  color: #64748B;
`;

const MeasureBadge = styled.span<{ $highlight?: boolean }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  background: ${p => p.$highlight ? 'rgba(239,68,68,0.2)' : 'rgba(30,41,59,0.6)'};
  color: ${p => p.$highlight ? '#EF4444' : '#94A3B8'};
  font-size: 0.68rem;
  font-weight: 700;
`;

const ControlStrip = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: rgba(0,0,0,0.4);
  border-top: 1px solid rgba(100,116,139,0.15);
  flex-wrap: wrap;
  gap: 10px;
`;

const Btn = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid ${p => p.$variant === 'primary' ? 'transparent' : 'rgba(100,116,139,0.3)'};
  background: ${p => p.$variant === 'primary' ? 'linear-gradient(90deg,#EF4444,#F97316)' : 'transparent'};
  color: ${p => p.$variant === 'primary' ? '#FFF' : '#94A3B8'};
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { transform: translateY(-1px); filter: brightness(1.1); }
`;

const ROOMS_DATA = [
  { id: 'lr', name: 'Living Room', size: '42 m²', ceiling: '3.2m', left: '10%', top: '15%', w: '38%', h: '35%' },
  { id: 'mb', name: 'Master Bedroom', size: '32 m²', ceiling: '3.2m', left: '52%', top: '15%', w: '35%', h: '32%' },
  { id: 'kt', name: 'Kitchen', size: '18 m²', ceiling: '2.8m', left: '10%', top: '55%', w: '24%', h: '28%' },
  { id: 'bt', name: 'Bathroom', size: '9 m²', ceiling: '2.8m', left: '38%', top: '55%', w: '15%', h: '28%' },
  { id: 'st', name: 'Study', size: '14 m²', ceiling: '2.8m', left: '57%', top: '52%', w: '20%', h: '30%' },
  { id: 'bl', name: 'Balcony', size: '12 m²', ceiling: '2.4m', left: '80%', top: '52%', w: '12%', h: '30%' },
];

// ─── Component ───────────────────────────────────────────────────────────────
export const Floorplan3DModeler: FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<string>('lr');
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');

  const selected = ROOMS_DATA.find(r => r.id === selectedRoom);

  return (
    <Wrapper data-testid="floorplan-3d-modeler">
      <Header>
        <Title>🏗️ Interactive 3D Floorplan</Title>
        <div style={{ display: 'flex', gap: '6px' }}>
          <Btn $variant={viewMode === '2d' ? 'primary' : 'secondary'} onClick={() => setViewMode('2d')}>2D Plan</Btn>
          <Btn $variant={viewMode === '3d' ? 'primary' : 'secondary'} onClick={() => setViewMode('3d')}>3D Extrusion</Btn>
        </div>
      </Header>

      <ViewArea>
        <FloorGrid />

        {viewMode === '2d' ? (
          ROOMS_DATA.map(r => (
            <FloorplanBox
              key={r.id}
              $selected={r.id === selectedRoom}
              style={{ left: r.left, top: r.top, width: r.w, height: r.h }}
              onClick={() => setSelectedRoom(r.id)}
            >
              {r.name.split(' ')[0]}
            </FloorplanBox>
          ))
        ) : (
          <CentralVisualization>
            <BuildingIcon>🏗️</BuildingIcon>
            <ExtrusionLabel>
              {selected?.name} — {selected?.ceiling} ceiling height
            </ExtrusionLabel>
            <MeasureBadge $highlight>{selected?.size}</MeasureBadge>
          </CentralVisualization>
        )}
      </ViewArea>

      <RoomPanel>
        {ROOMS_DATA.map(r => (
          <RoomCell key={r.id} $active={r.id === selectedRoom} onClick={() => setSelectedRoom(r.id)}>
            <RoomName>{r.name}</RoomName>
            <RoomMeta>
              <MeasureBadge $highlight={r.id === selectedRoom}>{r.size}</MeasureBadge>
              {' '}
              <MeasureBadge>H: {r.ceiling}</MeasureBadge>
            </RoomMeta>
          </RoomCell>
        ))}
      </RoomPanel>

      <ControlStrip>
        <span style={{ color: '#64748B', fontSize: '0.75rem' }}>
          Total: <strong style={{ color: '#EF4444' }}>
            {ROOMS_DATA.reduce((acc, r) => acc + parseInt(r.size), 0)} m²
          </strong> BUA
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Btn>📐 Measurements</Btn>
          <Btn $variant="primary">📄 Export PDF</Btn>
        </div>
      </ControlStrip>
    </Wrapper>
  );
};

export default Floorplan3DModeler;
