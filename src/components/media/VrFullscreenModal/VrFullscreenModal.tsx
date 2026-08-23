import React, { FC, useState, useCallback, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

// ─── Animations ─────────────────────────────────────────────────────────────
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const modalIn = keyframes`from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); }`;

// ─── Styled Components ───────────────────────────────────────────────────────
const Overlay = styled.div<{ $visible: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(12px);
  z-index: 9999;
  display: ${p => p.$visible ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${fadeIn} 0.25s ease;
`;

const Modal = styled.div`
  width: 100%;
  max-width: 1100px;
  background: linear-gradient(135deg, #0A0F1E 0%, #0F172A 100%);
  border: 2px solid rgba(239,68,68,0.35);
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: ${modalIn} 0.3s ease;
  max-height: 90vh;
`;

const ModalHeader = styled.div`
  padding: 16px 20px;
  background: rgba(239,68,68,0.07);
  border-bottom: 1px solid rgba(239,68,68,0.18);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #FFF;
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid rgba(100,116,139,0.3);
  background: transparent;
  color: #94A3B8;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  &:hover { background: rgba(239,68,68,0.15); color: #EF4444; border-color: #EF4444; }
`;

const FullscreenViewport = styled.div`
  flex: 1;
  position: relative;
  min-height: 400px;
  background: radial-gradient(ellipse at 20% 40%, #1A0A2E 0%, #0A0F1E 60%, #050810 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const Panorama = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  z-index: 2;
`;

const RoomEmoji = styled.div`
  font-size: 7rem;
  filter: drop-shadow(0 0 30px rgba(239,68,68,0.4));
  animation: ${fadeIn} 0.4s ease;
`;

const GridBg = styled.div`
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(0deg, rgba(239,68,68,0.04) 0px, rgba(239,68,68,0.04) 1px, transparent 1px, transparent 60px),
    repeating-linear-gradient(90deg, rgba(239,68,68,0.04) 0px, rgba(239,68,68,0.04) 1px, transparent 1px, transparent 60px);
`;

const WasdHint = styled.div`
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const WasdRow = styled.div`
  display: flex;
  gap: 4px;
`;

const WKey = styled.div<{ $active?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 7px;
  background: ${p => p.$active ? 'rgba(239,68,68,0.4)' : 'rgba(30,41,59,0.8)'};
  border: 1px solid ${p => p.$active ? '#EF4444' : 'rgba(100,116,139,0.3)'};
  color: ${p => p.$active ? '#EF4444' : '#64748B'};
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.1s ease;
`;

const RoomSwitcher = styled.div`
  display: flex;
  gap: 8px;
  padding: 14px 20px;
  background: rgba(0,0,0,0.5);
  border-top: 1px solid rgba(100,116,139,0.15);
  overflow-x: auto;
  &::-webkit-scrollbar { display: none; }
`;

const RoomBtn = styled.button<{ $active: boolean }>`
  flex-shrink: 0;
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid ${p => p.$active ? '#EF4444' : 'rgba(100,116,139,0.25)'};
  background: ${p => p.$active ? 'rgba(239,68,68,0.15)' : 'transparent'};
  color: ${p => p.$active ? '#EF4444' : '#64748B'};
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  &:hover { border-color: #EF4444; color: #EF4444; }
`;

// Trigger button
const TriggerBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 12px;
  border: 2px solid #EF4444;
  background: linear-gradient(90deg, rgba(239,68,68,0.15), rgba(239,68,68,0.08));
  color: #EF4444;
  font-size: 0.85rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.03em;
  &:hover {
    background: linear-gradient(90deg, rgba(239,68,68,0.3), rgba(239,68,68,0.15));
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(239,68,68,0.2);
  }
`;

const ROOMS = [
  { id: 'lr', emoji: '🛋️', name: 'Living Room' },
  { id: 'mb', emoji: '🛏️', name: 'Master Bedroom' },
  { id: 'kt', emoji: '🍳', name: 'Kitchen' },
  { id: 'bt', emoji: '🚿', name: 'Bathroom' },
  { id: 'st', emoji: '📚', name: 'Study' },
  { id: 'bl', emoji: '🌇', name: 'Balcony' },
];

// ─── Component ───────────────────────────────────────────────────────────────
export const VrFullscreenModal: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeRoom, setActiveRoom] = useState('lr');
  const [keys, setKeys] = useState({ w: false, a: false, s: false, d: false });

  const activeIdx = ROOMS.findIndex(r => r.id === activeRoom);
  const room = ROOMS[activeIdx];

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase() as keyof typeof keys;
      if (!['w','a','s','d'].includes(k)) return;
      if (e.type === 'keydown') {
        setKeys(prev => ({ ...prev, [k]: true }));
        if (k === 'w' || k === 'd') setActiveRoom(ROOMS[Math.min(activeIdx + 1, ROOMS.length - 1)].id);
        if (k === 's' || k === 'a') setActiveRoom(ROOMS[Math.max(activeIdx - 1, 0)].id);
      }
      if (e.type === 'keyup') setKeys(prev => ({ ...prev, [k]: false }));
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('keyup', onKey); };
  }, [isOpen, activeIdx]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  return (
    <>
      <TriggerBtn onClick={() => setIsOpen(true)} data-testid="vr-fullscreen-trigger">
        🥽 Enter Fullscreen VR
      </TriggerBtn>

      <Overlay $visible={isOpen} onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}>
        <Modal data-testid="vr-fullscreen-modal">
          <ModalHeader>
            <ModalTitle>🥽 White Caves VR — {room?.name}</ModalTitle>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary, #64748B)' }}>Press ESC to exit</span>
              <CloseBtn onClick={() => setIsOpen(false)}>✕</CloseBtn>
            </div>
          </ModalHeader>

          <FullscreenViewport>
            <GridBg />
            <PanoCamera style={{ position: 'absolute', top: 16, right: 16 }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary, #64748B)', background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: '6px' }}>
                360° Panoramic Mode
              </span>
            </PanoCamera>

            <PanoramaContent activeRoom={activeRoom} room={room} />

            <WasdHint>
              <WasdRow><WKey $active={keys.w}>W</WKey></WasdRow>
              <WasdRow>
                <WKey $active={keys.a}>A</WKey>
                <WKey $active={keys.s}>S</WKey>
                <WKey $active={keys.d}>D</WKey>
              </WasdRow>
            </WasdHint>
          </FullscreenViewport>

          <RoomSwitcher>
            {ROOMS.map(r => (
              <RoomBtn key={r.id} $active={r.id === activeRoom} onClick={() => setActiveRoom(r.id)}>
                {r.emoji} {r.name}
              </RoomBtn>
            ))}
          </RoomSwitcher>
        </Modal>
      </Overlay>
    </>
  );
};

// Sub-component to avoid re-defining inside render
const PanoCamera = styled.div``;
const PanoramaContent: FC<{ activeRoom: string; room: typeof ROOMS[0] }> = ({ room }) => (
  <Panorama key={room?.id}>
    <RoomEmoji>{room?.emoji || '🏠'}</RoomEmoji>
    <div style={{ textAlign: 'center' }}>
      <div style={{ color: 'var(--accent-red, #EF4444)', fontWeight: 800, fontSize: '1.2rem' }}>{room?.name}</div>
      <div style={{ color: 'var(--color-475569, #475569)', fontSize: '0.78rem', marginTop: '6px' }}>
        Use WASD keys or click room tabs to navigate
      </div>
    </div>
  </Panorama>
);

export default VrFullscreenModal;
