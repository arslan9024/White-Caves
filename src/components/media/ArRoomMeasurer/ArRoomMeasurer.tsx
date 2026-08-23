import React, { FC, useState, useCallback, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

// ─── Animations ─────────────────────────────────────────────────────────────
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const scanLine = keyframes`0% { transform: translateY(-100%); } 100% { transform: translateY(300%); }`;
const pulse = keyframes`0%, 100% { opacity: 1; } 50% { opacity: 0.4; }`;

// ─── Styled Components ───────────────────────────────────────────────────────
const Container = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #070B14 0%, #0F172A 100%);
  border: 2px solid rgba(239,68,68,0.3);
  border-radius: 20px;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  animation: ${fadeIn} 0.4s ease;
`;

const Header = styled.div`
  padding: 14px 20px;
  background: rgba(239,68,68,0.05);
  border-bottom: 1px solid rgba(239,68,68,0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  margin: 0; color: #FFF; font-size: 0.95rem; font-weight: 700;
  display: flex; align-items: center; gap: 8px;
`;

const StatusBadge = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 999px;
  background: ${p => p.$active ? 'rgba(16,185,129,0.15)' : 'rgba(100,116,139,0.15)'};
  border: 1px solid ${p => p.$active ? 'rgba(16,185,129,0.4)' : 'rgba(100,116,139,0.3)'};
  color: ${p => p.$active ? '#10B981' : '#64748B'};
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
`;

const Dot = styled.div<{ $active: boolean }>`
  width: 7px; height: 7px;
  border-radius: 50%;
  background: ${p => p.$active ? '#10B981' : '#64748B'};
  animation: ${p => p.$active ? pulse : 'none'} 1s ease-in-out infinite;
`;

const ScanArea = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
  background: radial-gradient(circle at 50% 50%, #0D1B3E 0%, #050A14 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: crosshair;
`;

const RoomPreview = styled.div`
  font-size: 6rem;
  filter: drop-shadow(0 0 15px rgba(239,68,68,0.3));
  user-select: none;
`;

const ScanLineElem = styled.div<{ $scanning: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #10B981, transparent);
  animation: ${p => p.$scanning ? scanLine : 'none'} 2s linear infinite;
  opacity: ${p => p.$scanning ? 0.8 : 0};
`;

const GridOverlay = styled.div<{ $active: boolean }>`
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(0deg, rgba(16,185,129,0.05) 0px, rgba(16,185,129,0.05) 1px, transparent 1px, transparent 40px),
    repeating-linear-gradient(90deg, rgba(16,185,129,0.05) 0px, rgba(16,185,129,0.05) 1px, transparent 1px, transparent 40px);
  opacity: ${p => p.$active ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const MeasureLine = styled.div<{ $x1: number; $y1: number; $x2: number; $y2: number }>`
  position: absolute;
  height: 2px;
  background: linear-gradient(90deg, #10B981, #34D399);
  border-radius: 1px;
  left: ${p => Math.min(p.$x1, p.$x2)}%;
  top: ${p => (p.$y1 + p.$y2) / 2}%;
  width: ${p => Math.abs(p.$x2 - p.$x1)}%;
  box-shadow: 0 0 8px rgba(16,185,129,0.4);
  &::before, &::after {
    content: '';
    position: absolute;
    top: -4px;
    width: 2px;
    height: 10px;
    background: #10B981;
    border-radius: 1px;
  }
  &::before { left: 0; }
  &::after { right: 0; }
`;

const MeasureLabel = styled.div`
  position: absolute;
  padding: 3px 8px;
  border-radius: 5px;
  background: rgba(16,185,129,0.9);
  color: #000;
  font-size: 0.68rem;
  font-weight: 800;
  transform: translateX(-50%) translateY(-50%);
  white-space: nowrap;
  pointer-events: none;
`;

const ResultsPanel = styled.div`
  padding: 16px 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  border-top: 1px solid rgba(100,116,139,0.15);
`;

const ResultCard = styled.div`
  padding: 12px;
  border-radius: 10px;
  background: rgba(16,185,129,0.06);
  border: 1px solid rgba(16,185,129,0.2);
  text-align: center;
`;

const ResultValue = styled.div`
  font-size: 1.2rem;
  font-weight: 800;
  color: #10B981;
`;

const ResultLabel = styled.div`
  font-size: 0.68rem;
  color: #64748B;
  margin-top: 3px;
`;

const ControlRow = styled.div`
  padding: 12px 20px;
  display: flex;
  gap: 10px;
  border-top: 1px solid rgba(100,116,139,0.1);
`;

const Btn = styled.button<{ $variant?: 'primary' }>`
  flex: 1;
  padding: 10px;
  border-radius: 9px;
  border: 1px solid ${p => p.$variant === 'primary' ? 'transparent' : 'rgba(100,116,139,0.3)'};
  background: ${p => p.$variant === 'primary' ? 'linear-gradient(90deg,#10B981,#34D399)' : 'rgba(30,41,59,0.5)'};
  color: ${p => p.$variant === 'primary' ? '#000' : '#94A3B8'};
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { filter: brightness(1.1); transform: translateY(-1px); }
`;

const SAMPLE_MEASURES = [
  { label: 'Width', x1: 10, y1: 70, x2: 90, y2: 70, value: '8.4m' },
  { label: 'Length', x1: 50, y1: 15, x2: 50, y2: 65, value: '6.2m' },
];

// ─── Component ───────────────────────────────────────────────────────────────
export const ArRoomMeasurer: FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const startScan = useCallback(() => {
    setIsScanning(true);
    setHasResults(false);
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setScanProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        setHasResults(true);
      }
    }, 200);
  }, []);

  const reset = useCallback(() => {
    setHasResults(false);
    setScanProgress(0);
    setIsScanning(false);
  }, []);

  return (
    <Container data-testid="ar-room-measurer">
      <Header>
        <Title>📐 AR Room Measurement Tool</Title>
        <StatusBadge $active={isScanning || hasResults}>
          <Dot $active={isScanning} />
          {isScanning ? 'SCANNING...' : hasResults ? 'MEASURED' : 'READY'}
        </StatusBadge>
      </Header>

      <ScanArea onClick={!isScanning && !hasResults ? startScan : undefined}>
        <GridOverlay $active={isScanning || hasResults} />
        <ScanLineElem $scanning={isScanning} />

        <RoomPreview>🏠</RoomPreview>

        {hasResults && SAMPLE_MEASURES.map(m => (
          <React.Fragment key={m.label}>
            <MeasureLine $x1={m.x1} $y1={m.y1} $x2={m.x2} $y2={m.y2} />
            <MeasureLabel style={{
              left: `${(m.x1 + m.x2) / 2}%`,
              top: `${(m.y1 + m.y2) / 2}%`
            }}>
              {m.label}: {m.value}
            </MeasureLabel>
          </React.Fragment>
        ))}

        {!isScanning && !hasResults && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: '8px', pointerEvents: 'none'
          }}>
            <div style={{ color: 'var(--accent-green, #10B981)', fontSize: '0.8rem', fontWeight: 700, textAlign: 'center' }}>
              📱 Tap to start AR scan
            </div>
          </div>
        )}
      </ScanArea>

      {hasResults && (
        <ResultsPanel>
          <ResultCard><ResultValue>52.1 m²</ResultValue><ResultLabel>Total Area</ResultLabel></ResultCard>
          <ResultCard><ResultValue>8.4m × 6.2m</ResultValue><ResultLabel>Dimensions</ResultLabel></ResultCard>
          <ResultCard><ResultValue>3.2m</ResultValue><ResultLabel>Ceiling Height</ResultLabel></ResultCard>
        </ResultsPanel>
      )}

      <ControlRow>
        <Btn onClick={startScan} disabled={isScanning}>
          {isScanning ? `Scanning... ${scanProgress}%` : '📐 Start Scan'}
        </Btn>
        <Btn $variant="primary" onClick={reset}>🔄 Reset</Btn>
      </ControlRow>
    </Container>
  );
};

export default ArRoomMeasurer;
