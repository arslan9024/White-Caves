import React, { FC, useState, useCallback, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// ─── Animations ─────────────────────────────────────────────────────────────
const fadeSlideIn = keyframes`from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); }`;
const rotateSlow = keyframes`from { transform: rotate(0deg); } to { transform: rotate(360deg); }`;
const floatY = keyframes`0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); }`;

// ─── Styled Components ───────────────────────────────────────────────────────
const ViewerContainer = styled.div`
  position: relative;
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  background: radial-gradient(ellipse at 20% 30%, #1A0A2E 0%, #0D1B3E 50%, #0F172A 100%);
  border: 2px solid rgba(239, 68, 68, 0.4);
  font-family: 'Inter', sans-serif;
  animation: ${fadeSlideIn} 0.5s ease-out;
`;

const ViewportArea = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const EnvironmentDome = styled.div`
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse at 50% 80%, rgba(239,68,68,0.06) 0%, transparent 60%),
    radial-gradient(ellipse at 20% 20%, rgba(99,102,241,0.08) 0%, transparent 50%);
`;

const GridFloor = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: 
    repeating-linear-gradient(90deg, rgba(239,68,68,0.08) 0px, rgba(239,68,68,0.08) 1px, transparent 1px, transparent 80px),
    repeating-linear-gradient(0deg, rgba(239,68,68,0.08) 0px, rgba(239,68,68,0.08) 1px, transparent 1px, transparent 80px);
  transform: perspective(400px) rotateX(40deg);
  transform-origin: bottom center;
`;

const FloatingIcon = styled.div<{ $delay?: number }>`
  font-size: 4rem;
  animation: ${floatY} 3s ease-in-out ${p => p.$delay || 0}s infinite;
  text-shadow: 0 0 40px rgba(239,68,68,0.4);
`;

const ModeIndicator = styled.div<{ $mode: string }>`
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 10px;
  backdrop-filter: blur(12px);
  background: rgba(0,0,0,0.7);
  border: 1px solid ${p => p.$mode === 'vr' ? '#EF4444' : p.$mode === 'webxr' ? '#8B5CF6' : '#10B981'};
  color: ${p => p.$mode === 'vr' ? '#EF4444' : p.$mode === 'webxr' ? '#A78BFA' : '#34D399'};
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
`;

const WalkPath = styled.div`
  position: absolute;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 6px;
`;

const PathNode = styled.div<{ $active: boolean }>`
  width: ${p => p.$active ? '24px' : '10px'};
  height: 10px;
  border-radius: 5px;
  background: ${p => p.$active ? '#EF4444' : 'rgba(239,68,68,0.25)'};
  transition: all 0.3s ease;
`;

const NavOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 20px;
  background: linear-gradient(0deg, rgba(0,0,0,0.85) 0%, transparent 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const DirectionPad = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 40px);
  grid-template-rows: repeat(3, 40px);
  gap: 4px;
`;

const DPadBtn = styled.button<{ $col: number; $row: number; $visible?: boolean }>`
  grid-column: ${p => p.$col};
  grid-row: ${p => p.$row};
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid rgba(239,68,68,0.3);
  background: rgba(0,0,0,0.6);
  color: #EF4444;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.15s ease;
  display: ${p => p.$visible === false ? 'none' : 'flex'};
  align-items: center;
  justify-content: center;
  visibility: ${p => p.$visible === false ? 'hidden' : 'visible'};
  &:hover { background: rgba(239,68,68,0.2); transform: scale(1.05); }
  &:active { transform: scale(0.95); }
`;

const RoomList = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const RoomChip = styled.button<{ $active: boolean }>`
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid ${p => p.$active ? '#EF4444' : 'rgba(100,116,139,0.3)'};
  background: ${p => p.$active ? 'rgba(239,68,68,0.15)' : 'rgba(15,23,42,0.8)'};
  color: ${p => p.$active ? '#EF4444' : '#94A3B8'};
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
  &:hover { border-color: #EF4444; }
`;

const HeaderBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: rgba(239,68,68,0.05);
  border-bottom: 1px solid rgba(239,68,68,0.15);
`;

const HeadTitle = styled.h3`
  margin: 0;
  color: #FFF;
  font-size: 0.95rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ModeBtn = styled.button<{ $active: boolean }>`
  padding: 7px 16px;
  border-radius: 8px;
  border: 1px solid ${p => p.$active ? '#8B5CF6' : 'rgba(100,116,139,0.3)'};
  background: ${p => p.$active ? 'rgba(139,92,246,0.15)' : 'transparent'};
  color: ${p => p.$active ? '#A78BFA' : '#64748B'};
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { border-color: #8B5CF6; color: #A78BFA; }
`;

const ROOMS = ['Living Room', 'Master Bedroom', 'Kitchen', 'Bathroom', 'Study', 'Balcony'];
const ROOM_ICONS: Record<string, string> = {
  'Living Room': '🛋️', 'Master Bedroom': '🛏️', 'Kitchen': '🍳',
  'Bathroom': '🚿', 'Study': '📚', 'Balcony': '🌇',
};

// ─── Component ───────────────────────────────────────────────────────────────
export const WebXRHeadsetViewer: FC = () => {
  const [activeRoom, setActiveRoom] = useState('Living Room');
  const [isWebXR, setIsWebXR] = useState(false);
  const [currentNode, setCurrentNode] = useState(0);
  const [wasdKeys, setWasdKeys] = useState({ w: false, a: false, s: false, d: false });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase() as keyof typeof wasdKeys;
      if (['w','a','s','d'].includes(key)) {
        if (e.type === 'keydown') setWasdKeys(prev => ({ ...prev, [key]: true }));
        if (e.type === 'keyup') setWasdKeys(prev => ({ ...prev, [key]: false }));
      }
    };
    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', handleKey);
    return () => { window.removeEventListener('keydown', handleKey); window.removeEventListener('keyup', handleKey); };
  }, []);

  const move = useCallback((dir: 'fwd' | 'back' | 'left' | 'right') => {
    setCurrentNode(n => {
      if (dir === 'fwd') return Math.min(n + 1, ROOMS.length - 1);
      if (dir === 'back') return Math.max(n - 1, 0);
      return n;
    });
    if (dir === 'fwd' || dir === 'back') {
      setActiveRoom(ROOMS[currentNode]);
    }
  }, [currentNode]);

  return (
    <ViewerContainer data-testid="webxr-headset-viewer">
      <HeaderBar>
        <HeadTitle>🥽 WebXR Immersive Room Walkthrough</HeadTitle>
        <div style={{ display: 'flex', gap: '8px' }}>
          <ModeBtn $active={!isWebXR} onClick={() => setIsWebXR(false)}>360° VR</ModeBtn>
          <ModeBtn $active={isWebXR} onClick={() => setIsWebXR(true)}>WebXR Mode</ModeBtn>
        </div>
      </HeaderBar>

      <ViewportArea>
        <EnvironmentDome />
        <GridFloor />

        <ModeIndicator $mode={isWebXR ? 'webxr' : 'vr'}>
          <span style={{ fontSize: '1rem' }}>{isWebXR ? '🥽' : '🎥'}</span>
          {isWebXR ? 'WebXR Immersive' : '360° Panoramic'}
        </ModeIndicator>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', zIndex: 2 }}>
          <FloatingIcon>{ROOM_ICONS[activeRoom] || '🏠'}</FloatingIcon>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#EF4444', fontWeight: 800, fontSize: '1.1rem' }}>{activeRoom}</div>
            <div style={{ color: '#64748B', fontSize: '0.75rem', marginTop: '4px' }}>
              {isWebXR ? 'Immersive WebXR — Head tracking active' : 'Use WASD keys or D-pad to navigate'}
            </div>
          </div>
        </div>

        <WalkPath>
          {ROOMS.map((_, i) => (
            <PathNode key={i} $active={i === currentNode} />
          ))}
        </WalkPath>

        <NavOverlay>
          <DirectionPad>
            <DPadBtn $col={2} $row={1} onClick={() => move('fwd')}>▲</DPadBtn>
            <DPadBtn $col={1} $row={2} onClick={() => move('left')}>◀</DPadBtn>
            <DPadBtn $col={2} $row={2} onClick={() => {}}>⊙</DPadBtn>
            <DPadBtn $col={3} $row={2} onClick={() => move('right')}>▶</DPadBtn>
            <DPadBtn $col={2} $row={3} onClick={() => move('back')}>▼</DPadBtn>
          </DirectionPad>

          <RoomList>
            {ROOMS.map(r => (
              <RoomChip key={r} $active={r === activeRoom} onClick={() => setActiveRoom(r)}>
                {ROOM_ICONS[r]} {r}
              </RoomChip>
            ))}
          </RoomList>
        </NavOverlay>
      </ViewportArea>
    </ViewerContainer>
  );
};

export default WebXRHeadsetViewer;
