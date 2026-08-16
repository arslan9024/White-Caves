import React, { FC, useState, useRef, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';

// ─── Animations ─────────────────────────────────────────────────────────────
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const scaleIn = keyframes`from { opacity: 0; transform: scale(1.02); } to { opacity: 1; transform: scale(1); }`;

// ─── Styled Components ───────────────────────────────────────────────────────
const Wrapper = styled.div`
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid rgba(239,68,68,0.25);
  background: #0F172A;
  font-family: 'Inter', sans-serif;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
  overflow: hidden;
  background: #0F172A;
`;

const ImageLayer = styled.img<{ $loaded: boolean }>`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${p => p.$loaded ? 1 : 0};
  transition: opacity 0.5s ease;
  animation: ${p => p.$loaded ? scaleIn : 'none'} 0.6s ease;
`;

const BlurPlaceholder = styled.div<{ $hidden: boolean }>`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    #1E293B 0%, #0F172A 25%, #1E293B 50%, #0F172A 75%, #1E293B 100%
  );
  background-size: 400% 400%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
  opacity: ${p => p.$hidden ? 0 : 1};
  transition: opacity 0.5s ease;
`;

const QualityBadge = styled.div<{ $quality: string }>`
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  backdrop-filter: blur(8px);
  background: ${p => ({
    'LQ': 'rgba(239,68,68,0.2)',
    'MQ': 'rgba(245,158,11,0.2)',
    'HQ': 'rgba(16,185,129,0.2)',
    '4K': 'rgba(139,92,246,0.2)',
  }[p.$quality] || 'rgba(0,0,0,0.5)')};
  color: ${p => ({
    'LQ': '#EF4444',
    'MQ': '#F59E0B',
    'HQ': '#10B981',
    '4K': '#A78BFA',
  }[p.$quality] || '#FFF')};
  border: 1px solid currentColor;
`;

const LoadBar = styled.div<{ $progress: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  width: ${p => p.$progress}%;
  background: linear-gradient(90deg, #EF4444, #F97316);
  transition: width 0.3s ease;
  border-radius: 0 2px 2px 0;
`;

const InfoBar = styled.div`
  padding: 12px 16px;
  background: rgba(15,23,42,0.95);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(100,116,139,0.15);
`;

const ImageTitle = styled.div`
  font-size: 0.82rem;
  font-weight: 600;
  color: #CBD5E1;
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const MetaChip = styled.span`
  font-size: 0.68rem;
  color: #64748B;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(30,41,59,0.8);
`;

const ThumbnailStrip = styled.div`
  display: flex;
  gap: 6px;
  padding: 10px 14px;
  overflow-x: auto;
  background: rgba(0,0,0,0.3);
  border-top: 1px solid rgba(100,116,139,0.1);
  &::-webkit-scrollbar { height: 3px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: rgba(239,68,68,0.4); border-radius: 2px; }
`;

const Thumb = styled.div<{ $active: boolean }>`
  flex-shrink: 0;
  width: 60px;
  height: 45px;
  border-radius: 6px;
  border: 2px solid ${p => p.$active ? '#EF4444' : 'transparent'};
  background: rgba(30,41,59,0.8);
  cursor: pointer;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: border-color 0.2s ease;
  &:hover { border-color: rgba(239,68,68,0.5); }
`;

const GALLERY = [
  { id: 1, emoji: '🏙️', title: 'Aerial Dubai Marina View', size: '4.2 MB', quality: '4K', loaded: false },
  { id: 2, emoji: '🛋️', title: 'Living Room', size: '2.8 MB', quality: 'HQ', loaded: false },
  { id: 3, emoji: '🛏️', title: 'Master Bedroom', size: '3.1 MB', quality: 'HQ', loaded: false },
  { id: 4, emoji: '🍳', title: 'Chef Kitchen', size: '2.3 MB', quality: 'HQ', loaded: false },
  { id: 5, emoji: '🌇', title: 'Balcony View', size: '3.6 MB', quality: '4K', loaded: false },
  { id: 6, emoji: '🚿', title: 'En-suite Bathroom', size: '1.9 MB', quality: 'MQ', loaded: false },
];

// ─── Component ───────────────────────────────────────────────────────────────
export const ProgressiveImageLoader: FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const simulateLoad = useCallback(() => {
    setLoaded(false);
    setProgress(0);
    if (timerRef.current) clearInterval(timerRef.current);
    let p = 0;
    timerRef.current = setInterval(() => {
      p += Math.random() * 25 + 5;
      if (p >= 100) {
        p = 100;
        setLoaded(true);
        if (timerRef.current) clearInterval(timerRef.current);
      }
      setProgress(Math.min(p, 100));
    }, 150);
  }, []);

  useEffect(() => {
    simulateLoad();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [activeIdx, simulateLoad]);

  const current = GALLERY[activeIdx];
  const qualityLabel = loaded ? current.quality : 'LQ';

  return (
    <Wrapper data-testid="progressive-image-loader">
      <ImageContainer>
        <BlurPlaceholder $hidden={loaded} />
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: '5rem', opacity: loaded ? 1 : 0.3,
          transition: 'opacity 0.5s ease',
        }}>
          {current.emoji}
        </div>
        <QualityBadge $quality={qualityLabel}>{qualityLabel}</QualityBadge>
        <LoadBar $progress={progress} />
      </ImageContainer>

      <InfoBar>
        <ImageTitle>{current.title}</ImageTitle>
        <MetaInfo>
          <MetaChip>{current.size}</MetaChip>
          <MetaChip>{Math.round(progress)}% loaded</MetaChip>
        </MetaInfo>
      </InfoBar>

      <ThumbnailStrip>
        {GALLERY.map((img, idx) => (
          <Thumb key={img.id} $active={idx === activeIdx} onClick={() => setActiveIdx(idx)}>
            {img.emoji}
          </Thumb>
        ))}
      </ThumbnailStrip>
    </Wrapper>
  );
};

export default ProgressiveImageLoader;
