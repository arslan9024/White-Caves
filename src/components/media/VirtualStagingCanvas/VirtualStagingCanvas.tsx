import React, { FC, useState, useCallback, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';

// ─── Animations ────────────────────────────────────────────────────────────
const fadeIn = keyframes`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); }`;
const shimmer = keyframes`0% { background-position: -200% 0; } 100% { background-position: 200% 0; }`;
const pulse = keyframes`0%, 100% { opacity: 1; } 50% { opacity: 0.5; }`;

// ─── Styled Components ─────────────────────────────────────────────────────
const Container = styled.div`
  position: relative;
  width: 100%;
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  border: 2px solid #EF4444;
  border-radius: 20px;
  overflow: hidden;
  animation: ${fadeIn} 0.5s ease-out;
  font-family: 'Inter', sans-serif;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: rgba(239, 68, 68, 0.08);
  border-bottom: 1px solid rgba(239, 68, 68, 0.2);
`;

const Title = styled.h3`
  margin: 0;
  color: #FFFFFF;
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Badge = styled.span<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  background: ${p => p.$active ? 'linear-gradient(90deg, #EF4444, #F97316)' : 'rgba(100,116,139,0.3)'};
  color: ${p => p.$active ? '#FFFFFF' : '#94A3B8'};
  transition: all 0.3s ease;
`;

const CanvasWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #0F172A;
`;

const Layer = styled.div<{ $visible: boolean }>`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${p => p.$visible ? 1 : 0};
`;

const EmptyLayer = styled(Layer)`
  background: linear-gradient(160deg, #1E293B 0%, #0F172A 50%, #1E1E2E 100%);
`;

const StagedLayer = styled(Layer)`
  background: linear-gradient(160deg, #2D1B4E 0%, #1A2744 40%, #0D2137 100%);
`;

const RoomLabel = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 6px 14px;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(8px);
  border-radius: 8px;
  border: 1px solid rgba(239,68,68,0.3);
  color: #EF4444;
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 0.05em;
`;

const CrossfadeSlider = styled.div`
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 48px);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: rgba(0,0,0,0.75);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  border: 1px solid rgba(239,68,68,0.25);
`;

const SliderLabel = styled.span`
  font-size: 0.72rem;
  font-weight: 600;
  color: #94A3B8;
  white-space: nowrap;
  flex-shrink: 0;
`;

const RangeInput = styled.input<{ value?: number | string }>`
  flex: 1;
  height: 4px;
  appearance: none;
  background: linear-gradient(to right, #334155 0%, #334155 ${({ value }) => value}%, #EF4444 ${({ value }) => value}%, #EF4444 100%);
  border-radius: 999px;
  outline: none;
  cursor: pointer;
  &::-webkit-slider-thumb {
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #EF4444;
    border: 3px solid #FFFFFF;
    cursor: pointer;
    transition: transform 0.2s ease;
    &:hover { transform: scale(1.2); }
  }
`;

const FurnitureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 4px;
`;

const FurnitureItem = styled.div<{ $staged: boolean }>`
  aspect-ratio: 1;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 1.8rem;
  background: ${p => p.$staged ? 'rgba(239,68,68,0.12)' : 'rgba(30,41,59,0.6)'};
  border: 1px solid ${p => p.$staged ? 'rgba(239,68,68,0.4)' : 'rgba(100,116,139,0.3)'};
  transition: all 0.3s ease;
  opacity: ${p => p.$staged ? 1 : 0.3};
  transform: ${p => p.$staged ? 'scale(1)' : 'scale(0.9)'};
  span { font-size: 0.6rem; color: #94A3B8; font-weight: 600; }
`;

const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  gap: 12px;
  flex-wrap: wrap;
`;

const ToggleBtn = styled.button<{ $active: boolean }>`
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.82rem;
  transition: all 0.3s ease;
  background: ${p => p.$active
    ? 'linear-gradient(90deg, #EF4444, #F97316)'
    : 'rgba(100,116,139,0.2)'};
  color: ${p => p.$active ? '#FFFFFF' : '#94A3B8'};
  border: 1px solid ${p => p.$active ? 'transparent' : 'rgba(100,116,139,0.3)'};
  &:hover { transform: translateY(-1px); filter: brightness(1.1); }
`;

const StyleSelector = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const StyleChip = styled.button<{ $active: boolean }>`
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid ${p => p.$active ? '#EF4444' : 'rgba(100,116,139,0.3)'};
  background: ${p => p.$active ? 'rgba(239,68,68,0.15)' : 'transparent'};
  color: ${p => p.$active ? '#EF4444' : '#64748B'};
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { border-color: #EF4444; color: #EF4444; }
`;

const FURNITURE = [
  { emoji: '🛋️', label: 'Sofa' },
  { emoji: '🪑', label: 'Chair' },
  { emoji: '🛏️', label: 'Bed' },
  { emoji: '🪞', label: 'Mirror' },
  { emoji: '🌿', label: 'Plant' },
  { emoji: '🖼️', label: 'Art' },
  { emoji: '💡', label: 'Light' },
  { emoji: '🚿', label: 'Bath' },
  { emoji: '📺', label: 'TV' },
];

const STYLES = ['Modern Luxury', 'Minimalist', 'Contemporary', 'Arabic', 'Scandinavian'];

// ─── Component ─────────────────────────────────────────────────────────────
interface VirtualStagingCanvasProps {
  roomName?: string;
}

export const VirtualStagingCanvas: FC<VirtualStagingCanvasProps> = ({ roomName = 'Living Room' }) => {
  const [isStaged, setIsStaged] = useState(false);
  const [blend, setBlend] = useState(0);
  const [activeStyle, setActiveStyle] = useState('Modern Luxury');

  const handleToggle = useCallback(() => {
    setIsStaged(prev => {
      const next = !prev;
      setBlend(next ? 100 : 0);
      return next;
    });
  }, []);

  return (
    <Container data-testid="virtual-staging-canvas">
      <Header>
        <Title>
          🪄 AI Virtual Staging
        </Title>
        <Badge $active={isStaged}>
          {isStaged ? '✨ Staged' : '⬜ Empty Shell'}
        </Badge>
      </Header>

      <CanvasWrapper>
        <EmptyLayer $visible={true}>
          <FurnitureGrid>
            {FURNITURE.map(f => (
              <FurnitureItem key={f.label} $staged={isStaged}>
                {f.emoji}
                <span>{f.label}</span>
              </FurnitureItem>
            ))}
          </FurnitureGrid>
        </EmptyLayer>

        <RoomLabel>{roomName}</RoomLabel>

        <CrossfadeSlider>
          <SliderLabel>Empty</SliderLabel>
          <RangeInput
            type="range"
            min="0"
            max="100"
            value={blend}
            onChange={e => {
              const v = Number(e.target.value);
              setBlend(v);
              setIsStaged(v > 50);
            }}
          />
          <SliderLabel>Staged</SliderLabel>
        </CrossfadeSlider>
      </CanvasWrapper>

      <ControlsRow>
        <ToggleBtn $active={isStaged} onClick={handleToggle}>
          {isStaged ? '🪄 AI Staging: ON' : '⬜ Show Staged'}
        </ToggleBtn>
        <StyleSelector>
          {STYLES.map(s => (
            <StyleChip key={s} $active={s === activeStyle} onClick={() => setActiveStyle(s)}>
              {s}
            </StyleChip>
          ))}
        </StyleSelector>
      </ControlsRow>
    </Container>
  );
};

export default VirtualStagingCanvas;
