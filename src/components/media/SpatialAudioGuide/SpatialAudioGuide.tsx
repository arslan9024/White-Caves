import React, { FC, useState, useCallback, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// ─── Animations ─────────────────────────────────────────────────────────────
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const soundWave = keyframes`
  0% { transform: scaleY(0.3); }
  50% { transform: scaleY(1); }
  100% { transform: scaleY(0.3); }
`;
const pulse = keyframes`0%, 100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.05); }`;

// ─── Styled Components ───────────────────────────────────────────────────────
const Container = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #0F172A 0%, #1A0A2E 100%);
  border: 2px solid rgba(239,68,68,0.3);
  border-radius: 20px;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  animation: ${fadeIn} 0.4s ease;
`;

const Header = styled.div`
  padding: 14px 20px;
  background: rgba(139,92,246,0.07);
  border-bottom: 1px solid rgba(139,92,246,0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  margin: 0; color: #FFF; font-size: 0.95rem; font-weight: 700;
  display: flex; align-items: center; gap: 8px;
`;

const AgentSelector = styled.div`
  display: flex; gap: 6px;
`;

const AgentBtn = styled.button<{ $active: boolean; $agent: 'nadia' | 'nina' }>`
  padding: 6px 16px;
  border-radius: 8px;
  border: 1px solid ${p => p.$active ? (p.$agent === 'nadia' ? '#EF4444' : '#8B5CF6') : 'rgba(100,116,139,0.3)'};
  background: ${p => p.$active ? (p.$agent === 'nadia' ? 'rgba(239,68,68,0.15)' : 'rgba(139,92,246,0.15)') : 'transparent'};
  color: ${p => p.$active ? (p.$agent === 'nadia' ? '#EF4444' : '#A78BFA') : '#64748B'};
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const TourArea = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  background: radial-gradient(ellipse at 30% 50%, rgba(139,92,246,0.08) 0%, transparent 60%),
              radial-gradient(ellipse at 70% 30%, rgba(239,68,68,0.06) 0%, transparent 50%),
              #070B14;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const RoomIllustration = styled.div`
  font-size: 5rem;
  filter: drop-shadow(0 0 20px rgba(139,92,246,0.5));
  animation: ${pulse} 3s ease-in-out infinite;
`;

const AgentAvatar = styled.div<{ $agent: 'nadia' | 'nina' }>`
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: rgba(0,0,0,0.75);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  border: 1px solid ${p => p.$agent === 'nadia' ? 'rgba(239,68,68,0.3)' : 'rgba(139,92,246,0.3)'};
`;

const AgentFace = styled.div`
  font-size: 1.8rem;
`;

const AgentInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const AgentName = styled.div<{ $agent: 'nadia' | 'nina' }>`
  font-size: 0.8rem;
  font-weight: 700;
  color: ${p => p.$agent === 'nadia' ? '#EF4444' : '#A78BFA'};
`;

const AgentStatus = styled.div`
  font-size: 0.68rem;
  color: #64748B;
`;

const WaveVisualizer = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 40px;
`;

const WaveBar = styled.div<{ $delay: number; $active: boolean }>`
  width: 4px;
  height: 100%;
  background: linear-gradient(0deg, #EF4444, #F97316);
  border-radius: 2px;
  opacity: ${p => p.$active ? 0.9 : 0.2};
  animation: ${p => p.$active ? soundWave : 'none'} ${p => 0.4 + p.$delay * 0.1}s ease-in-out infinite;
  transform-origin: bottom;
`;

const NarrativeBox = styled.div`
  max-width: 500px;
  text-align: center;
`;

const NarrativeText = styled.p`
  margin: 0;
  color: #E2E8F0;
  font-size: 0.85rem;
  line-height: 1.6;
  font-style: italic;
`;

const RoomNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 14px 20px;
  border-top: 1px solid rgba(100,116,139,0.15);
  flex-wrap: wrap;
`;

const RoomTab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid ${p => p.$active ? '#EF4444' : 'rgba(100,116,139,0.25)'};
  background: ${p => p.$active ? 'rgba(239,68,68,0.12)' : 'transparent'};
  color: ${p => p.$active ? '#EF4444' : '#64748B'};
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { border-color: #EF4444; color: #EF4444; }
`;

const PlayBtn = styled.button<{ $playing: boolean }>`
  padding: 10px 24px;
  border-radius: 10px;
  border: none;
  background: ${p => p.$playing ? 'linear-gradient(90deg, #EF4444, #F97316)' : 'rgba(100,116,139,0.2)'};
  color: #FFF;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover { transform: scale(1.03); }
`;

const ROOMS = [
  { id: 'lr', emoji: '🛋️', name: 'Living Room', nadia: 'Welcome to this stunning living room with floor-to-ceiling windows overlooking the Dubai Marina skyline. The 42m² space features premium Italian marble flooring...', nina: 'Living room dimensions: 42 m². Ceiling height 3.2m. North-facing with marina views. AED 2.4M asking price.' },
  { id: 'mb', emoji: '🛏️', name: 'Master Bedroom', nadia: 'The master suite is a sanctuary of luxury — featuring a built-in walk-in wardrobe, en-suite bathroom, and direct balcony access...', nina: 'Master bedroom: 32 m². En-suite: 9 m². Walk-in wardrobe: 7 m². Built-in storage throughout.' },
  { id: 'kt', emoji: '🍳', name: 'Kitchen', nadia: 'This chef\'s kitchen is equipped with Gaggenau appliances, Calacatta marble countertops, and a central island — perfect for entertaining...', nina: 'Kitchen: 18 m² open-plan. Integrated Gaggenau appliances. Calacatta marble surfaces. Central island.' },
  { id: 'bl', emoji: '🌇', name: 'Balcony', nadia: 'Step onto this expansive 12m² balcony and enjoy unobstructed views of the iconic Palm Jumeirah and Atlantis The Palm...', nina: 'Balcony: 12 m². South-facing. Palm Jumeirah views. Glass balustrade. Outdoor dining area.' },
];

// ─── Component ───────────────────────────────────────────────────────────────
export const SpatialAudioGuide: FC = () => {
  const [activeAgent, setActiveAgent] = useState<'nadia' | 'nina'>('nadia');
  const [activeRoom, setActiveRoom] = useState('lr');
  const [isPlaying, setIsPlaying] = useState(false);

  const room = ROOMS.find(r => r.id === activeRoom) || ROOMS[0];
  const narrative = room[activeAgent];

  return (
    <Container data-testid="spatial-audio-guide">
      <Header>
        <Title>🎙️ AI Audio Tour Guide</Title>
        <AgentSelector>
          <AgentBtn $active={activeAgent === 'nadia'} $agent="nadia" onClick={() => setActiveAgent('nadia')}>
            🌹 Nadia
          </AgentBtn>
          <AgentBtn $active={activeAgent === 'nina'} $agent="nina" onClick={() => setActiveAgent('nina')}>
            🤖 Nina
          </AgentBtn>
        </AgentSelector>
      </Header>

      <TourArea>
        <RoomIllustration>{room.emoji}</RoomIllustration>
        <NarrativeBox>
          <NarrativeText>"{narrative}"</NarrativeText>
        </NarrativeBox>

        <AgentAvatar $agent={activeAgent}>
          <AgentFace>{activeAgent === 'nadia' ? '🌹' : '🤖'}</AgentFace>
          <AgentInfo>
            <AgentName $agent={activeAgent}>{activeAgent === 'nadia' ? 'Nadia' : 'Nina AI'}</AgentName>
            <AgentStatus>{isPlaying ? '🔊 Speaking...' : '💤 Paused'}</AgentStatus>
          </AgentInfo>
        </AgentAvatar>

        <WaveVisualizer>
          {Array.from({ length: 8 }).map((_, i) => (
            <WaveBar key={i} $delay={i} $active={isPlaying} />
          ))}
        </WaveVisualizer>
      </TourArea>

      <RoomNav>
        <PlayBtn $playing={isPlaying} onClick={() => setIsPlaying(p => !p)}>
          {isPlaying ? '⏸️ Pause Tour' : '▶️ Start Tour'}
        </PlayBtn>
        {ROOMS.map(r => (
          <RoomTab key={r.id} $active={r.id === activeRoom} onClick={() => setActiveRoom(r.id)}>
            {r.emoji} {r.name}
          </RoomTab>
        ))}
      </RoomNav>
    </Container>
  );
};

export default SpatialAudioGuide;
