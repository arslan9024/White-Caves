import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Compass, Maximize2, RotateCcw, Layers, Eye, Smartphone } from 'lucide-react';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Wrap = styled.div`
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  animation: ${fadeIn} 0.4s ease;
  background: #0F172A;
  border: 1px solid rgba(56, 189, 248, 0.25);
  border-radius: 20px;
  overflow: hidden;
  padding: 20px;
  color: #FFF;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 10px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.15rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #F8FAFC;
`;

const Badge = styled.span`
  background: rgba(16, 185, 129, 0.15);
  color: #34D399;
  border: 1px solid rgba(16, 185, 129, 0.3);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 9999px;
`;

const ModeTabs = styled.div`
  display: flex;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 3px;
  gap: 4px;
`;

const ModeTab = styled.button<{ $active: boolean }>`
  background: ${props => (props.$active ? 'linear-gradient(135deg, #EF4444, #B91C1C)' : 'transparent')};
  color: ${props => (props.$active ? '#FFF' : '#94A3B8')};
  border: none;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    color: #FFF;
  }
`;

const ViewportContainer = styled.div`
  width: 100%;
  aspect-ratio: 16/9;
  background: #020617;
  border-radius: 14px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 60px rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.06);
`;

const InteractiveOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, #1E293B 0%, #020617 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
`;

const HotspotIndicator = styled.div<{ $x: number; $y: number }>`
  position: absolute;
  left: ${props => props.$x}%;
  top: ${props => props.$y}%;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(56, 189, 248, 0.8);
  border: 2px solid #FFF;
  box-shadow: 0 0 15px #38BDF8;
  cursor: pointer;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 800;
  color: #000;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% { transform: translate(-50%, -50%) scale(0.95); box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.7); }
    70% { transform: translate(-50%, -50%) scale(1.1); box-shadow: 0 0 0 10px rgba(56, 189, 248, 0); }
    100% { transform: translate(-50%, -50%) scale(0.95); box-shadow: 0 0 0 0 rgba(56, 189, 248, 0); }
  }
`;

const ControlBar = styled.div`
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(15, 23, 42, 0.85);
  padding: 8px 16px;
  border-radius: 9999px;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  z-index: 10;
`;

const IconAction = styled.button`
  background: transparent;
  border: none;
  color: #CBD5E1;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;

  &:hover {
    color: #FFF;
    background: rgba(255, 255, 255, 0.1);
  }
`;

export interface VirtualTourViewerProps {
  propertyTitle?: string;
  tourUrl?: string;
  defaultMode?: 'dollhouse' | 'floorplan' | 'walkthrough';
}

export const VirtualTourViewer: FC<VirtualTourViewerProps> = ({
  propertyTitle = 'Signature Palm Villa — Frond N',
  tourUrl,
  defaultMode = 'walkthrough',
}) => {
  const [mode, setMode] = useState<'dollhouse' | 'floorplan' | 'walkthrough'>(defaultMode);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const hotspots = [
    { id: 'master-suite', label: 'Grand Master Suite', x: 35, y: 40 },
    { id: 'infinity-pool', label: 'Sea-facing Infinity Pool', x: 68, y: 65 },
    { id: 'chef-kitchen', label: 'Showcase Italian Kitchen', x: 50, y: 52 },
  ];

  return (
    <Wrap data-testid="virtual-tour-viewer">
      <Header>
        <div>
          <Title>
            <Compass className="w-5 h-5 text-sky-400" />
            <span>3D Matterport Digital Twin</span>
            <Badge>4K High-Fidelity</Badge>
          </Title>
          <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: 4 }}>
            {propertyTitle} · Spatial VR Experience
          </div>
        </div>

        <ModeTabs>
          <ModeTab $active={mode === 'walkthrough'} onClick={() => setMode('walkthrough')}>
            <Eye size={13} /> 360° Walkthrough
          </ModeTab>
          <ModeTab $active={mode === 'dollhouse'} onClick={() => setMode('dollhouse')}>
            <Layers size={13} /> VR Dollhouse
          </ModeTab>
          <ModeTab $active={mode === 'floorplan'} onClick={() => setMode('floorplan')}>
            <Smartphone size={13} /> 2D Floorplan
          </ModeTab>
        </ModeTabs>
      </Header>

      <ViewportContainer>
        {tourUrl && isPlaying ? (
          <iframe
            src={tourUrl}
            title={propertyTitle}
            className="w-full h-full border-none"
            allowFullScreen
            allow="vr; xr; accelerometer; gyroscope"
          />
        ) : (
          <InteractiveOverlay>
            {hotspots.map(h => (
              <HotspotIndicator
                key={h.id}
                $x={h.x}
                $y={h.y}
                onClick={() => setActiveHotspot(h.label)}
                title={h.label}
              >
                +
              </HotspotIndicator>
            ))}

            <div style={{ zIndex: 5 }}>
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#38BDF8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 8,
                }}
              >
                {mode === 'dollhouse' ? 'Architectural 3D Cutaway' : mode === 'floorplan' ? 'Precision Schematic View' : 'Interactive Interior Spatial Walkthrough'}
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 16px 0', color: '#FFF' }}>
                {activeHotspot ? `Focused on: ${activeHotspot}` : 'Explore Private Luxury Estate'}
              </h3>
              <button
                type="button"
                onClick={() => setIsPlaying(true)}
                style={{
                  background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                  color: '#FFF',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '9999px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 10px 20px rgba(239, 68, 68, 0.4)',
                }}
              >
                Launch Matterport 3D Tour
              </button>
            </div>

            <ControlBar>
              <IconAction title="Reset Camera View" onClick={() => setActiveHotspot(null)}>
                <RotateCcw size={15} />
              </IconAction>
              <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.15)' }} />
              <IconAction title="Full Screen View" onClick={() => setIsPlaying(true)}>
                <Maximize2 size={15} />
              </IconAction>
            </ControlBar>
          </InteractiveOverlay>
        )}
      </ViewportContainer>
    </Wrap>
  );
};

export default VirtualTourViewer;
