import React, { FC, useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// ─── Animations ─────────────────────────────────────────────────────────────
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const slideUp = keyframes`from { transform: translateY(8px); opacity: 0; } to { transform: translateY(0); opacity: 1; }`;

// ─── Styled Components ───────────────────────────────────────────────────────
const Bar = styled.div`
  width: 100%;
  background: linear-gradient(90deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95));
  border: 1px solid rgba(239,68,68,0.2);
  border-radius: 16px;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  animation: ${fadeIn} 0.3s ease;
`;

const ThumbnailTrack = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  overflow-x: auto;
  scroll-behavior: smooth;
  &::-webkit-scrollbar { height: 3px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: rgba(239,68,68,0.4); border-radius: 2px; }
`;

const Thumb = styled.div<{ $active: boolean }>`
  position: relative;
  flex-shrink: 0;
  width: 96px;
  height: 64px;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${p => p.$active ? '#EF4444' : 'rgba(100,116,139,0.25)'};
  background: rgba(30,41,59,0.8);
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  &:hover {
    border-color: rgba(239,68,68,0.6);
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(239,68,68,0.15);
  }
`;

const ActiveRing = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 9px;
  border: 2px solid #EF4444;
  box-shadow: inset 0 0 10px rgba(239,68,68,0.2);
  pointer-events: none;
`;

const ThumbLabel = styled.div<{ $active: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 3px 6px;
  background: ${p => p.$active ? 'rgba(239,68,68,0.85)' : 'rgba(0,0,0,0.65)'};
  font-size: 0.6rem;
  font-weight: 700;
  color: #FFF;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: background 0.2s ease;
`;

const RoomCount = styled.div`
  padding: 0 16px 10px;
  font-size: 0.72rem;
  color: #64748B;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CountBadge = styled.span`
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.2);
  color: #EF4444;
  font-weight: 700;
`;

const NavButtons = styled.div`
  display: flex;
  gap: 6px;
  margin-left: auto;
`;

const NavBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 7px;
  border: 1px solid rgba(239,68,68,0.3);
  background: rgba(239,68,68,0.08);
  color: #EF4444;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  &:hover { background: rgba(239,68,68,0.2); }
  &:disabled { opacity: 0.3; cursor: not-allowed; }
`;

const ROOMS = [
  { id: 1, emoji: '🏙️', name: 'Aerial View', tag: 'HERO' },
  { id: 2, emoji: '🛋️', name: 'Living Room', tag: 'MAIN' },
  { id: 3, emoji: '🛏️', name: 'Master Bed', tag: '' },
  { id: 4, emoji: '🛁', name: 'Bathroom', tag: '' },
  { id: 5, emoji: '🍳', name: 'Kitchen', tag: '' },
  { id: 6, emoji: '🌇', name: 'Balcony', tag: 'VIEW' },
  { id: 7, emoji: '📚', name: 'Study', tag: '' },
  { id: 8, emoji: '🚗', name: 'Parking', tag: '' },
];

// ─── Component ───────────────────────────────────────────────────────────────
interface VrThumbnailBarProps {
  onRoomSelect?: (roomName: string) => void;
}

export const VrThumbnailBar: FC<VrThumbnailBarProps> = ({ onRoomSelect }) => {
  const [activeId, setActiveId] = useState(1);
  const trackRef = useRef<HTMLDivElement>(null);

  const activeIdx = ROOMS.findIndex(r => r.id === activeId);

  const scrollTrack = (dir: 'left' | 'right') => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: dir === 'right' ? 200 : -200, behavior: 'smooth' });
  };

  const select = (room: typeof ROOMS[0]) => {
    setActiveId(room.id);
    onRoomSelect?.(room.name);
  };

  return (
    <Bar data-testid="vr-thumbnail-bar">
      <ThumbnailTrack ref={trackRef}>
        {ROOMS.map(room => (
          <Thumb key={room.id} $active={room.id === activeId} onClick={() => select(room)}>
            {room.emoji}
            {room.id === activeId && <ActiveRing />}
            <ThumbLabel $active={room.id === activeId}>
              {room.tag ? `[${room.tag}] ` : ''}{room.name}
            </ThumbLabel>
          </Thumb>
        ))}
      </ThumbnailTrack>

      <RoomCount>
        <CountBadge>{activeId}/{ROOMS.length}</CountBadge>
        Viewing: <strong style={{ color: '#CBD5E1' }}>{ROOMS.find(r => r.id === activeId)?.name}</strong>
        <NavButtons>
          <NavBtn onClick={() => scrollTrack('left')} disabled={activeIdx === 0}>‹</NavBtn>
          <NavBtn onClick={() => scrollTrack('right')} disabled={activeIdx === ROOMS.length - 1}>›</NavBtn>
        </NavButtons>
      </RoomCount>
    </Bar>
  );
};

export default VrThumbnailBar;
